# Uti & Iam — Wedding Live Photo Capture System

Web app live photo capture & real-time gallery untuk pernikahan **Uti & Iam**, 12 Desember 2026.
**#mengikUTIlangkahIAM**

---

## Tech Stack
- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom CSS (tema emas)
- **Database & Storage**: Supabase (PostgreSQL + Storage + Realtime + Auth)
- **Deployment**: Vercel (region: Singapore)

---

## Setup Awal (Wajib sebelum `npm run dev`)

### 1. Setup Supabase

#### a. Buat Project Baru
1. Buka [supabase.com](https://supabase.com) → "New project"
2. Pilih region **Southeast Asia (Singapore)**

#### b. Setup Database
1. Buka **SQL Editor** di Supabase Dashboard
2. Klik "New query" → paste seluruh isi file `supabase/schema.sql`
3. Klik "Run" — tabel `photos` dan semua RLS policy akan terbuat otomatis

#### c. Setup Storage
1. Buka **Storage** di Supabase Dashboard
2. Klik "New bucket"
3. Nama bucket: `wedding-photos`
4. Centang **Public bucket** → Save
5. Di bucket settings, set:
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
   - Max file size: `15728640` (15MB)

#### d. Buat Admin User
1. Buka **Authentication > Users**
2. Klik "Add user" → "Create new user"
3. Masukkan email & password untuk akun admin Anda

### 2. Setup Environment Variables

```bash
# Salin template
cp .env.local.example .env.local
```

Edit `.env.local` dan isi nilai dari **Supabase Dashboard > Settings > API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

> **Catatan**: Kamera hanya berfungsi di HTTPS atau `localhost`. Saat testing lokal, gunakan `localhost`, bukan IP address.

---

## Struktur Proyek

```
├── app/
│   ├── layout.tsx          ← Root layout + SEO metadata
│   ├── page.tsx            ← Halaman utama (Header + Kamera + Galeri)
│   ├── globals.css         ← Design system (color palette emas, animasi)
│   └── admin/
│       ├── page.tsx        ← Panel moderasi admin
│       └── login/
│           └── page.tsx    ← Login admin
├── components/
│   ├── Header.tsx          ← Header identitas halaman
│   ├── CameraSection.tsx   ← Live camera + shutter button
│   ├── PhotoPreviewModal.tsx ← Modal preview + upload
│   ├── GallerySection.tsx  ← Galeri real-time + infinite scroll
│   └── LightboxModal.tsx   ← Lightbox + download HD
├── lib/
│   ├── supabase.ts         ← Supabase client
│   ├── camera.ts           ← Camera utilities
│   ├── upload.ts           ← Upload & compression
│   ├── photos.ts           ← Fetch & realtime subscription
│   └── types.ts            ← TypeScript types
└── supabase/
    └── schema.sql          ← SQL schema + RLS policies
```

---

## Deployment ke Vercel

1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com) → "New Project" → import repo
3. Di **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy**

---

## Fitur

| Fitur | Status |
|---|---|
| Live camera preview (depan & belakang) | ✅ |
| Ambil foto + preview modal | ✅ |
| Upload ke Supabase Storage | ✅ |
| Galeri real-time (Supabase Realtime) | ✅ |
| Masonry grid responsive | ✅ |
| Infinite scroll | ✅ |
| Lightbox + navigasi prev/next | ✅ |
| Download HD | ✅ |
| Admin panel moderasi | ✅ |
| Fallback upload dari galeri | ✅ |
| Tema emas elegan | ✅ |

---

## Halaman

| URL | Fungsi |
|---|---|
| `/` | Halaman utama tamu (kamera + galeri) |
| `/admin` | Panel moderasi (perlu login) |
| `/admin/login` | Login admin |

---

## Catatan Hari-H

- Pastikan URL diakses lewat **HTTPS** agar kamera dapat berfungsi di semua browser
- Test di: Chrome Android, Safari iOS, Chrome iPad, Chrome Desktop
- Supabase Free tier cukup untuk ratusan foto (2GB storage, 500MB database)
- Monitor Supabase Dashboard untuk melihat aktivitas upload real-time
