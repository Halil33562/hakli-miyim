'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GirisPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (email.trim() === '' || password.trim() === '') {
      setErrorMsg('Lütfen tüm alanları doldur.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMsg('Giriş yapılırken hata oluştu: ' + error.message)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Giriş Yap</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: '0.5rem' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" style={{ padding: '0.5rem' }} />

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Hesabın yok mu? <Link href="/kayit">Kayıt ol</Link>
      </p>
    </div>
  )
}