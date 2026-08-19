'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SERIF = "'Playfair Display', Georgia, serif"
const SANS = "'Outfit', -apple-system, system-ui, sans-serif"

const s = {
  page: { minHeight: '100vh', background: '#0f0f0f', color: '#fff', padding: '1.25rem', fontFamily: SANS },
  wrap: { maxWidth: '1000px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' as const, gap: '1rem' },
  eyebrow: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: '0.35rem' },
  title: { fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 400, color: '#fff' },
  label: { fontSize: '0.6rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' as const, display: 'block', marginBottom: '0.4rem' },
  input: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.7rem 0.9rem', fontFamily: SANS, fontSize: '0.85rem', fontWeight: 300, outline: 'none', boxSizing: 'border-box' as const, marginBottom: '0.85rem' },
  btn: { background: '#fff', color: '#0f0f0f', border: 'none', padding: '0.7rem 1.5rem', fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, cursor: 'pointer', fontWeight: 600 },
  btnGhost: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', padding: '0.5rem 0.9rem', fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer' },
  btnTiny: { background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 8px', fontFamily: SANS, fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, cursor: 'pointer' },
  btnDanger: { background: 'transparent', color: '#f472b6', border: '1px solid rgba(244,114,182,0.2)', padding: '3px 8px', fontFamily: SANS, fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, cursor: 'pointer' },
  card: { background: '#161616', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', marginBottom: '0.6rem' },
  sectionTitle: { fontSize: '0.62rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginBottom: '1rem' },
}

const SKILL_CATEGORIES = ['Data Engineering', 'Cloud and Storage', 'Geospatial Engineering']
const PROJECT_CATEGORIES = ['Data Engineering', 'Analytics and Spatial Science']
const TABS = ['projects', 'skills', 'certs', 'about', 'cv'] as const
const TAB_LABELS: Record<string, string> = { projects: 'Projects', skills: 'Skills', certs: 'Certs', about: 'About & Links', cv: 'CV' }

export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<typeof TABS[number]>('projects')
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [certs, setCerts] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  // Project form
  const [pTitle, setPTitle] = useState('')
  const [pCategory, setPCategory] = useState('Data Engineering')
  const [pProblem, setPProblem] = useState('')
  const [pSource, setPSource] = useState('')
  const [pPipeline, setPPipeline] = useState('')
  const [pQuality, setPQuality] = useState('')
  const [pTags, setPTags] = useState('')
  const [pGithub, setPGithub] = useState('')
  const [pArticle, setPArticle] = useState('')
  const [pDemo, setPDemo] = useState('')
  const [pDiagram, setPDiagram] = useState('')
  const [pYear, setPYear] = useState('')
  const [pStatus, setPStatus] = useState('In Progress')

  // Skill form
  const [skName, setSkName] = useState('')
  const [skCategory, setSkCategory] = useState('Data Engineering')
  const [skFeatured, setSkFeatured] = useState(false)

  // Cert form
  const [cTitle, setCTitle] = useState('')
  const [cIssuer, setCIssuer] = useState('')
  const [cYear, setCYear] = useState('')

  // About form
  const [aboutId, setAboutId] = useState('')
  const [aHeading, setAHeading] = useState('')
  const [aP1, setAP1] = useState('')
  const [aP2, setAP2] = useState('')
  const [aTagline, setATagline] = useState('')
  const [aGithub, setAGithub] = useState('')
  const [aLinkedin, setALinkedin] = useState('')
  const [aEmail, setAEmail] = useState('')
  const [aCvUrl, setACvUrl] = useState('')
  const [aContact, setAContact] = useState('')

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (!data.session) router.push('/admin') })
    loadAll()
  }, [])

  const loadAll = async () => {
    const [p, sk, c, ab] = await Promise.all([
      supabase.from('projects').select('*').order('sort_order').order('created_at'),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('certifications').select('*').order('sort_order').order('created_at'),
      supabase.from('about').select('*').single(),
    ])
    if (p.data) setProjects(p.data)
    if (sk.data) setSkills(sk.data)
    if (c.data) setCerts(c.data)
    if (ab.data) {
      setAboutId(ab.data.id)
      setAHeading(ab.data.heading || ''); setAP1(ab.data.paragraph1 || ''); setAP2(ab.data.paragraph2 || '')
      setATagline(ab.data.tagline || ''); setAGithub(ab.data.github_url || '')
      setALinkedin(ab.data.linkedin_url || ''); setAEmail(ab.data.email || ''); setACvUrl(ab.data.cv_url || '')
      setAContact(ab.data.contact_text || '')
    }
  }

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }
  const logout = async () => { await supabase.auth.signOut(); router.push('/admin') }

  // PROJECTS
  const clearProjectForm = () => {
    setEditId(null); setPTitle(''); setPCategory('Data Engineering'); setPProblem(''); setPSource('')
    setPPipeline(''); setPQuality(''); setPTags(''); setPGithub(''); setPArticle('')
    setPDemo(''); setPDiagram(''); setPYear(''); setPStatus('In Progress')
  }

  const saveProject = async () => {
    if (!pTitle) return
    const tags = pTags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      title: pTitle, category: pCategory, problem: pProblem, source: pSource,
      pipeline: pPipeline, quality: pQuality, tags, github_url: pGithub,
      article_url: pArticle, demo_url: pDemo, diagram_url: pDiagram,
      year: pYear, status: pStatus,
    }
    if (editId) {
      await supabase.from('projects').update(payload).eq('id', editId); notify('Project updated')
    } else {
      await supabase.from('projects').insert({ ...payload, sort_order: projects.length }); notify('Project added')
    }
    clearProjectForm(); loadAll()
  }

  const editProject = (p: any) => {
    setEditId(p.id); setPTitle(p.title || ''); setPCategory(p.category || 'Data Engineering')
    setPProblem(p.problem || ''); setPSource(p.source || ''); setPPipeline(p.pipeline || '')
    setPQuality(p.quality || ''); setPTags((p.tags || []).join(', ')); setPGithub(p.github_url || '')
    setPArticle(p.article_url || ''); setPDemo(p.demo_url || ''); setPDiagram(p.diagram_url || '')
    setPYear(p.year || ''); setPStatus(p.status || 'In Progress')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteProject = async (id: string) => { await supabase.from('projects').delete().eq('id', id); loadAll() }
  const toggleStatus = async (id: string, cur: string) => {
    await supabase.from('projects').update({ status: cur === 'Published' ? 'In Progress' : 'Published' }).eq('id', id); loadAll()
  }

  const move = async (table: string, list: any[], index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= list.length) return
    const a = list[index], b = list[target]
    await Promise.all([
      supabase.from(table).update({ sort_order: target }).eq('id', a.id),
      supabase.from(table).update({ sort_order: index }).eq('id', b.id),
    ])
    loadAll()
  }

  // SKILLS
  const clearSkillForm = () => { setEditId(null); setSkName(''); setSkCategory('Data Engineering'); setSkFeatured(false) }

  const saveSkill = async () => {
    if (!skName) return
    const payload = { name: skName, category: skCategory, featured: skFeatured }
    if (editId) { await supabase.from('skills').update(payload).eq('id', editId); notify('Skill updated') }
    else { await supabase.from('skills').insert({ ...payload, sort_order: skills.length }); notify('Skill added') }
    clearSkillForm(); loadAll()
  }

  const editSkill = (sk: any) => {
    setEditId(sk.id); setSkName(sk.name); setSkCategory(sk.category); setSkFeatured(!!sk.featured)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteSkill = async (id: string) => { await supabase.from('skills').delete().eq('id', id); loadAll() }
  const toggleFeatured = async (id: string, cur: boolean) => {
    await supabase.from('skills').update({ featured: !cur }).eq('id', id); loadAll()
  }

  // CERTS
  const clearCertForm = () => { setEditId(null); setCTitle(''); setCIssuer(''); setCYear('') }

  const saveCert = async () => {
    if (!cTitle) return
    const payload = { title: cTitle, issuer: cIssuer, year: cYear }
    if (editId) { await supabase.from('certifications').update(payload).eq('id', editId); notify('Certification updated') }
    else { await supabase.from('certifications').insert({ ...payload, sort_order: certs.length }); notify('Certification added') }
    clearCertForm(); loadAll()
  }

  const editCert = (c: any) => {
    setEditId(c.id); setCTitle(c.title); setCIssuer(c.issuer || ''); setCYear(c.year || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteCert = async (id: string) => { await supabase.from('certifications').delete().eq('id', id); loadAll() }

  const saveAbout = async () => {
    await supabase.from('about').update({
      heading: aHeading, paragraph1: aP1, paragraph2: aP2, tagline: aTagline,
      github_url: aGithub, linkedin_url: aLinkedin, email: aEmail, contact_text: aContact,
    }).eq('id', aboutId)
    notify('About and links saved')
  }

  const uploadCV = async (file: File) => {
    setUploading(true)
    const path = 'Yazeed_Almuhlaki_CV.pdf'
    const { error } = await supabase.storage.from('cv').upload(path, file, { upsert: true, contentType: 'application/pdf' })
    if (error) { notify('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('cv').getPublicUrl(path)
    const url = data.publicUrl + '?v=' + Date.now()
    await supabase.from('about').update({ cv_url: url }).eq('id', aboutId)
    setACvUrl(url); notify('CV uploaded'); setUploading(false)
  }

  const featuredCount = skills.filter(sk => sk.featured).length
  const deCount = projects.filter(p => p.category === 'Data Engineering').length

  const switchTab = (t: typeof TABS[number]) => {
    setTab(t); setEditId(null); clearProjectForm(); clearSkillForm(); clearCertForm()
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <div style={s.header}>
          <div>
            <div style={s.eyebrow}>Admin</div>
            <div style={s.title}>Portfolio Manager</div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <a href="/" target="_blank" style={{ ...s.btnGhost, textDecoration: 'none', display: 'inline-block' }}>View Site</a>
            <button onClick={logout} style={s.btnGhost}>Logout</button>
          </div>
        </div>

        {msg && (
          <div style={{ fontSize: '0.75rem', color: '#fff', padding: '0.7rem 1rem', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => switchTab(t)} style={{
              ...s.btnGhost,
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#0f0f0f' : 'rgba(255,255,255,0.4)',
              border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.12)',
              fontWeight: tab === t ? 600 : 400,
            }}>{TAB_LABELS[t]}</button>
          ))}
        </div>

        {/* PROJECTS */}
        {tab === 'projects' && (
          <div className="admin-col">
            <div>
              <div style={s.sectionTitle}>{editId ? 'Edit Project' : 'Add New Project'}</div>

              <label style={s.label}>Title</label>
              <input style={s.input} value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Project title" />

              <label style={s.label}>Category</label>
              <select style={{ ...s.input, cursor: 'pointer' }} value={pCategory} onChange={e => setPCategory(e.target.value)}>
                {PROJECT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>

              <label style={s.label}>Problem — one line, what needed to move</label>
              <textarea style={{ ...s.input, minHeight: '60px', resize: 'vertical' }} value={pProblem} onChange={e => setPProblem(e.target.value)} />

              <label style={s.label}>Source — where the data came from and how much</label>
              <textarea style={{ ...s.input, minHeight: '60px', resize: 'vertical' }} value={pSource} onChange={e => setPSource(e.target.value)} />

              <label style={s.label}>Pipeline — ingestion, storage, transforms, serving</label>
              <textarea style={{ ...s.input, minHeight: '80px', resize: 'vertical' }} value={pPipeline} onChange={e => setPPipeline(e.target.value)} />

              <label style={s.label}>Quality — what was validated or rejected</label>
              <textarea style={{ ...s.input, minHeight: '60px', resize: 'vertical' }} value={pQuality} onChange={e => setPQuality(e.target.value)} />

              <label style={s.label}>Stack (comma separated)</label>
              <input style={s.input} value={pTags} onChange={e => setPTags(e.target.value)} placeholder="SQL, Python, AWS, Glue" />

              <label style={s.label}>Repo URL</label>
              <input style={s.input} value={pGithub} onChange={e => setPGithub(e.target.value)} placeholder="https://github.com/..." />

              <label style={s.label}>Architecture diagram URL</label>
              <input style={s.input} value={pDiagram} onChange={e => setPDiagram(e.target.value)} placeholder="https://..." />

              <label style={s.label}>Article URL</label>
              <input style={s.input} value={pArticle} onChange={e => setPArticle(e.target.value)} placeholder="https://..." />

              <label style={s.label}>Live demo URL</label>
              <input style={s.input} value={pDemo} onChange={e => setPDemo(e.target.value)} placeholder="https://..." />

              <label style={s.label}>Year</label>
              <input style={s.input} value={pYear} onChange={e => setPYear(e.target.value)} placeholder="2026" />

              <label style={s.label}>Status</label>
              <select style={{ ...s.input, cursor: 'pointer' }} value={pStatus} onChange={e => setPStatus(e.target.value)}>
                <option>In Progress</option>
                <option>Published</option>
              </select>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={s.btn} onClick={saveProject}>{editId ? 'Save Changes' : 'Add Project'}</button>
                {editId && <button style={s.btnGhost} onClick={clearProjectForm}>Cancel</button>}
              </div>
            </div>

            <div>
              <div style={s.sectionTitle}>Existing ({projects.length})</div>
              <div style={{ fontSize: '0.68rem', color: deCount >= 3 ? 'rgba(255,255,255,0.3)' : '#f472b6', marginBottom: '1rem' }}>
                {deCount} in Data Engineering — filter {deCount >= 3 ? 'is live' : 'hidden until 3'}
              </div>
              {projects.map((p, i) => (
                <div key={p.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontFamily: SERIF, fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>{p.title}</div>
                    <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                      <button style={s.btnTiny} onClick={() => move('projects', projects, i, -1)} disabled={i === 0}>↑</button>
                      <button style={s.btnTiny} onClick={() => move('projects', projects, i, 1)} disabled={i === projects.length - 1}>↓</button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.6rem' }}>
                    {p.category} · {p.status}{p.year ? ' · ' + p.year : ''}
                    {!p.diagram_url && <span style={{ color: 'rgba(244,114,182,0.6)' }}> · no diagram</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button style={s.btnTiny} onClick={() => editProject(p)}>Edit</button>
                    <button style={s.btnTiny} onClick={() => toggleStatus(p.id, p.status)}>Toggle Status</button>
                    <button style={s.btnDanger} onClick={() => deleteProject(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {tab === 'skills' && (
          <div className="admin-col">
            <div>
              <div style={s.sectionTitle}>{editId ? 'Edit Skill' : 'Add New Skill'}</div>
              <label style={s.label}>Skill Name</label>
              <input style={s.input} value={skName} onChange={e => setSkName(e.target.value)} placeholder="e.g. Airflow" />
              <label style={s.label}>Group</label>
              <select style={{ ...s.input, cursor: 'pointer' }} value={skCategory} onChange={e => setSkCategory(e.target.value)}>
                {SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <label style={{ ...s.label, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
                <input type="checkbox" checked={skFeatured} onChange={e => setSkFeatured(e.target.checked)} style={{ cursor: 'pointer' }} />
                Featured — show in hero sidebar
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={s.btn} onClick={saveSkill}>{editId ? 'Save Changes' : 'Add Skill'}</button>
                {editId && <button style={s.btnGhost} onClick={clearSkillForm}>Cancel</button>}
              </div>
              <div style={{ fontSize: '0.68rem', color: featuredCount > 6 ? '#f472b6' : 'rgba(255,255,255,0.3)', marginTop: '1rem' }}>
                {featuredCount} featured — hero shows the first 6
              </div>
            </div>

            <div>
              <div style={s.sectionTitle}>Existing ({skills.length})</div>
              {SKILL_CATEGORIES.map(cat => {
                const items = skills.filter(sk => sk.category === cat)
                if (items.length === 0) return null
                return (
                  <div key={cat} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{cat}</div>
                    {items.map((sk) => {
                      const gi = skills.findIndex(x => x.id === sk.id)
                      return (
                        <div key={sk.id} style={{ ...s.card, padding: '0.6rem 0.9rem', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <div>
                              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{sk.name}</span>
                              {sk.featured && <span style={{ fontSize: '0.52rem', color: '#0f0f0f', background: '#fff', padding: '2px 6px', marginLeft: '0.5rem', letterSpacing: '0.08em' }}>FEATURED</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                              <button style={s.btnTiny} onClick={() => move('skills', skills, gi, -1)} disabled={gi === 0}>↑</button>
                              <button style={s.btnTiny} onClick={() => move('skills', skills, gi, 1)} disabled={gi === skills.length - 1}>↓</button>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            <button style={s.btnTiny} onClick={() => editSkill(sk)}>Edit</button>
                            <button style={s.btnTiny} onClick={() => toggleFeatured(sk.id, sk.featured)}>{sk.featured ? 'Unfeature' : 'Feature'}</button>
                            <button style={s.btnDanger} onClick={() => deleteSkill(sk.id)}>Delete</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CERTS */}
        {tab === 'certs' && (
          <div className="admin-col">
            <div>
              <div style={s.sectionTitle}>{editId ? 'Edit Certification' : 'Add New Certification'}</div>
              <label style={s.label}>Title</label>
              <input style={s.input} value={cTitle} onChange={e => setCTitle(e.target.value)} placeholder="Certification title" />
              <label style={s.label}>Issuer</label>
              <input style={s.input} value={cIssuer} onChange={e => setCIssuer(e.target.value)} placeholder="e.g. AWS, Udacity, Tuwaiq" />
              <label style={s.label}>Year</label>
              <input style={s.input} value={cYear} onChange={e => setCYear(e.target.value)} placeholder="2026" />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={s.btn} onClick={saveCert}>{editId ? 'Save Changes' : 'Add Certification'}</button>
                {editId && <button style={s.btnGhost} onClick={clearCertForm}>Cancel</button>}
              </div>
            </div>

            <div>
              <div style={s.sectionTitle}>Existing ({certs.length})</div>
              {certs.map((c, i) => (
                <div key={c.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontFamily: SERIF, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>{c.title}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>{c.issuer} · {c.year}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                      <button style={s.btnTiny} onClick={() => move('certifications', certs, i, -1)} disabled={i === 0}>↑</button>
                      <button style={s.btnTiny} onClick={() => move('certifications', certs, i, 1)} disabled={i === certs.length - 1}>↓</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button style={s.btnTiny} onClick={() => editCert(c)}>Edit</button>
                    <button style={s.btnDanger} onClick={() => deleteCert(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT */}
        {tab === 'about' && (
          <div style={{ maxWidth: '640px' }}>
            <div style={s.sectionTitle}>Hero and About</div>
            <label style={s.label}>Hero Tagline (above your name)</label>
            <input style={s.input} value={aTagline} onChange={e => setATagline(e.target.value)} placeholder="Data Engineer" />
            <label style={s.label}>Hero Paragraph (under your name)</label>
            <textarea style={{ ...s.input, minHeight: '90px', resize: 'vertical' }} value={aP1} onChange={e => setAP1(e.target.value)} />
            <label style={s.label}>About Heading</label>
            <textarea style={{ ...s.input, minHeight: '70px', resize: 'vertical' }} value={aHeading} onChange={e => setAHeading(e.target.value)} />
            <label style={s.label}>About Paragraph</label>
            <textarea style={{ ...s.input, minHeight: '110px', resize: 'vertical' }} value={aP2} onChange={e => setAP2(e.target.value)} />

            <label style={s.label}>Contact Paragraph</label>
            <textarea style={{ ...s.input, minHeight: '80px', resize: 'vertical' }} value={aContact} onChange={e => setAContact(e.target.value)} />

            <div style={{ ...s.sectionTitle, marginTop: '2rem' }}>Contact Links</div>
            <label style={s.label}>GitHub URL</label>
            <input style={s.input} value={aGithub} onChange={e => setAGithub(e.target.value)} />
            <label style={s.label}>LinkedIn URL</label>
            <input style={s.input} value={aLinkedin} onChange={e => setALinkedin(e.target.value)} />
            <label style={s.label}>Email</label>
            <input style={s.input} value={aEmail} onChange={e => setAEmail(e.target.value)} />

            <button style={s.btn} onClick={saveAbout}>Save All</button>
          </div>
        )}

        {/* CV */}
        {tab === 'cv' && (
          <div style={{ maxWidth: '520px' }}>
            <div style={s.sectionTitle}>CV / Resume</div>
            <div style={{ ...s.card, padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Upload a new PDF to replace the current CV. The download button on your site updates immediately.
              </div>
              <label style={{ ...s.btn, display: 'inline-block', cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.5 : 1 }}>
                {uploading ? 'Uploading...' : 'Choose PDF'}
                <input type="file" accept="application/pdf" style={{ display: 'none' }} disabled={uploading}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCV(f); e.target.value = '' }} />
              </label>
              {aCvUrl && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ ...s.label, marginBottom: '0.5rem' }}>Current file</div>
                  <a href={aCvUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
                    View current CV
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        @media (max-width: 760px) { .admin-col { grid-template-columns: 1fr; gap: 2.5rem; } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
        select option { background: #161616; color: #fff; }
        button:disabled { opacity: 0.25; cursor: not-allowed; }
      ` }} />
    </div>
  )
}