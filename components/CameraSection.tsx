'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { getUserCamera, captureFrame, hasMultipleCameras } from '@/lib/camera'
import PhotoPreviewModal from './PhotoPreviewModal'

export default function CameraSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [hasMultiCam, setHasMultiCam] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [isMirrored, setIsMirrored] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const pinchStartDistance = useRef<number | null>(null)
  const zoomAtPinchStart = useRef(1)


  const startCamera = useCallback(async (facing: 'user' | 'environment') => {
    // Stop stream lama
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
    setCameraReady(false)
    setCameraError(null)

    try {
      const stream = await getUserCamera(facing)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setCameraReady(true)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
        setCameraError('Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.')
      } else if (msg.includes('NotFoundError')) {
        setCameraError('Kamera tidak ditemukan di perangkat Anda.')
      } else {
        setCameraError('Tidak dapat mengakses kamera. Pastikan browser mendukung kamera.')
      }
    }
  }, [])

  useEffect(() => {
    startCamera(facingMode)
    hasMultipleCameras().then(setHasMultiCam)

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSwitchCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    setIsMirrored(next === 'user')
    setZoomLevel(1) // reset zoom setiap ganti kamera
    startCamera(next)
  }

  const toggleMirror = () => setIsMirrored((prev) => !prev)

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return
    setIsCapturing(true)
    try {
      const blob = await captureFrame(videoRef.current, canvasRef.current, isMirrored, zoomLevel)
      setCapturedBlob(blob)
    } catch {
      setCameraError('Gagal mengambil foto. Silakan coba lagi.')
    } finally {
      setIsCapturing(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCapturedBlob(file)
  }

  const handleModalClose = () => {
    setCapturedBlob(null)
  }

  const ZOOM_PRESETS = [1, 2, 3, 4, 6]
  const MIN_ZOOM = 1
  const MAX_ZOOM = 6

  const getTouchDistance = (touches: React.TouchList) => {
    const t1 = touches[0]
    const t2 = touches[1]
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (facingMode !== 'environment') return
    if (e.touches.length === 2) {
      pinchStartDistance.current = getTouchDistance(e.touches)
      zoomAtPinchStart.current = zoomLevel
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (facingMode !== 'environment') return
    if (e.touches.length === 2 && pinchStartDistance.current) {
      e.preventDefault()
      const newDistance = getTouchDistance(e.touches)
      const scaleFactor = newDistance / pinchStartDistance.current
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomAtPinchStart.current * scaleFactor))
      setZoomLevel(newZoom)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStartDistance.current = null
  }

  return (
    <section
      id="kamera"
      className="py-8 px-4 relative"
    >
      <div className="max-w-lg mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        {/* Judul section */}
        <div className="text-center mb-6">
          <h2
            className="font-serif-display font-semibold text-2xl"
            style={{ color: '#4A3010' }}
          >
            Ambil Foto
          </h2>
        </div>

        {/* Kamera atau error state */}
        {cameraError ? (
          <div
            className="rounded-2xl p-6 text-center flex flex-col items-center gap-4"
            style={{ background: 'var(--card-cream)', border: '1.5px solid #E8C34A' }}
          >
            <div className="text-4xl">📷</div>
            <p className="text-sm" style={{ color: 'var(--charcoal)' }}>{cameraError}</p>

            {/* Fallback: upload dari galeri */}
            <label
              htmlFor="file-upload-fallback"
              className="btn-gold cursor-pointer"
            >
              Upload dari Galeri
              <input
                id="file-upload-fallback"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>

            <button
              onClick={() => startCamera(facingMode)}
              className="btn-outline-gold"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Video preview */}
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-xl"
              style={{
                aspectRatio: '3/4',
                background: '#1a1a1a',
                border: '3px solid #E8C34A',
                maxHeight: '480px',
                touchAction: 'none'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  transform: isMirrored ? 'scaleX(-1)' : 'none',
                  display: cameraReady ? 'block' : 'none',
                }}
              />
              {/* Kontrol zoom (hanya muncul untuk kamera belakang) */}
              {facingMode === 'environment' && cameraReady && (
                <div className="flex items-center gap-2 -mt-2">
                  {ZOOM_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setZoomLevel(preset)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: Math.abs(zoomLevel - preset) < 0.15 ? 'var(--deep-gold)' : 'rgba(138, 106, 31, 0.15)',
                        color: Math.abs(zoomLevel - preset) < 0.15 ? '#F7EFC7' : '#8A6A1F',
                      }}
                    >
                      {preset}x
                    </button>
                  ))}
                </div>
              )}

              {/* Loading skeleton */}
              {!cameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: '#E8C34A', borderTopColor: 'transparent' }}
                  />
                  <p className="text-xs text-white/60">Memuat kamera...</p>
                </div>
              )}

              {/* Tombol switch kamera (mobile dengan multi-cam) */}
              {cameraReady && (

                <button
                  onClick={handleSwitchCamera}
                  aria-label="Ganti kamera"
                  className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white' }}
                >
                  {/* Flip icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
                  </svg>
                </button>
              )}

              {/* Tombol toggle mirror */}
              {cameraReady && (
                <button
                  onClick={toggleMirror}
                  aria-label="Toggle mirror kamera"
                  className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                  style={{
                    background: isMirrored ? 'rgba(2  32, 195, 74, 0.85)' : 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    color: isMirrored ? '#4A3010' : 'white',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v18" /><path d="M16 3v18" />
                    <path d="M4 8l4-4M4 16l4 4" />
                    <path d="M20 8l-4-4M20 16l-4 4" />
                  </svg>
                </button>
              )}

              {/* Overlay frame dekoratif */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 0 2px rgba(232, 195, 74, 0.3)',
                  borderRadius: 'inherit',
                }}
              />
            </div>

            {/* Tombol shutter */}
            <div className="flex flex-col items-center gap-2">
              <button
                id="shutter-button"
                onClick={handleCapture}
                disabled={!cameraReady || isCapturing}
                aria-label="Ambil foto"
                className="shutter-btn w-20 h-20 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:animation-none"
                style={{
                  background: 'var(--deep-gold)',
                  border: '4px solid var(--warm-yellow-end)',
                  boxShadow: '0 4px 20px rgba(138, 106, 31, 0.4)',
                }}
              >
                {isCapturing ? (
                  <div
                    className="w-6 h-6 rounded-full border-3 border-t-transparent animate-spin"
                    style={{ border: '3px solid #F7EFC7', borderTopColor: 'transparent' }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ background: 'var(--cream-gold)' }}
                  />
                )}
              </button>
              <p className="text-xs tracking-widest uppercase" style={{ color: '#8A6A1F', fontFamily: 'Poppins, sans-serif' }}>
                Ambil Foto
              </p>
            </div>

            {/* Fallback upload dari galeri */}
            <label
              htmlFor="file-upload-gallery"
              className="text-xs cursor-pointer underline underline-offset-4"
              style={{ color: '#8A6A1F' }}
            >
              Upload dari Galeri
              <input
                id="file-upload-gallery"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* Canvas tersembunyi untuk capture */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Modal preview setelah capture */}
      {capturedBlob && (
        <PhotoPreviewModal blob={capturedBlob} onClose={handleModalClose} />
      )}
    </section>
  )
}
