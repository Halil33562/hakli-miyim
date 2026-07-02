'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CommentForm({ postId }: { postId: number }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [website, setWebsite] = useState('') // honeypot: botlar bunu doldurur, insanlar görmez
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    // Bot koruması: gizli alan doluysa sessizce reddet
    if (website.trim() !== '') {
      setErrorMsg('')
      setContent('')
      return
    }

    if (content.trim() === '') {
      setErrorMsg('Lütfen bir yorum yaz.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      content: content.trim(),
      author_name: name.trim() === '' ? 'Anonim' : name.trim(),
    })

    setLoading(false)

    if (error) {
      setErrorMsg('Yorum eklenirken hata oluştu: ' + error.message)
      return
    }

    setContent('')
    setName('')
    router.refresh() // yorum listesini yeniden çek
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="İsim (opsiyonel, boş bırakırsan Anonim yazar)"
        style={{ padding: '0.5rem' }}
      />

      {/* Honeypot alanı - gerçek kullanıcılar görmez */}
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