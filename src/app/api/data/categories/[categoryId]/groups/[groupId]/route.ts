import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function mapCard(card: any, lang: string) {
  const pick = (arr: any[]) => arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}
  const ct = pick(card.language_cards_card_translations ?? [])
  return {
    id: card.slug,
    native: card.native,
    transliteration: card.transliteration ?? null,
    word_type: card.word_type ?? null,
    example_native: card.example_native ?? null,
    translation: ct.translation ?? null,
    example_translation: ct.example_translation ?? null,
    difficulty: card.difficulty ?? null,
    context: card.context ?? null,
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ categoryId: string; groupId: string }> }
) {
  const { categoryId, groupId } = await params
  const lang = (await cookies()).get('jc_lang')?.value ?? 'de'
  const supabase = await createServerSupabaseClient()

  if (groupId === 'all') {
    const { data: cat } = await supabase
      .from('language_cards_categories')
      .select('id, native_name, card_type')
      .eq('language_id', 'ja')
      .eq('slug', categoryId)
      .single()

    if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: cards } = await supabase
      .from('language_cards_cards')
      .select('slug, native, transliteration, word_type, example_native, difficulty, context, sort_order, language_cards_card_translations (lang_code, translation, example_translation), language_cards_groups!inner(category_id)')
      .eq('language_cards_groups.category_id', cat.id)
      .eq('is_active', true)
      .order('sort_order')

    return NextResponse.json({
      id: `${categoryId}-all`,
      name: lang === 'de' ? 'Alle kombiniert' : 'All combined',
      card_type: cat.card_type,
      items: (cards ?? []).map((c) => mapCard(c, lang)),
    })
  }

  const { data: group, error } = await supabase
    .from('language_cards_groups')
    .select(`
      slug,
      language_cards_group_translations (lang_code, name),
      language_cards_categories!inner (slug, card_type),
      language_cards_cards (slug, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active, language_cards_card_translations (lang_code, translation, example_translation))
    `)
    .eq('slug', groupId)
    .eq('language_cards_categories.slug', categoryId)
    .single()

  if (error || !group) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const cardType = (group as any).language_cards_categories?.card_type ?? 'character'
  const pick = (arr: any[]) => arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}
  const gt = pick((group as any).language_cards_group_translations ?? [])

  const items = ((group as any).language_cards_cards ?? [])
    .filter((c: any) => c.is_active)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((c: any) => mapCard(c, lang))

  return NextResponse.json({
    id: `${categoryId}-${groupId}`,
    name: gt.name ?? groupId,
    card_type: cardType,
    items,
  })
}
