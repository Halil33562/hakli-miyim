'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'halilturkan35@gmail.com'

type Report = {
  id: number
  post_id: number
  reason: string
  created_at: string
}

type PostInfo = {
  id: number
  title: string
  content: string
  upvotes: number
  downvotes: number
  category?: string
}

type CommentInfo = {
  id: number
  post_id: number
  content: string
  author_name: string
  created_at: string
}

const TABS = [
  { key: 'raporlar', label: 'Raporlar' },
  { key: 'davalar', label: 'Tüm Davalar' },
  { key: 'yorumlar', label: 'Tüm Yorumlar' },
]

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const isAdmin = user?.email === ADMIN_EMAIL

  const [activeTab, setActiveTab] = useState('raporlar')

  const [reports, setReports] = useState<Report[]>([])
  const [postsMap, setPostsMap] = useState<Record<number, PostInfo>>({})
  const [allPosts, setAllPosts] = useState<PostInfo[]>([])
  const [allComments, setAllComments] = useState<CommentInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) loadTabData(activeTab)
  }, [isAdmin, activeTab])

  async function loadTabData(tab: string) {
    setLoading(true)

    if (tab === 'raporlar') {
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      const list = reportsData ?? []
      setReports(list)

      const postIds = [...new Set(list.map((r) => r.post_id))]
      if (postIds.length > 0) {
        const { data: postsData } = await supabase
          .from('posts')
          .select('id, title, content, upvotes, downvotes, category')
          .in('id', postIds)

        const map: Record<number, PostInfo> = {}
        postsData?.forEach((p) => { map[p.id] = p })
        setPostsMap(map)
      }
    }

    if (tab === 'davalar') {
      const { data } = await supabase
        .from('posts')
        .select('id, title, content, upvotes, downvotes, category')
        .order('created_at', { ascending: false })
      setAllPosts(data ?? [])
    }

    if (tab === 'yorumlar') {
      const { data } = await supabase
        .from('comments')
        .select('id, post_id, content, author_name, created_at')
        .order('created_at', { ascending: false })
      setAllComments(data ?? [])
    }

    setLoading(false)
  }

  async function dismissReport(id: number) {
    await supabase.from('reports').delete().eq('id', id)
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  async function deletePost(postId: number) {
    if (!confirm('Bu davayı kalıcı olarak silmek istediğine emin misin? Buna bağlı tüm oylar ve yorumlar da silinecek.')) return
    await supabase.from('posts').delete().eq('id', postId)
    setReports((prev) => prev.filter((r) => r.post_id !== postId))
    setAllPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  async function deleteComment(commentId: number) {
    if (!confirm('Bu yorumu silmek istediğine emin misin?')) return
    await supabase.from('comments').delete().eq('id', commentId)
    setAllComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  if (authLoading) return null

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', color: '#5C594A' }}>Bu sayfaya erişim yetkin yok.</p>
      </div>
    )
  }

  const cardStyle: React.CSSProperties = { background: '#FBF9F1', border: '1px solid #DDD4BC', borderRadius: '6px', padding: '16px 18px' }
  const smallBtn: React.CSSProperties = { fontSize: '12px', padding: '6px 12px', border: '1px solid #DDD4BC', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }
  const dangerBtn: React.CSSProperties = { fontSize: '12px', padding: '6px 12px', border: 'none', background: '#791F1F', color: '#fff', borderRadius: '4px', cursor: 'pointer' }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 28px 48px' }}>
      <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: '#8A7F5C', margin: '0 0 10px' }}>
        ADMIN
      </p>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '28px', color: '#22211A', margin: '0 0 20px' }}>
        Kontrol paneli
      </h1>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', borderBottom: '1px solid #DDD4BC', paddingBottom: '12px' }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                fontFamily: 'var(--font-plex-mono), monospace',
                fontSize: '12px',
                padding: '7px 14px',
                borderRadius: '4px',
                background: active ? '#22211A' : 'transparent',
                color: active ? '#F1EEE4' : '#8A7F5C',
                border: active ? 'none' : '1px solid #DDD4BC',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {loading && <p style={{ fontSize: '13px', color: '#5C594A' }}>Yükleniyor...</p>}

      {/* RAPORLAR */}
      {!loading && activeTab === 'raporlar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reports.length === 0 && <p style={{ fontSize: '13px', color: '#5C594A' }}>Bekleyen rapor yok.</p>}
          {reports.map((report) => {
            const post = postsMap[report.post_id]
            return (
              <div key={report.id} style={cardStyle}>
                <p style={{ fontSize: '11px', color: '#791F1F', margin: '0 0 8px', fontWeight: 600 }}>
                  Sebep: {report.reason}
                </p>
                {post ? (
                  <>
                    <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '15px', color: '#22211A', margin: '0 0 6px' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#5C594A', margin: '0 0 12px' }}>
                      {post.content.slice(0, 150)}...
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: '12px', color: '#8A7F5C', margin: '0 0 12px' }}>Bu dava zaten silinmiş.</p>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => dismissReport(report.id)} style={smallBtn}>Raporu kapat</button>
                  {post && <button onClick={() => deletePost(post.id)} style={dangerBtn}>Davayı sil</button>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* TÜM DAVALAR */}
      {!loading && activeTab === 'davalar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {allPosts.length === 0 && <p style={{ fontSize: '13px', color: '#5C594A' }}>Hiç dava yok.</p>}
          {allPosts.map((post) => (
            <div key={post.id} style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '15px', color: '#22211A', margin: '0 0 6px' }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#5C594A', margin: '0 0 10px' }}>
                {post.upvotes} haklısın · {post.downvotes} haksızsın · {post.category ?? 'kategori yok'}
              </p>
              <button onClick={() => deletePost(post.id)} style={dangerBtn}>Sil</button>
            </div>
          ))}
        </div>
      )}

      {/* TÜM YORUMLAR */}
      {!loading && activeTab === 'yorumlar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {allComments.length === 0 && <p style={{ fontSize: '13px', color: '#5C594A' }}>Hiç yorum yok.</p>}
          {allComments.map((c) => (
            <div key={c.id} style={cardStyle}>
              <p style={{ fontSize: '11px', color: '#8A7F5C', margin: '0 0 6px' }}>{c.author_name} · dava #{c.post_id}</p>
              <p style={{ fontSize: '13px', color: '#22211A', margin: '0 0 10px' }}>{c.content}</p>
              <button onClick={() => deleteComment(c.id)} style={dangerBtn}>Sil</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}