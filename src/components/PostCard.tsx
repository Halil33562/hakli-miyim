'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Post = {
  id: number
  title: string
  content: string
  upvotes: number
  downvotes: number
}

export default function PostCard({ post }: { post: Post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [downvotes, setDownvotes] = useState(post.downvotes)
  const [voted, setVoted] = useState(false)

  async function handleVote(type: 'up' | 'down') {
    if (voted) return // aynı oturumda ikinci kez oy vermeyi engelle

    const column = type === 'up' ? 'upvotes' : 'downvotes'
    const newValue = type === 'up' ? upvotes + 1 : downvotes + 1

    const { error } = await supabase
      .from('posts')
      .update({ [column]: newValue })
      .eq('id', post.id)

    if (error) {
      alert('Oy verilirken hata oluştu: ' + error.message)
      return
    }

    if (type === 'up') setUpvotes(newValue)
    else setDownvotes(newValue)
    setVoted(true)
  }

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button onClick={() => handleVote('up')} disabled={voted}>
          👍 Haklısın ({upvotes})
        </button>
        <button onClick={() => handleVote('down')} disabled={voted}>
          👎 Haksızsın ({downvotes})
        </button>
      </div>
    </div>
  )
}