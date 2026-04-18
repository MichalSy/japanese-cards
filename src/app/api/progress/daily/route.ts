import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

function weekStart(isoWeekStr: string): string {
  const [year, w] = isoWeekStr.split('-W').map(Number)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const monday = new Date(jan4)
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (w - 1) * 7)
  return monday.toISOString().slice(0, 10)
}

export const GET = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const params = new URL(req.url).searchParams
  const weeks = parseInt(params.get('weeks') ?? '0')
  const days = parseInt(params.get('days') ?? '5')
  const supabase = await createServerSupabaseClient()

  if (weeks > 0) {
    const since = new Date()
    since.setDate(since.getDate() - weeks * 7 + 1)
    since.setHours(0, 0, 0, 0)
    const sinceIso = since.toISOString()

    const [masteredRes, sessionsRes] = await Promise.all([
      supabase
        .from('language_cards_user_card_progress')
        .select('first_mastered_at')
        .eq('user_id', user.id)
        .gte('first_mastered_at', sinceIso)
        .not('first_mastered_at', 'is', null),
      supabase
        .from('language_cards_user_sessions')
        .select('started_at')
        .eq('user_id', user.id)
        .gte('started_at', sinceIso),
    ])

    // Build week buckets (oldest first)
    const weekKeys: string[] = []
    for (let i = weeks - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i * 7)
      const key = isoWeek(d)
      if (!weekKeys.includes(key)) weekKeys.push(key)
    }
    weekKeys.sort()

    const mastered: Record<string, number> = {}
    const active: Record<string, boolean> = {}
    for (const k of weekKeys) { mastered[k] = 0; active[k] = false }

    for (const row of masteredRes.data ?? []) {
      const key = isoWeek(new Date((row.first_mastered_at as string)))
      if (key in mastered) mastered[key]++
    }
    for (const row of sessionsRes.data ?? []) {
      const key = isoWeek(new Date((row.started_at as string)))
      if (key in active) active[key] = true
    }

    const daily = weekKeys.map(k => ({
      date: weekStart(k),
      week: k,
      mastered: mastered[k],
      active: active[k],
    }))

    return NextResponse.json({ daily })
  }

  // Daily mode
  const since = new Date()
  since.setDate(since.getDate() - days + 1)
  since.setHours(0, 0, 0, 0)
  const sinceIso = since.toISOString()

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
