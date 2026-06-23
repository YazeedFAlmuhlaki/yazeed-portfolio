'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORY_COLORS: Record<string, string> = {
  Core: '#2563eb', Geospatial: '#2563eb', 'Remote Sensing': '#2563eb',
  'Data Science': '#2563eb', 'Data Engineering': '#2563eb',
  Cloud: '#2563eb', GeoAI: '#2563eb',
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

const CV_URL = 'https://glgkclzcfvcvsstkezqh.supabase.co/storage/v1/object/public/cv/Yazeed_Almuhlaki_CV.pdf'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [certs, setCerts] = useState<any[]>([])
  const [about, setAbout] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeNav, setActiveNav] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [typed, setTyped] = useState('')
  const full = 'Spatial Data Scientist & GeoAI Practitioner'

  const aboutRef = useReveal()
  const skillsRef = useReveal()
  const projectsRef = useReveal()
  const certsRef = useReveal()
  const contactRef = useReveal()

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at').then(({ data }) => data && setProjects(data))
    supabase.from('skills').select('*').then(({ data }) => data && setSkills(data))
    supabase.from('certifications').select('*').order('created_at').then(({ data }) => data && setCerts(data))
    supabase.from('about').select('*').single().then(({ data }) => data && setAbout(data))
  }, [])

  useEffect(() => {
    let i = 0
    const t = setInterval(() => { i++; setTyped(full.slice(0, i)); if (i === full.length) clearInterval(t) }, 40)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40)
      const sections = ['About', 'Skills', 'Projects', 'Certifications', 'Contact']
      for (const s of sections) {
        const el = document.getElementById(s)
        if (el) { const r = el.getBoundingClientRect(); if (r.top <= 120 && r.bottom >= 120) { setActiveNav(s); return } }
      }
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveNav(id); setMenuOpen(false)
  }

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))]
  const filtered = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory)
  const NAV = ['About', 'Skills', 'Projects', 'Certifications', 'Contact']

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', height: '56px', background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', borderBottom: scrolled ? '1px solid #e5e7eb' : 'none', backdropFilter: scrolled ? 'blur(14px)' : 'none', transition: 'all 0.4s ease' }}>
        <div className="nav-desktop">
          {NAV.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: activeNav === l ? '#2563eb' : '#6b7280', padding: '4px 0', borderBottom: activeNav === l ? '1px solid #2563eb' : '1px solid transparent', transition: 'all 0.2s' }}>{l}</button>
          ))}
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px', padding: '8px', position: 'absolute', right: '1.25rem' }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ display: 'block', width: menuOpen && i === 1 ? '0' : '22px', height: '1.5px', background: '#111111', transform: menuOpen ? (i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'none') : 'none', transition: 'all 0.25s', opacity: menuOpen && i === 1 ? 0 : 1 }} />)}
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu" style={{ background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #e5e7eb' }}>
          {NAV.map((l) => <button key={l} onClick={() => scrollTo(l)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: '0.85rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: activeNav === l ? '#2563eb' : '#6b7280', padding: '6px 0', borderBottom: activeNav === l ? '1px solid #2563eb' : '1px solid transparent' }}>{l}</button>)}
        </div>
      )}

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem' }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.75rem', letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', marginBottom: '1.5rem', opacity: 0.8 }}>Based in Saudi Arabia · KSU · Vision 2030</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 400, color: '#111111', lineHeight: 1.1, margin: '0 0 1rem' }}>Yazeed<br /><span style={{ color: '#2563eb', fontStyle: 'italic' }}>Almuhlaki</span></h1>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', color: '#6b7280', minHeight: '1.6em', letterSpacing: '0.05em' }}>
          {typed}<span style={{ display: 'inline-block', width: '2px', height: '1.1em', background: '#2563eb', marginLeft: '3px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => scrollTo('Projects')} style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Courier New', monospace", fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 }}>View Projects</button>
          <button onClick={() => scrollTo('Contact')} style={{ background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', padding: '0.75rem 2rem', fontFamily: "'Courier New', monospace", fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Contact</button>
          <a href={CV_URL} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: '#111111', border: '1px solid #e5e7eb', padding: '0.75rem 2rem', fontFamily: "'Courier New', monospace", fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none' }}>Download CV</a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="About" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '8rem 1.5rem' }}>
        <div ref={aboutRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#2563eb' }} />01 / About</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#111111', margin: '0 0 2.5rem', lineHeight: 1.2 }}>{about?.heading || 'Location is the most underused feature in modern analytics.'}</h2>
          <div style={{ maxWidth: '640px' }}>
            <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.85, fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>{about?.paragraph1 || ''}</p>
            <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.85, fontFamily: 'Georgia, serif' }}>{about?.paragraph2 || ''}</p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="Skills" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem', background: '#f8f9fa' }}>
        <div ref={skillsRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#2563eb' }} />02 / Skills</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#111111', margin: '0 0 2.5rem', lineHeight: 1.2 }}>Technical <span style={{ color: '#2563eb', fontStyle: 'italic' }}>Stack</span></h2>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map((c) => <button key={c} onClick={() => setActiveCategory(c)} style={{ background: activeCategory === c ? '#2563eb' : 'transparent', border: '1px solid ' + (activeCategory === c ? '#2563eb' : '#e5e7eb'), color: activeCategory === c ? '#ffffff' : '#6b7280', fontFamily: "'Courier New', monospace", fontSize: '0.68rem', letterSpacing: '0.1em', padding: '5px 14px', cursor: 'pointer', textTransform: 'uppercase' }}>{c}</button>)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {filtered.map((s) => <div key={s.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} /><span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.78rem', color: '#374151' }}>{s.name}</span></div>)}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="Projects" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div ref={projectsRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#2563eb' }} />03 / Projects</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#111111', margin: '0 0 2.5rem', lineHeight: 1.2 }}>Selected <span style={{ color: '#2563eb', fontStyle: 'italic' }}>Work</span></h2>
          <div className="projects-grid">
            {projects.map((p) => {
              const isPublished = p.status === 'Published'
              return (
                <div key={p.id} style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: isPublished ? '#2563eb' : '#d1d5db' }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: isPublished ? '#2563eb' : '#9ca3af', border: '1px solid ' + (isPublished ? '#2563eb40' : '#e5e7eb'), padding: '3px 10px', textTransform: 'uppercase' }}>{p.status}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#111111', margin: '0 0 0.75rem' }}>{p.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.7, fontFamily: 'Georgia, serif', margin: '0 0 1.5rem' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {(p.tags || []).map((t: string) => <span key={t} style={{ fontFamily: "'Courier New', monospace", fontSize: '0.62rem', color: '#6b7280', background: '#e5e7eb', padding: '2px 8px' }}>{t}</span>)}
                  </div>
                  {p.github_url && p.github_url !== '#' && <a href={p.github_url} target="_blank" rel="noreferrer" style={{ fontFamily: "'Courier New', monospace", fontSize: '0.72rem', letterSpacing: '0.12em', color: '#2563eb', textDecoration: 'none', textTransform: 'uppercase' }}>GitHub</a>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="Certifications" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem', background: '#f8f9fa' }}>
        <div ref={certsRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#2563eb' }} />04 / Certifications</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#111111', margin: '0 0 2.5rem', lineHeight: 1.2 }}>Certifications & <span style={{ color: '#2563eb', fontStyle: 'italic' }}>Training</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {certs.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.75rem 1.5rem', background: '#ffffff', borderLeft: '3px solid #2563eb' }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.6rem', color: '#2563eb', minWidth: '24px' }}>{'0' + (i + 1)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#111111', marginBottom: '4px' }}>{c.title}</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.68rem', color: '#9ca3af' }}>{c.issuer}</div>
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', color: '#2563eb' }}>{c.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="Contact" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem 10rem', textAlign: 'center' }}>
        <div ref={contactRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#2563eb' }} />05 / Contact</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#111111', margin: '0 0 2.5rem', lineHeight: 1.2 }}>{"Let's"} <span style={{ color: '#2563eb', fontStyle: 'italic' }}>Connect</span></h2>
          <p style={{ fontFamily: 'Georgia, serif', color: '#6b7280', fontSize: '1rem', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 3rem' }}>Open to research collaborations, internships, and GeoAI projects that push the boundaries of what location data can do.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub', href: 'https://github.com/YazeedFAlmuhlaki' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yazeed-almuhlaki' },
              { label: 'Email', href: 'mailto:yazeed@almuhlaki.dev' }
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', border: '1px solid #e5e7eb', padding: '0.9rem 2.5rem', textDecoration: 'none' }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.75rem', letterSpacing: '0.18em', color: '#374151', textTransform: 'uppercase' }}>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', borderTop: '1px solid #e5e7eb', fontFamily: "'Courier New', monospace", fontSize: '0.65rem', color: '#9ca3af', letterSpacing: '0.15em' }}>
        2026 YAZEED ALMUHLAKI · SPATIAL DATA SCIENCE · KSA
      </div>
    </div>
  )
}