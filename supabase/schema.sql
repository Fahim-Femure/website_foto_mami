-- ============================================================
-- Schema Supabase untuk Uti & Iam Wedding Photo Capture System
-- Jalankan di Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================

-- 1. Buat tabel photos
CREATE TABLE IF NOT EXISTS public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text,
  photo_url text NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  is_approved boolean DEFAULT true NOT NULL
);

-- 2. Index untuk performa galeri (urut terbaru, hanya yang approved)
CREATE INDEX IF NOT EXISTS photos_approved_created_idx
  ON public.photos (is_approved, created_at DESC);

-- 3. Aktifkan Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Siapapun bisa SELECT foto yang is_approved = true
CREATE POLICY "Public can view approved photos"
  ON public.photos
  FOR SELECT
  USING (is_approved = true);

-- 5. Policy: Siapapun bisa INSERT foto baru (publik, tanpa login)
CREATE POLICY "Public can upload photos"
  ON public.photos
  FOR INSERT
  WITH CHECK (true);

-- 6. Policy: Hanya admin (authenticated) yang bisa UPDATE (moderasi)
CREATE POLICY "Admin can update photos"
  ON public.photos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 7. Policy: Hanya admin (authenticated) yang bisa DELETE
CREATE POLICY "Admin can delete photos"
  ON public.photos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 8. Aktifkan Realtime untuk tabel photos
ALTER PUBLICATION supabase_realtime ADD TABLE public.photos;

-- ============================================================
-- STORAGE SETUP (lakukan di Supabase Dashboard > Storage)
-- ============================================================
-- 1. Buat bucket baru dengan nama: wedding-photos
-- 2. Set bucket sebagai PUBLIC
-- 3. Allowed MIME types: image/jpeg, image/png, image/webp
-- 4. Max file size: 15MB (15728640 bytes)
--
-- RLS Policy untuk Storage (jika diperlukan tambahan):
-- - Public SELECT: sudah otomatis karena bucket public
-- - Insert: tambahkan policy agar hanya bisa upload ke folder 'photos/'
-- ============================================================

-- ============================================================
-- ADMIN AUTH SETUP
-- ============================================================
-- 1. Buka Supabase Dashboard > Authentication > Users
-- 2. Klik "Add user" > "Create new user"
-- 3. Masukkan email & password admin Anda
-- 4. User ini yang digunakan untuk login ke /admin
-- ============================================================
