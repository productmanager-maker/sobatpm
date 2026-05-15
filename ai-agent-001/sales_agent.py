import anthropic
import gspread
import json
import os
import re
import time
from datetime import datetime
from google.oauth2.service_account import Credentials

_CACHE_TTL = 300  # detik
_price_cache: dict = {"data": None, "ts": 0.0}
_partner_cache: dict = {"data": None, "ts": 0.0}

if not os.environ.get("ANTHROPIC_API_KEY"):
    zshrc = os.path.expanduser("~/.zshrc")
    if os.path.exists(zshrc):
        with open(zshrc) as f:
            for line in f:
                match = re.match(r'export ANTHROPIC_API_KEY=["\']?([^"\']+)["\']?', line.strip())
                if match:
                    os.environ["ANTHROPIC_API_KEY"] = match.group(1)
                    break

client = anthropic.Anthropic()

SPREADSHEET_ID = "1YifLsgcVbx89ET4auPgOVi2YCFAgZUOCmqogN-RDeNk"
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), "service-account.json")

SYSTEM_PROMPT_BASE = """
Kamu adalah AI Sales Assistant untuk perusahaan distributor sayuran dan buah-buahan B2B.

PENTING: Kamu HANYA boleh merespons dengan JSON valid.
Jangan tambahkan teks, penjelasan, atau markdown di luar JSON.
Jangan gunakan ```json atau ``` wrapper.
Respons pertama harus langsung karakter {{ dan diakhiri }}.

Format wajib:
{{
  "partner": string,
  "tipe_partner": "baru" | "lama" | "vip",
  "produk": string,
  "qty_kg": number,
  "harga_per_kg": number,
  "diskon_diminta": number,
  "diskon_disetujui": number,
  "total_harga": number,
  "counter_offer": string | null,
  "approved": boolean
}}

{price_context}

Aturan diskon:
- Partner baru: maks 5% (atau sesuai newmember_diskon produk jika lebih rendah)
- Partner lama (>3 bulan): maks 10%
- Partner VIP (>12 bulan + volume >500kg/bulan): maks 15%

Logika approved dan counter_offer:
- Jika diskon_diminta <= batas tipe_partner: approved=true, counter_offer=null
- Jika diskon_diminta > batas: approved=false, diskon_disetujui=batas maksimal, counter_offer=teks tawaran balik
- total_harga = qty_kg * harga_per_kg * (1 - diskon_disetujui/100)
"""

FALLBACK_PRICES = {
    "bayam_a": {"harga": 8500, "min_order": 10, "harga_modal": 6000, "newmember_diskon": 3},
    "bayam_b": {"harga": 7000, "min_order": 10, "harga_modal": 5000, "newmember_diskon": 3},
    "kangkung_a": {"harga": 6500, "min_order": 10, "harga_modal": 4500, "newmember_diskon": 3},
    "tomat_a": {"harga": 12000, "min_order": 5, "harga_modal": 8000, "newmember_diskon": 5},
}


def _get_sheets_client(readonly: bool = True):
    scopes = (
        ["https://www.googleapis.com/auth/spreadsheets.readonly"]
        if readonly
        else ["https://www.googleapis.com/auth/spreadsheets"]
    )
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scopes)
    return gspread.authorize(creds)


def get_price_list() -> dict:
    now = time.time()
    if _price_cache["data"] and now - _price_cache["ts"] < _CACHE_TTL:
        return _price_cache["data"]
    gc = _get_sheets_client(readonly=True)
    ws = gc.open_by_key(SPREADSHEET_ID).worksheet("Harga")
    price_map = {}
    for row in ws.get_all_records():
        key = f"{row['produk'].lower()}_{row['grade'].lower()}"
        price_map[key] = {
            "harga": row["harga_per_kg"],
            "min_order": row["min_order_kg"],
            "harga_modal": row.get("harga_modal", 0),
            "newmember_diskon": row.get("newmember_diskon", 5),
            "updated": row.get("updated_at", "-"),
        }
    _price_cache["data"] = price_map
    _price_cache["ts"] = now
    return price_map


def get_partner_list() -> list[dict]:
    now = time.time()
    if _partner_cache["data"] is not None and now - _partner_cache["ts"] < _CACHE_TTL:
        return _partner_cache["data"]
    try:
        gc = _get_sheets_client(readonly=True)
        ws = gc.open_by_key(SPREADSHEET_ID).worksheet("Partner")
        records = ws.get_all_records()
        _partner_cache["data"] = records
        _partner_cache["ts"] = now
        return records
    except Exception as e:
        print(f"[WARN] Gagal load partner list: {e}")
        return _partner_cache["data"] or []


