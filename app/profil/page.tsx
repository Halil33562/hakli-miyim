'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Post = {
  id: number
  title: string
  content: string
  upvotes: number
  downvotes: number
  created_at: string
}

export default function ProfilPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [voteCount, setVoteCount] = useState(0)

  useEffect(() => {
    if (!authLoading && user) {
      loadData()
    }
  }, [authLoading, user])

  async function loadData() {
    setLoadingPosts(true)

    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })

    setPosts(postsData ?? [])

    const { count } = await supabase
      .from('votes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id)

    setVoteCount(count ?? 0)
    setLoadingPosts(false)
  }

  if (authLoading) return null

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Profilini görmek için <Link href="/giris" style={{ color: 'var(--brand)', fontWeight: 600 }}>giriş yapmalısın</Link>.
        </p>
      </div>
    )
  }

  const totalUp = posts.reduce((sum, p) => sum + p.upvotes, 0)
  const totalDown = posts.reduce((sum, p) => sum + p.downvotes, 0)
  const totalVotesReceived = totalUp + totalDown
  const haklıOrani = totalVotesReceived === 0 ? null : Math.round((totalUp / totalVotesReceived) * 100)

  const stats = [
    { label: 'Paylaşım', value: posts.length },
    { label: 'Aldığı oy', value: totalVotesReceived },
    { label: 'Verdiği oy', value: voteCount },
    { label: 'Haklı bulunma oranı', value: haklıOrani === null ? '—' : `%${haklıOrani}` },
  ]

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 28px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 800, fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 20px' }}>
        {profile?.username ?? 'Kullanıcı'}
      </h1>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '32px' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 12px' }}>
            <p style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {s.value}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '0 0 12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        PAYLAŞIMLARI
      </p>

      {loadingPosts && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Yükleniyor...</p>}

      {!loadingPosts && posts.length === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Henüz paylaşım yapmamış.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map((post) => {
          const total = post.upvotes + post.downvotes
          const upPercent = total === 0 ? 50 : Math.round((post.upvotes / total) * 100)

          return (
            <Link key={post.id} href={`/post/${post.id}`}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
                <h3 style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', margin: 0 }}>
                  {post.title}
                </h3>
                <div style={{ height: '4px', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', marginTop: '10px' }}>
                  <div style={{ width: `${upPercent}%`, background: 'var(--pozitif)' }} />
                  <div style={{ width: `${100 - upPercent}%`, background: 'var(--negatif)' }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}