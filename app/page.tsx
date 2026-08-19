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

const SKILL_GROUPS = ['Data Engineering', 'Cloud and Storage', 'Geospatial Engineering']
const PROJECT_CATEGORIES = ['Data Engineering', 'Analytics and Spatial Science']

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
  const [activeCategory, setActiveCategory] = useState('Data Engineering')
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

  const featured = skills.filter((sk) => sk.featured).slice(0, 6)

  // Group skills by the three fixed groups, in order
  const groupedSkills = SKILL_GROUPS.map((g) => ({
    group: g,
    items: skills.filter((sk) => sk.category === g),
  })).filter((g) => g.items.length > 0)

  // Any skill not in the three groups goes last under "Other"
  const otherSkills = skills.filter((sk) => !SKILL_GROUPS.includes(sk.category))

  const deCount = projects.filter((p) => p.category === 'Data Engineering').length
  const showFilter = deCount >= 3
  const visibleProjects = showFilter
    ? projects.filter((p) => p.category === activeCategory)
    : projects

  const NAV = ['About', 'Skills', 'Work', 'Certifications', 'Contact']

  const label = (txt: string) => (
    <div style={{ fontFamily: SANS, fontSize: '0.65rem', color: T.faint, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 400 }}>{txt}</div>
  )

  const fieldRow = (name: string, value: string) => value ? (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontFamily: SANS, fontSize: '0.6rem', color: T.faint, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{name}</div>
      <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.85rem', color: T.muted, lineHeight: 1.7 }}>{value}</div>
    </div>
  ) : null

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
              {about?.tagline || 'Data Engineer'}
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 400, lineHeight: 0.98, margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>Yazeed</h1>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 0.98, margin: '0 0 2.5rem', letterSpacing: '-0.01em' }}>Almuhlaki</h1>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1rem', color: T.muted, lineHeight: 1.85, maxWidth: '420px', margin: '0 0 2.5rem' }}>
              {about?.paragraph1 || 'Pipelines, data modeling, and quality gates for national-scale Saudi data.'}
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

          {featured.length > 0 && (
            <div className="hero-side">
              <div style={{ fontFamily: SANS, fontSize: '0.6rem', color: T.faint, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1rem' }}>Core Skills</div>
              {featured.map((sk) => (
                <div key={sk.id} style={{
                  padding: '0.6rem 0', borderBottom: '1px solid ' + T.border,
                  fontFamily: SANS, fontWeight: 300, fontSize: '0.85rem', color: T.text,
                }}>{sk.name}</div>
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

      {/* SKILLS — grouped */}
      <section id="Skills" className="sec" style={{ maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem', borderTop: '1px solid ' + T.border }}>
        <div ref={skillsRef} className="reveal">
          {label('Skills')}
          {groupedSkills.map((g, gi) => (
            <div key={g.group} style={{ marginBottom: gi === groupedSkills.length - 1 && otherSkills.length === 0 ? 0 : '2.5rem' }}>
              <div style={{
                fontFamily: SERIF, fontSize: '1.15rem', fontWeight: 400,
                marginBottom: '1rem', paddingBottom: '0.5rem',
                borderBottom: '1px solid ' + T.border,
              }}>{g.group}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {g.items.map((sk) => (
                  <span key={sk.id} style={{
                    fontFamily: SANS, fontWeight: 300, fontSize: '0.8rem',
                    color: T.text, background: T.tagBg, border: '1px solid ' + T.border,
                    padding: '7px 16px',
                  }}>{sk.name}</span>
                ))}
              </div>
            </div>
          ))}
          {otherSkills.length > 0 && (
            <div>
              <div style={{
                fontFamily: SERIF, fontSize: '1.15rem', fontWeight: 400,
                marginBottom: '1rem', paddingBottom: '0.5rem',
                borderBottom: '1px solid ' + T.border,
              }}>Other</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {otherSkills.map((sk) => (
                  <span key={sk.id} style={{
                    fontFamily: SANS, fontWeight: 300, fontSize: '0.8rem',
                    color: T.text, background: T.tagBg, border: '1px solid ' + T.border,
                    padding: '7px 16px',
                  }}>{sk.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WORK */}
      <section id="Work" className="sec" style={{ maxWidth: '1080px', margin: '0 auto', padding: '6rem 2rem', borderTop: '1px solid ' + T.border }}>
        <div ref={projectsRef} className="reveal">
          {label('Selected Work')}

          {showFilter && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {PROJECT_CATEGORIES.map((c) => (
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
          )}

          <div className="work-grid">
            {visibleProjects.map((p) => (
              <div key={p.id} style={{ background: T.tagBg, border: '1px solid ' + T.border, padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 400, margin: 0, lineHeight: 1.3 }}>{p.title}</h3>
                  {p.year && <span style={{ fontFamily: SANS, fontSize: '0.7rem', color: T.faint, flexShrink: 0 }}>{p.year}</span>}
                </div>

                {p.diagram_url && (
                  <img src={p.diagram_url} alt={p.title + ' architecture'} style={{
                    width: '100%', display: 'block', marginBottom: '1.25rem',
                    border: '1px solid ' + T.border, background: T.bg,
                  }} />
                )}

                {fieldRow('Problem', p.problem)}
                {fieldRow('Source', p.source)}
                {fieldRow('Pipeline', p.pipeline)}
                {fieldRow('Quality', p.quality)}

                {!p.problem && !p.pipeline && p.description && (
                  <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.88rem', color: T.muted, lineHeight: 1.75, margin: '0 0 1.25rem' }}>{p.description}</p>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '1.25rem 0' }}>
                  {(p.tags || []).map((t: string) => (
                    <span key={t} style={{
                      fontFamily: SANS, fontSize: '0.65rem', color: T.faint,
                      background: T.bg, border: '1px solid ' + T.border, padding: '3px 9px',
                    }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Repo', href: p.github_url },
                    { label: 'Article', href: p.article_url },
                    { label: 'Demo', href: p.demo_url },
                  ].filter((l) => l.href && l.href !== '#').map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                      fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.12em',
                      color: T.text, textDecoration: 'none', textTransform: 'uppercase',
                      borderBottom: '1px solid ' + T.text, paddingBottom: '2px',
                    }}>{l.label}</a>
                  ))}
                </div>
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
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1rem', color: T.muted, lineHeight: 1.85, maxWidth: '520px', margin: '0 0 2.5rem' }}>
            {about?.contact_text || ''}
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