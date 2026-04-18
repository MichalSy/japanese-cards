// All progress is stored server-side in Supabase.
// No localStorage. Client accumulates results during gameplay,
// then batch-syncs to server at session end.

export async function syncProgressToServer(category, results) {
  if (!results?.length) return
  await fetch(`/api/progress/${category}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results }),
  })
}

export async function fetchProgressFromServer(category) {
  try {
    const res = await fetch(`/api/progress/${category}`)
    if (!res.ok) return {}
    const { progress } = await res.json()
    return progress ?? {}
  } catch {
    return {}
  }
}

export function computeGroupProgress(groupItems, progress) {
  if (!groupItems?.length) return 0
  // score = correct_count - incorrect_count, threshold = 3
  const mastered = groupItems.filter(item => (progress[item.id]?.score ?? 0) >= 3).length
  return Math.round((mastered / groupItems.length) * 100)
}

export const MASTERY_THRESHOLD = 3  // net score (correct - incorrect) needed to be "mastered"

export function computeCategoryStats(progress) {
  const terms = Object.values(progress)
  if (!terms.length) return { totalLearned: 0, mastered: 0, learning: 0, struggling: 0 }
  return {
    totalLearned: terms.filter(t => t.learned).length,
    mastered:     terms.filter(t => t.score >= 3).length,
    learning:     terms.filter(t => t.score >= 1 && t.score < 3).length,
    struggling:   terms.filter(t => t.score <= 0 && t.learned).length,
  }
}
