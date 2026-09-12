import { createClient } from './supabase'
import type { Photo } from './types'
import type { RealtimeChannel } from '@supabase/supabase-js'

const PAGE_SIZE = 20

/**
 * Fetch foto dengan pagination (hanya yang is_approved = true)
 */
export async function fetchPhotos(page: number = 0): Promise<Photo[]> {
  const supabase = createClient()
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(`Gagal fetch foto: ${error.message}`)
  return (data as Photo[]) ?? []
}

/**
 * Subscribe ke Realtime INSERT pada tabel photos
 */
export function subscribeToPhotos(callback: (photo: Photo) => void): RealtimeChannel {
  const supabase = createClient()
  const channel = supabase
    .channel('photos-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'photos',
        filter: 'is_approved=eq.true',
      },
      (payload) => {
        callback(payload.new as Photo)
      }
    )
    .subscribe()

  return channel
}

/**
 * Format timestamp ke keterangan relatif (misal: "2 menit yang lalu")
 */
export function formatRelativeTime(timestamp: string): string {
  const then = new Date(timestamp)
  return then.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace('pukul', '|') // Optional: id-ID sometimes outputs "12 Desember 2026 pukul 14.30"
}
