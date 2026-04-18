import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const { categoryId } = await context.params
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)

  const { data: cat, error } = await supabase
    .from('language_cards_categories')
    .select(`
      slug, native_name, emoji, color, card_type, game_modes, show_all_option, is_active,
      language_cards_category_translations (lang_code, name, description),
      language_cards_groups (slug, sort_order, language_cards_group_translations (lang_code, name))
    `)
    .eq('language_id', 'ja')
    .eq('slug', categoryId)
    .single()

  if (error || !cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const pick = (arr: any[]) => arr?.find((x) => x.lang_code === lang) ?? arr?.find((x) => x.lang_code === 'en') ?? {}
  const ct = pick((cat as any).language_cards_category_translations ?? [])

  const groups = ((cat as any).language_cards_groups ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((g: any) => {
      const gt = pick(g.language_cards_group_translations ?? [])
      return { id: g.slug, name: gt.name ?? g.slug }
    })

  return NextResponse.json({
    id: cat.slug,
    native_name: cat.native_name,
    name: ct.name ?? cat.native_name,
    description: ct.description ?? '',
    emoji: cat.emoji,
    color: cat.color,
    card_type: cat.card_type,
    enabled: cat.is_active,
    show_all_option: cat.show_all_option,
    game_modes: cat.game_modes ?? [],
    groups,
  })
})
