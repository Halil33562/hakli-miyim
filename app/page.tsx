import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p style={{ padding: '2rem' }}>Hata oluştu: {error.message}</p>
  }

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

      <div style={{ padding: '24px 28px 48px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {posts?.length === 0 && <p style={{ color: '#5C594A', fontSize: '14px' }}>Henüz dava yok, ilkini sen aç.</p>}

        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}