# Product Requirements Document (PRD)
## Sistem Live Photo Capture & Gallery — "Uti & Iam"

| | |
|---|---|
| **Nama Proyek** | Uti & Iam — Wedding Live Photo Capture System |
| **Hashtag** | #mengikUTIlangkahIAM |
| **Tanggal Acara** | 12 Desember 2026 |
| **Versi Dokumen** | 2.0 (Revisi — scope disederhanakan) |
| **Dibuat untuk** | Antigravity (AI Coding Agent) |
| **Status** | Draft — siap dieksekusi |

> **Catatan revisi penting:** Website undangan (Our Story, The Event, Childhood, Ucapan, dll.) **sudah ada dan terpisah**, dan **bukan** bagian dari proyek ini. Gambar referensi yang dilampirkan sebelumnya **hanya digunakan sebagai acuan color palette/tema warna**, bukan acuan struktur halaman. PRD ini **hanya mencakup satu sistem berdiri sendiri**: fitur kamera live capture dan galeri foto real-time beserta tampilannya di web.

---

## 1. Latar Belakang & Tujuan

Dibutuhkan sebuah **web app standalone** (halaman tunggal atau mini-web terpisah) yang berfungsi sebagai **penangkap momen digital** saat acara pernikahan berlangsung pada **12 Desember 2026**.

Pada hari-H, tamu undangan membuka link web ini, mengaktifkan kamera langsung dari browser, mengambil foto, dan foto tersebut **langsung tampil secara real-time** di galeri publik pada halaman yang sama (format scroll ke bawah, seperti feed). Setiap foto dapat diunduh dalam kualitas HD oleh siapa saja.

### Tujuan Utama
1. Menyediakan fitur capture foto berbasis kamera browser (tanpa aplikasi tambahan, tanpa login).
2. Menampilkan seluruh foto yang diambil tamu secara real-time dalam satu galeri bersama, tersusun scroll ke bawah.
3. Memungkinkan setiap foto diunduh dalam resolusi tinggi (HD).
4. Berjalan mulus di semua perangkat: mobile, tablet/iPad, dan desktop.
5. Tema visual mengikuti color palette emas/kuning dari gambar referensi yang dilampirkan.

---

## 2. Ruang Lingkup (Scope)

### 2.1 Termasuk dalam scope (In-Scope)
- Satu halaman web (single-page app) khusus fitur **Live Photo Capture**.
- Kamera live preview + tombol ambil foto.
- Upload otomatis hasil foto ke database/storage.
- Galeri foto real-time yang menampilkan seluruh foto dari semua tamu, urut dari terbaru, dengan scroll ke bawah.
- Tombol download HD di setiap foto.
- Elemen branding minimal: nama "Uti & Iam" dan hashtag **#mengikUTIlangkahIAM** sebagai header/judul halaman.
- Tema warna emas/kuning sesuai gambar referensi.
- Responsive penuh: mobile, tablet, desktop.
- Deploy ke Vercel, database & storage di Supabase.

### 2.2 Tidak termasuk dalam scope (Out-of-Scope)
- Halaman Our Story, The Event, Childhood, Ucapan, dan seluruh konten undangan lain — **sudah ada di website terpisah**, tidak perlu dibuat ulang di sini.
- Sistem navigasi multi-halaman/navbar kompleks.
- Sistem login/akun tamu (akses publik, tanpa login).
- Filter foto ala Instagram/AR beauty filter.
- Live streaming video.
- Cetak fisik foto otomatis.

### 2.3 Integrasi dengan Website Undangan yang Sudah Ada
Karena website undangan sudah ada secara terpisah, sistem foto ini bisa:
- **Opsi A (direkomendasikan)**: Dibuat sebagai halaman/route tambahan di dalam project website yang sudah ada (misal `/momen` atau `/gallery`), lalu ditambahkan sebagai satu menu baru di navbar website lama.
- **Opsi B**: Dibuat sebagai sub-domain atau mini-web terpisah (misal `momen.utidaniam.com`) yang berdiri sendiri, dan dari website utama cukup ditambahkan tombol/link menuju web ini.

