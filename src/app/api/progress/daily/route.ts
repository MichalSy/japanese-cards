import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

export const GET = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const days = parseInt(new URL(req.url).searchParams.get('days') ?? '5')
  const supabase = await createServerSupabaseClient()

  const since = new Date()
  since.setDate(since.getDate() - days + 1)
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('language_cards_user_card_progress')
    .select('first_mastered_at')
    .eq('user_id', user.id)
    .gte('first_mastered_at', since.toISOString())
    .not('first_mastered_at', 'is', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Build day buckets
  const buckets: Record<string, number> = {}
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    buckets[d.toISOString().slice(0, 10)] = 0
  }

  for (const row of data ?? []) {
    const day = row.first_mastered_at!.slice(0, 10)
    if (day in buckets) buckets[day]++
  }

  const result = Object.entries(buckets).map(([date, count]) => ({ date, count }))
  return NextResponse.json({ daily: result })
})
