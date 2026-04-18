import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

const COOKIE = 'jc_lang'
const COOKIE_OPTS = 'Path=/; SameSite=Lax; Max-Age=31536000'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()

  let { data: settings } = await supabase
    .from('language_cards_user_settings')
    .select('ui_language, learn_language_id')
    .eq('user_id', user.id)
    .single()

  if (!settings) {
    await supabase
      .from('language_cards_user_settings')
      .insert({ user_id: user.id, ui_language: 'de', learn_language_id: 'ja' })
    settings = { ui_language: 'de', learn_language_id: 'ja' }
  }

  return NextResponse.json(settings, {
    headers: { 'Set-Cookie': `${COOKIE}=${settings.ui_language}; ${COOKIE_OPTS}` },
  })
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

  return NextResponse.json({ ok: true }, {
    headers: body.ui_language
      ? { 'Set-Cookie': `${COOKIE}=${body.ui_language}; ${COOKIE_OPTS}` }
      : {},
  })
})
