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

  let categories = (categoryQuery.data ?? []).map((cat: any) => {
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

  const plannedN5Categories = [
    { id: 'n5-vocabulary', native_name: '語彙', nameDe: 'N5 Vokabeln', descDe: 'Kernwortschatz für JLPT N5', nameEn: 'N5 Vocabulary', descEn: 'Core vocabulary for JLPT N5', emoji: '📚', card_type: 'vocabulary', sort: 4 },
    { id: 'n5-numbers-time', native_name: '数と時間', nameDe: 'Zahlen & Zeit', descDe: 'Zahlen, Uhrzeit, Datum, Wochentage und Mengen', nameEn: 'Numbers & Time', descEn: 'Numbers, time, dates, weekdays, and quantities', emoji: '🔢', card_type: 'vocabulary', sort: 5 },
    { id: 'n5-particles', native_name: '助詞', nameDe: 'Partikel', descDe: 'N5-Partikel wie は, が, を, に, で und の', nameEn: 'Particles', descEn: 'N5 particles such as は, が, を, に, で, and の', emoji: '🧩', card_type: 'grammar', sort: 6 },
    { id: 'n5-verbs', native_name: '動詞', nameDe: 'Verben', descDe: 'Verbgruppen und grundlegende N5-Formen', nameEn: 'Verbs', descEn: 'Verb groups and basic N5 forms', emoji: '🏃', card_type: 'grammar', sort: 7 },
    { id: 'n5-adjectives', native_name: '形容詞', nameDe: 'Adjektive', descDe: 'い- und な-Adjektive mit einfachen Formen', nameEn: 'Adjectives', descEn: 'い and な adjectives with basic forms', emoji: '🎨', card_type: 'grammar', sort: 8 },
    { id: 'n5-grammar', native_name: '文法', nameDe: 'Grammatik', descDe: 'Grundlegender Satzbau und wichtige N5-Muster', nameEn: 'Grammar', descEn: 'Basic sentence structure and important N5 patterns', emoji: '🏗️', card_type: 'grammar', sort: 9 },
    { id: 'n5-kanji', native_name: '漢字', nameDe: 'N5 Kanji', descDe: 'Grundlegende Kanji mit Lesungen und Beispielwörtern', nameEn: 'N5 Kanji', descEn: 'Basic kanji with readings and example words', emoji: '🈶', card_type: 'character', sort: 10 },
    { id: 'n5-phrases', native_name: '表現', nameDe: 'Sätze & Dialoge', descDe: 'Alltagssätze, Mini-Dialoge und Prüfungsmuster', nameEn: 'Phrases & Dialogues', descEn: 'Everyday phrases, mini dialogues, and test patterns', emoji: '💬', card_type: 'phrase', sort: 11 },
  ]

  const plannedCollections = [
    { id: 'jlpt-n4', name: 'JLPT N4', descDe: 'Aufbaukurs nach N5', descEn: 'Follow-up course after N5', emoji: '🌿', sort: 2 },
    { id: 'jlpt-n3', name: 'JLPT N3', descDe: 'Mittelstufe mit Alltag und Lesen', descEn: 'Intermediate everyday Japanese and reading', emoji: '⛩️', sort: 3 },
    { id: 'jlpt-n2', name: 'JLPT N2', descDe: 'Fortgeschrittene Grammatik, Kanji und Texte', descEn: 'Advanced grammar, kanji, and texts', emoji: '🗻', sort: 4 },
    { id: 'jlpt-n1', name: 'JLPT N1', descDe: 'Höchste JLPT-Stufe für komplexes Japanisch', descEn: 'Highest JLPT level for complex Japanese', emoji: '🏯', sort: 5 },
  ]

  for (const cat of plannedN5Categories) {
    if (categories.some((existing) => existing.id === cat.id)) continue
    categories.push({
      id: cat.id,
      collection_id: null,
      collection_sort_order: cat.sort,
      native_name: cat.native_name,
      name: lang === 'de' ? cat.nameDe : cat.nameEn,
      description: lang === 'de' ? cat.descDe : cat.descEn,
      emoji: cat.emoji,
      card_type: cat.card_type,
      enabled: false,
    })
  }

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
        sort_order: collection.sort_order ?? 0,
        categories: collection.slug === 'jlpt-n5'
          ? Array.from(new Set([...collectionCategories.map((cat) => cat.id), ...plannedN5Categories.map((cat) => cat.id)]))
          : collectionCategories.map((cat) => cat.id),
      }
    })
  }

  if (collections.length === 0) {
    const n5Categories = ['hiragana', 'katakana', 'first-words', ...plannedN5Categories.map((cat) => cat.id)].filter((categoryId) =>
      categories.some((category) => category.id === categoryId)
    )

    if (n5Categories.length > 0) {
      collections = [{
        id: 'jlpt-n5',
        name: 'JLPT N5',
        description: lang === 'de'
          ? 'Grundlagen für die erste Japanisch-Prüfung'
          : 'Basics for the first Japanese proficiency test',
        emoji: '🎓',
        enabled: true,
        sort_order: 1,
        categories: n5Categories,
      }]
    }
  }

  for (const collection of plannedCollections) {
    if (collections.some((existing) => existing.id === collection.id)) continue
    collections.push({
      id: collection.id,
      name: collection.name,
      description: lang === 'de' ? collection.descDe : collection.descEn,
      emoji: collection.emoji,
      enabled: false,
      sort_order: collection.sort,
      categories: [],
    })
  }

  collections.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return NextResponse.json({ categories, collections })
})
