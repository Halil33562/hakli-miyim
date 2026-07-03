'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSidebar } from '@/context/SidebarContext'
import { CATEGORIES } from '@/lib/categories'

export default function Sidebar() {
  const { open, close } = useSidebar()
const { user, profile, signOut } = useAuth()
const isAdmin = profile?.is_admin === true
  return (
    <>
      {open && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, background: 'rgba(23,23,31,0.35)', zIndex: 40 }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: open ? 0 : '-280px',
          width: '260px',
          height: '100%',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          zIndex: 50,
          transition: 'left 0.25s ease',
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <p style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)', margin: '0 0 20px', padding: '0 8px' }}>
          Haklı mıyım?
        </p>

        {user && (
          <Link href="/profil" onClick={close} style={{ padding: '10px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
            👤 {profile?.username ?? 'Profilim'}
          </Link>
        )}

        <Link href="/ayarlar" onClick={close} style={{ padding: '10px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '14px' }}>
          ⚙️ Ayarlar
        </Link>

        {isAdmin && (
          <Link href="/admin" onClick={close} style={{ padding: '10px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--negatif)', fontSize: '14px' }}>
            🚩 Admin panel
          </Link>
        )}

        <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '10px', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '20px 0 6px', padding: '0 10px' }}>
          KATEGORİLER
        </p>

        {CATEGORIES.filter((c) => c.key !== 'tumu').map((c) => (
          <Link
            key={c.key}
            href={`/?category=${c.key}`}
            onClick={close}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '13px' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, display: 'inline-block' }} />
            {c.label}
          </Link>
        ))}

        {user && (
          <button
            onClick={() => { signOut(); close() }}
            style={{ marginTop: 'auto', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', padding: '10px 10px', cursor: 'pointer' }}
          >
            Çıkış yap
          </button>
        )}
      </div>
    </>
  )
}