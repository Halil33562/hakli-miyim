import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  upvotes: number
  downvotes: number
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const activeFilter = filter ?? 'yeni'

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')

  if (error) {
    return <p style={{ padding: '2rem' }}>Hata oluştu: {error.message}</p>
  }

  let sortedPosts = [...(posts ?? [])] as Post[]

  if (activeFilter === 'yeni') {
    sortedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } else if (activeFilter === 'tartisilan') {
    sortedPosts.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes))
  } else if (activeFilter === 'belirsiz') {
    sortedPosts = sortedPosts.filter((p) => p.upvotes + p.downvotes >= 3)
    sortedPosts.sort((a, b) => {
      const totalA = a.upvotes + a.downvotes
      const totalB = b.upvotes + b.downvotes
      const distA = Math.abs(50 - Math.round((a.upvotes / totalA) * 100))
      const distB = Math.abs(50 - Math.round((b.upvotes / totalB) * 100))
      return distA - distB
    })
  }

  const tabs = [
    { key: 'yeni', label: 'Yeni' },
    { key: 'tartisilan', label: 'En çok tartışılan' },
    { key: 'belirsiz', label: 'Kazananı belirsiz' },
  ]

  return (
    <div>
      <div style={{ padding: '40px 28px 32px', borderBottom: '1px solid #DDD4BC', maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: '#8A7F5C', margin: '0 0 10px' }}>
          Halk mahkemesi · herkes oy verir
        </p>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '34px', lineHeight: 1.15, color: '#22211A', margin: '0 0 12px', maxWidth: '420px' }}>
          Olayını anlat,<br />karar halkın olsun.
        </h1>
        <p style={{ fontSize: '14px', color: '#5C594A', margin: '0 0 20px', maxWidth: '380px', lineHeight: 1.6 }}>
          Başına geleni yaz, herkes "haklısın" ya da "haksızsın" mührünü bassın.
        </p>
        <Link href="/yeni-gonderi">
          <button style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '12px', letterSpacing: '0.04em', background: '#22211A', color: '#F1EEE4', border: 'none', borderRadius: '4px', padding: '11px 20px', cursor: 'pointer' }}>
            + Dava aç
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 28px 0', display: 'flex', gap: '6px' }}>
        {tabs.map((tab) => {
          const active = activeFilter === tab.key
          return (
            <Link key={tab.key} href={`/?filter=${tab.key}`} style={{ textDecoration: 'none' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-plex-mono), monospace',
                  fontSize: '12px',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  background: active ? '#22211A' : 'transparent',
                  color: active ? '#F1EEE4' : '#8A7F5C',
                  border: active ? 'none' : '1px solid #DDD4BC',
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>

      <div style={{ padding: '24px 28px 48px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedPosts.length === 0 && (
          <p style={{ color: '#5C594A', fontSize: '14px' }}>
            {activeFilter === 'belirsiz' ? 'Henüz yeterince oy almış dava yok.' : 'Henüz dava yok, ilkini sen aç.'}
          </p>
        )}

        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}