def _find_partner_in_records(nama_cari: str, records: list[dict]) -> dict | None:
    nama_cari = nama_cari.lower().strip()
    if not nama_cari:
        return None
    for row in records:
        nama_sheet = str(row.get("nama partner", "")).lower().strip()
        owner_sheet = str(row.get("nama owner", "")).lower().strip()
        match_partner = nama_cari in nama_sheet or nama_sheet in nama_cari
        match_owner = nama_cari in owner_sheet or owner_sheet in nama_cari
        if match_partner or match_owner:
            return {
                "id_partner": row.get("id_partner", ""),
                "nama_partner": row.get("nama partner", ""),
                "nama_owner": row.get("nama owner", ""),
                "tipe_partner": row.get("tipe_partner", "baru"),
                "tanggal_bergabung": row.get("tanggal_bergabung", ""),
                "volume_avg_kg_bulan": row.get("volume_avg_kg_bulan", 0),
                "kota": row.get("kota", ""),
                "telegram_chat_id": row.get("telegram_chat_id", ""),
            }
    return None


def get_partner_info(nama_partner: str) -> dict | None:
    return _find_partner_in_records(nama_partner, get_partner_list())


def build_price_context() -> tuple[str, dict]:
    try:
        prices = get_price_list()
        source = "Google Sheets"
    except Exception as e:
        print(f"[WARN] Gagal load Google Sheets ({e}), pakai fallback harga statis")
        prices = FALLBACK_PRICES
        source = "fallback"

    lines = [f"DATA HARGA TERKINI (sumber: {source}):"]
    for key, data in prices.items():
        parts = key.rsplit("_", 1)
        produk = parts[0].replace("_", " ").title()
        grade = parts[1].upper() if len(parts) > 1 else "-"
        display = f"{produk} Grade {grade}"
        lines.append(
            f"- {display}: Rp {data['harga']:,}/kg "
            f"(min_order_qty: {data['min_order']}kg, "
            f"modal Rp {data['harga_modal']:,}, "
            f"diskon member baru maks {data['newmember_diskon']}%)"
        )
    return "\n".join(lines), prices


def build_system_prompt() -> str:
    price_context, _ = build_price_context()
    return SYSTEM_PROMPT_BASE.format(price_context=price_context)


def parse_agent_response(text: str) -> dict:
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except Exception:
            pass

    return {"error": "parse_failed", "raw": text}


DISCOUNT_RULES = {
    "baru": {"max_pct": 5,  "volume_bonus": {500: 2}},
    "lama": {"max_pct": 10, "volume_bonus": {300: 2, 500: 4}},
    "vip":  {"max_pct": 15, "volume_bonus": {300: 3}},
}


def calculate_max_discount(tipe_partner: str, qty_kg: float) -> dict:
    rule = DISCOUNT_RULES.get(tipe_partner, DISCOUNT_RULES["baru"])
    base_max = rule["max_pct"]
    bonus = 0
    for threshold, extra in sorted(rule["volume_bonus"].items()):
        if qty_kg >= threshold:
            bonus = extra
    absolute_max = base_max + bonus
    return {
        "base_max": base_max,
        "volume_bonus": bonus,
        "absolute_max": absolute_max,
        "need_approval": absolute_max >= 15,
    }


def enforce_and_respond(agent_output: dict) -> dict:
    tipe = agent_output.get("tipe_partner", "baru")
    qty = agent_output.get("qty_kg", 0)
    diskon_diminta = agent_output.get("diskon_diminta", 0)

    limits = calculate_max_discount(tipe, qty)
    diskon_final = min(diskon_diminta, limits["absolute_max"])

    agent_output["diskon_disetujui"] = diskon_final
    agent_output["diskon_max_allowed"] = limits["absolute_max"]
    agent_output["need_human_approval"] = limits["need_approval"]
    agent_output["approved"] = diskon_diminta <= limits["absolute_max"]

    if not agent_output["approved"]:
        for threshold in sorted(DISCOUNT_RULES.get(tipe, DISCOUNT_RULES["baru"])["volume_bonus"]):
            if calculate_max_discount(tipe, threshold)["absolute_max"] >= diskon_diminta:
                agent_output["counter_qty"] = threshold
                break

    harga = agent_output.get("harga_per_kg", 0)
    agent_output["total_harga"] = round(qty * harga * (1 - diskon_final / 100))

    return agent_output


