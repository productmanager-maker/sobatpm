import os
import logging
import time
from datetime import datetime
from pathlib import Path

# Load .env jika ada
_env_file = Path(__file__).parent / ".env"
if _env_file.exists():
    for line in _env_file.read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import Application, MessageHandler, CommandHandler, CallbackQueryHandler, filters, ContextTypes
from sales_agent import full_pipeline, update_so_in_log, check_nego, get_price_table

logging.basicConfig(level=logging.INFO)

TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN", "")
MANAGER_CHAT_ID = int(os.environ.get("MANAGER_CHAT_ID", "0"))
SALES_CHAT_IDS = [int(x) for x in os.environ.get("SALES_CHAT_IDS", "").split(",") if x]
SALES_USER_IDS = [int(x) for x in os.environ.get("SALES_USER_IDS", "").split(",") if x]
FINANCE_USER_IDS = [int(x) for x in os.environ.get("FINANCE_USER_IDS", "").split(",") if x]

# Simpan deal terakhir per chat_id untuk /so command
last_deal: dict[int, dict] = {}
pending_approvals: dict[str, dict] = {}  # deal_id -> {deal, sales_chat_id}

# Keyword detection untuk nego query vs order
_NEGO_WORDS = {"bisa", "boleh", "bs", "apakah", "bisa?", "boleh?"}
_PRICE_WORDS = {"diskon", "%", "harga", "price", "ribu", "rb", "persen", "/kg"}
_ORDER_WORDS = {"mau order", "order ", "pesan ", "beli ", " ambil ", "minta ", "request "}
_QUESTION_WORDS = {"bagaimana", "gimana", "kenapa", "mengapa", "siapa", "dimana", "kapan", "apa itu", "apakah", "tolong jelaskan"}


def is_finance(user_id) -> bool:
    return bool(FINANCE_USER_IDS) and user_id in FINANCE_USER_IDS


def is_nego_query(message: str) -> bool:
    msg = message.lower()
    has_nego = any(w in msg for w in _NEGO_WORDS)
    has_price = any(w in msg for w in _PRICE_WORDS)
    has_order = any(w in msg for w in _ORDER_WORDS)
    return has_nego and has_price and not has_order


def is_order_request(message: str) -> bool:
    msg = message.lower()
    has_qty = bool(re.search(r'\d+\s*kg', msg))
    has_order_word = any(w in msg for w in _ORDER_WORDS)
    is_question = msg.rstrip().endswith("?") or any(w in msg for w in _QUESTION_WORDS)
    return (has_qty or has_order_word) and not is_question


def _auth_check(chat_id: int, user_id: int | None) -> bool:
    """Return True jika user boleh pakai bot."""
    if SALES_CHAT_IDS and chat_id not in SALES_CHAT_IDS:
        return False
    if SALES_USER_IDS and user_id not in SALES_USER_IDS:
        if not is_finance(user_id):
            return False
    return True


def generate_sales_order(deal: dict) -> str:
    so_number = f"SO-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    filename = f"/tmp/{so_number}.pdf"

    c = canvas.Canvas(filename, pagesize=A4)
    w, h = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, h - 60, "SALES ORDER")
    c.setFont("Helvetica", 10)
    c.drawString(50, h - 80, "PT Distributor Segar Nusantara")
    c.drawString(50, h - 95, f"No: {so_number}")
    c.drawString(50, h - 110, f"Tanggal: {datetime.now().strftime('%d %B %Y')}")

    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, h - 150, "Kepada:")
    c.setFont("Helvetica", 10)
    c.drawString(50, h - 165, deal["partner"])

    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, h - 210, "Produk")
    c.drawString(250, h - 210, "Qty (kg)")
    c.drawString(340, h - 210, "Harga/kg")
    c.drawString(440, h - 210, "Total")
    c.line(50, h - 215, w - 50, h - 215)

    c.setFont("Helvetica", 10)
    c.drawString(50, h - 235, deal["produk"])
    c.drawString(250, h - 235, str(deal["qty_kg"]))
    c.drawString(340, h - 235, f"Rp {deal['harga_per_kg']:,}")

    harga_normal = deal["harga_per_kg"] * deal["qty_kg"]
    diskon_amt = harga_normal * deal["diskon_disetujui"] / 100
    total = harga_normal - diskon_amt
    c.drawString(440, h - 235, f"Rp {harga_normal:,.0f}")

    c.line(50, h - 250, w - 50, h - 250)
    c.drawString(340, h - 265, f"Diskon {deal['diskon_disetujui']}%:")
    c.drawString(440, h - 265, f"-Rp {diskon_amt:,.0f}")
    c.setFont("Helvetica-Bold", 11)
    c.drawString(340, h - 285, "TOTAL:")
    c.drawString(440, h - 285, f"Rp {total:,.0f}")

    c.setFont("Helvetica", 9)
    c.drawString(50, 60, "Diproses otomatis oleh sistem. Pembayaran jatuh tempo 14 hari setelah pengiriman.")

    c.save()
    return filename


