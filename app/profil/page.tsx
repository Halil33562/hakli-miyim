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
        <p style={{ fontSize: '14px', color: '#5C594A' }}>
          Profilini görmek için <Link href="/giris" style={{ color: '#22211A', fontWeight: 500 }}>giriş yapmalısın</Link>.
        </p>
      </div>
    )
  }

  const totalUp = posts.reduce((sum, p) => sum + p.upvotes, 0)
  const totalDown = posts.reduce((sum, p) => sum + p.downvotes, 0)
  const totalVotesReceived = totalUp + totalDown
  const haklıOrani = totalVotesReceived === 0 ? null : Math.round((totalUp / totalVotesReceived) * 100)

  const enTartisilan = posts.length === 0 ? null : posts.reduce((max, p) =>
    (p.upvotes + p.downvotes) > (max.upvotes + max.downvotes) ? p : max
  , posts[0])

  const stats = [
    { label: 'Açtığı dava', value: posts.length },
    { label: 'Aldığı mühür', value: totalVotesReceived },
    { label: 'Kullandığı mühür', value: voteCount },
    { label: 'Haklı bulunma oranı', value: haklıOrani === null ? '—' : `%${haklıOrani}` },
  ]

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 28px 48px' }}>
      <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: '#8A7F5C', margin: '0 0 10px' }}>
        SİCİL
      </p>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '30px', color: '#22211A', margin: '0 0 24px' }}>
        {profile?.username ?? 'Kullanıcı'}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '32px' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: '#FBF9F1', border: '1px solid #DDD4BC', borderRadius: '6px', padding: '14px 12px' }}>
            <p style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '22px', color: '#22211A', margin: '0 0 4px' }}>
              {s.value}
            </p>
            <p style={{ fontSize: '11px', color: '#8A7F5C', margin: 0, lineHeight: 1.3 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {enTartisilan && (enTartisilan.upvotes + enTartisilan.downvotes) > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: '#8A7F5C', margin: '0 0 10px' }}>
            EN ÇOK TARTIŞILAN DAVASI
          </p>
          <Link href={`/post/${enTartisilan.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#FBF9F1', border: '1px solid #DDD4BC', borderRadius: '6px', padding: '16px 18px' }}>
              <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '16px', color: '#22211A', margin: '0 0 8px' }}>
                {enTartisilan.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#5C594A', margin: 0 }}>
                {enTartisilan.upvotes} haklısın · {enTartisilan.downvotes} haksızsın
              </p>
            </div>
          </Link>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: '#8A7F5C', margin: '0 0 12px', borderTop: '1px solid #DDD4BC', paddingTop: '20px' }}>
        AÇTIĞI DAVALAR
      </p>

      {loadingPosts && <p style={{ fontSize: '13px', color: '#5C594A' }}>Yükleniyor...</p>}

      {!loadingPosts && posts.length === 0 && (
        <p style={{ fontSize: '13px', color: '#5C594A' }}>Henüz dava açmamış.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map((post) => {
          const total = post.upvotes + post.downvotes
          const upPercent = total === 0 ? 50 : Math.round((post.upvotes / total) * 100)
          const caseNumber = String(post.id).padStart(3, '0')

          return (
            <Link key={post.id} href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#FBF9F1', border: '1px solid #DDD4BC', borderRadius: '6px', padding: '16px 18px' }}>
                <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '10px', letterSpacing: '0.06em', color: '#A79B72', margin: '0 0 6px' }}>
                  DOSYA NO {caseNumber}
                </p>
                <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '16px', color: '#22211A', margin: 0 }}>
                  {post.title}
                </h3>
                <div style={{ height: '4px', borderRadius: '2px', overflow: 'hidden', display: 'flex', marginTop: '10px' }}>
                  <div style={{ width: `${upPercent}%`, background: '#639922' }} />
                  <div style={{ width: `${100 - upPercent}%`, background: '#E24B4A' }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}