import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

function computeScore(correct: number, incorrect: number): number {
  return correct - incorrect
}

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { categorySlug } = await context.params
  const { user } = context
  const supabase = await createServerSupabaseClient()

  const { data: cat } = await supabase
    .from('language_cards_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!cat) return NextResponse.json({ progress: {} })

  const { data: practiceCards, error: practiceCardsError } = await supabase
    .from('language_cards_practice_group_cards')
    .select('card_id, language_cards_cards!inner(slug), language_cards_practice_groups!inner(category_id)')
    .eq('language_cards_practice_groups.category_id', cat.id)

  if (practiceCardsError) return NextResponse.json({ error: practiceCardsError.message }, { status: 500 })

  const cardIds = Array.from(new Set((practiceCards ?? []).map((row: any) => row.card_id)))
  if (!cardIds.length) return NextResponse.json({ progress: {} })

  const slugByCardId = new Map(
    (practiceCards ?? []).map((row: any) => [row.card_id, row.language_cards_cards?.slug])
  )

  const { data: progressRows, error: progressError } = await supabase
    .from('language_cards_user_card_progress')
    .select('card_id, correct_count, incorrect_count, last_reviewed_at')
    .eq('user_id', user.id)
    .in('card_id', cardIds)

  if (progressError) return NextResponse.json({ error: progressError.message }, { status: 500 })

  const progress: Record<string, { score: number; learned: boolean }> = {}
  for (const row of progressRows ?? []) {
    const slug = slugByCardId.get((row as any).card_id)
    if (slug) {
      progress[slug] = {
        score: computeScore(row.correct_count, row.incorrect_count),
        learned: row.last_reviewed_at !== null,
      }
    }
  }

  return NextResponse.json({ progress })
})

export const POST = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const body = await req.json()
  const results: { cardSlug: string; isCorrect: boolean }[] = body.results ?? []

  const supabase = await createServerSupabaseClient()

  const slugs = results.map((r) => r.cardSlug)
  const { data: cards } = await supabase
    .from('language_cards_cards')
    .select('id, slug')
    .in('slug', slugs)

  const cardMap = Object.fromEntries((cards ?? []).map((c) => [c.slug, c.id]))

  for (const { cardSlug, isCorrect } of results) {
    const cardId = cardMap[cardSlug]
    if (!cardId) continue

    const { data: existing } = await supabase
      .from('language_cards_user_card_progress')
      .select('id, correct_count, incorrect_count')
      .eq('user_id', user.id)
      .eq('card_id', cardId)
      .single()

    if (existing) {
      const correct = existing.correct_count + (isCorrect ? 1 : 0)
      const incorrect = existing.incorrect_count + (isCorrect ? 0 : 1)
      const score = computeScore(correct, incorrect)
      const mastery = Math.min(Math.max(score / 10, 0), 1)
      await supabase
        .from('language_cards_user_card_progress')
        .update({ correct_count: correct, incorrect_count: incorrect, mastery_level: mastery, last_reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      const correct = isCorrect ? 1 : 0
      const incorrect = isCorrect ? 0 : 1
      const mastery = isCorrect ? 0.1 : 0
      await supabase
        .from('language_cards_user_card_progress')
        .insert({ user_id: user.id, card_id: cardId, correct_count: correct, incorrect_count: incorrect, mastery_level: mastery, last_reviewed_at: new Date().toISOString() })
    }
  }

  return NextResponse.json({ ok: true })
})
