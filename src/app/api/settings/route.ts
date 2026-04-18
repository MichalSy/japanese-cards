import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings, invalidateCache } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const settings = await resolveSettings(user.id, supabase)
  return NextResponse.json(settings)
})

export const POST = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const body = await req.json()
  const supabase = await createServerSupabaseClient()

  const update: Record<string, string> = {}
  if (body.ui_language) update.ui_language = body.ui_language
  if (body.learn_language_id) update.learn_language_id = body.learn_language_id

  await supabase
    .from('language_cards_user_settings')
    .upsert({ user_id: user.id, ...update, updated_at: new Date().toISOString() })

  invalidateCache(user.id)
  return NextResponse.json({ ok: true })
})
