import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const { ui_language: lang } = await resolveSettings(user.id, supabase)

  let categoryQuery: any = await supabase
    .from('language_cards_categories')
    .select(`slug, native_name, emoji, card_type, is_active, sort_order, collection_id, collection_sort_order, language_cards_category_translations (lang_code, name, description)`)
    .eq('language_id', 'ja')
    .order('sort_order')

  if (categoryQuery.error) {
    // Backward-compatible fallback while the collection migration is not applied yet.
    categoryQuery = await supabase
      .from('language_cards_categories')
      .select(`slug, native_name, emoji, card_type, is_active, sort_order, language_cards_category_translations (lang_code, name, description)`)
      .eq('language_id', 'ja')
      .order('sort_order')
  }

  if (categoryQuery.error) return NextResponse.json({ error: categoryQuery.error.message }, { status: 500 })

  const pick = (arr: any[]) => arr?.find((x) => x.lang_code === lang) ?? arr?.find((x) => x.lang_code === 'en') ?? {}

  const categories = (categoryQuery.data ?? []).map((cat: any) => {
    const t = pick(cat.language_cards_category_translations ?? [])
    return {
      id: cat.slug,
      collection_id: cat.collection_id ?? null,
      collection_sort_order: cat.collection_sort_order ?? cat.sort_order ?? 0,
      native_name: cat.native_name,
      name: t.name ?? cat.native_name,
      description: t.description ?? '',
      emoji: cat.emoji,
      card_type: cat.card_type,
      enabled: cat.is_active,
    }
  })

  let collections: any[] = []
  const collectionIds = Array.from(new Set(categories.map((cat) => cat.collection_id).filter(Boolean)))
  if (collectionIds.length > 0) {
    const { data: collectionData } = await supabase
      .from('language_cards_category_collections')
      .select(`id, slug, emoji, sort_order, is_active, language_cards_category_collection_translations (lang_code, name, description)`)
      .in('id', collectionIds)
      .eq('language_id', 'ja')
      .order('sort_order')

    collections = (collectionData ?? []).map((collection: any) => {
      const t = pick(collection.language_cards_category_collection_translations ?? [])
      const collectionCategories = categories
        .filter((cat) => cat.collection_id === collection.id)
        .sort((a, b) => (a.collection_sort_order - b.collection_sort_order) || a.name.localeCompare(b.name))

      return {
        id: collection.slug,
        name: t.name ?? collection.slug,
        description: t.description ?? '',
        emoji: collection.emoji,
        enabled: collection.is_active,
        categories: collectionCategories.map((cat) => cat.id),
      }
    })
  }

  return NextResponse.json({ categories, collections })
})
