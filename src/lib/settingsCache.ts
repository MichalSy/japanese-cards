// Server-side in-memory cache for user settings, keyed by user ID.
// TTL: 5 min. Single-replica K8s deployment, so cross-instance sync is not needed.
// Promise coalescing prevents thundering herd when multiple requests arrive simultaneously.

interface UserSettings {
  ui_language: string
  learn_language_id: string | null
  show_translations_by_default: boolean
}

interface CacheEntry extends UserSettings {
  cachedAt: number
}

const cache = new Map<string, CacheEntry>()
const pending = new Map<string, Promise<UserSettings>>()
const TTL_MS = 5 * 60 * 1000

function getCached(userId: string): UserSettings | null {
  const entry = cache.get(userId)
  if (!entry) return null
  if (Date.now() - entry.cachedAt > TTL_MS) { cache.delete(userId); return null }
  return {
    ui_language: entry.ui_language,
    learn_language_id: entry.learn_language_id,
    show_translations_by_default: entry.show_translations_by_default,
  }
}

export function setCachedSettings(userId: string, settings: UserSettings) {
  cache.set(userId, { ...settings, cachedAt: Date.now() })
}

export function invalidateCache(userId: string) {
  cache.delete(userId)
  pending.delete(userId)
}

export async function resolveSettings(userId: string, supabase: any): Promise<UserSettings> {
  const cached = getCached(userId)
  if (cached) return cached

  // Coalesce: if a DB request for this user is already in-flight, reuse it
  const inflight = pending.get(userId)
  if (inflight) return inflight

  const promise = (async (): Promise<UserSettings> => {
    try {
      let { data } = await supabase
        .from('language_cards_user_settings')
        .select('ui_language, learn_language_id, show_translations_by_default')
        .eq('user_id', userId)
        .single()

      if (!data) {
        data = { ui_language: 'en', learn_language_id: 'ja', show_translations_by_default: true }
        await supabase.from('language_cards_user_settings').insert({ user_id: userId, ...data })
      }

      setCachedSettings(userId, data)
      return data
    } finally {
      pending.delete(userId)
    }
  })()

  pending.set(userId, promise)
  return promise
}
