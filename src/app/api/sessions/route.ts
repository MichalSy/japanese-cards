import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'

export const POST = requireAuth(async (req: Request, context: any) => {
  const { user } = context
  const body = await req.json()
  const supabase = await createServerSupabaseClient()
  const { learn_language_id } = await resolveSettings(user.id, supabase)
  const learningLanguage = learn_language_id ?? 'ja'

  // Resolve category_id from slug
  const { data: cat } = await supabase
    .from('language_cards_categories')
    .select('id')
    .eq('language_id', learningLanguage)
    .eq('slug', body.category_slug)
    .single()

  // Resolve practice group id from slug (optional).
  // language_cards_user_sessions.group_id still stores the copied UUID.
  let groupId: string | null = null
  if (body.group_slug && body.group_slug !== 'all' && cat) {
    const { data: grp } = await supabase
      .from('language_cards_practice_groups')
      .select('id')
      .eq('slug', body.group_slug)
      .eq('category_id', cat.id)
      .single()
    groupId = grp?.id ?? null
  }

  const { data, error } = await supabase
    .from('language_cards_user_sessions')
    .insert({
      user_id: user.id,
      language_id: learningLanguage,
      category_id: cat?.id ?? null,
      group_id: groupId,
      game_mode: body.game_mode ?? 'swipe',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
})
