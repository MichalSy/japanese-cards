import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)

  const { data, error } = await supabase
    .from('language_cards_categories')
    .select(`slug, native_name, emoji, card_type, is_active, language_cards_category_translations (lang_code, name, description)`)
    .eq('language_id', 'ja')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const pick = (arr: any[]) => arr?.find((x) => x.lang_code === lang) ?? arr?.find((x) => x.lang_code === 'en') ?? {}

  const categories = data.map((cat) => {
    const t = pick((cat as any).language_cards_category_translations ?? [])
    return {
      id: cat.slug,
      native_name: cat.native_name,
      name: t.name ?? cat.native_name,
      description: t.description ?? '',
      emoji: cat.emoji,
      card_type: cat.card_type,
      enabled: cat.is_active,
    }
  })

  return NextResponse.json({ categories })
})
