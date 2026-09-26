import { createAuthentikAuth, AuthUnavailableError } from '@michalsy/aiko-webapp-core/oidc/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

const issuer = 'https://auth.sytko.de/application/o/japanese-cards/'
let auth: ReturnType<typeof createAuthentikAuth> | undefined
let dataClient: SupabaseClient | undefined

export function getAuth() {
  return auth ??= createAuthentikAuth()
}

export function createDataClient() {
  if (dataClient) return dataClient
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase data connection is not configured')
  return dataClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function resolveUserId(subject: string, accessToken: string): Promise<string> {
  const db = createDataClient()
  const { data: existing, error: lookupError } = await db
    .from('language_cards_oidc_identities')
    .select('user_id')
    .eq('issuer', issuer)
    .eq('subject', subject)
    .maybeSingle()
  if (lookupError) throw lookupError
  if (existing) return existing.user_id

  const response = await fetch('https://auth.sytko.de/application/o/userinfo/', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new AuthUnavailableError('OAuth userinfo unavailable')
  const profile = await response.json()
  if (profile?.sub !== subject) throw new Error('OAuth userinfo subject mismatch')
  const googleSubject = typeof profile.google_subject === 'string' && /^\d+$/.test(profile.google_subject)
    ? profile.google_subject : null
  // A Google identity must carry its immutable source ID. Never link by email.
  if (!googleSubject) throw new Error('Google source ID missing from OAuth profile')
  const { data: userId, error } = await db.rpc('language_cards_resolve_identity', {
    p_issuer: issuer,
    p_subject: subject,
    p_google_subject: googleSubject,
  })
  if (error || typeof userId !== 'string') throw error ?? new Error('Identity resolution failed')
  return userId
}

export function requireAuth(handler: (req: NextRequest, context: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context: any) => {
    let userId: string
    try {
      const session = await getAuth().getSession()
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      userId = await resolveUserId(session.user.id, session.access_token)
    } catch (error) {
      console.error('Authentication or identity lookup unavailable')
      return NextResponse.json({ error: 'Authentication unavailable' }, { status: 503 })
    }
    return handler(req, { ...context, user: { id: userId } })
  }
}
