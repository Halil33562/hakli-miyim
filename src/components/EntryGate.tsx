'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'hmy_entered'

const QUOTES: {
  text: string
  rotate: number
  top?: string
  bottom?: string
  left?: string
  right?: string
  hideOnMobile?: boolean
}[] = [
  { text: '"Kardeşim düğünüme geç kaldı diye küstüm, haksız mıyım?"', rotate: -6, top: '9%', left: '5%' },
  { text: '"Ev arkadaşım hiç bulaşık yıkamıyor, haklı mıyım?"', rotate: 5, top: '14%', right: '4%', hideOnMobile: true },
  { text: '"Arkadaşımın doğum gününü unuttum, ne kadar haksızım?"', rotate: -4, bottom: '20%', left: '4%', hideOnMobile: true },
  { text: '"Patronumdan zam istedim, tepkisi çok sertti, haksız mıyım?"', rotate: 6, bottom: '12%', right: '5%' },
  { text: '"Eski sevgilimle takılan arkadaşıma küstüm, haklı mıyım?"', rotate: -8, top: '46%', left: '2%', hideOnMobile: true },
]

export default function EntryGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [showGate, setShowGate] = useState(false)

  useEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY)
    setShowGate(seen !== '1')
    setReady(true)
  }, [])

  function enter() {
    window.localStorage.setItem(STORAGE_KEY, '1')
    setShowGate(false)
  }

  if (!ready) return null

  if (!showGate) return <>{children}</>

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {QUOTES.map((q, i) => (
        <div
          key={i}
          className={q.hideOnMobile ? 'hidden md:block' : ''}
          style={{
            position: 'absolute',
            top: q.top,
            bottom: q.bottom,
            left: q.left,
            right: q.right,
            transform: `rotate(${q.rotate}deg)`,
            maxWidth: '220px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '14px 16px',
            fontFamily: 'var(--font-fraunces), sans-serif',
            fontSize: '13px',
            lineHeight: 1.45,
            color: 'var(--text-secondary)',
            pointerEvents: 'none',
          }}
        >
          {q.text}
        </div>
      ))}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '32px',
          maxWidth: '420px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: 'var(--brand)',
            fontWeight: 600,
            margin: '0 0 14px',
          }}
        >
          Gerçek olaylar · gerçek oylar
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces), sans-serif',
            fontWeight: 800,
            fontSize: '42px',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            margin: '0 0 14px',
          }}
        >
          Haklı mıyım?
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: '0 0 28px',
            lineHeight: 1.6,
          }}
        >
          Devam etmeden önce nasıl gitmek istersin? İstersen kimliğini hiç açmadan da katılabilirsin.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
          <button
            onClick={enter}
            style={{
              fontSize: '14px',
              fontWeight: 600,
              background: 'var(--brand)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '13px 22px',
              cursor: 'pointer',
            }}
          >
            Anonim devam et
          </button>
          <Link href="/giris" onClick={enter}>
            <span
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '12px 22px',
                color: 'var(--text-primary)',
                background: 'var(--surface)',
              }}
            >
              Giriş yap
            </span>
          </Link>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '18px' }}>
          Hesabın yok mu?{' '}
          <Link href="/kayit" onClick={enter} style={{ color: 'var(--brand)', fontWeight: 600 }}>
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  )
}