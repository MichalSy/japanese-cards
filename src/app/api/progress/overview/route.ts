import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const { learn_language_id } = await resolveSettings(user.id, supabase)
  const learningLanguage = learn_language_id ?? 'ja'

  const [{ data: snapshots }, { data: categories }, { data: cardCounts }] = await Promise.all([
    supabase
      .from('language_cards_category_snapshots')
      .select('category_id, seen_cards, mastered_cards, language_cards_categories!inner(slug)')
      .eq('user_id', user.id),
    supabase
      .from('language_cards_categories')
      .select('id, slug')
      .eq('language_id', learningLanguage)
      .eq('is_active', true)
      .eq('status', 'active')
      .order('sort_order'),
    supabase.rpc('get_language_category_card_counts', { p_language_id: learningLanguage }),
  ])

  const snapshotMap = Object.fromEntries(
    (snapshots ?? []).map((s: any) => [s.language_cards_categories.slug, s])
  )
  const countMap = Object.fromEntries(
    (cardCounts ?? []).map((r: any) => [r.slug, r.total_cards])
  )

  const overview = (categories ?? []).map((cat) => {
    const snap = snapshotMap[cat.slug]
    return {
      category_slug: cat.slug,
      total:    countMap[cat.slug] ?? 0,
      seen:     snap ? snap.seen_cards     : 0,
      mastered: snap ? snap.mastered_cards : 0,
    }
  })

  return NextResponse.json({ overview })
})
