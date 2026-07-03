'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import TurnstileWidget from './TurnstileWidget'
import Link from 'next/link'

type Post = {
  id: number
  title: string
  content: string
  upvotes: number
  downvotes: number
  category?: string
}

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

  useEffect(() => {
    checkExistingVote()
  }, [user])

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

  const total = upvotes + downvotes
  const upPercent = total === 0 ? 50 : Math.round((upvotes / total) * 100)
  const downPercent = 100 - upPercent
  const caseNumber = String(post.id).padStart(3, '0')

  return (
    <div style={{ background: '#FBF9F1', border: '1px solid #DDD4BC', borderRadius: '6px', padding: '20px 22px' }}>
      <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '10px', letterSpacing: '0.06em', color: '#A79B72', margin: '0 0 8px' }}>
        DOSYA NO {caseNumber}
      </p>
      {post.category && (
  <span style={{ display: 'inline-block', fontFamily: 'var(--font-plex-mono), monospace', fontSize: '10px', padding: '3px 9px', borderRadius: '3px', background: '#EFE9DA', color: '#5C594A', marginBottom: '10px' }}>
    {post.category}
  </span>
)}  

      <Link href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
        <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '19px', color: '#22211A', margin: '0 0 8px', lineHeight: 1.3, cursor: 'pointer' }}>
          {post.title}
        </h2>
      </Link>

      <p style={{ fontSize: '13px', color: '#5C594A', lineHeight: 1.6, margin: '0 0 18px' }}>
        {post.content}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <button
          onClick={() => handleVote('up')}
          disabled={voted || checking}
          style={{
            flex: 1,
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: '12px',
            background: '#EAF3DE',
            color: '#27500A',
            border: '1.5px solid #97C459',
            borderRadius: '4px',
            padding: '9px 0',
            cursor: voted || checking ? 'default' : 'pointer',
            opacity: voted || checking ? 0.6 : 1,
            transform: 'rotate(-1deg)',
          }}
        >
          Haklısın · {upvotes}
        </button>
        <button
          onClick={() => handleVote('down')}
          disabled={voted || checking}
          style={{
            flex: 1,
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: '12px',
            background: '#FCEBEB',
            color: '#791F1F',
            border: '1.5px solid #F09595',
            borderRadius: '4px',
            padding: '9px 0',
            cursor: voted || checking ? 'default' : 'pointer',
            opacity: voted || checking ? 0.6 : 1,
            transform: 'rotate(1deg)',
          }}
        >
          Haksızsın · {downvotes}
        </button>
      </div>

      <div style={{ height: '4px', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${upPercent}%`, background: '#639922' }} />
        <div style={{ width: `${downPercent}%`, background: '#E24B4A' }} />
      </div>

      {pendingVoteType && (
        <div style={{ marginTop: '14px' }}>
          <TurnstileWidget onVerify={handleTurnstileVerify} />
        </div>
      )}

      {errorMsg && <p style={{ color: '#E24B4A', marginTop: '10px', fontSize: '12px' }}>{errorMsg}</p>}
    </div>
  )
}