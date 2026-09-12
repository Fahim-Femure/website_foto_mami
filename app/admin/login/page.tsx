'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email atau password salah. Silakan coba lagi.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--cream-gold)' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 shadow-xl"
        style={{
          background: 'var(--card-cream)',
          border: '2px solid rgba(232, 195, 74, 0.5)',
        }}
      >
        {/* Logo/header */}
        <div className="text-center mb-8">
          <h1 className="font-serif-display font-semibold text-2xl" style={{ color: '#4A3010' }}>
            Uti &amp; Iam
          </h1>
          <p className="mt-1 text-xs tracking-widest uppercase" style={{ color: '#8A6A1F', fontFamily: 'Poppins, sans-serif' }}>
            Admin Panel
          </p>
          <div
            className="mx-auto mt-4 w-12 h-0.5"
            style={{ background: 'linear-gradient(to right, transparent, #8A6A1F, transparent)' }}
          />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#8A6A1F' }}>
              Email Admin
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="gold-input"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#8A6A1F' }}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="gold-input"
            />
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: '#8A2020' }}>{error}</p>
          )}

          <button
            id="btn-admin-login"
            type="submit"
            disabled={loading}
            className="btn-gold mt-2"
          >
            {loading ? 'Masuk...' : 'Masuk sebagai Admin'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs" style={{ color: '#A89060' }}>
          Halaman ini hanya untuk admin moderasi foto
        </p>
      </div>
    </div>
  )
}
