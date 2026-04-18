import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const lang = (await cookies()).get('jc_lang')?.value ?? 'de'
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('language_cards_categories')
    .select(`slug, native_name, emoji, card_type, is_active, language_cards_category_translations (lang_code, name, description)`)
    .eq('language_id', 'ja')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const categories = data.map((cat) => {
    const translations: any[] = (cat as any).language_cards_category_translations ?? []
    const t = translations.find((x) => x.lang_code === lang) ?? translations.find((x) => x.lang_code === 'en') ?? {}
    return {
      id: cat.slug,
      native_name: cat.native_name,
      name: t.name ?? cat.native_name,
      description: t.description ?? '',
      emoji: cat.emoji,
      card_type: cat.card_type,
      enabled: cat.is_active,
    }
  })

  return NextResponse.json({ categories })
}
