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

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <Link href={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 style={{ cursor: 'pointer' }}>{post.title}</h2>
      </Link>
      <p>{post.content}</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => handleVote('up')} disabled={voted || checking}>
          👍 Haklısın ({upvotes})
        </button>
        <button onClick={() => handleVote('down')} disabled={voted || checking}>
          👎 Haksızsın ({downvotes})
        </button>
      </div>

      {pendingVoteType && (
        <div style={{ marginTop: '0.75rem' }}>
          <TurnstileWidget onVerify={handleTurnstileVerify} />
        </div>
      )}

      {errorMsg && <p style={{ color: 'red', marginTop: '0.5rem' }}>{errorMsg}</p>}
    </div>
  )
}