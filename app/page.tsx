import { supabase } from '@/lib/supabase'
import PortfolioClient from './PortfolioClient'

export const revalidate = 60

export default async function Home() {
  const [p, sk, c, ab] = await Promise.all([
    supabase.from('projects').select('*').order('sort_order').order('created_at'),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('certifications').select('*').order('sort_order').order('created_at'),
    supabase.from('about').select('*').single(),
  ])

  return (
    <PortfolioClient
      projects={p.data || []}
      skills={sk.data || []}
      certs={c.data || []}
      about={ab.data || null}
    />
  )
}