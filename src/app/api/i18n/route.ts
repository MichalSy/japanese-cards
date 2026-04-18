import { createServerSupabaseClient } from '@michalsy/aiko-webapp-core/server'
import { requireAuth } from '@michalsy/aiko-webapp-core/server'
import { NextResponse } from 'next/server'
import { resolveSettings } from '@/lib/settingsCache'
import { translations } from '@/lib/translations'

export const GET = requireAuth(async (_req: Request, context: any) => {
  const { user } = context
  const supabase = await createServerSupabaseClient()
  const { ui_language } = await resolveSettings(user.id, supabase)
  return NextResponse.json(translations[ui_language] ?? translations.en)
})