def format_sales_reply(result: dict) -> str:
    approved = "✅ DISETUJUI" if result["approved"] else "❌ TIDAK DISETUJUI"
    return (
        f"*HASIL AGENT* {approved}\n\n"
        f"Produk: {result['produk']}\n"
        f"Qty: {result['qty_kg']}kg\n"
        f"Harga: Rp {result['harga_per_kg']:,}/kg\n"
        f"Diskon: {result['diskon_disetujui']}%\n"
        f"*Total: Rp {result['total_harga']:,}*\n\n"
        f"---\n{result['draft_pesan']}\n\n"
        f"_Ketik /so untuk generate Sales Order PDF_"
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    message = update.message.text.strip()
    user_id = update.effective_user.id if update.effective_user else None

    logging.info(f"MSG IN | chat_id={chat_id} user_id={user_id} | {message[:60]}")

    if not _auth_check(chat_id, user_id):
        logging.info(f"FILTERED: chat_id={chat_id} user_id={user_id}")
        return

    # Nego feasibility check (bisa X% / harga fix?)
    if is_nego_query(message):
        try:
            result = check_nego(message)
            finance = is_finance(user_id)
            if "feasible" not in result:
                await update.message.reply_text("Maaf, tidak bisa menganalisa permintaan ini.")
                return

            icon = "✅" if result["feasible"] else "❌"
            lines = [
                f"{icon} *CEK NEGO*\n",
                f"Produk: {result.get('produk', '-')} ({result.get('tipe_partner', '-')})",
                f"Qty: {result.get('qty_kg', '-')}kg",
                f"Harga normal: Rp {result.get('harga_normal', 0):,}/kg",
                f"Harga diminta: Rp {result.get('harga_diminta', 0):,}/kg",
                f"Setara diskon: *{result.get('diskon_pct', 0):.1f}%*",
            ]
            if finance:
                lines.append(f"Diskon maks: {result.get('diskon_max', 0)}%")
            lines += [
                "",
                f"*{'BISA ✅' if result['feasible'] else 'TIDAK BISA ❌'}*",
                f"_{result.get('alasan', '')}_",
            ]
            await update.message.reply_text("\n".join(lines), parse_mode="Markdown")
        except Exception as e:
            await update.message.reply_text("Gagal cek nego.")
            logging.error(f"Nego check error: {e}")
        return

    if not is_order_request(message):
        await update.message.reply_text(
            "Maaf, saya tidak mengerti. Kirim permintaan order seperti:\n"
            "_Pak Bayu mau 50kg jeruk grade A, minta diskon 10%_",
            parse_mode="Markdown"
        )
        return

    try:
        result = full_pipeline(message, telegram_sales_id=user_id)
        last_deal[chat_id] = result

        await update.message.reply_text(format_sales_reply(result), parse_mode="Markdown")

        if result.get("need_human_approval") and MANAGER_CHAT_ID:
            deal_id = f"{chat_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            pending_approvals[deal_id] = {"deal": result, "sales_chat_id": chat_id}

            keyboard = InlineKeyboardMarkup([
                [
                    InlineKeyboardButton("✅ Approve", callback_data=f"approve_{deal_id}"),
                    InlineKeyboardButton("❌ Reject", callback_data=f"reject_{deal_id}"),
                ]
            ])

            await context.bot.send_message(
                chat_id=MANAGER_CHAT_ID,
                text=(
                    f"⚠️ *APPROVAL NEEDED*\n\n"
                    f"Partner: {result['partner']} ({result['tipe_partner']})\n"
                    f"Produk: {result['produk']} {result['qty_kg']}kg\n"
                    f"Harga: Rp {result['harga_per_kg']:,}/kg\n"
                    f"Diskon diminta: *{result['diskon_diminta']}%*\n"
                    f"Max otomatis: {result['diskon_max_allowed']}%\n"
                    f"Total jika disetujui: Rp {round(result['qty_kg'] * result['harga_per_kg'] * (1 - result['diskon_diminta'] / 100)):,}"
                ),
                parse_mode="Markdown",
                reply_markup=keyboard,
            )

    except Exception as e:
        await update.message.reply_text("Maaf, ada kendala sistem. Mohon hubungi Finance secara langsung.")
        logging.error(f"Pipeline error for chat_id {chat_id}: {e}")


async def handle_approval(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    data = query.data
    action, deal_id = data.split("_", 1)

    if deal_id not in pending_approvals:
        await query.edit_message_text("⚠️ Deal ini sudah diproses atau expired.")
        return

    entry = pending_approvals.pop(deal_id)
    deal = entry["deal"]
    sales_chat_id = entry["sales_chat_id"]
    approver = query.from_user.full_name or query.from_user.username or "Manager"

    if action == "approve":
        deal["diskon_disetujui"] = deal["diskon_diminta"]
        deal["total_harga"] = round(deal["qty_kg"] * deal["harga_per_kg"] * (1 - deal["diskon_diminta"] / 100))
        deal["approved"] = True
        last_deal[sales_chat_id] = deal

        await query.edit_message_text(
            f"✅ *APPROVED* oleh {approver}\n\n"
            f"Partner: {deal['partner']}\n"
            f"Diskon {deal['diskon_diminta']}% disetujui\n"
            f"Total: Rp {deal['total_harga']:,}",
            parse_mode="Markdown",
        )

        await context.bot.send_message(
            chat_id=sales_chat_id,
            text=(
                f"✅ *DISKON DISETUJUI MANAGER*\n\n"
                f"Partner: {deal['partner']}\n"
                f"Produk: {deal['produk']} {deal['qty_kg']}kg\n"
                f"Diskon: *{deal['diskon_diminta']}%* ✅\n"
                f"*Total: Rp {deal['total_harga']:,}*\n\n"
                f"_Ketik /so untuk generate Sales Order PDF_"
            ),
            parse_mode="Markdown",
        )

    elif action == "reject":
        await query.edit_message_text(
            f"❌ *REJECTED* oleh {approver}\n\n"
            f"Partner: {deal['partner']}\n"
            f"Diskon {deal['diskon_diminta']}% ditolak\n"
            f"Diskon maks berlaku: {deal['diskon_max_allowed']}%",
            parse_mode="Markdown",
        )

        await context.bot.send_message(
            chat_id=sales_chat_id,
            text=(
                f"❌ *DISKON DITOLAK MANAGER*\n\n"
                f"Partner: {deal['partner']}\n"
                f"Diskon {deal['diskon_diminta']}% tidak disetujui\n"
                f"Diskon maksimal yang berlaku: *{deal['diskon_max_allowed']}%*\n\n"
                f"_Silakan informasikan ke partner._"
            ),
            parse_mode="Markdown",
        )


async def handle_cekharga(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    user_id = update.effective_user.id if update.effective_user else None
    if not _auth_check(chat_id, user_id):
        return

    args = " ".join(context.args).strip() if context.args else ""
    if not args:
        await update.message.reply_text(
            "Ketik nama produk yang ingin dicek, atau `all` untuk semua.\n"
            "Contoh: `/cekharga jeruk` atau `/cekharga all`",
            parse_mode="Markdown"
        )
        return

    try:
        await update.message.reply_text("Mengambil data harga...")
        tabel = get_price_table(product_filter=args, show_modal=is_finance(user_id))
        await update.message.reply_text(tabel, parse_mode="Markdown")
    except Exception as e:
        await update.message.reply_text("Gagal ambil data harga.")
        logging.error(f"cekharga error: {e}")


async def handle_cekdiskon(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    user_id = update.effective_user.id if update.effective_user else None
    if not _auth_check(chat_id, user_id):
        return

    query = " ".join(context.args).strip() if context.args else ""
    if not query:
        await update.message.reply_text(
            "Tulis query setelah command.\n"
            "Contoh:\n"
            "`/cekdiskon Bu Ani mau jeruk grade A harga 30.000`\n"
            "`/cekdiskon Pak Bayu minta diskon 15% jeruk 100kg`\n"
            "`/cekdiskon jeruk grade A diskon berapa untuk partner baru`",
            parse_mode="Markdown"
        )
        return

    try:
        result = check_nego(query)
        finance = is_finance(user_id)

        if "feasible" not in result and "query_type" not in result:
            await update.message.reply_text("Maaf, tidak bisa menganalisa permintaan ini.")
            return

        qtype = result.get("query_type", "diskon_check")
        partner = result.get("partner", "-")
        produk = result.get("produk", "-")
        qty = result.get("qty_kg", 0)
        harga_normal = result.get("harga_normal", 0)
        harga_diminta = result.get("harga_diminta", 0)
        diskon_pct = result.get("diskon_pct", 0)
        diskon_max = result.get("diskon_max", 0)
        tipe = result.get("tipe_partner", "-")
        alasan = result.get("alasan", "")
        feasible = result.get("feasible")

        lines = [f"🔍 *CEK DISKON*\n"]
        lines.append(f"Partner: *{partner}* ({tipe})")
        lines.append(f"Produk: {produk}" + (f" | Qty: {qty}kg" if qty else ""))
        if harga_normal:
            lines.append(f"Harga normal: Rp {harga_normal:,}/kg")

        if qtype == "max_inquiry":
            lines.append(f"\n💡 *Diskon maks yang bisa didapat: {diskon_max}%*")
            if harga_normal and diskon_max:
                harga_setelah = round(harga_normal * (1 - diskon_max / 100))
                lines.append(f"Setara harga: Rp {harga_setelah:,}/kg")
        else:
            if qtype == "harga_check" and harga_diminta:
                lines.append(f"Harga diminta: Rp {harga_diminta:,}/kg")
            lines.append(f"Setara diskon: *{diskon_pct:.1f}%*")
            if finance:
                lines.append(f"Diskon maks partner ini: {diskon_max}%")

            icon = "✅" if feasible else "❌"
            lines.append(f"\n{icon} *{'BISA' if feasible else 'TIDAK BISA'}*")

        lines.append(f"_{alasan}_")
        await update.message.reply_text("\n".join(lines), parse_mode="Markdown")

    except Exception as e:
        await update.message.reply_text("Gagal cek diskon.")
        logging.error(f"cekdiskon error: {e}")


async def handle_so(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id

    if chat_id not in last_deal:
        await update.message.reply_text("Belum ada deal yang diproses. Kirim permintaan order dulu.")
        return

    deal = last_deal[chat_id]

    try:
        await update.message.reply_text("Generating PDF...")
        pdf_path = generate_sales_order(deal)
        so_number = os.path.splitext(os.path.basename(pdf_path))[0]

        with open(pdf_path, "rb") as f:
            await context.bot.send_document(
                chat_id=chat_id,
                document=f,
                filename=os.path.basename(pdf_path),
                caption=f"Sales Order untuk {deal['partner']}",
            )

        # Update kolom detail SO di Log Transaksi
        if deal.get("log_row"):
            update_so_in_log(deal["log_row"], so_number)

    except Exception as e:
        await update.message.reply_text("Gagal generate PDF.")
        logging.error(f"PDF error for chat_id {chat_id}: {e}")


if __name__ == "__main__":
    if not TELEGRAM_TOKEN:
        raise ValueError("TELEGRAM_TOKEN belum di-set")

    app = Application.builder().token(TELEGRAM_TOKEN).connect_timeout(30).read_timeout(30).build()
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_handler(CommandHandler("so", handle_so))
    app.add_handler(CommandHandler("cekharga", handle_cekharga))
    app.add_handler(CommandHandler("cekdiskon", handle_cekdiskon))
    app.add_handler(CallbackQueryHandler(handle_approval))
    print("Bot berjalan... Tekan Ctrl+C untuk stop.")
    app.run_polling(bootstrap_retries=-1)
