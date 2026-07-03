'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const USERNAME_COOLDOWN_DAYS = 7

export default function AyarlarPage() {
  const { user, profile, loading } = useAuth()

  const [newUsername, setNewUsername] = useState('')
  const [usernameMsg, setUsernameMsg] = useState('')
  const [usernameLoading, setUsernameLoading] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  if (loading) return null

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', color: '#5C594A' }}>
          Ayarları görmek için <Link href="/giris" style={{ color: '#22211A', fontWeight: 500 }}>giriş yapmalısın</Link>.
        </p>
      </div>
    )
  }

  const lastChanged = (profile as any)?.username_changed_at
    ? new Date((profile as any).username_changed_at)
    : null
  const daysSinceChange = lastChanged
    ? Math.floor((Date.now() - lastChanged.getTime()) / (1000 * 60 * 60 * 24))
    : USERNAME_COOLDOWN_DAYS
  const canChangeUsername = daysSinceChange >= USERNAME_COOLDOWN_DAYS

  async function handleUsernameChange(e: React.FormEvent) {
    e.preventDefault()
    setUsernameMsg('')

    if (!canChangeUsername) {
      setUsernameMsg(`Kullanıcı adını en son değiştirdiğin üzerinden ${USERNAME_COOLDOWN_DAYS} gün geçmeden tekrar değiştiremezsin. ${USERNAME_COOLDOWN_DAYS - daysSinceChange} gün sonra tekrar dene.`)
      return
    }

    if (newUsername.trim().length < 3) {
      setUsernameMsg('Kullanıcı adı en az 3 karakter olmalı.')
      return
    }

    setUsernameLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername.trim(), username_changed_at: new Date().toISOString() })
      .eq('id', user!.id)

    setUsernameLoading(false)

    if (error) {
      setUsernameMsg('Bir hata oluştu: ' + error.message)
      return
    }

    setUsernameMsg('Kullanıcı adın güncellendi. Değişikliğin her yerde görünmesi için sayfayı yenile.')
    setNewUsername('')
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault()
    setEmailMsg('')

    if (!newEmail.includes('@')) {
      setEmailMsg('Geçerli bir e-posta adresi gir.')
      return
    }

    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setEmailLoading(false)

    if (error) {
      setEmailMsg('Bir hata oluştu: ' + error.message)
      return
    }

    setEmailMsg('Onay linki yeni e-posta adresine gönderildi. Linke tıklayınca değişiklik tamamlanacak.')
    setNewEmail('')
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg('')

    if (newPassword.length < 6) {
      setPasswordMsg('Şifre en az 6 karakter olmalı.')
      return
    }

    setPasswordLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordLoading(false)

    if (error) {
      setPasswordMsg('Bir hata oluştu: ' + error.message)
      return
    }

    setPasswordMsg('Şifren güncellendi.')
    setNewPassword('')
  }

  const sectionStyle: React.CSSProperties = {
    background: '#FBF9F1',
    border: '1px solid #DDD4BC',
    borderRadius: '6px',
    padding: '18px',
    marginBottom: '16px',
  }

  const labelStyle: React.CSSProperties = { fontSize: '12px', color: '#8A7F5C', margin: '0 0 4px' }
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #DDD4BC', borderRadius: '4px', marginBottom: '8px' }
  const buttonStyle: React.CSSProperties = { fontFamily: 'var(--font-plex-mono), monospace', fontSize: '12px', padding: '8px 16px', background: '#22211A', color: '#F1EEE4', border: 'none', borderRadius: '4px', cursor: 'pointer' }
  const msgStyle: React.CSSProperties = { fontSize: '12px', color: '#5C594A', marginTop: '8px' }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 28px 48px' }}>
      <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: '#8A7F5C', margin: '0 0 10px' }}>
        AYARLAR
      </p>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '28px', color: '#22211A', margin: '0 0 24px' }}>
        Hesap ayarların
      </h1>

      {/* Mevcut bilgiler */}
      <div style={sectionStyle}>
        <p style={labelStyle}>Kullanıcı adı</p>
        <p style={{ fontSize: '14px', color: '#22211A', margin: '0 0 12px' }}>{profile?.username ?? '—'}</p>

        <p style={labelStyle}>E-posta</p>
        <p style={{ fontSize: '14px', color: '#22211A', margin: 0 }}>{user.email}</p>
      </div>

      {/* Kullanıcı adı değiştir */}
      <div style={sectionStyle}>
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '15px', color: '#22211A', margin: '0 0 10px' }}>
          Kullanıcı adını değiştir
        </p>
        <p style={{ fontSize: '11px', color: '#8A7F5C', margin: '0 0 12px' }}>
          {canChangeUsername
            ? `Değiştirebilirsin (son ${USERNAME_COOLDOWN_DAYS} günde değişiklik yapmadın).`
            : `Son değişiklikten bu yana ${daysSinceChange} gün geçti. ${USERNAME_COOLDOWN_DAYS - daysSinceChange} gün sonra tekrar değiştirebilirsin.`}
        </p>
        <form onSubmit={handleUsernameChange}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Yeni kullanıcı adı"
            style={inputStyle}
            disabled={!canChangeUsername}
          />
          <button type="submit" style={buttonStyle} disabled={usernameLoading || !canChangeUsername}>
            {usernameLoading ? 'Güncelleniyor...' : 'Kaydet'}
          </button>
          {usernameMsg && <p style={msgStyle}>{usernameMsg}</p>}
        </form>
      </div>

      {/* E-posta değiştir */}
      <div style={sectionStyle}>
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '15px', color: '#22211A', margin: '0 0 10px' }}>
          E-posta adresini değiştir
        </p>
        <form onSubmit={handleEmailChange}>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="yeni@eposta.com"
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle} disabled={emailLoading}>
            {emailLoading ? 'Gönderiliyor...' : 'Değiştir'}
          </button>
          {emailMsg && <p style={msgStyle}>{emailMsg}</p>}
        </form>
      </div>

      {/* Şifre değiştir */}
      <div style={sectionStyle}>
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '15px', color: '#22211A', margin: '0 0 10px' }}>
          Şifreni değiştir
        </p>
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Yeni şifre"
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle} disabled={passwordLoading}>
            {passwordLoading ? 'Güncelleniyor...' : 'Kaydet'}
          </button>
          {passwordMsg && <p style={msgStyle}>{passwordMsg}</p>}
        </form>
      </div>
    </div>
  )
}