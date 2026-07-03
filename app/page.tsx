import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

const PAGE_SIZE = 9

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string; category?: string; q?: string }>
}) {
  const { filter, page, category, q } = await searchParams
  const activeFilter = filter ?? 'yeni'
  const activeCategory = category ?? 'tumu'
  const searchQuery = q ?? ''
  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1)
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase.from('posts').select('*', { count: 'exact' })

  if (activeCategory !== 'tumu') {
    query = query.eq('category', activeCategory)
  }

  if (searchQuery.trim() !== '') {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
  }

  if (activeFilter === 'yeni') {
    query = query.order('created_at', { ascending: false })
  } else if (activeFilter === 'tartisilan') {
    query = query.order('total_votes', { ascending: false })
  } else if (activeFilter === 'belirsiz') {
    query = query.gte('total_votes', 3).order('created_at', { ascending: false })
  }

  const { data: posts, count, error } = await query.range(from, to)

  if (error) {
    return <p style={{ padding: '2rem' }}>Hata oluştu: {error.message}</p>
  }

  let displayPosts = posts ?? []

  if (activeFilter === 'belirsiz') {
    displayPosts = [...displayPosts].sort((a, b) => {
      const distA = Math.abs(50 - Math.round((a.upvotes / a.total_votes) * 100))
      const distB = Math.abs(50 - Math.round((b.upvotes / b.total_votes) * 100))
      return distA - distB
    })
  }

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))

  const tabs = [
    { key: 'yeni', label: 'Yeni' },
    { key: 'tartisilan', label: 'En çok tartışılan' },
    { key: 'belirsiz', label: 'Yakın oylar' },
  ]

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      filter: activeFilter,
      category: activeCategory,
      ...(searchQuery ? { q: searchQuery } : {}),
      ...overrides,
    })
    return `/?${params.toString()}`
  }

  return (
    <div>
      <div style={{ padding: '44px 28px 32px', maxWidth: '720px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--brand)', fontWeight: 600, margin: '0 0 10px' }}>
          Gerçek olaylar · gerçek oylar
        </p>
        <h1 style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 800, fontSize: '36px', lineHeight: 1.15, color: 'var(--text-primary)', margin: '0 0 12px', maxWidth: '440px' }}>
          Olayını anlat,<br />karar halkın olsun.
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 22px', maxWidth: '380px', lineHeight: 1.6 }}>
          Başına geleni yaz, herkes "haklısın" ya da "haksızsın" desin.
        </p>
        <Link href="/yeni-gonderi">
          <button style={{ fontSize: '13px', fontWeight: 600, background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px 22px', cursor: 'pointer' }}>
            + Paylaşım yap
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 28px' }}>
        <form action="/" method="GET" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input type="hidden" name="filter" value={activeFilter} />
          <input type="hidden" name="category" value={activeCategory} />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Anahtar kelime ile ara..."
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
            }}
          />
          <button
            type="submit"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '10px 18px',
              background: 'var(--text-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Ara
          </button>
        </form>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => {
            const active = activeFilter === tab.key
            return (
              <Link key={tab.key} href={buildUrl({ filter: tab.key, page: '1' })}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '8px 15px',
                    borderRadius: 'var(--radius-full)',
                    background: active ? 'var(--brand)' : 'var(--surface)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    border: active ? 'none' : '1px solid var(--border)',
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.key
            return (
              <Link key={c.key} href={buildUrl({ category: c.key, page: '1' })}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: active ? c.color : c.bg,
                    color: active ? '#fff' : c.color,
                  }}
                >
                  {c.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '24px 28px 24px', maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayPosts.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {searchQuery ? 'Bu aramayla eşleşen paylaşım yok.' : activeFilter === 'belirsiz' ? 'Henüz yeterince oy almış paylaşım yok.' : 'Henüz paylaşım yok, ilkini sen yap.'}
          </p>
        )}

        {displayPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 28px 48px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {currentPage > 1 && (
            <Link href={buildUrl({ page: String(currentPage - 1) })}>
              <span style={{ fontSize: '12px', fontWeight: 500, padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                ← Önceki
              </span>
            </Link>
          )}
          <span style={{ fontSize: '12px', padding: '8px 14px', color: 'var(--text-muted)' }}>
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={buildUrl({ page: String(currentPage + 1) })}>
              <span style={{ fontSize: '12px', fontWeight: 500, padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                Sonraki →
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}