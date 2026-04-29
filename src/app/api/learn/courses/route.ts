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
  const getQuizCardIds = (lesson: any, relationName: string) =>
    (lesson?.[relationName] ?? [])
      .map((row: any) => row.language_cards_cards)
      .filter((card: any) => card?.card_type === 'quiz_4_option')
      .map((card: any) => card.id)

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

  const fallbackCourseTitle = (slug: string) => {
    if (slug === 'hiragana-basics') return lang === 'de' ? 'Hiragana Grundlagen' : 'Hiragana Basics'
    if (slug === 'katakana-basics') return lang === 'de' ? 'Katakana Grundlagen' : 'Katakana Basics'
    return slug
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  let learningQuery = supabase
    .from('language_cards_learning_courses')
    .select(`
      id, slug, level, sort_order,
      language_cards_categories!inner (slug, language_id),
      language_cards_learning_course_translations (lang_code, title, description),
        language_cards_learning_lessons (
        id, slug, sort_order, is_active,
        language_cards_learning_lesson_translations (lang_code, title, description),
        language_cards_learning_lesson_cards (
          language_cards_cards (id, card_type)
        )
      )
    `)
    .eq('is_active', true)
    .eq('language_cards_categories.language_id', 'ja')
    .order('sort_order')

  if (category) learningQuery = learningQuery.eq('language_cards_categories.slug', category)

  const { data: learningCourses, error: learningError } = await learningQuery

  if (!learningError) {
    const completedCardIds = await getCompletedCardIds(
      (learningCourses ?? []).flatMap((course: any) =>
        (course.language_cards_learning_lessons ?? []).flatMap((lesson: any) =>
          getQuizCardIds(lesson, 'language_cards_learning_lesson_cards')
        )
      )
    )

    const result = (learningCourses ?? []).map((c: any) => {
      const ct = pick(c.language_cards_learning_course_translations ?? [])
      const lessons = (c.language_cards_learning_lessons ?? [])
        .filter((l: any) => l.is_active !== false)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((l: any) => {
          const lt = pick(l.language_cards_learning_lesson_translations ?? [])
          const quizCardIds = getQuizCardIds(l, 'language_cards_learning_lesson_cards')
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

    return NextResponse.json({ courses: result })
  }

  let legacyQuery = supabase
    .from('language_cards_courses')
    .select(`
      id, slug, level, sort_order,
        language_cards_course_lessons (
        id, slug, sort_order, is_active,
        language_cards_course_lesson_translations (lang_code, title, description),
        language_cards_course_lesson_cards (
          language_cards_cards (id, card_type)
        )
      )
    `)
    .eq('language_id', 'ja')
    .eq('is_active', true)
    .order('sort_order')

  if (category) legacyQuery = legacyQuery.like('slug', `${category}-%`)

  const { data: courses } = await legacyQuery

  const completedCardIds = await getCompletedCardIds(
    (courses ?? []).flatMap((course: any) =>
      (course.language_cards_course_lessons ?? []).flatMap((lesson: any) =>
        getQuizCardIds(lesson, 'language_cards_course_lesson_cards')
      )
    )
  )

  const result = (courses ?? []).map((c: any) => {
    const lessons = (c.language_cards_course_lessons ?? [])
      .filter((l: any) => l.is_active !== false)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((l: any) => {
        const lt = pick(l.language_cards_course_lesson_translations ?? [])
        const quizCardIds = getQuizCardIds(l, 'language_cards_course_lesson_cards')
        return {
          id: l.id,
          slug: l.slug,
          title: lt.title ?? l.slug,
          description: lt.description ?? null,
          completed: isLessonCompleted(quizCardIds, completedCardIds),
        }
      })
    return { id: c.id, slug: c.slug, title: fallbackCourseTitle(c.slug), description: null, level: c.level, lessons }
  })

  return NextResponse.json({ courses: result })
})
