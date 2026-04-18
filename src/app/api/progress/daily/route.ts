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
  const sinceIso = since.toISOString()

  // Mastered cards per day + sessions per day in parallel
  const [masteredRes, sessionsRes] = await Promise.all([
    supabase
      .from('language_cards_user_card_progress')
      .select('first_mastered_at')
      .eq('user_id', user.id)
      .gte('first_mastered_at', sinceIso)
      .not('first_mastered_at', 'is', null),
    supabase
      .from('language_cards_user_sessions')
      .select('started_at, cards_reviewed')
      .eq('user_id', user.id)
      .gte('started_at', sinceIso),
  ])

  // Build day buckets
  const mastered: Record<string, number> = {}
  const reviewed: Record<string, number> = {}
  const active: Record<string, boolean> = {}

  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    mastered[key] = 0
    reviewed[key] = 0
    active[key] = false
  }

  for (const row of masteredRes.data ?? []) {
    const day = (row.first_mastered_at as string).slice(0, 10)
    if (day in mastered) mastered[day]++
  }

  for (const row of sessionsRes.data ?? []) {
    const day = (row.started_at as string).slice(0, 10)
    if (day in reviewed) {
      reviewed[day] += row.cards_reviewed ?? 0
      active[day] = true
    }
  }

  const daily = Object.keys(mastered).map(date => ({
    date,
    mastered: mastered[date],
    reviewed: reviewed[date],
    active: active[date],
  }))

  return NextResponse.json({ daily })
})