def process_sales_request(pesan: str) -> dict:
    for attempt in range(3):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=500,
                temperature=0.0,
                system=build_system_prompt(),
                messages=[{"role": "user", "content": pesan}]
            )
            break
        except anthropic.APIStatusError as e:
            if e.status_code == 529 and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            raise

    result = parse_agent_response(response.content[0].text)

    required = ["partner", "harga_per_kg", "diskon_disetujui", "approved"]
    for field in required:
        if field not in result:
            raise ValueError(f"Field '{field}' tidak ada di respons agent")

    return result


NEGOTIATION_PROMPT = """
Kamu membantu tim Sales membuat pesan balasan ke partner.
Tulis dalam bahasa Indonesia yang natural dan profesional.
Jangan terlalu formal, tapi tetap sopan.

Jika diskon disetujui: konfirmasi dengan hangat, minta konfirmasi order.
Jika tidak disetujui: sampaikan dengan taktis, berikan counter-offer yang menarik.
Maksimal 3 kalimat. Tidak perlu salam pembuka/penutup.
"""


def draft_negotiation_message(deal_data: dict) -> str:
    context = f"""
Partner: {deal_data['partner']} ({deal_data['tipe_partner']})
Produk: {deal_data['produk']}, {deal_data['qty_kg']}kg
Harga per kg: Rp {deal_data['harga_per_kg']:,}
Diskon diminta: {deal_data['diskon_diminta']}%
Diskon disetujui: {deal_data['diskon_disetujui']}%
Total: Rp {deal_data['total_harga']:,}
Counter offer qty (agar dapat diskon diminta): {deal_data.get('counter_qty', 'N/A')}kg
"""
    for attempt in range(3):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=200,
                temperature=0.6,
                system=NEGOTIATION_PROMPT,
                messages=[{"role": "user", "content": context}]
            )
            return response.content[0].text
        except anthropic.APIStatusError as e:
            if e.status_code == 529 and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            raise


# Kolom Log Transaksi (1-based):
# 1:timestamp 2:partner 3:tipe_partner 4:produk 5:qty_kg 6:harga_per_kg
# 7:diskon_diminta 8:diskon_disetujui 9:total_harga 10:approved
# 11:need_human_approval 12:telegram_sales_id 13:detail SO
SO_DETAIL_COL = 13


def log_transaction(deal: dict, telegram_sales_id=None) -> int | None:
    try:
        gc = _get_sheets_client(readonly=False)
        ws = gc.open_by_key(SPREADSHEET_ID).worksheet("Log Transaksi")
        rows_before = len(ws.get_all_values())
        ws.append_row([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            deal.get("partner", ""),
            deal.get("tipe_partner", ""),
            deal.get("produk", ""),
            deal.get("qty_kg", 0),
            deal.get("harga_per_kg", 0),
            deal.get("diskon_diminta", 0),
            deal.get("diskon_disetujui", 0),
            deal.get("total_harga", 0),
            "Ya" if deal.get("approved") else "Tidak",
            "Ya" if deal.get("need_human_approval") else "Tidak",
            str(telegram_sales_id) if telegram_sales_id else "",
            "",  # detail SO — diisi saat /so dipanggil
        ])
        return rows_before + 1  # row index 1-based di sheet
    except Exception as e:
        print(f"[WARN] Gagal log transaksi: {e}")
        return None


def update_so_in_log(log_row: int, so_number: str):
    try:
        gc = _get_sheets_client(readonly=False)
        ws = gc.open_by_key(SPREADSHEET_ID).worksheet("Log Transaksi")
        ws.update_cell(log_row, SO_DETAIL_COL, so_number)
    except Exception as e:
        print(f"[WARN] Gagal update SO di log: {e}")


NEGO_CHECK_PROMPT = """
Kamu adalah AI Sales Checker. Analisis query negosiasi dan tentukan kelayakannya.

Ada 3 jenis query:
1. "max_inquiry" - tanya maksimal diskon yang bisa didapat (contoh: "dapat diskon berapa?", "bisa dapat berapa persen?")
2. "diskon_check" - cek apakah diskon % tertentu bisa diterima (contoh: "minta diskon 15%")
3. "harga_check" - cek apakah harga fix bisa diterima (contoh: "mau harga 30.000/kg", "di harga 11rb")

Untuk harga_check: hitung diskon_pct = (harga_normal - harga_diminta) / harga_normal * 100

Lookup tipe_partner dari nama partner jika bisa ditentukan dari konteks.
Jika partner tidak dikenal, default ke "baru".

{price_context}

Aturan diskon maksimal:
- baru: sesuai newmember_diskon produk
- lama: maks 10% (bonus diskon ekstra: +2% jika qty ≥300kg, +4% jika qty ≥500kg)
- vip: maks 15% (bonus diskon ekstra: +3% jika qty ≥300kg)

CATATAN PENTING:
- "min_order_qty" di data harga = minimum quantity yang harus dipesan (bukan threshold diskon)
- "bonus diskon ekstra" threshold (300kg/500kg) = quantity untuk dapat tambahan %, BUKAN minimum order
- Jika query TIDAK menyebut qty/jumlah, gunakan qty_kg=0 dan JANGAN sebut threshold bonus di alasan
- Di field "alasan", sebut "threshold bonus volume" (bukan "min") agar tidak ambigu dengan min_order

PENTING: Respons HANYA JSON valid tanpa teks lain.
{{
  "query_type": "max_inquiry"|"diskon_check"|"harga_check",
  "partner": string,
  "tipe_partner": "baru"|"lama"|"vip",
  "produk": string,
  "qty_kg": number,
  "harga_normal": number,
  "harga_diminta": number,
  "diskon_pct": number,
  "diskon_max": number,
  "feasible": true|false|null,
  "alasan": string
}}

Untuk max_inquiry: feasible=null, diskon_pct=diskon_max (tampilkan maks yang bisa didapat).
"""


