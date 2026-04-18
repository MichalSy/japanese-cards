import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)

  const { data, error } = await supabase
    .from('language_cards_languages')
    .select('id, name_en, name_de, name_native, flag_emoji, is_ui_language, is_learn_language')
    .eq('is_active', true)
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const getName = (row: any) => (lang === 'de' ? row.name_de : row.name_en) ?? row.name_en ?? row.name_native

  const ui_languages = data
    .filter((r) => r.is_ui_language)
    .map((r) => ({ id: r.id, name: getName(r), native_name: r.name_native, flag: r.flag_emoji }))

  const learn_languages = data
    .filter((r) => r.is_learn_language)
    .map((r) => ({ id: r.id, name: getName(r), native_name: r.name_native, flag: r.flag_emoji }))

  return NextResponse.json({ ui_languages, learn_languages })
})
