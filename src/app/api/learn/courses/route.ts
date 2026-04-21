import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)

  const { data: courses } = await supabase
    .from('language_cards_courses')
    .select(`
      id, slug, level, sort_order,
      language_cards_course_translations (lang_code, name, description),
      language_cards_course_lessons (
        id, slug, sort_order,
        language_cards_course_lesson_translations (lang_code, title, description)
      )
    `)
    .eq('language_id', 'ja')
    .eq('is_active', true)
    .order('sort_order')

  const pick = (arr: any[]) =>
    arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}

  const result = (courses ?? []).map((c: any) => {
    const ct = pick(c.language_cards_course_translations ?? [])
    const lessons = (c.language_cards_course_lessons ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((l: any) => {
        const lt = pick(l.language_cards_course_lesson_translations ?? [])
        return { id: l.id, slug: l.slug, title: lt.title ?? l.slug, description: lt.description ?? null }
      })
    return {
      id: c.id, slug: c.slug, level: c.level,
      name: ct.name ?? c.slug, description: ct.description ?? null,
      lessons,
    }
  })

  return NextResponse.json({ courses: result })
})
