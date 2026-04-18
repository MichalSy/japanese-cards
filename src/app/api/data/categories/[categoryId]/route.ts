import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

const TYPE_MAP: Record<string, string> = {
  character: 'characters',
  vocabulary: 'vocabulary',
  phrase: 'phrases',
  grammar: 'grammar',
}

export async function GET(_req: Request, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: cat, error } = await supabase
    .from('categories')
    .select(`
      id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, is_active,
      category_translations (lang_code, name, description),
      groups (id, slug, sort_order, group_translations (lang_code, name))
    `)
    .eq('language_id', 'ja')
    .eq('slug', categoryId)
    .single()

  if (error || !cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const de = cat.category_translations?.find((t: any) => t.lang_code === 'de')
  const en = cat.category_translations?.find((t: any) => t.lang_code === 'en')

  const groups = (cat.groups ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((g: any) => {
      const gDe = g.group_translations?.find((t: any) => t.lang_code === 'de')
      return { id: g.slug, name: gDe?.name ?? g.slug }
    })

  return NextResponse.json({
    id: cat.slug,
    name: cat.native_name,
    nameEn: en?.name ?? cat.native_name,
    nameDe: de?.name ?? cat.native_name,
    descriptionEn: en?.description ?? '',
    descriptionDe: de?.description ?? '',
    emoji: cat.emoji,
    color: cat.color,
    type: TYPE_MAP[cat.card_type] ?? cat.card_type,
    enabled: cat.is_active,
    showAllOption: cat.show_all_option,
    gameModes: cat.game_modes ?? [],
    groups,
  })
}
