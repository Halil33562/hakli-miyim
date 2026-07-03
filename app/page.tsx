import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

const PAGE_SIZE = 9

const CATEGORIES = [
  { key: 'tumu', label: 'Tümü' },
  { key: 'aile', label: 'Aile' },
  { key: 'is', label: 'İş' },
  { key: 'arkadaslik', label: 'Arkadaşlık' },
  { key: 'iliski', label: 'İlişki' },
  { key: 'para', label: 'Para' },
  { key: 'diger', label: 'Diğer' },
]

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
    { key: 'belirsiz', label: 'Kazananı belirsiz' },
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
      <div style={{ padding: '40px 28px 32px', borderBottom: '1px solid #DDD4BC', maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '11px', letterSpacing: '0.06em', color: '#8A7F5C', margin: '0 0 10px' }}>
          Halk mahkemesi · herkes oy verir
        </p>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '34px', lineHeight: 1.15, color: '#22211A', margin: '0 0 12px', maxWidth: '420px' }}>
          Olayını anlat,<br />karar halkın olsun.
        </h1>
        <p style={{ fontSize: '14px', color: '#5C594A', margin: '0 0 20px', maxWidth: '380px', lineHeight: 1.6 }}>
          Başına geleni yaz, herkes "haklısın" ya da "haksızsın" mührünü bassın.
        </p>
        <Link href="/yeni-gonderi">
          <button style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '12px', letterSpacing: '0.04em', background: '#22211A', color: '#F1EEE4', border: 'none', borderRadius: '4px', padding: '11px 20px', cursor: 'pointer' }}>
            + Dava aç
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 28px 0' }}>
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
              padding: '9px 12px',
              fontSize: '13px',
              border: '1px solid #DDD4BC',
              borderRadius: '4px',
              background: '#FBF9F1',
            }}
          />
          <button
            type="submit"
            style={{
              fontFamily: 'var(--font-plex-mono), monospace',
              fontSize: '12px',
              padding: '9px 16px',
              background: '#22211A',
              color: '#F1EEE4',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ara
          </button>
        </form>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {tabs.map((tab) => {
            const active = activeFilter === tab.key
            return (
              <Link key={tab.key} href={buildUrl({ filter: tab.key, page: '1' })} style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-plex-mono), monospace',
                    fontSize: '12px',
                    padding: '7px 14px',
                    borderRadius: '4px',
                    background: active ? '#22211A' : 'transparent',
                    color: active ? '#F1EEE4' : '#8A7F5C',
                    border: active ? 'none' : '1px solid #DDD4BC',
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
              <Link key={c.key} href={buildUrl({ category: c.key, page: '1' })} style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-plex-mono), monospace',
                    fontSize: '11px',
                    padding: '5px 11px',
                    borderRadius: '3px',
                    background: active ? '#5C594A' : 'transparent',
                    color: active ? '#F1EEE4' : '#8A7F5C',
                    border: active ? 'none' : '1px solid #DDD4BC',
                  }}
                >
                  {c.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '24px 28px 24px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayPosts.length === 0 && (
          <p style={{ color: '#5C594A', fontSize: '14px' }}>
            {searchQuery ? 'Bu aramayla eşleşen dava yok.' : activeFilter === 'belirsiz' ? 'Henüz yeterince oy almış dava yok.' : 'Henüz dava yok, ilkini sen aç.'}
          </p>
        )}

        {displayPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 28px 48px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {currentPage > 1 && (
            <Link href={buildUrl({ page: String(currentPage - 1) })} style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '12px', padding: '8px 14px', border: '1px solid #DDD4BC', borderRadius: '4px', color: '#22211A' }}>
                ← Önceki
              </span>
            </Link>
          )}
          <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '12px', padding: '8px 14px', color: '#8A7F5C' }}>
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={buildUrl({ page: String(currentPage + 1) })} style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '12px', padding: '8px 14px', border: '1px solid #DDD4BC', borderRadius: '4px', color: '#22211A' }}>
                Sonraki →
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}