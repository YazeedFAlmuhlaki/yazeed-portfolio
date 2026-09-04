'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SERIF = "'Playfair Display', Georgia, serif"
const SANS = "'Outfit', -apple-system, system-ui, sans-serif"

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/admin/dashboard')
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '0.7rem 0.9rem',
    fontFamily: SANS,
    fontSize: '0.85rem',
    fontWeight: 300,
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontFamily: SANS,
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '0.4rem',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: SANS,
    }}>
      <div style={{
        width: '100%', maxWidth: '380px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: '#161616',
        padding: '2.5rem',
      }}>
        <div style={{
          fontSize: '0.6rem', letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
          marginBottom: '0.35rem',
        }}>Admin</div>

        <div style={{
          fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 400,
          color: '#fff', marginBottom: '2rem',
        }}>Sign In</div>

        {error && (
          <div style={{
            fontFamily: SANS, fontSize: '0.75rem', color: '#f472b6',
            marginBottom: '1.25rem', padding: '0.7rem 0.9rem',
            border: '1px solid rgba(244,114,182,0.2)',
            background: 'rgba(244,114,182,0.05)',
          }}>{error}</div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={labelStyle}>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            onKeyDown={(e) => e.key === 'Enter' && login()}
            style={inputStyle}
          />
        </div>

        <button onClick={login} disabled={loading} style={{
          width: '100%', background: '#fff', color: '#0f0f0f',
          border: 'none', padding: '0.8rem',
          fontFamily: SANS, fontSize: '0.68rem',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          cursor: loading ? 'wait' : 'pointer', fontWeight: 600,
          opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Signing in' : 'Sign In'}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        input:focus { border-color: rgba(255,255,255,0.25) !important; }
      ` }} />
    </div>
  )
}