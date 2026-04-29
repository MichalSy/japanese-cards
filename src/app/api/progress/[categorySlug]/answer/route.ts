import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

export const POST = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const { categorySlug } = await context.params
  const { cardSlug, isCorrect } = await req.json()

  if (!cardSlug) return NextResponse.json({ error: 'cardSlug required' }, { status: 400 })

  const supabase = await createServerSupabaseClient()

  const { data: practiceCard } = await supabase
    .from('language_cards_practice_group_cards')
    .select(`
      card_id,
      language_cards_cards!inner(slug),
      language_cards_practice_groups!inner(category_id, language_cards_categories!inner(id, slug))
    `)
    .eq('language_cards_cards.slug', cardSlug)
    .eq('language_cards_practice_groups.language_cards_categories.slug', categorySlug)
    .limit(1)
    .maybeSingle()

  if (!practiceCard) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  const categoryId = (practiceCard as any).language_cards_practice_groups?.language_cards_categories?.id
  const cardId = practiceCard.card_id
  const now = new Date().toISOString()

  const { data: existing } = await supabase
    .from('language_cards_user_card_progress')
    .select('id, correct_count, incorrect_count, first_mastered_at')
    .eq('user_id', user.id)
    .eq('card_id', cardId)
    .single()

  if (existing) {
    const correct   = existing.correct_count   + (isCorrect ? 1 : 0)
    const incorrect = existing.incorrect_count + (isCorrect ? 0 : 1)
    const score     = correct - incorrect
    // Set first_mastered_at the first time net score (correct - incorrect) reaches 3
    const prevScore = existing.correct_count - existing.incorrect_count
    const newScore = correct - incorrect
    const justMastered = newScore >= 3 && prevScore < 3 && !existing.first_mastered_at
    await supabase
      .from('language_cards_user_card_progress')
      .update({
        correct_count: correct,
        incorrect_count: incorrect,
        mastery_level: Math.min(Math.max(score / 10, 0), 1),
        last_reviewed_at: now,
        updated_at: now,
        ...(justMastered ? { first_mastered_at: now } : {}),
      })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('language_cards_user_card_progress')
      .insert({
        user_id: user.id,
        card_id: cardId,
        correct_count: isCorrect ? 1 : 0,
        incorrect_count: isCorrect ? 0 : 1,
        mastery_level: isCorrect ? 0.1 : 0,
        last_reviewed_at: now,
      })
  }

  await supabase.rpc('update_category_snapshot', { p_user_id: user.id, p_category_id: categoryId })

  return NextResponse.json({ ok: true })
})
