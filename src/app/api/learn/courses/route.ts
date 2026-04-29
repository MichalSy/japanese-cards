import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const category = new URL(req.url).searchParams.get('category')
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)

  const pick = (arr: any[]) =>
    arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}

  const getCompletedCardIds = async (cardIds: string[]) => {
    const uniqueIds = Array.from(new Set(cardIds))
    if (!uniqueIds.length) return new Set<string>()

    const { data: progressRows } = await supabase
      .from('language_cards_user_card_progress')
      .select('card_id, correct_count')
      .eq('user_id', user.id)
      .in('card_id', uniqueIds)

    return new Set(
      (progressRows ?? [])
        .filter((row: any) => (row.correct_count ?? 0) > 0)
        .map((row: any) => row.card_id)
    )
  }

  const isLessonCompleted = (quizCardIds: string[], completedCardIds: Set<string>) =>
    quizCardIds.length > 0 && quizCardIds.every((id) => completedCardIds.has(id))

  let learningQuery = supabase
    .from('language_cards_learning_courses')
    .select(`
      id, slug, level, sort_order,
      language_cards_categories!inner (slug, language_id),
      language_cards_learning_course_translations (lang_code, title, description),
      language_cards_learning_lessons (
        id, slug, sort_order, is_active,
        language_cards_learning_lesson_translations (lang_code, title, description)
      )
    `)
    .eq('is_active', true)
    .eq('language_cards_categories.language_id', 'ja')
    .order('sort_order')

  if (category) learningQuery = learningQuery.eq('language_cards_categories.slug', category)

  const { data: learningCourses, error } = await learningQuery

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const lessonIds = (learningCourses ?? []).flatMap((course: any) =>
    (course.language_cards_learning_lessons ?? []).map((lesson: any) => lesson.id)
  )

  const { data: lessonCards, error: lessonCardsError } = lessonIds.length
    ? await supabase
      .from('language_cards_learning_lesson_cards')
      .select('lesson_id, language_cards_cards (id, card_type)')
      .in('lesson_id', lessonIds)
    : { data: [], error: null }

  if (lessonCardsError) return NextResponse.json({ error: lessonCardsError.message }, { status: 500 })

  const quizCardIdsByLessonId = new Map<string, string[]>()
  for (const row of lessonCards ?? []) {
    const card = (row as any).language_cards_cards
    if (card?.card_type !== 'quiz_4_option') continue
    const ids = quizCardIdsByLessonId.get((row as any).lesson_id) ?? []
    ids.push(card.id)
    quizCardIdsByLessonId.set((row as any).lesson_id, ids)
  }

  const completedCardIds = await getCompletedCardIds(
    Array.from(quizCardIdsByLessonId.values()).flat()
  )

  const courses = (learningCourses ?? []).map((c: any) => {
    const ct = pick(c.language_cards_learning_course_translations ?? [])
    const lessons = (c.language_cards_learning_lessons ?? [])
      .filter((l: any) => l.is_active !== false)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((l: any) => {
        const lt = pick(l.language_cards_learning_lesson_translations ?? [])
        const quizCardIds = quizCardIdsByLessonId.get(l.id) ?? []
        return {
          id: l.id,
          slug: l.slug,
          title: lt.title ?? l.slug,
          description: lt.description ?? null,
          completed: isLessonCompleted(quizCardIds, completedCardIds),
        }
      })
    return { id: c.id, slug: c.slug, title: ct.title ?? c.slug, description: ct.description ?? null, level: c.level, lessons }
  })

  return NextResponse.json({ courses })
})
