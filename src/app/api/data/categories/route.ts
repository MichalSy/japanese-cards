import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('language_cards_categories')
    .select(`id, slug, native_name, emoji, card_type, is_active, language_cards_category_translations (lang_code, name, description)`)
    .eq('language_id', 'ja')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const categories = data.map((cat) => ({
    id: cat.slug,
    native_name: cat.native_name,
    translations: Object.fromEntries(
      ((cat as any).language_cards_category_translations ?? []).map((t: any) => [t.lang_code, { name: t.name, description: t.description }])
    ),
    emoji: cat.emoji,
    card_type: cat.card_type,
    enabled: cat.is_active,
  }))

  return NextResponse.json({ categories })
}
