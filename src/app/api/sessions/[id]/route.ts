export const dynamic = 'force-dynamic'

import { createDataClient } from '@/lib/auth'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const PATCH = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const { id } = await context.params
  const body = await req.json()
  const supabase = createDataClient()

  const ended_at = new Date().toISOString()

  const { error } = await supabase
    .from('language_cards_user_sessions')
    .update({
      ended_at,
      cards_reviewed: body.cards_reviewed ?? 0,
      cards_correct: body.cards_correct ?? 0,
      duration_seconds: body.duration_seconds ?? null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
})
