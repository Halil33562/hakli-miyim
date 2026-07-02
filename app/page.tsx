import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p>Hata oluştu: {error.message}</p>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Haklı mıyım?</h1>

      <Link href="/yeni-gonderi">
        <button style={{ marginBottom: '1rem' }}>+ Yeni Gönderi Ekle</button>
      </Link>

      {posts?.length === 0 && <p>Henüz gönderi yok.</p>}

      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}