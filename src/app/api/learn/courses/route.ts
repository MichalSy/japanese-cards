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
        language_cards_learning_lesson_translations (lang_code, title, description)
      )
    `)
    .eq('is_active', true)
    .eq('language_cards_categories.language_id', 'ja')
    .order('sort_order')

  if (category) learningQuery = learningQuery.eq('language_cards_categories.slug', category)

  const { data: learningCourses, error: learningError } = await learningQuery

  if (!learningError) {
    const result = (learningCourses ?? []).map((c: any) => {
      const ct = pick(c.language_cards_learning_course_translations ?? [])
      const lessons = (c.language_cards_learning_lessons ?? [])
        .filter((l: any) => l.is_active !== false)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((l: any) => {
          const lt = pick(l.language_cards_learning_lesson_translations ?? [])
          return { id: l.id, slug: l.slug, title: lt.title ?? l.slug, description: lt.description ?? null }
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
        language_cards_course_lesson_translations (lang_code, title, description)
      )
    `)
    .eq('language_id', 'ja')
    .eq('is_active', true)
    .order('sort_order')

  if (category) legacyQuery = legacyQuery.like('slug', `${category}-%`)

  const { data: courses } = await legacyQuery

  const result = (courses ?? []).map((c: any) => {
    const lessons = (c.language_cards_course_lessons ?? [])
      .filter((l: any) => l.is_active !== false)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((l: any) => {
        const lt = pick(l.language_cards_course_lesson_translations ?? [])
        return { id: l.id, slug: l.slug, title: lt.title ?? l.slug, description: lt.description ?? null }
      })
    return { id: c.id, slug: c.slug, title: fallbackCourseTitle(c.slug), description: null, level: c.level, lessons }
  })

  return NextResponse.json({ courses: result })
})
