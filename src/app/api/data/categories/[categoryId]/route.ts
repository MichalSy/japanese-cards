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

  const groupCardSelect = includeItems
    ? `slug, sort_order, section_id,
       language_cards_group_translations (lang_code, name),
       language_cards_cards (slug, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active,
         language_cards_card_translations (lang_code, translation, example_translation))`
    : `slug, sort_order, section_id, language_cards_group_translations (lang_code, name)`

  const { data: cat, error } = await supabase
    .from('language_cards_categories')
    .select(`
      slug, native_name, emoji, color, card_type, game_modes, show_all_option, is_active,
      language_cards_category_translations (lang_code, name, description),
      language_cards_sections (slug, sort_order, language_cards_section_translations (lang_code, name, description)),
      language_cards_groups (${groupCardSelect})
    `)
    .eq('language_id', 'ja')
    .eq('slug', categoryId)
    .single()

  if (error || !cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ct = pick((cat as any).language_cards_category_translations ?? [])

  // Build group map
  const rawGroups = ((cat as any).language_cards_groups ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)

  const mapGroupItems = (g: any) => {
    if (!includeItems) return {}
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
        }
      })
    return { items }
  }

  // Sections with their groups
  const sections = ((cat as any).language_cards_sections ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((s: any) => {
      const st = pick(s.language_cards_section_translations ?? [])
      const sectionGroups = rawGroups
        .filter((g: any) => g.section_id === s.id)
        .map((g: any) => {
          const gt = pick(g.language_cards_group_translations ?? [])
          return { id: g.slug, name: gt.name ?? g.slug, ...mapGroupItems(g) }
        })
      const totalItems = includeItems
        ? sectionGroups.reduce((n: number, g: any) => n + (g.items?.length ?? 0), 0)
        : null
      return { id: s.slug, name: st.name ?? s.slug, description: st.description ?? '', groups: sectionGroups, ...(totalItems !== null ? { item_count: totalItems } : {}) }
    })

  // All groups (flat, for individual row navigation)
  const groups = rawGroups.map((g: any) => {
    const gt = pick(g.language_cards_group_translations ?? [])
    return { id: g.slug, name: gt.name ?? g.slug, section_id: g.section_id ?? null, ...mapGroupItems(g) }
  })

  return NextResponse.json({
    id: cat.slug,
    native_name: cat.native_name,
    name: ct.name ?? cat.native_name,
    description: ct.description ?? '',
    emoji: cat.emoji,
    color: cat.color,
    cardType: cat.card_type,
    enabled: cat.is_active,
    showAllOption: cat.show_all_option,
    gameModes: cat.game_modes ?? [],
    sections,
    groups,
  })
})
