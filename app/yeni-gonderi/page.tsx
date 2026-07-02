'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function YeniGonderi() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (title.trim() === '' || content.trim() === '') {
      setErrorMsg('Lütfen başlık ve içerik alanlarını doldur.')
      return
    }

    if (!user) {
      setErrorMsg('Dava açmak için giriş yapmalısın.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      upvotes: 0,
      downvotes: 0,
      user_id: user.id,
    })

    setLoading(false)

    if (error) {
      setErrorMsg('Bir hata oluştu: ' + error.message)
      return
    }

    router.push('/')
  }

  if (authLoading) return null

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', color: '#5C594A' }}>
          Dava açmak için <Link href="/giris" style={{ color: '#22211A', fontWeight: 500 }}>giriş yapmalısın</Link>.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Olayını anlat</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            placeholder="Örn: Arkadaşımın hediyesini beğenmedim, söyledim"
          />
        </div>

        <div>
          <label>Olayı anlat</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            placeholder="Başından sonuna kadar ne oldu anlat..."
          />
        </div>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>
    </div>
  )
}