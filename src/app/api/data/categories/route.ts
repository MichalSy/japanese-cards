import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

const TYPE_MAP: Record<string, string> = {
  character: 'characters',
  vocabulary: 'vocabulary',
  phrase: 'phrases',
  grammar: 'grammar',
}

export async function GET() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('categories')
    .select(`
      id, slug, native_name, emoji, is_active,
      category_translations (lang_code, name, description)
    `)
    .eq('language_id', 'ja')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const categories = data.map((cat) => {
    const de = cat.category_translations?.find((t: any) => t.lang_code === 'de')
    const en = cat.category_translations?.find((t: any) => t.lang_code === 'en')
    return {
      id: cat.slug,
      name: cat.native_name,
      nameEn: en?.name ?? cat.native_name,
      nameDe: de?.name ?? cat.native_name,
      descriptionEn: en?.description ?? '',
      descriptionDe: de?.description ?? '',
      emoji: cat.emoji,
      type: TYPE_MAP[cat.slug] ?? cat.slug,
      enabled: cat.is_active,
    }
  })

  return NextResponse.json({ categories })
}
