// app/ayarlar/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useTranslation } from '@/lib/useTranslation'

const USERNAME_COOLDOWN_DAYS = 7
const GENDERS = [
  { key: 'belirtmek_istemiyorum', label: 'Belirtmek istemiyorum' },
  { key: 'kadın', label: 'Kadın' },
  { key: 'erkek', label: 'Erkek' },
  { key: 'diğer', label: 'Diğer' },
]

export default function AyarlarPage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const { lang, toggleLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState('')

  const [bio, setBio] = useState(profile?.bio ?? '')
  const [bioMsg, setBioMsg] = useState('')
  const [bioLoading, setBioLoading] = useState(false)

  const [gender, setGender] = useState(profile?.gender ?? 'belirtmek_istemiyorum')
  const [genderMsg, setGenderMsg] = useState('')

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
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {t('settings.loginRequired')}{' '}
          <Link href="/giris" style={{ color: 'var(--brand)', fontWeight: 600 }}>
            {t('nav.login')}
          </Link>
        </p>
      </div>
    )
  }

  const lastChanged = profile?.username_changed_at ? new Date(profile.username_changed_at) : null
  const daysSinceChange = lastChanged
    ? Math.floor((Date.now() - lastChanged.getTime()) / (1000 * 60 * 60 * 24))
    : USERNAME_COOLDOWN_DAYS
  const canChangeUsername = daysSinceChange >= USERNAME_COOLDOWN_DAYS

  // ===== FONKSİYONLAR =====
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setAvatarMsg('Dosya 2MB\'den küçük olmalı.')
      return
    }

    setAvatarUploading(true)
    setAvatarMsg('')

    const ext = file.name.split('.').pop()
    const path = `${user!.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setAvatarMsg('Yükleme hatası: ' + uploadError.message)
      setAvatarUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user!.id)

    setAvatarUploading(false)

    if (updateError) {
      setAvatarMsg('Kaydetme hatası: ' + updateError.message)
      return
    }

    setAvatarMsg('Kaydedildi.')
    await refreshProfile()
  }

  async function handleBioSave(e: React.FormEvent) {
    e.preventDefault()
    setBioMsg('')

    if (bio.length > 200) {
      setBioMsg('En fazla 200 karakter.')
      return
    }

    setBioLoading(true)
    const { error } = await supabase.from('profiles').update({ bio: bio.trim() }).eq('id', user!.id)
    setBioLoading(false)

    if (error) {
      setBioMsg('Hata: ' + error.message)
      return
    }

    setBioMsg('Kaydedildi.')
    await refreshProfile()
  }

  async function handleGenderSave(selected: string) {
    setGender(selected)
    setGenderMsg('')
    const { error } = await supabase.from('profiles').update({ gender: selected }).eq('id', user!.id)
    if (error) {
      setGenderMsg('Hata: ' + error.message)
      return
    }
    setGenderMsg('Kaydedildi.')
    await refreshProfile()
  }

  async function handleUsernameChange(e: React.FormEvent) {
    e.preventDefault()
    setUsernameMsg('')

    if (!canChangeUsername) {
      setUsernameMsg(`${USERNAME_COOLDOWN_DAYS - daysSinceChange} gün sonra tekrar dene.`)
      return
    }

    if (newUsername.trim().length < 3) {
      setUsernameMsg('En az 3 karakter olmalı.')
      return
    }

    setUsernameLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername.trim(), username_changed_at: new Date().toISOString() })
      .eq('id', user!.id)
    setUsernameLoading(false)

    if (error) {
      setUsernameMsg('Hata: ' + error.message)
      return
    }

    setUsernameMsg('Güncellendi.')
    setNewUsername('')
    await refreshProfile()
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault()
    setEmailMsg('')

    if (!newEmail.includes('@')) {
      setEmailMsg('Geçerli bir e-posta gir.')
      return
    }

    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setEmailLoading(false)

    if (error) {
      setEmailMsg('Hata: ' + error.message)
      return
    }

    setEmailMsg('Onay linki gönderildi.')
    setNewEmail('')
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg('')

    if (newPassword.length < 6) {
      setPasswordMsg('En az 6 karakter olmalı.')
      return
    }

    setPasswordLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordLoading(false)

    if (error) {
      setPasswordMsg('Hata: ' + error.message)
      return
    }

    setPasswordMsg('Güncellendi.')
    setNewPassword('')
  }

  // ===== STILLER =====
  const sectionStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '18px',
    marginBottom: '16px'
  }

  const miniCardStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '8px'
  }

  const buttonStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    padding: '9px 16px',
    background: 'var(--brand)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer'
  }

  const msgStyle: React.CSSProperties = {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '6px'
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-fraunces), sans-serif',
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--text-primary)',
    margin: '0 0 10px'
  }

  // ===== RENDER =====
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 28px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 800, fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 20px' }}>
        {t('settings.title')}
      </h1>

      {/* DİL + TEMA KARTI */}
      <div style={{ ...sectionStyle, display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <p style={titleStyle}>🌐 {t('settings.language')}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{t('settings.languageDesc')}</p>
          </div>
          <button
            onClick={toggleLang}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--brand)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {lang === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <p style={titleStyle}>🎨 {t('settings.theme')}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{t('settings.themeDesc')}</p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              fontSize: '20px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* PROFİL KARTI */}
      <div style={{ ...sectionStyle, display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 140px', textAlign: 'center' }}>
          <img
            src={profile?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + (profile?.username ?? 'U')}
            alt="avatar"
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', marginBottom: '10px' }}
          />
          <label style={{ ...buttonStyle, display: 'inline-block', fontSize: '11px', padding: '7px 12px' }}>
            {avatarUploading ? 'Yükleniyor...' : t('settings.avatar')}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={avatarUploading} />
          </label>
          {avatarMsg && <p style={msgStyle}>{avatarMsg}</p>}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <form onSubmit={handleBioSave} style={{ marginBottom: '14px' }}>
            <p style={titleStyle}>{t('settings.bio')}</p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('form.bio.placeholder')}
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '6px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="submit" style={{ ...buttonStyle, fontSize: '11px', padding: '7px 14px' }} disabled={bioLoading}>
                {bioLoading ? '...' : t('button.save')}
              </button>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{bio.length}/200</span>
              {bioMsg && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{bioMsg}</span>}
            </div>
          </form>

          <p style={titleStyle}>{t('settings.gender')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {GENDERS.map((g) => {
              const labelMap: Record<string, string> = {
                'belirtmek_istemiyorum': t('settings.gender.none'),
                'kadın': t('settings.gender.female'),
                'erkek': t('settings.gender.male'),
                'diğer': t('settings.gender.other'),
              }
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => handleGenderSave(g.key)}
                  style={{
                    fontSize: '11px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: gender === g.key ? 'var(--brand)' : 'var(--bg)',
                    color: gender === g.key ? '#fff' : 'var(--text-secondary)',
                    border: gender === g.key ? 'none' : '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                >
                  {labelMap[g.key] || g.label}
                </button>
              )
            })}
          </div>
          {genderMsg && <p style={msgStyle}>{genderMsg}</p>}
        </div>
      </div>

      {/* HESAP AYARLARI GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {/* Kullanıcı Adı */}
        <div style={miniCardStyle}>
          <p style={titleStyle}>{t('settings.username')}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 8px' }}>
            {canChangeUsername ? t('settings.usernameChange') : t('settings.usernameWait', { days: USERNAME_COOLDOWN_DAYS - daysSinceChange })}
          </p>
          <form onSubmit={handleUsernameChange}>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={profile?.username ?? 'Yeni ad'}
              style={inputStyle}
              disabled={!canChangeUsername}
            />
            <button type="submit" style={{ ...buttonStyle, width: '100%' }} disabled={usernameLoading || !canChangeUsername}>
              {usernameLoading ? '...' : t('button.save')}
            </button>
            {usernameMsg && <p style={msgStyle}>{usernameMsg}</p>}
          </form>
        </div>

        {/* E-posta */}
        <div style={miniCardStyle}>
          <p style={titleStyle}>{t('settings.email')}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 8px' }}>{user.email}</p>
          <form onSubmit={handleEmailChange}>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t('form.newEmail')}
              style={inputStyle}
            />
            <button type="submit" style={{ ...buttonStyle, width: '100%' }} disabled={emailLoading}>
              {emailLoading ? '...' : t('button.change')}
            </button>
            {emailMsg && <p style={msgStyle}>{emailMsg}</p>}
          </form>
        </div>

        {/* Şifre */}
        <div style={miniCardStyle}>
          <p style={titleStyle}>{t('settings.password')}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 8px' }}>{t('settings.passwordMin')}</p>
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('form.newPassword')}
              style={inputStyle}
            />
            <button type="submit" style={{ ...buttonStyle, width: '100%' }} disabled={passwordLoading}>
              {passwordLoading ? '...' : t('button.save')}
            </button>
            {passwordMsg && <p style={msgStyle}>{passwordMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}