> Developer/Antigravity perlu konfirmasi ke klien opsi mana yang dipilih sebelum mulai coding, karena ini memengaruhi struktur repository. Jika tidak ada instruksi lebih lanjut, default ke **Opsi B** (berdiri sendiri) agar tidak mengganggu website undangan yang sudah berjalan.

---

## 3. Tema Visual & Design Guideline

### 3.1 Konsep
Tema **elegant golden/yellow**, hangat dan romantis, **hanya mengambil color palette** dari gambar referensi yang dilampirkan (bukan tata letak/struktur halamannya).

### 3.2 Color Palette (diambil dari gambar referensi)

| Nama Warna | Kode Hex (perkiraan) | Penggunaan |
|---|---|---|
| Cream Gold Light | `#F7EFC7` | Background utama halaman |
| Warm Yellow Gradient | `#E8C34A` → `#F3D877` | Background section/hero kecil di atas galeri |
| Deep Gold / Bronze | `#8A6A1F` | Tombol shutter/kamera, tombol download, aksen ikon |
| Dark Olive / Forest Green | `#4A5A3A` | Teks hashtag (italic), aksen kontras |
| Charcoal Grey | `#4A4A4A` | Teks label kecil, keterangan foto |
| Card Background (Cream White) | `#FDF9E8` | Kartu/frame di sekitar foto pada galeri |

> Developer wajib mengekstrak nilai hex pasti dari file gambar referensi menggunakan color picker; tabel di atas adalah estimasi visual sebagai acuan awal.

### 3.3 Tipografi
- **Judul halaman ("Uti & Iam")**: font serif elegan (contoh: *Playfair Display* atau *Cormorant Garamond*).
- **Hashtag**: serif italic.
- **Label/tombol/keterangan kecil**: sans-serif uppercase dengan letter-spacing lebar (contoh: *Poppins* atau *Montserrat*).

### 3.4 Elemen Dekoratif
- Ilustrasi bunga kuning blur di pojok layar (opsional, ringan, sebagai aksen background saja) — gaya sama seperti pada gambar referensi.
- Tombol shutter berbentuk bulat besar dengan warna gold solid.
- Kartu/frame foto di galeri dengan sudut membulat (rounded-2xl) dan shadow lembut.

---

## 4. Struktur Halaman Tunggal

Karena ini adalah web standalone/single-page, strukturnya sederhana, dari atas ke bawah:

1. **Header singkat**: Nama "Uti & Iam" + tanggal 12 Desember 2026 + hashtag **#mengikUTIlangkahIAM** (statis, sebagai identitas halaman).
2. **Kamera Section**: Live preview kamera + tombol ambil foto + tombol switch kamera depan/belakang.
3. **Galeri Section**: Feed foto real-time dari seluruh tamu, scroll ke bawah, dengan tombol download HD di tiap foto.

Tidak ada navbar multi-menu, tidak ada halaman lain di dalam web ini.

---

## 5. Spesifikasi Fitur Utama: Live Photo Capture & Gallery

### 5.1 Alur Pengguna (User Flow)
1. Tamu membuka link web sistem foto ini.
2. Website meminta izin akses kamera browser (`getUserMedia` API).
3. Tamu melihat live preview kamera di layar (mendukung kamera depan & belakang pada mobile, dengan tombol switch kamera).
4. Tamu menekan tombol **"Ambil Foto"** (shutter button).
5. Sistem menampilkan preview hasil foto dengan 2 pilihan: **"Simpan & Bagikan"** atau **"Ambil Ulang"**.
6. (Opsional, disarankan) Tamu dapat mengisi **nama** singkat sebelum submit, agar setiap foto punya keterangan "diambil oleh: [Nama]".
7. Setelah tamu menekan **"Simpan & Bagikan"**:
   - Foto diunggah ke Supabase Storage.
   - Metadata foto (nama pengambil, timestamp, URL foto) disimpan ke Supabase Database.
8. Foto otomatis muncul di **galeri real-time** di bagian bawah halaman yang sama, tersusun secara **scroll ke bawah (masonry grid atau feed list)**, dengan foto terbaru muncul paling atas.
9. Tamu lain yang sedang membuka halaman yang sama akan melihat foto baru muncul otomatis tanpa perlu refresh (real-time update).
10. Tamu dapat mengklik salah satu foto di galeri untuk melihat versi penuh (lightbox) dan menekan tombol **"Download HD"** untuk mengunduh foto asli ke perangkat mereka.

