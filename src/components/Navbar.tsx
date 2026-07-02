'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth()

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #ccc' }}>
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
        Haklı mıyım?
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {loading ? null : user ? (
          <>
            <span>{profile?.username ?? 'Kullanıcı'}</span>
            <button onClick={signOut}>Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link href="/giris">Giriş Yap</Link>
            <Link href="/kayit">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  )
}