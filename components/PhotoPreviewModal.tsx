'use client'

import { useState, useEffect, useRef } from 'react'
import { uploadPhoto } from '@/lib/upload'

interface Props {
  blob: Blob
  onClose: () => void
}

export default function PhotoPreviewModal({ blob, onClose }: Props) {
  const [guestName, setGuestName] = useState('')
  const [status, setStatus] = useState<'preview' | 'uploading' | 'done' | 'error'>('preview')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status === 'preview') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [status, onClose])

  const handleSubmit = async () => {
    setStatus('uploading')
    setProgress(0)
    try {
      await uploadPhoto(blob, guestName.trim() || null, setProgress)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat upload')
      setStatus('error')
    }
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && status === 'preview') onClose()
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'var(--card-cream)',
          border: '2px solid rgba(232, 195, 74, 0.5)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header modal */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(232, 195, 74, 0.4)' }}
        >
          <h3 className="font-serif-display font-semibold text-lg" style={{ color: '#4A3010' }}>
            {status === 'done' ? 'Foto Tersimpan!' : 'Preview Foto'}
          </h3>
          {status === 'preview' && (
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(138, 106, 31, 0.1)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A6A1F" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Preview gambar */}
        <div className="px-5 pt-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview foto yang baru diambil"
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: '480px', border: '1.5px solid rgba(232, 195, 74, 0.5)' }}
            />
          ) : (
            <div className="w-full rounded-2xl bg-gray-200 animate-pulse" style={{ height: '480px' }} />
          )}
        </div>

        {/* Konten berdasarkan status */}
        <div className="px-5 pb-6 pt-4">
          {status === 'preview' && (
            <>
              {/* Input nama (opsional) */}
              <div className="mb-4">
                <label
                  htmlFor="guest-name-input"
                  className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: '#8A6A1F' }}
                >
                  Nama Kamu (Opsional)
                </label>
                <input
                  id="guest-name-input"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="contoh: Budi & Ani"
                  maxLength={50}
                  className="gold-input"
                />
              </div>

              {/* Tombol aksi */}
              <div className="flex flex-col gap-3">
                <button
                  id="btn-simpan-bagikan"
                  onClick={handleSubmit}
                  className="btn-gold w-full"
                >
                  Simpan &amp; Bagikan
                </button>
                <button
                  id="btn-ambil-ulang"
                  onClick={onClose}
                  className="btn-outline-gold w-full"
                >
                  Ambil Ulang
                </button>
              </div>
            </>
          )}

          {status === 'uploading' && (
            <div className="flex flex-col items-center gap-4 py-2">
              <p className="text-sm font-medium" style={{ color: '#4A3010' }}>
                Sedang mengupload foto...
              </p>
              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#E8C34A40' }}>
                <div
                  className="h-full rounded-full transition-all duration-300 progress-shimmer"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs" style={{ color: '#8A6A1F' }}>{progress}%</p>
            </div>
          )}

          {status === 'done' && (
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: 'rgba(74, 90, 58, 0.12)' }}
              >
                📸
              </div>
              <p className="text-sm" style={{ color: 'var(--charcoal)' }}>
                Foto sudah muncul di galeri! Tamu lain bisa melihatnya sekarang.
              </p>
              <button
                id="btn-ambil-lagi"
                onClick={onClose}
                className="btn-gold w-full"
              >
                Ambil Foto Lagi
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <div className="text-3xl">😔</div>
              <p className="text-sm" style={{ color: '#8A2020' }}>{errorMsg}</p>
              <div className="flex gap-3 w-full">
                <button
                  id="btn-coba-lagi"
                  onClick={handleSubmit}
                  className="btn-gold flex-1"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={onClose}
                  className="btn-outline-gold flex-1"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
