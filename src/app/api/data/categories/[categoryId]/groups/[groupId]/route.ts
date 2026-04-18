import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

function mapCard(card: any, cardType: string) {
  const base = { id: card.slug }
  if (cardType === 'character') {
    return { ...base, character: card.native, romaji: card.transliteration }
  }
  if (cardType === 'vocabulary') {
    return {
      ...base,
      word: card.native,
      romaji: card.transliteration,
      wordType: card.word_type,
      exampleSentence: card.example_native,
    }
  }
  if (cardType === 'phrase') {
    return {
      ...base,
      sentence: card.native,
      romaji: card.transliteration,
      difficulty: card.difficulty,
      context: card.context,
    }
  }
  return { ...base, native: card.native, transliteration: card.transliteration }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ categoryId: string; groupId: string }> }
) {
  const { categoryId, groupId } = await params
  const supabase = await createServerSupabaseClient()

  // Handle "all" → fetch all groups in category
  if (groupId === 'all') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id, native_name, card_type')
      .eq('language_id', 'ja')
      .eq('slug', categoryId)
      .single()

    if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: cards } = await supabase
      .from('cards')
      .select('slug, native, transliteration, word_type, example_native, difficulty, context, sort_order, groups!inner(category_id)')
      .eq('groups.category_id', cat.id)
      .eq('is_active', true)
      .order('sort_order')

    return NextResponse.json({
      id: `${categoryId}-all`,
      name: `Alle kombiniert`,
      type: cat.card_type,
      items: (cards ?? []).map((c) => mapCard(c, cat.card_type)),
    })
  }

  // Specific group
  const { data: group, error } = await supabase
    .from('groups')
    .select(`
      id, slug,
      group_translations (lang_code, name),
      categories!inner (slug, card_type),
      cards (slug, native, transliteration, word_type, example_native, difficulty, context, sort_order, is_active)
    `)
    .eq('slug', groupId)
    .eq('categories.slug', categoryId)
    .single()

  if (error || !group) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const cardType = (group.categories as any)?.card_type ?? 'character'
  const gDe = (group.group_translations as any[])?.find((t) => t.lang_code === 'de')

  const items = ((group.cards as any[]) ?? [])
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => mapCard(c, cardType))

  return NextResponse.json({
    id: `${categoryId}-${groupId}`,
    name: gDe?.name ?? groupId,
    type: cardType,
    items,
  })
}
