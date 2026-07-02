import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import CommentForm from '@/components/CommentForm'

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (postError || !post) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <p>Gönderi bulunamadı.</p>
      </div>
    )
  }

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <PostCard post={post} />

      <h3 style={{ marginTop: '2rem' }}>
        Yorumlar ({comments?.length ?? 0})
      </h3>

      <CommentForm postId={post.id} />

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {comments?.length === 0 && <p>Henüz yorum yok, ilk yorumu sen yaz.</p>}

        {comments?.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: '1px solid #eee',
              borderRadius: '6px',
              padding: '0.75rem',
            }}
          >
            <strong>{comment.author_name}</strong>
            <p style={{ margin: '0.25rem 0 0' }}>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}