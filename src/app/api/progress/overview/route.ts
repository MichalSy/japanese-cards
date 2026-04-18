import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()

  // Read from snapshots — fast, pre-computed after each answer
  const { data: snapshots } = await supabase
    .from('language_cards_category_snapshots')
    .select('category_id, total_cards, seen_cards, mastered_cards, language_cards_categories!inner(slug)')
    .eq('user_id', user.id)

  // Also get all active categories to show 0 for ones not yet played
  const { data: categories } = await supabase
    .from('language_cards_categories')
    .select('id, slug')
    .eq('language_id', 'ja')
    .eq('is_active', true)
    .order('sort_order')

  const snapshotMap = Object.fromEntries(
    (snapshots ?? []).map((s: any) => [s.language_cards_categories.slug, s])
  )

  const overview = (categories ?? []).map((cat) => {
    const snap = snapshotMap[cat.slug]
    return {
      category_slug:  cat.slug,
      total:    snap ? snap.total_cards   : 0,
      seen:     snap ? snap.seen_cards    : 0,
      mastered: snap ? snap.mastered_cards : 0,
    }
  })

  return NextResponse.json({ overview })
})
