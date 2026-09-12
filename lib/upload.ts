import { createClient } from './supabase'

const BUCKET = 'wedding-photos'
const MAX_FILE_SIZE_MB = 15

/**
 * Kompresi gambar di sisi client menggunakan canvas
 */
export async function compressImage(blob: Blob, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Canvas context tidak tersedia'))
        return
      }
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (compressed) => {
          URL.revokeObjectURL(url)
          if (compressed) resolve(compressed)
          else reject(new Error('Kompresi gagal'))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gagal load gambar untuk kompresi'))
    }
    img.src = url
  })
}

/**
 * Upload foto ke Supabase Storage + insert metadata ke tabel photos
 */
export async function uploadPhoto(
  blob: Blob,
  guestName: string | null,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Validasi ukuran file
  if (blob.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB`)
  }

  const supabase = createClient()
  const fileName = `photo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`
  const filePath = `photos/${fileName}`

  onProgress?.(10)

  // Kompresi sebelum upload
  const compressed = await compressImage(blob, 0.85)
  onProgress?.(30)

  // Upload ke Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, compressed, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`)
  onProgress?.(70)

  // Dapatkan public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  const photoUrl = urlData.publicUrl

  // Insert metadata ke database
  const { error: dbError } = await supabase.from('photos').insert({
    guest_name: guestName || null,
    photo_url: photoUrl,
    is_approved: true,
  })

  if (dbError) throw new Error(`Simpan metadata gagal: ${dbError.message}`)
  onProgress?.(100)

  return photoUrl
}
