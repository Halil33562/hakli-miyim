'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import TurnstileWidget from './TurnstileWidget'
import CommentForm from './CommentForm'
import Link from 'next/link'
import { getCategory } from '@/lib/categories'

type Post = {
  id: number
  title: string
  content: string
  upvotes: number
  downvotes: number
  category?: string
}

type Comment = {
  id: number
  content: string
  author_name: string
  created_at: string
}

const REPORT_REASONS = [
  'Hakaret / taciz',
  'Spam',
  'Uygunsuz içerik',
  'Diğer',
]

function getAnonId() {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('anon_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('anon_id', id)
  }
  return id
}

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth()
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [downvotes, setDownvotes] = useState(post.downvotes)
  const [voted, setVoted] = useState(false)
  const [checking, setChecking] = useState(true)
  const [pendingVoteType, setPendingVoteType] = useState<'up' | 'down' | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentCount, setCommentCount] = useState<number | null>(null)

  useEffect(() => {
    checkExistingVote()
    loadCommentCount()
    if (typeof window !== 'undefined') {
      const reported = localStorage.getItem(`reported_${post.id}`)
      if (reported) setReportSent(true)
    }
  }, [user])

  async function loadCommentCount() {
    const { count } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', post.id)
    setCommentCount(count ?? 0)
  }

  async function toggleComments() {
    const opening = !commentsOpen
    setCommentsOpen(opening)

    if (opening && comments.length === 0) {
      setCommentsLoading(true)
      const { data } = await supabase
        .from('comments')
        .select('id, content, author_name, created_at')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false })

      setComments(data ?? [])
      setCommentsLoading(false)
    }
  }

  function handleNewComment() {
    setComments([])
    loadCommentCount()
    toggleComments()
    setTimeout(() => toggleComments(), 0)
  }

  async function checkExistingVote() {
    setChecking(true)
    const anonId = getAnonId()

    let query = supabase.from('votes').select('id').eq('post_id', post.id)
    query = user ? query.eq('user_id', user.id) : query.eq('anon_id', anonId)

    const { data } = await query.maybeSingle()
    setVoted(!!data)
    setChecking(false)
  }

  async function handleVote(type: 'up' | 'down') {
    if (voted) return
    setErrorMsg('')

    if (user) {
      const { error: insertError } = await supabase.from('votes').insert({
        post_id: post.id,
        vote_type: type,
        user_id: user.id,
      })

      if (insertError) {
        setErrorMsg('Zaten oy vermişsin veya bir hata oluştu.')
        return
      }

      const column = type === 'up' ? 'upvotes' : 'downvotes'
      const newValue = type === 'up' ? upvotes + 1 : downvotes + 1

      const { error: updateError } = await supabase
        .from('posts')
        .update({ [column]: newValue })
        .eq('id', post.id)

      if (updateError) {
        setErrorMsg('Oy sayısı güncellenirken hata oluştu.')
        return
      }

      if (type === 'up') setUpvotes(newValue)
      else setDownvotes(newValue)
      setVoted(true)
    } else {
      setPendingVoteType(type)
    }
  }

  async function handleTurnstileVerify(token: string) {
    if (!pendingVoteType) return

    const anonId = getAnonId()

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id, voteType: pendingVoteType, token, anonId }),
    })

    const data = await res.json()

    if (!res.ok) {
      setErrorMsg(data.error ?? 'Bir hata oluştu.')
      setPendingVoteType(null)
      return
    }

    if (pendingVoteType === 'up') setUpvotes(data.newValue)
    else setDownvotes(data.newValue)

    setVoted(true)
    setPendingVoteType(null)
  }

  async function handleReport(reason: string) {
    await supabase.from('reports').insert({ post_id: post.id, reason })
    localStorage.setItem(`reported_${post.id}`, '1')
    setReportSent(true)
    setReportOpen(false)
  }

  const total = upvotes + downvotes
  const upPercent = total === 0 ? 50 : Math.round((upvotes / total) * 100)
  const downPercent = 100 - upPercent
  const cat = getCategory(post.category)

  let verdict: { label: string; color: string; bg: string } | null = null
  if (total >= 5) {
    if (upPercent >= 65) verdict = { label: '🟢 Toplum: Haklı buluyor', color: '#0F8F5F', bg: 'var(--pozitif-soft)' }
    else if (upPercent <= 35) verdict = { label: '🔴 Toplum: Haksız buluyor', color: '#C23B4A', bg: 'var(--negatif-soft)' }
    else verdict = { label: '⚪ Toplum kararsız', color: '#6B6B7B', bg: '#F1F1F5' }
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', fontWeight: 500, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: cat.bg, color: cat.color }}>
            {cat.label}
          </span>
          {verdict && (
            <span style={{ fontSize: '11px', fontWeight: 500, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: verdict.bg, color: verdict.color }}>
              {verdict.label}
            </span>
          )}
        </div>

        {!reportSent ? (
          <button
            onClick={() => setReportOpen(!reportOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
          >
            🚩 Bildir
          </button>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bildirildi</span>
        )}
      </div>

      {reportOpen && (
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Neden bildiriyorsun?</p>
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => handleReport(reason)}
              style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer', padding: '4px 0' }}
            >
              {reason}
            </button>
          ))}
        </div>
      )}

      <Link href={`/post/${post.id}`}>
        <h2 style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 700, fontSize: '19px', color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.3, cursor: 'pointer' }}>
          {post.title}
        </h2>
      </Link>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 18px' }}>
        {post.content}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <button
          onClick={() => handleVote('up')}
          disabled={voted || checking}
          style={{
            flex: 1,
            fontSize: '13px',
            fontWeight: 600,
            background: 'var(--pozitif-soft)',
            color: 'var(--pozitif)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '10px 0',
            cursor: voted || checking ? 'default' : 'pointer',
            opacity: voted || checking ? 0.6 : 1,
          }}
        >
          👍 Haklısın · {upvotes}
        </button>
        <button
          onClick={() => handleVote('down')}
          disabled={voted || checking}
          style={{
            flex: 1,
            fontSize: '13px',
            fontWeight: 600,
            background: 'var(--negatif-soft)',
            color: 'var(--negatif)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '10px 0',
            cursor: voted || checking ? 'default' : 'pointer',
            opacity: voted || checking ? 0.6 : 1,
          }}
        >
          👎 Haksızsın · {downvotes}
        </button>
      </div>

      <div style={{ height: '5px', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', marginBottom: '12px' }}>
        <div style={{ width: `${upPercent}%`, background: 'var(--pozitif)' }} />
        <div style={{ width: `${downPercent}%`, background: 'var(--negatif)' }} />
      </div>

      <button
        onClick={toggleComments}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', padding: '4px 0', fontWeight: 500 }}
      >
        💬 {commentCount ?? '…'} yorum {commentsOpen ? '▲' : '▼'}
      </button>

      {pendingVoteType && (
        <div style={{ marginTop: '14px' }}>
          <TurnstileWidget onVerify={handleTurnstileVerify} />
        </div>
      )}

      {errorMsg && <p style={{ color: 'var(--negatif)', marginTop: '10px', fontSize: '12px' }}>{errorMsg}</p>}

      {commentsOpen && (
        <div style={{ marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
          {commentsLoading && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Yükleniyor...</p>}

          {!commentsLoading && comments.length === 0 && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Henüz yorum yok, ilk sen yaz.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            {comments.map((c) => (
              <div key={c.id} style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 600 }}>{c.author_name}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>{c.content}</p>
              </div>
            ))}
          </div>

          <CommentForm postId={post.id} onSuccess={handleNewComment} />
        </div>
      )}
    </div>
  )
}