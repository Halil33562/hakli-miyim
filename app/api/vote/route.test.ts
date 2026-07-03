import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { postId, voteType, token, anonId } = await request.json()

    if (typeof postId !== 'number' || (voteType !== 'up' && voteType !== 'down') || !token || !anonId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Turnstile token'ı sunucuda doğrula
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
      return NextResponse.json({ error: 'Doğrulama başarısız' }, { status: 403 })
    }

    // Aynı anon kullanıcı bu posta zaten oy vermiş mi?
    const { data: existing } = await supabase
      .from('votes')
      .select('id')
      .eq('post_id', postId)
      .eq('anon_id', anonId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Zaten oy vermişsin' }, { status: 409 })
    }

    // Atomik artırım için RPC kullan (aşağıda açıklıyorum)
    const { data: newValue, error: rpcError } = await supabase.rpc('increment_vote', {
      p_post_id: postId,
      p_vote_type: voteType,
    })

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 })
    }

    await supabase.from('votes').insert({ post_id: postId, vote_type: voteType, anon_id: anonId })

    return NextResponse.json({ success: true, newValue })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}