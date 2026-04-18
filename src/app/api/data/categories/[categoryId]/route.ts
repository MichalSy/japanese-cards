import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params
  const supabase = await createServerSupabaseClient()

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

  const groups = ((cat as any).language_cards_groups ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((g: any) => ({
      id: g.slug,
      translations: Object.fromEntries(
        (g.language_cards_group_translations ?? []).map((t: any) => [t.lang_code, { name: t.name }])
      ),
    }))

  return NextResponse.json({
    id: cat.slug,
    native_name: cat.native_name,
    translations: Object.fromEntries(
      ((cat as any).language_cards_category_translations ?? []).map((t: any) => [t.lang_code, { name: t.name, description: t.description }])
    ),
    emoji: cat.emoji,
    color: cat.color,
    card_type: cat.card_type,
    enabled: cat.is_active,
    show_all_option: cat.show_all_option,
    game_modes: cat.game_modes ?? [],
    groups,
  })
}
