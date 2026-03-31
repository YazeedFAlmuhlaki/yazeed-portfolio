'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

  return (
    <div style={{ minHeight: '100vh', background: '#050a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', border: '1px solid rgba(0,255,200,0.15)', padding: '3rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.3em', color: '#00ffc8', textTransform: 'uppercase', marginBottom: '2rem' }}>Admin Portal</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#fff', marginBottom: '2rem' }}>Sign In</h1>
        {error && <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.75rem', color: '#f472b6', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #f472b630' }}>{error}</div>}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(0,255,200,0.7)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem 1rem', fontFamily: "'Courier New', monospace", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(0,255,200,0.7)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" onKeyDown={(e) => e.key === 'Enter' && login()} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem 1rem', fontFamily: "'Courier New', monospace", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={login} disabled={loading} style={{ width: '100%', background: '#00ffc8', color: '#020a10', border: 'none', padding: '0.9rem', fontFamily: "'Courier New', monospace", fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}