'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORY_COLORS: Record<string, string> = {
  Core: '#00ffc8', Geospatial: '#38bdf8', 'Remote Sensing': '#a78bfa',
  'Data Science': '#fb923c', 'Data Engineering': '#facc15',
  Cloud: '#34d399', GeoAI: '#f472b6',
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

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    let stars: any[]
    function init() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2, a: Math.random(),
        speed: Math.random() * 0.003 + 0.001, drift: (Math.random() - 0.5) * 0.08,
      }))
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((s) => {
        s.a += s.speed; s.x += s.drift
        if (s.x < 0) s.x = canvas.width
        if (s.x > canvas.width) s.x = 0
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,220,255,${((Math.sin(s.a) + 1) / 2) * 0.7})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    init(); draw()
    window.addEventListener('resize', init)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
}

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [certs, setCerts] = useState<any[]>([])
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
    <div style={{ minHeight: '100vh', background: '#050a14', color: '#fff', overflowX: 'hidden' }}>
      <Starfield />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', height: '56px', background: scrolled ? 'rgba(5,10,20,0.94)' : 'transparent', borderBottom: scrolled ? '1px solid rgba(0,255,200,0.08)' : 'none', backdropFilter: scrolled ? 'blur(14px)' : 'none', transition: 'all 0.4s ease' }}>
        <div className="nav-desktop">
          {NAV.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: activeNav === l ? '#00ffc8' : 'rgba(255,255,255,0.45)', padding: '4px 0', borderBottom: activeNav === l ? '1px solid #00ffc8' : '1px solid transparent', transition: 'all 0.2s' }}>{l}</button>
          ))}
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px', padding: '8px', position: 'absolute', right: '1.25rem' }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ display: 'block', width: menuOpen && i === 1 ? '0' : '22px', height: '1.5px', background: '#00ffc8', transform: menuOpen ? (i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'none') : 'none', transition: 'all 0.25s', opacity: menuOpen && i === 1 ? 0 : 1 }} />)}
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          {NAV.map((l) => <button key={l} onClick={() => scrollTo(l)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: '0.85rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: activeNav === l ? '#00ffc8' : 'rgba(255,255,255,0.6)', padding: '6px 0', borderBottom: activeNav === l ? '1px solid #00ffc8' : '1px solid transparent' }}>{l}</button>)}
        </div>
      )}

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,200,0.07) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.75rem', letterSpacing: '0.3em', color: '#00ffc8', textTransform: 'uppercase', marginBottom: '1.5rem', opacity: 0.8 }}>Based in Saudi Arabia · KSA · Vision 2030</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, margin: '0 0 1rem' }}>Yazeed<br /><span style={{ color: '#00ffc8', fontStyle: 'italic' }}>Almuhlaki</span></h1>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', color: 'rgba(255,255,255,0.6)', minHeight: '1.6em', letterSpacing: '0.05em' }}>
          {typed}<span style={{ display: 'inline-block', width: '2px', height: '1.1em', background: '#00ffc8', marginLeft: '3px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => scrollTo('Projects')} style={{ background: '#00ffc8', color: '#020a10', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Courier New', monospace", fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 }}>View Projects</button>
          <button onClick={() => scrollTo('Contact')} style={{ background: 'transparent', color: '#00ffc8', border: '1px solid rgba(0,255,200,0.4)', padding: '0.75rem 2rem', fontFamily: "'Courier New', monospace", fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Contact</button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="About" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '8rem 1.5rem' }}>
        <div ref={aboutRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#00ffc8', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#00ffc8' }} />01 / About</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#fff', margin: '0 0 2.5rem', lineHeight: 1.2 }}>Location is the most underused feature in <span style={{ color: '#00ffc8', fontStyle: 'italic' }}>modern analytics.</span> I build the systems that change that.</h2>
          <div style={{ maxWidth: '640px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.85, fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>I am a Spatial Data Scientist and GeoAI practitioner based in Riyadh — combining deep learning, statistical modeling, and spatial data engineering to turn raw location data into predictive systems that reveal what conventional data science misses.</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.85, fontFamily: 'Georgia, serif' }}>My projects include groundwater depletion mapping across Saudi Arabia, dust health exposure indices across Saudi governorates, and GeoAI pipelines trained on Earth observation imagery. From classifying healthcare facility quality to mapping environmental risk across census tracts — I work on problems where geography is not background noise. It is the answer.</p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="Skills" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div ref={skillsRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#00ffc8', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#00ffc8' }} />02 / Skills</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#fff', margin: '0 0 2.5rem', lineHeight: 1.2 }}>Technical <span style={{ color: '#00ffc8', fontStyle: 'italic' }}>Arsenal</span></h2>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map((c) => <button key={c} onClick={() => setActiveCategory(c)} style={{ background: activeCategory === c ? 'rgba(0,255,200,0.12)' : 'transparent', border: '1px solid ' + (activeCategory === c ? '#00ffc8' : 'rgba(255,255,255,0.1)'), color: activeCategory === c ? '#00ffc8' : 'rgba(255,255,255,0.45)', fontFamily: "'Courier New', monospace", fontSize: '0.68rem', letterSpacing: '0.1em', padding: '5px 14px', cursor: 'pointer', textTransform: 'uppercase' }}>{c}</button>)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {filtered.map((s) => <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid ' + (CATEGORY_COLORS[s.category] || '#00ffc8') + '30', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: CATEGORY_COLORS[s.category] || '#00ffc8', flexShrink: 0 }} /><span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>{s.name}</span></div>)}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="Projects" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div ref={projectsRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#00ffc8', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#00ffc8' }} />03 / Projects</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#fff', margin: '0 0 2.5rem', lineHeight: 1.2 }}>Earth Observation <span style={{ color: '#00ffc8', fontStyle: 'italic' }}>Work</span></h2>
          <div className="projects-grid">
            {projects.map((p) => {
              const accent = p.status === 'Published' ? '#00ffc8' : '#a78bfa'
              return (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${accent},transparent)` }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: accent, border: '1px solid ' + accent + '30', padding: '3px 10px', textTransform: 'uppercase' }}>{p.status}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#fff', margin: '0 0 0.75rem' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7, fontFamily: 'Georgia, serif', margin: '0 0 1.5rem' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {(p.tags || []).map((t: string) => <span key={t} style={{ fontFamily: "'Courier New', monospace", fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px' }}>{t}</span>)}
                  </div>
                  {p.github_url && p.github_url !== '#' && <a href={p.github_url} target="_blank" rel="noreferrer" style={{ fontFamily: "'Courier New', monospace", fontSize: '0.72rem', letterSpacing: '0.12em', color: '#00ffc8', textDecoration: 'none', textTransform: 'uppercase' }}>GitHub</a>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="Certifications" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div ref={certsRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#00ffc8', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#00ffc8' }} />04 / Certifications</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#fff', margin: '0 0 2.5rem', lineHeight: 1.2 }}>Certifications & <span style={{ color: '#00ffc8', fontStyle: 'italic' }}>Training</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {certs.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.75rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(0,255,200,0.1)' }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.6rem', color: 'rgba(0,255,200,0.4)', minWidth: '24px' }}>{'0' + (i + 1)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>{c.title}</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{c.issuer}</div>
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', color: 'rgba(0,255,200,0.6)' }}>{c.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="Contact" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem 10rem', textAlign: 'center' }}>
        <div ref={contactRef} className="reveal">
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.35em', color: '#00ffc8', textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}><span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#00ffc8' }} />05 / Contact</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: '#fff', margin: '0 0 2.5rem', lineHeight: 1.2 }}>{"Let's"} <span style={{ color: '#00ffc8', fontStyle: 'italic' }}>Connect</span></h2>
          <p style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 3rem' }}>Open to research collaborations, internships, and GeoAI projects that push the boundaries of what location data can do.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub', href: 'https://github.com/YazeedFAlmuhlaki' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yazeed-almuhlaki-0172a4360' },
              { label: 'Email', href: 'mailto:yazeedfalmuhlaki@gmail.com' }
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem 2.5rem', textDecoration: 'none' }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.75rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Courier New', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
        2026 YAZEED ALMUHLAKI · SPATIAL DATA SCIENCE · KSA
      </div>
    </div>
  )
}