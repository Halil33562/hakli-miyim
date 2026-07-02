import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { postId, voteType, token, anonId } = await req.json()

  if (!postId || !voteType || !token || !anonId) {
    return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 })
  }

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    }),
  })
  const verifyData = await verifyRes.json()

  if (!verifyData.success) {
    return NextResponse.json({ error: 'Bot doğrulaması başarısız.' }, { status: 403 })
  }

  const { data: existing } = await supabase
    .from('votes')
    .select('id')
    .eq('post_id', postId)
    .eq('anon_id', anonId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Bu gönderiye zaten oy verdin.' }, { status: 409 })
  }

  const { error: insertError } = await supabase.from('votes').insert({
    post_id: postId,
    vote_type: voteType,
    anon_id: anonId,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  const column = voteType === 'up' ? 'upvotes' : 'downvotes'
  const { data: post } = await supabase.from('posts').select(column).eq('id', postId).single()
  const currentValue = (post as any)?.[column] ?? 0
  const newValue = currentValue + 1

  await supabase.from('posts').update({ [column]: newValue }).eq('id', postId)

  return NextResponse.json({ success: true, newValue })
}