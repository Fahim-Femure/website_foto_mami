'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Photo } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'approved' | 'hidden'>('all')

  const checkAuth = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/admin/login')
    }
  }, [router])

  const loadAllPhotos = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setPhotos(data as Photo[])
    setLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
    loadAllPhotos()
  }, [checkAuth, loadAllPhotos])

  const handleToggleApproval = async (photo: Photo) => {
    setActionLoading(photo.id)
    const supabase = createClient()
    const { error } = await supabase
      .from('photos')
      .update({ is_approved: !photo.is_approved })
      .eq('id', photo.id)

    if (!error) {
      setPhotos((prev) =>
        prev.map((p) => p.id === photo.id ? { ...p, is_approved: !p.is_approved } : p)
      )
    }
    setActionLoading(null)
  }

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Yakin ingin menghapus foto ini secara permanen?')) return
    setActionLoading(photo.id)
    const supabase = createClient()

    // Hapus dari storage
    const filePath = photo.photo_url.split('/wedding-photos/')[1]
    if (filePath) {
      await supabase.storage.from('wedding-photos').remove([filePath])
    }

    // Hapus dari database
    const { error } = await supabase.from('photos').delete().eq('id', photo.id)
    if (!error) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    }
    setActionLoading(null)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const filteredPhotos = photos.filter((p) => {
    if (filter === 'approved') return p.is_approved
    if (filter === 'hidden') return !p.is_approved
    return true
  })

  const approvedCount = photos.filter((p) => p.is_approved).length
  const hiddenCount = photos.filter((p) => !p.is_approved).length

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-gold)' }}>
      {/* Header admin */}
      <header
        className="sticky top-0 z-40 px-4 py-4 flex items-center justify-between shadow-sm"
        style={{
          background: 'var(--card-cream)',
          borderBottom: '1.5px solid rgba(232, 195, 74, 0.5)',
        }}
      >
        <div>
          <h1 className="font-serif-display font-semibold text-xl" style={{ color: '#4A3010' }}>
            Admin — Uti &amp; Iam
          </h1>
          <p className="text-xs" style={{ color: '#8A6A1F', fontFamily: 'Poppins, sans-serif' }}>
            Moderasi Foto Galeri
          </p>
        </div>
        <button onClick={handleLogout} className="btn-outline-gold text-sm">
          Keluar
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Foto', value: photos.length, color: '#4A3010' },
            { label: 'Tampil', value: approvedCount, color: '#4A5A3A' },
            { label: 'Disembunyikan', value: hiddenCount, color: '#8A2020' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'var(--card-cream)', border: '1.5px solid rgba(232, 195, 74, 0.4)' }}
            >
              <p className="text-2xl font-bold" style={{ color: stat.color, fontFamily: 'Poppins, sans-serif' }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: '#8A6A1F', fontFamily: 'Poppins, sans-serif' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'approved', 'hidden'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'btn-gold' : 'btn-outline-gold'}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              {f === 'all' ? 'Semua' : f === 'approved' ? 'Tampil' : 'Disembunyikan'}
            </button>
          ))}
          <button
            onClick={loadAllPhotos}
            className="btn-outline-gold ml-auto"
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div
              className="w-10 h-10 rounded-full animate-spin"
              style={{ border: '3px solid #E8C34A', borderTopColor: 'transparent' }}
            />
          </div>
        )}

        {/* Grid foto admin */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-2xl overflow-hidden relative"
                style={{
                  background: 'var(--card-cream)',
                  border: photo.is_approved
                    ? '1.5px solid rgba(74, 90, 58, 0.3)'
                    : '1.5px solid rgba(138, 32, 32, 0.3)',
                  opacity: photo.is_approved ? 1 : 0.7,
                }}
              >
                {/* Foto */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.photo_url}
                  alt={`Foto oleh ${photo.guest_name || 'tamu'}`}
                  className="w-full object-cover"
                  style={{ aspectRatio: '1', height: '180px' }}
                  loading="lazy"
                />

                {/* Badge status */}
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: photo.is_approved ? 'rgba(74, 90, 58, 0.85)' : 'rgba(138, 32, 32, 0.85)',
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '10px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {photo.is_approved ? '✓ Tampil' : '✗ Hidden'}
                </div>

                {/* Info & actions */}
                <div className="p-3">
                  <p className="text-xs font-medium truncate" style={{ color: '#4A3010' }}>
                    {photo.guest_name || 'Tamu Undangan'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#8A6A1F' }}>
                    {new Date(photo.created_at).toLocaleString('id-ID', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>

                  <div className="flex gap-1.5 mt-2.5">
                    {/* Toggle hide/show */}
                    <button
                      onClick={() => handleToggleApproval(photo)}
                      disabled={actionLoading === photo.id}
                      className="flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
                      style={{
                        background: photo.is_approved ? 'rgba(138, 32, 32, 0.12)' : 'rgba(74, 90, 58, 0.12)',
                        color: photo.is_approved ? '#8A2020' : '#4A5A3A',
                        border: photo.is_approved ? '1px solid rgba(138, 32, 32, 0.3)' : '1px solid rgba(74, 90, 58, 0.3)',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {actionLoading === photo.id ? '...' : photo.is_approved ? 'Sembunyikan' : 'Tampilkan'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(photo)}
                      disabled={actionLoading === photo.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
                      style={{ background: 'rgba(138, 32, 32, 0.12)', color: '#8A2020' }}
                      aria-label="Hapus foto"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3,6 5,6 21,6" /><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6" /><path d="M10,11v6M14,11v6" /><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif-display text-xl" style={{ color: '#4A3010' }}>Tidak ada foto</p>
          </div>
        )}
      </main>
    </div>
  )
}
