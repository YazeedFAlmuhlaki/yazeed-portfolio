'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const s = {
  page: { minHeight: '100vh', background: '#050a14', color: '#fff', padding: '1.25rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(0,255,200,0.1)', flexWrap: 'wrap' as const, gap: '1rem' },
  title: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 400, color: '#fff' },
  label: { fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(0,255,200,0.7)', textTransform: 'uppercase' as const, display: 'block', marginBottom: '0.5rem' },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem 1rem', fontFamily: "'Courier New', monospace", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '1rem' },
  btn: { background: '#00ffc8', color: '#020a10', border: 'none', padding: '0.75rem 1.5rem', fontFamily: "'Courier New', monospace", fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', fontWeight: 700 },
  btnDanger: { background: 'transparent', color: '#f472b6', border: '1px solid #f472b630', padding: '0.4rem 0.9rem', fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer' },
  btnSecondary: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1rem', fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer' },
  card: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', marginBottom: '0.75rem' },
  section: { marginBottom: '3rem' },
  sectionTitle: { fontFamily: "'Courier New', monospace", fontSize: '0.7rem', letterSpacing: '0.3em', color: '#00ffc8', textTransform: 'uppercase' as const, marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,255,200,0.1)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' as const },
  tag: { fontFamily: "'Courier New', monospace", fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', marginRight: '4px' },
}

export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'projects' | 'skills' | 'certs' | 'about'>('projects')
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [certs, setCerts] = useState<any[]>([])

  // Project form
  const [pTitle, setPTitle] = useState('')
  const [pDesc, setPDesc] = useState('')
  const [pTags, setPTags] = useState('')
  const [pGithub, setPGithub] = useState('')
  const [pStatus, setPStatus] = useState('In Progress')

  // Skill form
  const [sName, setSName] = useState('')
  const [sCategory, setSCategory] = useState('Geospatial')

  // Cert form
  const [cTitle, setCTitle] = useState('')
  const [cIssuer, setCIssuer] = useState('')
  const [cYear, setCYear] = useState('')

  // About form
  const [aHeading, setAHeading] = useState('')
  const [aPara1, setAPara1] = useState('')
  const [aPara2, setAPara2] = useState('')
  const [aboutId, setAboutId] = useState('')

  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin')
    })
    loadAll()
  }, [])

  const loadAll = async () => {
    const [p, sk, c, ab] = await Promise.all([
      supabase.from('projects').select('*').order('created_at'),
      supabase.from('skills').select('*'),
      supabase.from('certifications').select('*').order('created_at'),
      supabase.from('about').select('*').single(),
    ])
    if (p.data) setProjects(p.data)
    if (sk.data) setSkills(sk.data)
    if (c.data) setCerts(c.data)
    if (ab.data) {
      setAboutId(ab.data.id)
      setAHeading(ab.data.heading || '')
      setAPara1(ab.data.paragraph1 || '')
      setAPara2(ab.data.paragraph2 || '')
    }
  }

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }
  const logout = async () => { await supabase.auth.signOut(); router.push('/admin') }

  const addProject = async () => {
    if (!pTitle) return
    const tags = pTags.split(',').map((t) => t.trim()).filter(Boolean)
    const { error } = await supabase.from('projects').insert({ title: pTitle, description: pDesc, tags, github_url: pGithub, status: pStatus })
    if (!error) { notify('Project added!'); setPTitle(''); setPDesc(''); setPTags(''); setPGithub(''); loadAll() }
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id); loadAll()
  }

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'Published' ? 'In Progress' : 'Published'
    await supabase.from('projects').update({ status: next }).eq('id', id); loadAll()
  }

  const addSkill = async () => {
    if (!sName) return
    const { error } = await supabase.from('skills').insert({ name: sName, category: sCategory })
    if (!error) { notify('Skill added!'); setSName(''); loadAll() }
  }

  const deleteSkill = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id); loadAll()
  }

  const addCert = async () => {
    if (!cTitle) return
    const { error } = await supabase.from('certifications').insert({ title: cTitle, issuer: cIssuer, year: cYear })
    if (!error) { notify('Certification added!'); setCTitle(''); setCIssuer(''); setCYear(''); loadAll() }
  }

  const deleteCert = async (id: string) => {
    await supabase.from('certifications').delete().eq('id', id); loadAll()
  }

  const saveAbout = async () => {
    await supabase.from('about').update({ heading: aHeading, paragraph1: aPara1, paragraph2: aPara2 }).eq('id', aboutId)
    notify('About section updated!')
  }

  const CATEGORIES = ['Core', 'Geospatial', 'Remote Sensing', 'Data Science', 'Data Engineering', 'Cloud', 'GeoAI']
  const TAB_LABELS: Record<string, string> = { projects: 'Projects', skills: 'Skills', certs: 'Certs', about: 'About' }

  return (
    <div style={s.page}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.65rem', letterSpacing: '0.3em', color: '#00ffc8', marginBottom: '0.4rem' }}>ADMIN DASHBOARD</div>
            <div style={s.title}>Portfolio Manager</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' as const }}>
            <a href="/" target="_blank" style={{ ...s.btnSecondary, textDecoration: 'none', display: 'inline-block' }}>View Site</a>
            <button onClick={logout} style={s.btnSecondary}>Logout</button>
          </div>
        </div>

        {/* Success message */}
        {msg && <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.75rem', color: '#00ffc8', padding: '0.75rem 1rem', border: '1px solid rgba(0,255,200,0.2)', background: 'rgba(0,255,200,0.05)', marginBottom: '2rem' }}>{msg}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2.5rem', flexWrap: 'wrap' as const }}>
          {(['projects', 'skills', 'certs', 'about'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.btnSecondary, color: tab === t ? '#00ffc8' : 'rgba(255,255,255,0.4)', borderColor: tab === t ? '#00ffc8' : 'rgba(255,255,255,0.1)' }}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* PROJECTS TAB */}
        {tab === 'projects' && (
          <div>
            <div style={s.section}>
              <div style={s.sectionTitle}>Add New Project</div>
              <label style={s.label}>Title</label>
              <input style={s.input} value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Project title" />
              <label style={s.label}>Description</label>
              <textarea style={{ ...s.input, minHeight: '100px', resize: 'vertical' }} value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Project description" />
              <label style={s.label}>Tags (comma separated)</label>
              <input style={s.input} value={pTags} onChange={(e) => setPTags(e.target.value)} placeholder="Python, GeoAI, Remote Sensing" />
              <label style={s.label}>GitHub URL</label>
              <input style={s.input} value={pGithub} onChange={(e) => setPGithub(e.target.value)} placeholder="https://github.com/..." />
              <label style={s.label}>Status</label>
              <select style={{ ...s.input, cursor: 'pointer' }} value={pStatus} onChange={(e) => setPStatus(e.target.value)}>
                <option>In Progress</option>
                <option>Published</option>
              </select>
              <button style={s.btn} onClick={addProject}>Add Project</button>
            </div>

            <div style={s.section}>
              <div style={s.sectionTitle}>Existing Projects ({projects.length})</div>
              {projects.map((p) => (
                <div key={p.id} style={s.card}>
                  <div style={s.row}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#fff', marginBottom: '0.4rem' }}>{p.title}</div>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.7rem', color: p.status === 'Published' ? '#00ffc8' : '#a78bfa', marginBottom: '0.4rem' }}>{p.status}</div>
                      <div style={{ flexWrap: 'wrap' as const }}>{(p.tags || []).map((t: string) => <span key={t} style={s.tag}>{t}</span>)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap' as const }}>
                      <button style={s.btnSecondary} onClick={() => toggleStatus(p.id, p.status)}>Toggle</button>
                      <button style={s.btnDanger} onClick={() => deleteProject(p.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {tab === 'skills' && (
          <div>
            <div style={s.section}>
              <div style={s.sectionTitle}>Add New Skill</div>
              <label style={s.label}>Skill Name</label>
              <input style={s.input} value={sName} onChange={(e) => setSName(e.target.value)} placeholder="e.g. PyTorch" />
              <label style={s.label}>Category</label>
              <select style={{ ...s.input, cursor: 'pointer' }} value={sCategory} onChange={(e) => setSCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <button style={s.btn} onClick={addSkill}>Add Skill</button>
            </div>

            <div style={s.section}>
              <div style={s.sectionTitle}>Existing Skills ({skills.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map((sk) => (
                  <div key={sk.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.5rem 0.75rem' }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.75rem', color: '#fff' }}>{sk.name}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{sk.category}</span>
                    <button onClick={() => deleteSkill(sk.id)} style={{ background: 'none', border: 'none', color: '#f472b6', cursor: 'pointer', fontSize: '0.7rem', padding: '0 4px' }}>x</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {tab === 'about' && (
          <div>
            <div style={s.section}>
              <div style={s.sectionTitle}>Edit About Section</div>
              <label style={s.label}>Heading</label>
              <input style={s.input} value={aHeading} onChange={(e) => setAHeading(e.target.value)} placeholder="Your main heading" />
              <label style={s.label}>Paragraph 1</label>
              <textarea style={{ ...s.input, minHeight: '120px', resize: 'vertical' }} value={aPara1} onChange={(e) => setAPara1(e.target.value)} placeholder="First paragraph" />
              <label style={s.label}>Paragraph 2</label>
              <textarea style={{ ...s.input, minHeight: '120px', resize: 'vertical' }} value={aPara2} onChange={(e) => setAPara2(e.target.value)} placeholder="Second paragraph" />
              <button style={s.btn} onClick={saveAbout}>Save About</button>
            </div>
          </div>
        )}

        {/* CERTS TAB */}
        {tab === 'certs' && (
          <div>
            <div style={s.section}>
              <div style={s.sectionTitle}>Add New Certification</div>
              <label style={s.label}>Title</label>
              <input style={s.input} value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="Certification title" />
              <label style={s.label}>Issuer</label>
              <input style={s.input} value={cIssuer} onChange={(e) => setCIssuer(e.target.value)} placeholder="e.g. Google, NASA, Coursera" />
              <label style={s.label}>Year</label>
              <input style={s.input} value={cYear} onChange={(e) => setCYear(e.target.value)} placeholder="2025" />
              <button style={s.btn} onClick={addCert}>Add Certification</button>
            </div>

            <div style={s.section}>
              <div style={s.sectionTitle}>Existing Certifications ({certs.length})</div>
              {certs.map((c) => (
                <div key={c.id} style={s.card}>
                  <div style={s.row}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>{c.title}</div>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{c.issuer} · {c.year}</div>
                    </div>
                    <button style={s.btnDanger} onClick={() => deleteCert(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}