### 5.2 Kebutuhan Fungsional Detail

| ID | Kebutuhan | Detail Teknis |
|---|---|---|
| F-01 | Akses kamera browser | Gunakan Web API `navigator.mediaDevices.getUserMedia()`. Harus berjalan di HTTPS (syarat wajib browser modern). |
| F-02 | Switch kamera depan/belakang | Deteksi `facingMode: 'user'` vs `'environment'`, tampilkan tombol toggle di mobile. |
| F-03 | Capture foto ke canvas | Gunakan HTML5 `<canvas>` untuk mengambil frame dari video stream menjadi gambar (format JPEG/PNG). |
| F-04 | Kualitas foto HD | Capture pada resolusi native kamera (idealnya minimal 1920×1080 atau resolusi maksimum yang didukung device), tanpa kompresi berlebihan saat upload. |
| F-05 | Upload ke storage | Upload file gambar ke **Supabase Storage** (bucket khusus, misal `wedding-photos`). |
| F-06 | Simpan metadata | Insert data ke tabel Supabase: nama pengambil (opsional), URL foto, timestamp, status moderasi. |
| F-07 | Galeri real-time | Gunakan **Supabase Realtime (subscribe on INSERT)** agar galeri otomatis update tanpa refresh saat ada foto baru masuk. |
| F-08 | Infinite scroll / pagination | Galeri memuat foto secara bertahap (misal 20 foto per batch) agar performa tetap ringan meski jumlah foto banyak. |
| F-09 | Download HD | Tombol download mengambil file asli (bukan thumbnail) dari Supabase Storage URL, memicu `<a download>` agar tersimpan langsung ke perangkat tamu. |
| F-10 | Moderasi (Admin) | Halaman khusus admin (dilindungi password sederhana atau Supabase Auth) untuk menghapus foto yang tidak pantas dari galeri publik. Halaman ini terpisah dari halaman utama tamu (misal route `/admin`). |
| F-11 | Kompatibilitas lintas perangkat | Wajib teruji di: Chrome/Safari mobile (iOS & Android), Safari/Chrome iPad, Chrome/Edge/Safari desktop. |
| F-12 | Fallback tanpa kamera | Jika browser/perangkat tidak mengizinkan akses kamera, sediakan opsi **"Upload dari Galeri"** sebagai alternatif (`<input type="file" accept="image/*" capture>`). |

### 5.3 Kebutuhan Non-Fungsional
- **Performa**: Halaman harus tetap responsif meski diakses oleh puluhan/ratusan tamu secara bersamaan saat acara berlangsung.
- **Keamanan**:
  - Validasi tipe file (hanya image) dan batas ukuran file (misal maksimal 15MB per foto) sebelum upload.
  - Supabase Row Level Security (RLS) diaktifkan: publik hanya boleh INSERT (upload) dan SELECT (lihat), tidak boleh UPDATE/DELETE — hanya admin yang bisa moderasi.
- **Ketersediaan**: Website harus stabil selama durasi acara (estimasi 4–8 jam beban tinggi pada tanggal 12 Desember 2026).
- **Privasi**: Tidak ada data pribadi sensitif yang diminta dari tamu (cukup nama, opsional).
- **Kompresi cerdas**: Foto dikompresi ringan di sisi client sebelum upload (misal ke ~85% quality JPEG) untuk mempercepat upload tanpa mengorbankan kualitas HD secara signifikan; foto asli tetap disimpan untuk keperluan download.

---

## 6. Arsitektur Teknis

### 6.1 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend Framework | Next.js (React) — direkomendasikan karena kompatibel penuh dengan Vercel |
| Styling | Tailwind CSS (memudahkan implementasi tema warna kustom & responsive design) |
| Kamera / Media Capture | Web MediaDevices API + HTML5 Canvas |
| Database | Supabase (PostgreSQL) |
| Storage File Foto | Supabase Storage |
| Realtime Update Galeri | Supabase Realtime Subscriptions |
| Autentikasi Admin (moderasi) | Supabase Auth (email/password sederhana untuk 1 akun admin) |
| Hosting / Deployment | Vercel |
| Domain | Sub-path atau sub-domain dari website undangan yang sudah ada (lihat Section 2.3) |

