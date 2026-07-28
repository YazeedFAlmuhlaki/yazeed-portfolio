'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const T = {
  bg: '#ffffff',
  text: '#0a0a0a',
  muted: '#8a8a8a',
  faint: '#aaaaaa',
  border: '#f0f0f0',
  tagBg: '#fafafa',
}

const SERIF = "'Playfair Display', Georgia, serif"
const SANS = "'Outfit', -apple-system, system-ui, sans-serif"

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); ob.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  return ref
}

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [certs, setCerts] = useState<any[]>([])
  const [about, setAbout] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeNav, setActiveNav] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const aboutRef = useReveal()
  const skillsRef = useReveal()
  const projectsRef = useReveal()
  const certsRef = useReveal()
  const contactRef = useReveal()

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').order('created_at').then(({ data }) => data && setProjects(data))
    supabase.from('skills').select('*').order('sort_order').then(({ data }) => data && setSkills(data))
    supabase.from('certifications').select('*').order('sort_order').order('created_at').then(({ data }) => data && setCerts(data))
    supabase.from('about').select('*').single().then(({ data }) => data && setAbout(data))
  }, [])

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40)
      const sections = ['About', 'Skills', 'Work', 'Certifications', 'Contact']
      for (const s of sections) {
        const el = document.getElementById(s)
        if (el) { const r = el.getBoundingClientRect(); if (r.top <= 120 && r.bottom >= 120) { setActiveNav(s); return } }
      }
      setActiveNav('')
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveNav(id); setMenuOpen(false)
  }

  const featured = skills.filter((s) => s.featured).slice(0, 6)
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))]
  const filtered = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory)
  const NAV = ['About', 'Skills', 'Work', 'Certifications', 'Contact']

  const label = (txt: string) => (
    <div style={{ fontFamily: SANS, fontSize: '0.65rem', color: T.faint, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 400 }}>{txt}</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 1.5rem',
        background: scrolled ? 'rgba(255,255,255,0.94)' : 'transparent',
        borderBottom: scrolled ? '1px solid ' + T.border : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <div className="nav-desktop">
          {NAV.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', fontWeight: 400,
              color: activeNav === l ? T.text : T.faint,
              padding: '4px 0', transition: 'color 0.2s',
            }}>{l}</button>
          ))}
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen((v) => !v)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          flexDirection: 'column', gap: '5px', padding: '8px',
          position: 'absolute', right: '1.25rem',
        }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: 'block', width: menuOpen && i === 1 ? '0' : '20px', height: '1px', background: T.text,
              transform: menuOpen ? (i === 0 ? 'translateY(6px) rotate(45deg)' : i === 2 ? 'translateY(-6px) rotate(-45deg)' : 'none') : 'none',
              transition: 'all 0.25s', opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: SANS, fontSize: '0.8rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: activeNav === l ? T.text : T.muted, padding: '6px 0',
            }}>{l}</button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem 4rem' }}>
        <div className="hero-grid">
          <div>
            <div style={{ fontFamily: SANS, fontSize: '0.7rem', color: T.faint, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              {about?.tagline || 'Spatial Data Scientist'}
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 400, lineHeight: 0.98, margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>Yazeed</h1>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 0.98, margin: '0 0 2.5rem', letterSpacing: '-0.01em' }}>Almuhlaki</h1>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1rem', color: T.muted, lineHeight: 1.85, maxWidth: '420px', margin: '0 0 2.5rem' }}>
              {about?.paragraph1 || ''}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => scrollTo('Work')} style={{
                background: T.text, color: T.bg, border: 'none', padding: '0.9rem 2rem',
                fontFamily: SANS, fontSize: '0.7rem', fontWeight: 500,
                letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
              }}>View Work</button>
              {about?.cv_url && (
                <a href={about.cv_url} target="_blank" rel="noreferrer" style={{
                  border: '1px solid ' + T.border, color: T.muted, padding: '0.9rem 2rem',
                  fontFamily: SANS, fontSize: '0.7rem', letterSpacing: '0.14em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center',
                }}>Download CV</a>
              )}
            </div>
          </div>

          {/* Featured skills sidebar */}
          {featured.length > 0 && (
            <div className="hero-side">
              <div style={{ fontFamily: SANS, fontSize: '0.6rem', color: T.faint, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1rem' }}>Core Skills</div>
              {featured.map((s) => (
                <div key={s.id} style={{
                  padding: '0.6rem 0', borderBottom: '1px solid ' + T.border,
                  fontFamily: SANS, fontWeight: 300, fontSize: '0.85rem', color: T.text,
                }}>{s.name}</div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="About" className="sec" style={{ maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem', borderTop: '1px solid ' + T.border }}>
        <div ref={aboutRef} className="reveal">
          {label('About')}
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, lineHeight: 1.35, margin: '0 0 2rem', maxWidth: '760px' }}>
            {about?.heading || ''}
          </h2>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1rem', color: T.muted, lineHeight: 1.9, maxWidth: '640px' }}>
            {about?.paragraph2 || ''}
          </p>
        </div>
      </section>

      {/* SKILLS */}
      <section id="Skills" className="sec" style={{ maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem', borderTop: '1px solid ' + T.border }}>
        <div ref={skillsRef} className="reveal">
          {label('Skills')}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)} style={{
                background: activeCategory === c ? T.text : 'transparent',
                color: activeCategory === c ? T.bg : T.muted,
                border: '1px solid ' + (activeCategory === c ? T.text : T.border),
                fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.1em',
                padding: '6px 14px', cursor: 'pointer', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {filtered.map((s) => (
              <span key={s.id} style={{
                fontFamily: SANS, fontWeight: 300, fontSize: '0.8rem',
                color: T.text, background: T.tagBg, border: '1px solid ' + T.border,
                padding: '7px 16px',
              }}>{s.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="Work" className="sec" style={{ maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem', borderTop: '1px solid ' + T.border }}>
        <div ref={projectsRef} className="reveal">
          {label('Selected Work')}
          <div className="work-grid">
            {projects.map((p) => (
              <div key={p.id} style={{ background: T.tagBg, border: '1px solid ' + T.border, padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.6rem' }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 400, margin: 0, lineHeight: 1.3 }}>{p.title}</h3>
                  {p.year && <span style={{ fontFamily: SANS, fontSize: '0.7rem', color: T.faint, flexShrink: 0 }}>{p.year}</span>}
                </div>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.88rem', color: T.muted, lineHeight: 1.75, margin: '0 0 1.25rem' }}>{p.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: p.github_url && p.github_url !== '#' ? '1.25rem' : 0 }}>
                  {(p.tags || []).map((t: string) => (
                    <span key={t} style={{
                      fontFamily: SANS, fontSize: '0.65rem', color: T.faint,
                      background: T.bg, border: '1px solid ' + T.border, padding: '3px 9px',
                    }}>{t}</span>
                  ))}
                </div>
                {p.github_url && p.github_url !== '#' && (
                  <a href={p.github_url} target="_blank" rel="noreferrer" style={{
                    fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.12em',
                    color: T.text, textDecoration: 'none', textTransform: 'uppercase',
                    borderBottom: '1px solid ' + T.text, paddingBottom: '2px',
                  }}>GitHub</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="Certifications" className="sec" style={{ maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem', borderTop: '1px solid ' + T.border }}>
        <div ref={certsRef} className="reveal">
          {label('Certifications')}
          {certs.map((c) => (
            <div key={c.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              gap: '1.5rem', padding: '1.1rem 0', borderBottom: '1px solid ' + T.border,
            }}>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: '1rem', marginBottom: '3px' }}>{c.title}</div>
                <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.78rem', color: T.faint }}>{c.issuer}</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: '0.75rem', color: T.faint, flexShrink: 0 }}>{c.year}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="Contact" className="sec" style={{ maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem 8rem', borderTop: '1px solid ' + T.border }}>
        <div ref={contactRef} className="reveal">
          {label('Contact')}
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, fontStyle: 'italic', margin: '0 0 1.5rem' }}>
            Let&apos;s connect.
          </h2>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1rem', color: T.muted, lineHeight: 1.85, maxWidth: '480px', margin: '0 0 2.5rem' }}>
            Open to research collaborations, internships, and GeoAI projects that push the boundaries of what location data can do.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub', href: about?.github_url },
              { label: 'LinkedIn', href: about?.linkedin_url },
              { label: 'Email', href: about?.email ? 'mailto:' + about.email : null },
            ].filter((l) => l.href).map((l) => (
              <a key={l.label} href={l.href!} target="_blank" rel="noreferrer" style={{
                border: '1px solid ' + T.border, padding: '0.9rem 2rem',
                fontFamily: SANS, fontSize: '0.7rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: T.text, textDecoration: 'none',
              }}>{l.label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid ' + T.border, padding: '2rem', textAlign: 'center' }}>
        <span style={{ fontFamily: SANS, fontSize: '0.65rem', color: T.faint, letterSpacing: '0.14em' }}>
          © 2026 Yazeed Almuhlaki
        </span>
      </footer>
    </div>
  )
}