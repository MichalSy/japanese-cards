// Server-side in-memory cache for user settings, keyed by user ID.
// TTL: 5 min. Single-replica deployment (K8s), so cross-instance sync is not needed.

interface UserSettings {
  ui_language: string
  learn_language_id: string | null
}

interface CacheEntry extends UserSettings {
  cachedAt: number
}

const cache = new Map<string, CacheEntry>()
const TTL_MS = 5 * 60 * 1000

export function getCachedSettings(userId: string): UserSettings | null {
  const entry = cache.get(userId)
  if (!entry) return null
  if (Date.now() - entry.cachedAt > TTL_MS) { cache.delete(userId); return null }
  return { ui_language: entry.ui_language, learn_language_id: entry.learn_language_id }
}

export function setCachedSettings(userId: string, settings: UserSettings) {
  cache.set(userId, { ...settings, cachedAt: Date.now() })
}

export function invalidateCache(userId: string) {
  cache.delete(userId)
}

export async function resolveSettings(userId: string, supabase: any): Promise<UserSettings> {
  const cached = getCachedSettings(userId)
  if (cached) return cached

  let { data } = await supabase
    .from('language_cards_user_settings')
    .select('ui_language, learn_language_id')
    .eq('user_id', userId)
    .single()

  if (!data) {
    data = { ui_language: 'en', learn_language_id: 'ja' }
    await supabase
      .from('language_cards_user_settings')
      .insert({ user_id: userId, ...data })
  }

  setCachedSettings(userId, data)
  return data
}
