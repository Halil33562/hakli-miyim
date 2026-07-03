'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSidebar } from '@/context/SidebarContext'

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const { toggle } = useSidebar()

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={toggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px', color: 'var(--text-secondary)' }}
          aria-label="Menü"
        >
          ☰
        </button>
        <Link href="/" style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>
          Haklı mıyım?
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
        {loading ? null : user ? (
          <button
            onClick={signOut}
            style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '7px 16px', color: 'var(--text-primary)', fontWeight: 500, background: 'transparent', cursor: 'pointer', fontSize: '13px' }}
          >
            Çıkış yap
          </button>
        ) : (
          <>
            <Link href="/giris" style={{ color: 'var(--text-secondary)', fontWeight: 500, padding: '7px 10px' }}>Giriş yap</Link>
            <Link href="/kayit" style={{ background: 'var(--brand)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '8px 16px', fontWeight: 600 }}>
              Kayıt ol
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}