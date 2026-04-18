import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'
import { translations } from '@/lib/translations'

// Returns both user settings and UI translations in one request.
// Backend knows the user from the auth token and picks the right language automatically.
export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const settings = await resolveSettings(user.id, supabase)

  const { data: lang } = await supabase
    .from('language_cards_languages')
    .select('name_en, name_de, app_icon, flag_emoji')
    .eq('id', settings.learn_language_id)
    .single()

  return NextResponse.json({
    // Settings
    ui_language: settings.ui_language,
    learn_language_id: settings.learn_language_id,
    learn_language: lang ?? null,
    // Translations for the user's language
    strings: translations[settings.ui_language] ?? translations.en,
  })
})
