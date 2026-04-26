import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

function mapCard(card: any, lang: string, groupName?: string) {
  const pick = (arr: any[]) => arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}
  const ct = pick(card.language_cards_card_translations ?? [])
  return {
    id: card.slug, native: card.native, transliteration: card.transliteration ?? null,
    word_type: card.word_type ?? null, example_native: card.example_native ?? null,
    translation: ct.translation ?? null, example_translation: ct.example_translation ?? null,
    difficulty: card.difficulty ?? null, context: card.context ?? null,
    group_name: groupName ?? null,
  }
}

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const { categoryId, groupId } = await context.params
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)
  const pick = (arr: any[]) => arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}

  const { data: cat } = await supabase
    .from('language_cards_categories')
    .select('id, card_type')
    .eq('language_id', 'ja').eq('slug', categoryId).single()

  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (groupId === 'all') {
    const { data: practiceGroups, error: practiceError } = await supabase
      .from('language_cards_practice_groups')
      .select(`slug, sort_order, language_cards_practice_group_translations (lang_code, name),
               language_cards_practice_group_cards (sort_order,
                 language_cards_cards (slug, card_type, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active, language_cards_card_translations (lang_code, translation, example_translation)))`)
      .eq('category_id', cat.id)
      .order('sort_order')

    if (!practiceError) {
      const items = (practiceGroups ?? []).flatMap((g: any) => {
        const gName = pick(g.language_cards_practice_group_translations ?? []).name ?? g.slug
        return (g.language_cards_practice_group_cards ?? [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((entry: any) => entry.language_cards_cards)
          .filter((c: any) => c?.is_active && c.card_type === cat.card_type)
          .map((c: any) => mapCard(c, lang, gName))
      })

      return NextResponse.json({
        id: `${categoryId}-all`,
        name: lang === 'de' ? 'Alle kombiniert' : 'All combined',
        card_type: cat.card_type, items,
      })
    }

    const { data: groups } = await supabase
      .from('language_cards_groups')
      .select(`slug, sort_order, language_cards_group_translations (lang_code, name),
               language_cards_cards (slug, card_type, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active, language_cards_card_translations (lang_code, translation, example_translation))`)
      .eq('category_id', cat.id).order('sort_order')

    const items = (groups ?? []).flatMap((g: any) => {
      const gName = pick(g.language_cards_group_translations ?? []).name ?? g.slug
      return (g.language_cards_cards ?? [])
        .filter((c: any) => c.is_active && c.card_type === cat.card_type)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((c: any) => mapCard(c, lang, gName))
    })

    return NextResponse.json({
      id: `${categoryId}-all`,
      name: lang === 'de' ? 'Alle kombiniert' : 'All combined',
      card_type: cat.card_type, items,
    })
  }

  const { data: practiceGroup, error: practiceGroupError } = await supabase
    .from('language_cards_practice_groups')
    .select(`slug, language_cards_practice_group_translations (lang_code, name),
             language_cards_categories!inner (slug, card_type),
             language_cards_practice_group_cards (sort_order,
               language_cards_cards (slug, card_type, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active, language_cards_card_translations (lang_code, translation, example_translation)))`)
    .eq('slug', groupId)
    .eq('language_cards_categories.slug', categoryId)
    .single()

  if (!practiceGroupError && practiceGroup) {
    const cardType = (practiceGroup as any).language_cards_categories?.card_type ?? 'character'
    const gt = pick((practiceGroup as any).language_cards_practice_group_translations ?? [])
    const groupName = gt.name ?? groupId

    const items = ((practiceGroup as any).language_cards_practice_group_cards ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((entry: any) => entry.language_cards_cards)
      .filter((c: any) => c?.is_active && c.card_type === cardType)
      .map((c: any) => mapCard(c, lang, groupName))

    return NextResponse.json({ id: `${categoryId}-${groupId}`, name: groupName, card_type: cardType, items })
  }

  const { data: group, error } = await supabase
    .from('language_cards_groups')
    .select(`slug, language_cards_group_translations (lang_code, name),
             language_cards_categories!inner (slug, card_type),
             language_cards_cards (slug, card_type, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active, language_cards_card_translations (lang_code, translation, example_translation))`)
    .eq('slug', groupId).eq('language_cards_categories.slug', categoryId).single()

  if (error || !group) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const cardType = (group as any).language_cards_categories?.card_type ?? 'character'
  const gt = pick((group as any).language_cards_group_translations ?? [])
  const groupName = gt.name ?? groupId

  const items = ((group as any).language_cards_cards ?? [])
    .filter((c: any) => c.is_active && c.card_type === cardType)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((c: any) => mapCard(c, lang, groupName))

  return NextResponse.json({ id: `${categoryId}-${groupId}`, name: groupName, card_type: cardType, items })
})
