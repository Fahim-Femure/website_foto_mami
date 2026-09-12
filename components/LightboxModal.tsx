'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Photo } from '@/lib/types'

interface Props {
  photo: Photo
  photos: Photo[]
  onClose: () => void
  onNavigate: (photo: Photo) => void
}

export default function LightboxModal({ photo, photos, onClose, onNavigate }: Props) {
  const currentIndex = photos.findIndex((p) => p.id === photo.id)

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(photos[currentIndex - 1])
  }, [currentIndex, photos, onNavigate])

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) onNavigate(photos[currentIndex + 1])
  }, [currentIndex, photos, onNavigate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, handlePrev, handleNext])

  // Prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.photo_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `uti-iam-wedding-photo-${photo.id.slice(0, 8)}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: buka di tab baru
      window.open(photo.photo_url, '_blank')
    }
  }

  const touchStartX = useRef<number>(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: 'var(--card-cream)',
          border: '2px solid rgba(232, 195, 74, 0.4)',
          maxHeight: '90vh',
        }}
      >
        {/* Toolbar atas */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(232, 195, 74, 0.4)' }}
        >
          <div>
            <p className="font-semibold text-sm" style={{ color: '#4A3010', fontFamily: 'Poppins, sans-serif' }}>
              {photo.guest_name || 'Tamu'}
            </p>
            <p className="text-xs" style={{ color: '#8A6A1F' }}>
              {new Date(photo.created_at).toLocaleString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup lightbox"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(138, 106, 31, 0.12)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A6A1F" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Gambar besar */}
        <div className="relative flex-1 overflow-hidden" style={{ minHeight: '200px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.photo_url}
            alt={`Foto oleh ${photo.guest_name || 'tamu'}`}
            className="w-full h-full object-contain"
            style={{ maxHeight: '60vh' }}
          />

          {/* Navigasi prev */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', color: 'white' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6" /></svg>
            </button>
          )}

          {/* Navigasi next */}
          {currentIndex < photos.length - 1 && (
            <button
              onClick={handleNext}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', color: 'white' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6" /></svg>
            </button>
          )}
        </div>

        {/* Footer dengan download */}
        <div
          className="px-5 py-4 flex items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(232, 195, 74, 0.4)' }}
        >
          <p className="text-xs" style={{ color: '#8A6A1F' }}>
            {currentIndex + 1} / {photos.length}
          </p>
          <button
            id="btn-download-hd"
            onClick={handleDownload}
            className="btn-gold flex items-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Download HD
          </button>
        </div>
      </div>
    </div>
  )
}
