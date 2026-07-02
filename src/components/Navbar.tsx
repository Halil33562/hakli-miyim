'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth()

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', borderBottom: '1px solid #DDD4BC', background: '#EFE9DA' }}>
      <Link href="/" style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 600, fontSize: '20px', color: '#2B2A22', textDecoration: 'none' }}>
        Haklı mıyım?
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#5C594A' }}>
        {loading ? null : user ? (
          <>
            <span>{profile?.username ?? 'Kullanıcı'}</span>
            <button
              onClick={signOut}
              style={{ border: '1px solid #B8AF93', borderRadius: '4px', padding: '6px 14px', color: '#2B2A22', fontWeight: 500, background: 'transparent', cursor: 'pointer', fontSize: '13px' }}
            >
              Çıkış yap
            </button>
          </>
        ) : (
          <>
            <Link href="/giris" style={{ color: '#2B2A22', textDecoration: 'none' }}>Giriş yap</Link>
            <Link href="/kayit" style={{ border: '1px solid #B8AF93', borderRadius: '4px', padding: '6px 14px', color: '#2B2A22', fontWeight: 500, textDecoration: 'none' }}>
              Kayıt ol
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}