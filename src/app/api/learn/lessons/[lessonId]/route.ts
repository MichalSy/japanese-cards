import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const { lessonId } = await context.params
  const supabase = await createServerSupabaseClient()
  const settings = await resolveSettings(user.id, supabase)
  const { ui_language: lang } = settings

  const pick = (arr: any[]) =>
    arr?.find((x: any) => x.lang_code === lang) ?? arr?.find((x: any) => x.lang_code === 'en') ?? {}

  const { data: lesson, error: lessonError } = await supabase
    .from('language_cards_learning_lessons')
    .select(`
      id, slug,
      language_cards_learning_lesson_translations (lang_code, title, description)
    `)
    .eq('slug', lessonId)
    .single()

  if (lessonError || !lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: lessonCards, error: lessonCardsError } = await supabase
    .from('language_cards_learning_lesson_cards')
    .select(`
      sort_order,
      language_cards_cards (
        id, slug, card_type, native, transliteration, image_id, audio_url, data,
        language_cards_card_translations (lang_code, translation, example_translation, hint)
      )
    `)
    .eq('lesson_id', lesson.id)
    .order('sort_order')

  if (lessonCardsError) return NextResponse.json({ error: lessonCardsError.message }, { status: 500 })

  const lt = pick((lesson as any).language_cards_learning_lesson_translations ?? [])

  const cards = (lessonCards ?? []).map((lc: any) => {
    const c = lc.language_cards_cards
    const translation = pick(c.language_cards_card_translations ?? [])
    return {
      id: c.id, slug: c.slug, card_type: c.card_type,
      native: c.native ?? null, transliteration: c.transliteration ?? null,
      image_id: c.image_id ?? null, audio_url: c.audio_url ?? null,
      translation: translation.translation ?? null,
      example_translation: translation.example_translation ?? null,
      hint: translation.hint ?? null,
      translations: c.language_cards_card_translations ?? [],
      data: c.data ?? null,
    }
  })

  return NextResponse.json({
    lesson: { id: lesson.id, slug: lesson.slug, title: lt.title ?? lesson.slug, description: lt.description ?? null },
    lang,
    settings: {
      show_translations_by_default: settings.show_translations_by_default,
    },
    cards,
  })
})