### 6.2 Skema Database Supabase

**Tabel: `photos`**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | ID unik foto, auto-generate |
| `guest_name` | text (nullable) | Nama tamu yang mengambil foto (opsional) |
| `photo_url` | text | URL publik foto di Supabase Storage |
| `thumbnail_url` | text (nullable) | URL thumbnail (opsional, untuk mempercepat loading galeri) |
| `created_at` | timestamp | Waktu foto diambil, default `now()` |
| `is_approved` | boolean | Default `true`; admin bisa set `false` untuk sembunyikan dari galeri |

**Storage Bucket**: `wedding-photos` (public read, restricted write via RLS policy agar hanya melalui aplikasi, bukan akses langsung).

> Tidak ada tabel `wishes` atau tabel konten undangan lain — itu adalah tanggung jawab website terpisah yang sudah ada.

### 6.3 Responsive Design
Wajib menggunakan pendekatan **mobile-first**, dengan breakpoint minimal:
- Mobile: < 640px
- Tablet/iPad: 640px – 1024px
- Desktop: > 1024px

Elemen kamera (video preview) harus menyesuaikan aspect ratio otomatis di ketiga breakpoint tersebut, dan grid galeri berubah dari 1 kolom (mobile) → 2–3 kolom (tablet) → 4 kolom (desktop).

---

## 7. Alur Deployment
1. Setup project Supabase → buat tabel `photos`, bucket storage `wedding-photos`, dan RLS policy.
2. Setup project Next.js, integrasikan Supabase client (`@supabase/supabase-js`).
3. Simpan environment variable (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) di Vercel Project Settings (bukan hardcode di kode).
4. Push kode ke repository (GitHub/GitLab) — terpisah dari repository website undangan utama (kecuali jika memilih Opsi A pada Section 2.3).
5. Hubungkan repository ke Vercel untuk auto-deploy setiap ada perubahan.
6. Uji coba penuh di staging URL sebelum tanggal acara (12 Desember 2026), termasuk uji beban (simulasi banyak pengguna upload bersamaan).
7. Setup link/tombol dari website undangan utama menuju halaman/sub-domain sistem foto ini.

---

## 8. Metrik Keberhasilan (Success Metrics)
- Website dapat diakses tanpa error di 3 kategori perangkat (mobile, tablet, desktop) — 0 bug kritikal pada hari-H.
- Waktu upload 1 foto (dari capture hingga muncul di galeri) di bawah 5 detik dengan koneksi internet normal.
- Galeri dapat menampung minimal 500 foto tanpa penurunan performa signifikan.
- Fitur download HD menghasilkan file dengan resolusi yang sama/mendekati hasil capture asli.

---

## 9. Timeline Pengembangan (Estimasi, dapat disesuaikan)

| Tahap | Durasi | Deliverable |
|---|---|---|
| Setup project (Next.js + Supabase + Vercel) | 1–2 hari | Environment siap, skema database jadi |
| UI header + tema warna | 1 hari | Header identitas halaman sesuai color palette |
| Fitur kamera + capture + upload | 4–5 hari | Fitur inti berfungsi end-to-end |
| Fitur galeri real-time + download HD | 3 hari | Galeri live update, download berfungsi |
| Testing lintas perangkat & QA | 2 hari | Bug fixing, uji beban |
| Deployment final + integrasi link ke web utama | 1 hari | Web live siap diakses tamu |

---

## 10. Lampiran
- Referensi color palette: gambar landing page bertema kuning-emas (dilampirkan terpisah oleh klien) — **hanya diambil warnanya**, bukan struktur halamannya.
- Format hashtag di seluruh halaman: **#mengikUTIlangkahIAM** (perhatikan kapitalisasi persis: huruf besar pada "UTI" dan "IAM").

---

*Dokumen ini disusun agar dapat langsung digunakan sebagai instruksi kerja oleh Antigravity (AI coding agent) tanpa perlu klarifikasi tambahan, dengan scope yang sudah dipersempit hanya pada sistem live photo capture & gallery. Jika ada asumsi di atas yang perlu diubah (misalnya opsi integrasi pada Section 2.3, atau kapasitas foto), silakan revisi bagian terkait sebelum dikirim.*
