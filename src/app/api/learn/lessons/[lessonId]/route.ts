import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const { lessonId } = await context.params
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)

  const pick = (arr: any[]) =>
    arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}

  const { data: learningLesson, error: learningLessonError } = await supabase
    .from('language_cards_learning_lessons')
    .select(`
      id, slug,
      language_cards_learning_lesson_translations (lang_code, title, description)
    `)
    .eq('slug', lessonId)
    .single()

  if (!learningLessonError && learningLesson) {
    const { data: learningLessonCards } = await supabase
      .from('language_cards_learning_lesson_cards')
      .select(`
        sort_order,
        language_cards_cards (
          id, slug, card_type, native, transliteration, image_id, audio_url, data
        )
      `)
      .eq('lesson_id', learningLesson.id)
      .order('sort_order')

    const lt = pick((learningLesson as any).language_cards_learning_lesson_translations ?? [])

    const cards = (learningLessonCards ?? []).map((lc: any) => {
      const c = lc.language_cards_cards
      return {
        id: c.id, slug: c.slug, card_type: c.card_type,
        native: c.native ?? null, transliteration: c.transliteration ?? null,
        image_id: c.image_id ?? null, audio_url: c.audio_url ?? null,
        data: c.data ?? null,
      }
    })

    return NextResponse.json({
      lesson: { id: learningLesson.id, title: lt.title ?? learningLesson.slug, description: lt.description ?? null },
      lang,
      cards,
    })
  }

  const { data: lesson } = await supabase
    .from('language_cards_course_lessons')
    .select(`
      id, slug,
      language_cards_course_lesson_translations (lang_code, title, description)
    `)
    .eq('slug', lessonId)
    .single()

  if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: lessonCards } = await supabase
    .from('language_cards_course_lesson_cards')
    .select(`
      sort_order,
      language_cards_cards (
        id, slug, card_type, native, transliteration, image_id, audio_url, data
      )
    `)
    .eq('lesson_id', lesson.id)
    .order('sort_order')

  const lt = pick((lesson as any).language_cards_course_lesson_translations ?? [])

  const cards = (lessonCards ?? []).map((lc: any) => {
    const c = lc.language_cards_cards
    return {
      id: c.id, slug: c.slug, card_type: c.card_type,
      native: c.native ?? null, transliteration: c.transliteration ?? null,
      image_id: c.image_id ?? null, audio_url: c.audio_url ?? null,
      data: c.data ?? null,
    }
  })

  return NextResponse.json({
    lesson: { id: lesson.id, title: lt.title ?? lesson.slug, description: lt.description ?? null },
    lang,
    cards,
  })
})
