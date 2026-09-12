'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchPhotos, subscribeToPhotos, formatRelativeTime } from '@/lib/photos'
import type { Photo } from '@/lib/types'
import LightboxModal from './LightboxModal'

export default function GallerySection() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [newPhotoIds, setNewPhotoIds] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Initial fetch
  const loadPhotos = useCallback(async (pageNum: number, append = false) => {
    try {
      const data = await fetchPhotos(pageNum)
      if (data.length < 20) setHasMore(false)
      setPhotos((prev) => append ? [...prev, ...data] : data)
    } catch (err) {
      console.error('Gagal load foto:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadPhotos(0)
  }, [loadPhotos])

  // Realtime subscription
  useEffect(() => {
    const channel = subscribeToPhotos((newPhoto) => {
      setPhotos((prev) => {
        // Hindari duplikat
        if (prev.find((p) => p.id === newPhoto.id)) return prev
        return [newPhoto, ...prev]
      })
      setNewPhotoIds((prev) => new Set([...prev, newPhoto.id]))
      // Hapus class animasi setelah 1 detik
      setTimeout(() => {
        setNewPhotoIds((prev) => {
          const next = new Set(prev)
          next.delete(newPhoto.id)
          return next
        })
      }, 1000)
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  // Infinite scroll dengan IntersectionObserver
  useEffect(() => {
    if (!hasMore || loadingMore) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = page + 1
          setPage(nextPage)
          setLoadingMore(true)
          loadPhotos(nextPage, true)
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, loadingMore, page, loadPhotos])

  return (
    <section
      id="galeri"
      style={{ minHeight: '60vh' }}
      className="py-10 px-4 relative z-10"
    >
      {/* Header galeri */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{ background: 'rgba(138, 106, 31, 0.1)', border: '1px solid rgba(138, 106, 31, 0.25)' }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#4A5A3A' }}
          />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#4A5A3A', fontFamily: 'Poppins, sans-serif' }}
          >
            Live Gallery
          </span>
        </div>
        <h2
          className="font-serif-display font-semibold text-2xl"
          style={{ color: '#4A3010' }}
        >
          Momen Bersama
        </h2>
        <p className="mt-1 text-xs" style={{ color: '#8A6A1F', fontFamily: 'Poppins, sans-serif' }}>
          {photos.length > 0
            ? `${photos.length} foto dari tamu undangan`
            : 'Belum ada foto — jadilah yang pertama!'}
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="masonry-grid max-w-6xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="masonry-item rounded-2xl animate-pulse"
              style={{
                height: `${180 + (i % 3) * 60}px`,
                background: 'rgba(138, 106, 31, 0.15)',
              }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && photos.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="text-6xl">📸</div>
          <p className="font-serif-display text-xl" style={{ color: '#4A3010' }}>
            Galeri Masih Kosong
          </p>
          <p className="text-sm" style={{ color: '#8A6A1F' }}>
            Ambil foto pertama dan abadikan momen ini!
          </p>
        </div>
      )}

      {/* Masonry grid */}
      {!loading && photos.length > 0 && (
        <div className="masonry-grid max-w-6xl mx-auto">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`masonry-item photo-card rounded-2xl overflow-hidden cursor-pointer ${newPhotoIds.has(photo.id) ? 'animate-fade-in-up' : ''
                }`}
              style={{
                background: 'var(--card-cream)',
                boxShadow: '0 4px 20px rgba(138, 106, 31, 0.12)',
                border: '1.5px solid rgba(232, 195, 74, 0.4)',
              }}
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Foto */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.photo_url}
                alt={`Foto oleh ${photo.guest_name || 'tamu undangan'}`}
                className="w-full object-cover"
                loading="lazy"
                decoding="async"
              />

              {/* Info kartu */}
              <div className="px-3 py-2.5">
                <p
                  className="font-medium text-xs truncate"
                  style={{ color: '#4A3010', fontFamily: 'Poppins, sans-serif' }}
                >
                  {photo.guest_name || 'Tamu Undangan'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8A6A1F' }}>
                  {formatRelativeTime(photo.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sentinel untuk infinite scroll */}
      <div ref={sentinelRef} className="h-4 mt-4" />

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center py-6">
          <div
            className="w-8 h-8 rounded-full border-3 animate-spin"
            style={{ border: '3px solid #E8C34A', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {/* End of gallery */}
      {!hasMore && photos.length > 0 && (
        <div className="text-center py-8">
          <div
            className="inline-block w-32 h-0.5"
            style={{ background: 'linear-gradient(to right, transparent, #8A6A1F, transparent)' }}
          />
          <p className="mt-3 text-xs tracking-widest uppercase" style={{ color: '#8A6A1F', fontFamily: 'Poppins, sans-serif' }}>
            Semua foto telah dimuat
          </p>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <LightboxModal
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={setSelectedPhoto}
        />
      )}
    </section>
  )
}
