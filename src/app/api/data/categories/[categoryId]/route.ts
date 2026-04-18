import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const { categoryId } = await context.params
  const includeItems = new URL(req.url).searchParams.get('items') === 'true'
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)
  const pick = (arr: any[]) => arr?.find((x) => x.lang_code === lang) ?? arr?.find((x) => x.lang_code === 'en') ?? {}

  const groupSelect = includeItems
    ? `slug, sort_order, language_cards_group_translations (lang_code, name),
       language_cards_cards (slug, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active,
         language_cards_card_translations (lang_code, translation, example_translation))`
    : `slug, sort_order, language_cards_group_translations (lang_code, name)`

  const { data: cat, error } = await supabase
    .from('language_cards_categories')
    .select(`
      slug, native_name, emoji, color, card_type, game_modes, show_all_option, is_active,
      language_cards_category_translations (lang_code, name, description),
      language_cards_groups (${groupSelect})
    `)
    .eq('language_id', 'ja')
    .eq('slug', categoryId)
    .single()

  if (error || !cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ct = pick((cat as any).language_cards_category_translations ?? [])

  const groups = ((cat as any).language_cards_groups ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((g: any) => {
      const gt = pick(g.language_cards_group_translations ?? [])
      const base = { id: g.slug, name: gt.name ?? g.slug }
      if (!includeItems) return base

      const items = (g.language_cards_cards ?? [])
        .filter((c: any) => c.is_active)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((c: any) => {
          const ct2 = pick(c.language_cards_card_translations ?? [])
          return {
            id: c.slug, native: c.native, transliteration: c.transliteration ?? null,
            word_type: c.word_type ?? null, example_native: c.example_native ?? null,
            translation: ct2.translation ?? null, example_translation: ct2.example_translation ?? null,
            difficulty: c.difficulty ?? null, context: c.context ?? null,
            group_name: gt.name ?? g.slug,
          }
        })
      return { ...base, items }
    })

  return NextResponse.json({
    id: cat.slug, native_name: cat.native_name,
    name: ct.name ?? cat.native_name, description: ct.description ?? '',
    emoji: cat.emoji, color: cat.color, cardType: cat.card_type,
    enabled: cat.is_active, showAllOption: cat.show_all_option,
    gameModes: cat.game_modes ?? [], groups,
  })
})
