import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

function normalizeCount(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

export const POST = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const { lessonId } = await context.params
  const body = await req.json().catch(() => ({}))
  const supabase = await createServerSupabaseClient()

  const quizCount = normalizeCount(body.quiz_count)
  const correctCount = normalizeCount(body.correct_count)
  const passed = quizCount === 0 || correctCount >= quizCount

  if (!passed) {
    return NextResponse.json({ ok: true, completed: false })
  }

  const { data: learningLesson, error: learningError } = await supabase
    .from('language_cards_learning_lessons')
    .select(`
      id, slug,
      language_cards_learning_lesson_cards (
        language_cards_cards (id, card_type)
      )
    `)
    .eq('slug', lessonId)
    .single()

  let quizCardIds = ((learningLesson as any)?.language_cards_learning_lesson_cards ?? [])
    .map((row: any) => row.language_cards_cards)
    .filter((card: any) => card?.card_type === 'quiz_4_option')
    .map((card: any) => card.id)

  if (learningError || !learningLesson) {
    const { data: legacyLesson } = await supabase
      .from('language_cards_course_lessons')
      .select(`
        id, slug,
        language_cards_course_lesson_cards (
          language_cards_cards (id, card_type)
        )
      `)
      .eq('slug', lessonId)
      .single()

    quizCardIds = ((legacyLesson as any)?.language_cards_course_lesson_cards ?? [])
      .map((row: any) => row.language_cards_cards)
      .filter((card: any) => card?.card_type === 'quiz_4_option')
      .map((card: any) => card.id)
  }

  if (quizCardIds.length === 0) {
    return NextResponse.json({ ok: true, completed: true })
  }

  if (quizCount !== quizCardIds.length || correctCount !== quizCardIds.length) {
    return NextResponse.json({ ok: true, completed: false })
  }

  const now = new Date().toISOString()
  const { data: existingRows } = await supabase
    .from('language_cards_user_card_progress')
    .select('id, card_id, correct_count, incorrect_count')
    .eq('user_id', user.id)
    .in('card_id', quizCardIds)

  const existingByCardId = new Map((existingRows ?? []).map((row: any) => [row.card_id, row]))

  for (const cardId of quizCardIds) {
    const existing = existingByCardId.get(cardId)
    if (existing) {
      const correct = (existing.correct_count ?? 0) + 1
      const incorrect = existing.incorrect_count ?? 0
      const score = correct - incorrect
      const { error } = await supabase
        .from('language_cards_user_card_progress')
        .update({
          correct_count: correct,
          mastery_level: Math.min(Math.max(score / 10, 0), 1),
          last_reviewed_at: now,
          updated_at: now,
        })
        .eq('id', existing.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      const { error } = await supabase
        .from('language_cards_user_card_progress')
        .insert({
          user_id: user.id,
          card_id: cardId,
          correct_count: 1,
          incorrect_count: 0,
          mastery_level: 0.1,
          last_reviewed_at: now,
        })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, completed: true })
})