def check_nego(query: str) -> dict:
    price_context, _ = build_price_context()

    # Enrich dengan data partner — load sekali, cari in-memory pakai ngram
    partner_hint = ""
    partner_records = get_partner_list()
    words = query.split()
    found = False
    for n in range(len(words), 0, -1):
        for i in range(len(words) - n + 1):
            phrase = " ".join(words[i:i + n])
            info = _find_partner_in_records(phrase, partner_records)
            if info:
                partner_hint = (
                    f"\nData partner ditemukan: {info['nama_partner']} "
                    f"(owner: {info['nama_owner']}) = tipe {info['tipe_partner']}, "
                    f"volume avg {info.get('volume_avg_kg_bulan', 0)}kg/bulan"
                )
                found = True
                break
        if found:
            break

    prompt = NEGO_CHECK_PROMPT.format(price_context=price_context + partner_hint)
    for attempt in range(3):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=400,
                temperature=0.0,
                system=prompt,
                messages=[{"role": "user", "content": query}]
            )
            break
        except anthropic.APIStatusError as e:
            if e.status_code == 529 and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            raise
    return parse_agent_response(response.content[0].text)


def get_price_table(product_filter: str = "", show_modal: bool = False) -> str:
    try:
        prices = get_price_list()
        source = "live"
    except Exception:
        prices = FALLBACK_PRICES
        source = "fallback"

    # Filter by product name if specified
    if product_filter and product_filter not in ("all", "semua"):
        keyword = product_filter.lower().strip()
        prices = {k: v for k, v in prices.items() if keyword in k}

    if not prices:
        return f"Produk *{product_filter}* tidak ditemukan. Ketik `/cekharga all` untuk lihat semua."

    label = "semua produk" if not product_filter or product_filter in ("all", "semua") else f"*{product_filter}*"
    lines = [f"📦 *DAFTAR HARGA* {label} _{source}_\n"]
    for key, data in prices.items():
        parts = key.rsplit("_", 1)
        produk = parts[0].replace("_", " ").title()
        grade = parts[1].upper() if len(parts) > 1 else "-"
        line = (
            f"• *{produk} Grade {grade}*\n"
            f"  Harga: Rp {data['harga']:,}/kg | Min: {data['min_order']}kg"
        )
        if show_modal:
            line += f" | Modal: Rp {data['harga_modal']:,}/kg"
        lines.append(line)
    return "\n".join(lines)


def full_pipeline(pesan_sales: str, telegram_sales_id=None) -> dict:
    parsed = process_sales_request(pesan_sales)

    # Enrich tipe_partner dari Partner sheet jika partner ditemukan (pakai cache)
    partner_info = _find_partner_in_records(parsed.get("partner", ""), get_partner_list())
    if partner_info:
        parsed["tipe_partner"] = partner_info["tipe_partner"]
        parsed["volume_avg_kg_bulan"] = partner_info.get("volume_avg_kg_bulan", 0)
        parsed["kota"] = partner_info.get("kota", "")

    deal = enforce_and_respond(parsed)
    deal["draft_pesan"] = draft_negotiation_message(deal)
    log_row = log_transaction(deal, telegram_sales_id=telegram_sales_id)
    deal["log_row"] = log_row
    return deal


if __name__ == "__main__":
    result = full_pipeline("Bu Sari (partner baru) mau 5kg jeruk grade A, minta diskon 8%")
    print("=== HASIL AGENT ===")
    print(f"Diskon disetujui: {result['diskon_disetujui']}%")
    print(f"Butuh approval: {result['need_human_approval']}")
    print(f"Draft pesan:\n{result['draft_pesan']}")
