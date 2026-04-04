import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import aikoapp from '../../../../../aikoapp.json'

export const dynamic = 'force-dynamic'

let lastRegister = 0

async function selfRegister() {
  const now = Date.now()
  if (now - lastRegister < 5 * 60 * 1000) return
  lastRegister = now

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) return

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, serviceKey)
    const appName = (aikoapp as any).app?.['app-name']

    await supabase
      .from('guild_apps')
      .upsert({
        name: appName,
        display_name: (aikoapp as any).app?.name,
        version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0',
        description: (aikoapp as any).app?.description || '',
        last_seen: new Date().toISOString(),
      }, { onConflict: 'name' })

    const abilities = (aikoapp as any).abilities?.list || []
    for (const ability of abilities) {
      await supabase
        .from('guild_abilities')
        .upsert({
          name: ability.name,
          app_name: appName,
          emoji: ability.emoji || '⚡',
          description: ability.description || '',
          is_passierschein: ability.is_passierschein || false,
        }, { onConflict: 'name,app_name' })
    }
    console.log(`[HEALTH] Registered ${appName} with ${abilities.length} abilities`)
  } catch (e) {
    console.warn('[HEALTH] Self-register failed:', e)
  }
}

export async function GET() {
  selfRegister()

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    app: (aikoapp as any).app?.['app-name'],
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0',
  })
}
