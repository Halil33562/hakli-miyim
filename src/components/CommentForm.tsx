'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function CommentForm({ postId, onSuccess }: { postId: number; onSuccess?: () => void }) {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [content, setContent] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (website.trim() !== '') {
      setContent('')
      return
    }

    if (content.trim() === '') {
      setErrorMsg('Lütfen bir yorum yaz.')
      return
    }

    if (!user) {
      setErrorMsg('Yorum yapmak için giriş yapmalısın.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      content: content.trim(),
      author_name: profile?.username ?? 'Kullanıcı',
      user_id: user.id,
    })

    setLoading(false)

    if (error) {
      setErrorMsg('Yorum eklenirken hata oluştu: ' + error.message)
      return
    }

    setContent('')
    router.refresh()
    onSuccess?.()
  }

  if (authLoading) return null

  if (!user) {
    return (
      <p style={{ marginTop: '1rem' }}>
        Yorum yapmak için <Link href="/giris">giriş yapmalısın</Link>.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: 'absolute', left: '-9999px' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorumunu yaz..."
        rows={4}
        style={{ padding: '0.5rem' }}
      />

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Yorum Yap'}
      </button>
    </form>
  )
}