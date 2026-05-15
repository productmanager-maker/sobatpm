import gspread
import os
import re
from google.oauth2.service_account import Credentials

SPREADSHEET_ID = "1YifLsgcVbx89ET4auPgOVi2YCFAgZUOCmqogN-RDeNk"
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), "service-account.json")

PARTNERS = [
    # (nama, tipe, bergabung, volume_avg_kg, kota, telegram_id)
    ("UD Sumber Rejeki",    "vip",  "2024-01-10", 650, "Jakarta",   ""),
    ("CV Maju Bersama",     "vip",  "2024-02-05", 820, "Surabaya",  ""),
    ("Toko Hijau Segar",    "vip",  "2024-03-12", 510, "Bandung",   ""),
    ("PT Agro Nusantara",   "lama", "2024-09-03", 280, "Semarang",  ""),
    ("UD Berkah Tani",      "lama", "2024-08-20", 190, "Yogyakarta",""),
    ("CV Buah Sayur Prima", "lama", "2024-10-01", 320, "Medan",     ""),
    ("Toko Pak Hendra",     "lama", "2024-11-15", 150, "Makassar",  ""),
    ("UD Sejahtera Makmur", "lama", "2024-07-22", 410, "Bali",      ""),
    ("CV Segar Selalu",     "lama", "2025-01-08", 230, "Palembang", ""),
    ("Warung Gizi Bu Dewi", "lama", "2025-02-14", 170, "Malang",    ""),
    ("Toko Sayur Pak Budi", "lama", "2025-01-30", 260, "Bogor",     ""),
    ("UD Panen Raya",       "lama", "2024-12-05", 390, "Bekasi",    ""),
    ("CV Fresh Market",     "baru", "2026-03-10", 80,  "Jakarta",   ""),
    ("Toko Organik Muda",   "baru", "2026-04-02", 45,  "Bandung",   ""),
    ("UD Hijau Asri",       "baru", "2026-04-18", 60,  "Depok",     ""),
    ("Warung Sehat Bu Sari","baru", "2026-05-01", 30,  "Tangerang", ""),
    ("CV Dapur Nusantara",  "baru", "2026-05-05", 55,  "Surabaya",  ""),
    ("Toko Buah Pak Rudi",  "baru", "2026-04-25", 40,  "Yogyakarta",""),
    ("UD Segar Prima",      "baru", "2026-05-10", 25,  "Semarang",  ""),
    ("CV Mitra Tani Muda",  "baru", "2026-05-12", 70,  "Malang",    ""),
]

LOG_HEADER = [
    "timestamp", "partner", "tipe_partner", "produk",
    "qty_kg", "harga_per_kg", "diskon_diminta", "diskon_disetujui",
    "total_harga", "approved", "need_human_approval",
]

PARTNER_HEADER = [
    "id_partner", "nama", "tipe_partner", "tanggal_bergabung",
    "volume_avg_kg_bulan", "kota", "telegram_chat_id",
]


def main():
    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SPREADSHEET_ID)

    # --- Sheet: Partner ---
    try:
        ws_partner = sh.worksheet("Partner")
        ws_partner.clear()
        print("Sheet 'Partner' ditemukan, data lama dihapus.")
    except gspread.WorksheetNotFound:
        ws_partner = sh.add_worksheet(title="Partner", rows=100, cols=10)
        print("Sheet 'Partner' dibuat baru.")

    ws_partner.append_row(PARTNER_HEADER)
    rows = [
        [f"P{str(i+1).zfill(3)}", nama, tipe, bergabung, vol, kota, tg_id]
        for i, (nama, tipe, bergabung, vol, kota, tg_id) in enumerate(PARTNERS)
    ]
    ws_partner.append_rows(rows)
    print(f"✓ {len(rows)} data partner berhasil ditulis.")

    # --- Sheet: Log Transaksi — pastikan header ada ---
    try:
        ws_log = sh.worksheet("Log Transaksi")
        if ws_log.row_count == 0 or ws_log.cell(1, 1).value != "timestamp":
            ws_log.insert_row(LOG_HEADER, index=1)
            print("✓ Header 'Log Transaksi' ditambahkan.")
        else:
            print("✓ Sheet 'Log Transaksi' sudah ada header, tidak diubah.")
    except gspread.WorksheetNotFound:
        print("✗ Sheet 'Log Transaksi' tidak ditemukan — pastikan sudah dibuat manual di spreadsheet.")


if __name__ == "__main__":
    main()
