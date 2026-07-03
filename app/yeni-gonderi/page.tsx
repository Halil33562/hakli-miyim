'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const CATEGORIES = [
  { key: 'aile', label: 'Aile' },
  { key: 'is', label: 'İş' },
  { key: 'arkadaslik', label: 'Arkadaşlık' },
  { key: 'iliski', label: 'İlişki' },
  { key: 'para', label: 'Para' },
  { key: 'diger', label: 'Diğer' },
]

const TITLE_MIN = 30
const CONTENT_MIN = 150
const DAILY_LIMIT = 3

export default function YeniGonderi() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('diger')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [todayCount, setTodayCount] = useState<number | null>(null)

  useEffect(() => {
    if (user) checkDailyCount()
  }, [user])

  async function checkDailyCount() {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id)
      .gte('created_at', startOfDay.toISOString())

    setTodayCount(count ?? 0)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!user) {
      setErrorMsg('Dava açmak için giriş yapmalısın.')
      return
    }

    if (todayCount !== null && todayCount >= DAILY_LIMIT) {
      setErrorMsg(`Günde en fazla ${DAILY_LIMIT} dava açabilirsin. Yarın tekrar dene.`)
      return
    }

    if (title.trim().length < TITLE_MIN) {
      setErrorMsg(`Başlık en az ${TITLE_MIN} karakter olmalı (şu an ${title.trim().length}).`)
      return
    }

    if (content.trim().length < CONTENT_MIN) {
      setErrorMsg(`Olay anlatımı en az ${CONTENT_MIN} karakter olmalı (şu an ${content.trim().length}).`)
      return
    }

    setLoading(true)

    const { error } = await supabase.from('posts').insert({
      title: title.trim(),
      content: content.trim(),
      category,
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

  const limitReached = todayCount !== null && todayCount >= DAILY_LIMIT

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Olayını anlat</h1>

      {todayCount !== null && (
        <p style={{ fontSize: '12px', color: '#8A7F5C', marginBottom: '1rem' }}>
          Bugün {todayCount}/{DAILY_LIMIT} dava açtın.
        </p>
      )}

      {limitReached ? (
        <p style={{ fontSize: '14px', color: '#791F1F', background: '#FCEBEB', padding: '12px', borderRadius: '4px' }}>
          Günlük dava açma limitine ulaştın. Yarın tekrar deneyebilirsin.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Kategori</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  style={{
                    fontFamily: 'var(--font-plex-mono), monospace',
                    fontSize: '12px',
                    padding: '7px 14px',
                    borderRadius: '4px',
                    background: category === c.key ? '#22211A' : 'transparent',
                    color: category === c.key ? '#F1EEE4' : '#5C594A',
                    border: category === c.key ? 'none' : '1px solid #DDD4BC',
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label>Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              placeholder="Örn: Arkadaşımın hediyesini beğenmedim, açıkça söyledim"
            />
            <p style={{ fontSize: '11px', color: title.trim().length < TITLE_MIN ? '#791F1F' : '#8A7F5C', margin: '4px 0 0' }}>
              {title.trim().length} / {TITLE_MIN} karakter (en az)
            </p>
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
            <p style={{ fontSize: '11px', color: content.trim().length < CONTENT_MIN ? '#791F1F' : '#8A7F5C', margin: '4px 0 0' }}>
              {content.trim().length} / {CONTENT_MIN} karakter (en az)
            </p>
          </div>

          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      )}
    </div>
  )
}