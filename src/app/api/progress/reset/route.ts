import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

export const DELETE = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()

  await Promise.all([
    supabase.from('language_cards_user_card_progress').delete().eq('user_id', user.id),
    supabase.from('language_cards_category_snapshots').delete().eq('user_id', user.id),
    supabase.from('language_cards_user_sessions').delete().eq('user_id', user.id),
  ])

  return NextResponse.json({ ok: true })
})
