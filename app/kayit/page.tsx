'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function KayitPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
      setErrorMsg('Lütfen tüm alanları doldur.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { username: username.trim() } },
    })

    setLoading(false)

    if (error) {
      setErrorMsg('Kayıt olurken hata oluştu: ' + error.message)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Kayıt Ol</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı adı" style={{ padding: '0.5rem' }} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: '0.5rem' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" style={{ padding: '0.5rem' }} />

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Zaten hesabın var mı? <Link href="/giris">Giriş yap</Link>
      </p>
    </div>
  )
}