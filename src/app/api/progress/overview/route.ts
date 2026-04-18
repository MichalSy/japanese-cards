import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .rpc('get_progress_overview', { p_user_id: user.id })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // overview: [{ category_slug, total, seen, mastered }]
  return NextResponse.json({ overview: data ?? [] })
})
