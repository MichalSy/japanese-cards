import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang, learn_language_id } = await resolveSettings(user.id, supabase)
  const learningLanguage = learn_language_id ?? 'ja'

  const pick = (arr: any[]) => arr?.find((x) => x.lang_code === lang) ?? arr?.find((x) => x.lang_code === 'en') ?? {}

  const categoryQuery: any = await supabase
    .from('language_cards_categories')
    .select(`id, slug, native_name, emoji, card_type, is_active, status, sort_order, language_cards_category_translations (lang_code, name, description)`)
    .eq('language_id', learningLanguage)
    .order('sort_order')

  if (categoryQuery.error) return NextResponse.json({ error: categoryQuery.error.message }, { status: 500 })

  const categories = (categoryQuery.data ?? []).map((cat: any) => {
    const t = pick(cat.language_cards_category_translations ?? [])
    const status = cat.status ?? (cat.is_active ? 'active' : 'draft')
    return {
      id: cat.slug,
      db_id: cat.id,
      status,
      native_name: cat.native_name,
      name: t.name ?? cat.native_name,
      description: t.description ?? '',
      emoji: cat.emoji,
      card_type: cat.card_type,
      enabled: cat.is_active && status === 'active',
    }
  })

  const categoryBySlug = new Map(categories.map((cat: any) => [cat.id, cat]))

  const { data: trackData, error: trackError } = await supabase
    .from('language_cards_tracks')
    .select(`
      id, slug, emoji, status, sort_order,
      language_cards_track_translations (lang_code, name, description),
      language_cards_track_categories (
        sort_order, status_override,
        language_cards_categories (slug)
      )
    `)
    .eq('language_id', learningLanguage)
    .order('sort_order')

  if (trackError) return NextResponse.json({ error: trackError.message }, { status: 500 })

  const tracks = (trackData ?? []).map((track: any) => {
    const t = pick(track.language_cards_track_translations ?? [])
    const trackCategories = (track.language_cards_track_categories ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((entry: any) => entry.language_cards_categories?.slug)
      .filter((slug: string | null) => slug && categoryBySlug.has(slug))

    return {
      id: track.slug,
      status: track.status,
      name: t.name ?? track.slug,
      description: t.description ?? '',
      emoji: track.emoji,
      enabled: track.status === 'active',
      sort_order: track.sort_order ?? 0,
      categories: trackCategories,
    }
  })

  return NextResponse.json({
    learningLanguage,
    categories,
    tracks,
  })
})
