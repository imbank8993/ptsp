# PTSP Digital — MAN Insan Cendekia Gowa

Aplikasi Pusat Pelayanan Terpadu Satu Pintu (PTSP) digital untuk **MAN Insan Cendekia Gowa** dengan antarmuka modern yang serasi dengan ekosistem **ACCA (Academic Center & Access) / akademik-app**.

---

## 🌟 Fitur Utama

1. **Pusat Pengajuan Layanan Terpadu (10 Formulir)**:
   - 📢 **Pengajuan Sosialisasi**: Permohonan kunjungan sosialisasi kampus, sekolah, studi banding, atau kemitraan.
   - 🏢 **Peminjaman Sarana**: Pengajuan peminjaman gedung, aula, ruang kelas, dan sarana prasarana madrasah.
   - 🔬 **Izin Penelitian**: Pengajuan riset, skripsi, tesis, dan pengambilan data di lingkungan madrasah.
   - 📜 **Layanan Legalisir**: Permohonan legalisir ijazah, rapor semester 1-6, transkrip nilai, dan piagam online.
   - 🎓 **Ganti Ijazah Hilang**: Pengajuan surat keterangan pengganti ijazah yang rusak/hilang dilengkapi upload 4 berkas (Copy Ijazah, KTP, Pas Foto 3x4 latar merah, dan Surat Kehilangan Kepolisian).
   - 💼 **Permohonan Magang**: Pengajuan Praktik Kerja Lapangan (PKL) / magang mahasiswa & siswa kejuruan.
   - 🔄 **Mutasi Keluar Siswa**: Permohonan pindah sekolah dengan upload berkas permohonan orang tua.
   - 📣 **Pengaduan Masyarakat**: Saluran pengaduan aspirasi, fasilitas, dan kedisiplinan dengan opsi anonim.
   - 🏠 **Izin Siswa Asrama**: Permohonan izin pulang atau keluar asrama (sakit, izin keluarga, lomba).
   - 📖 **Buku Tamu Digital**: Catatan kunjungan tamu madrasah secara real-time.

2. **Tracker Token & Real-time Timeline**:
   - Pelacakan instan menggunakan **Kode Lacak (Short Code, misal `PTSP-K8J29A`)** atau **Token UUID**.
   - Indikator progres persentase dinamis (Menunggu Verifikasi 25% → Diproses 65% → Selesai/Terbit 100% / Ditolak 0%).
   - Visualisasi tahapan alur berkas (Diterima → Verifikasi Berkas → Disposisi & Tanda Tangan → Pengambilan Dokumen).
   - Menampilkan catatan resmi petugas PTSP secara transparan.

3. **Maskot Interaktif & UI Modern**:
   - Maskot Robot Cerdas ACCA Bot dengan animasi mata terminal (`> _` / `^ ^`) yang memberi panduan kontekstual.
   - Indikator kelengkapan formulir live (`● X% Lengkap`).
   - Tombol Bantuan Cepat WhatsApp terhubung langsung ke loket helpdesk PTSP.
   - Modal selebrasi dengan efek konfeti saat pengajuan berhasil terkirim.

---

## 🛡️ Celah Keamanan & Mitigasi Bug (Zero-Vulnerability Architecture)

1. **Integritas Unggah Berkas Cloudflare R2**:
   - Berkas diunggah ke bucket `acca` di dalam folder tersendiri `PTSP/` (`PTSP/<kategori>/<timestamp>_<uuid>.<ext>`).
   - Validasi ganda: bukan hanya ekstensi berkas, melainkan **analisis signature biner (magic bytes)** untuk mencegah file executable berbahaya yang disamarkan menjadi PDF/JPG.
   - Pembatasan ukuran berkas maksimum (10 MB).
   - Sanitasi nama berkas kriptografis mencegah serangan *Path Traversal* (`../`).

2. **Keamanan Backend (NestJS)**:
   - **Strict Validation Pipe**: menggunakan `whitelist: true` dan `forbidNonWhitelisted: true` dari `class-validator` sehingga parameter liar/injeksi otomatis ditolak dengan error 400.
   - **Proteksi Header**: Integrasi `helmet` untuk proteksi XSS, MIME-sniffing, dan clickjacking.
   - **Rate Limiting**: `ThrottlerGuard` membatasi frekuensi submit dan tracking untuk mencegah DoS dan brute-force.
   - **Transaksi Atomik (Atomic Database Transactions)**: Pembuatan data formulir dan pembuatan record di `ptsp_master_tracking` dibungkus dalam `BEGIN ... COMMIT` sehingga tidak ada risiko inkonsistensi data.
   - **Exception Filter Global**: Seluruh error sistem diproteksi agar tidak membocorkan query SQL, username, password, atau credential database ke publik, melainkan dicatat ke tabel `ptsp_system_logs`.
   - **Privasi Pemohon**: Nama pemohon di halaman publik disamarkan (*masked* otomatis, contoh `Dr. M*** F***`) untuk melindungi data pribadi dari publik.

---

## 🗄️ Database & Storage

- **Database**: PostgreSQL VPS `acca_db` (`schema=public`).
- **Tabel PTSP**:
  - `ptsp_sosialisasi`
  - `ptsp_peminjaman_sarana`
  - `ptsp_izin_penelitian`
  - `ptsp_legalisir`
  - `ptsp_pengganti_ijazah`
  - `ptsp_izin_magang`
  - `ptsp_mutasi_siswa`
  - `ptsp_pengaduan`
  - `ptsp_izin_siswa`
  - `ptsp_buku_tamu`
  - `ptsp_master_tracking` (indeks `short_code` dan `tracking_token`)
  - `ptsp_system_logs`
  - `ptsp_wa_log`
- **Penyimpanan**: Cloudflare R2 Bucket `acca`
  - Folder terisolasi: `PTSP/`
  - Public Base URL: `https://tiny-field-c83e.imbank8993.workers.dev`

---

## 🚀 Panduan Menjalankan Project

### A. Menjalankan dengan Docker Compose (Disarankan)
Aplikasi sudah dikonfigurasi dengan Dockerfile multi-stage yang ringan dan aman:
- **Frontend (Next.js)**: Berjalan di port **3001** (`http://localhost:3001`)
- **Backend (NestJS)**: Berjalan di port **3002** (`http://localhost:3002/api`)

Jalankan perintah berikut:
```bash
# Build dan jalankan seluruh container di background:
docker compose up --build -d

# Memeriksa log container:
docker compose logs -f

# Menghentikan container:
docker compose down
```

### B. Menjalankan Secara Lokal (Node.js)
```bash
# 1. Jalankan backend dan frontend bersamaan:
npm run dev

# 2. Atau jalankan secara terpisah:
npm run dev:backend   # Port 3002 (http://localhost:3002/api)
npm run dev:frontend  # Port 3001 (http://localhost:3001)
```

### C. Build Production
```bash
npm run build
```
