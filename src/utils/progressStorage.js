// During gameplay: localStorage (instant feedback, no latency).
// On session end: batch sync to Supabase via /api/progress/[category].
// On page load: fetch from server to populate local cache.

const LOCAL_KEY = 'jc-progress'
const MIN_SCORE = -5

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') } catch { return {} }
}

function saveLocal(data) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)) } catch {}
}

// ── Local read/write (sync, used during gameplay) ─────────────────────────

export function getCategoryProgress(category) {
  return loadLocal()[category]?.progress ?? {}
}

export function getTermProgress(category, termId) {
  return getCategoryProgress(category)[termId] ?? { score: 0, learned: false }
}

export function recordCorrect(category, termId) {
  const all = loadLocal()
  const cat = all[category] ?? { progress: {} }
  const cur = cat.progress[termId] ?? { score: 0, learned: false }
  cat.progress[termId] = { score: cur.score + 1, learned: true }
  cat.lastPlayed = new Date().toISOString()
  all[category] = cat
  saveLocal(all)
  return cat.progress[termId]
}

export function recordWrong(category, termId) {
  const all = loadLocal()
  const cat = all[category] ?? { progress: {} }
  const cur = cat.progress[termId] ?? { score: 0, learned: false }
  const newScore = cur.score >= 0 ? -1 : Math.max(MIN_SCORE, cur.score - 1)
  cat.progress[termId] = { score: newScore, learned: true }
  cat.lastPlayed = new Date().toISOString()
  all[category] = cat
  saveLocal(all)
  return cat.progress[termId]
}

export function recordResults(category, results) {
  const all = loadLocal()
  const cat = all[category] ?? { progress: {} }
  results.forEach(({ termId, isCorrect }) => {
    const cur = cat.progress[termId] ?? { score: 0, learned: false }
    const newScore = isCorrect ? cur.score + 1 : cur.score >= 0 ? -1 : Math.max(MIN_SCORE, cur.score - 1)
    cat.progress[termId] = { score: newScore, learned: true }
  })
  cat.lastPlayed = new Date().toISOString()
  all[category] = cat
  saveLocal(all)
  return cat.progress
}

// ── Server sync (async) ────────────────────────────────────────────────────

export async function syncProgressToServer(category, results) {
  try {
    await fetch(`/api/progress/${category}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        results: results.map(({ termId, isCorrect }) => ({ cardSlug: termId, isCorrect })),
      }),
    })
  } catch (e) {
    console.error('Progress sync failed:', e)
  }
}

export async function loadProgressFromServer(category) {
  try {
    const res = await fetch(`/api/progress/${category}`)
    if (!res.ok) return getCategoryProgress(category)
    const { progress } = await res.json()
    const all = loadLocal()
    all[category] = { ...all[category], progress }
    saveLocal(all)
    return progress
  } catch {
    return getCategoryProgress(category)
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────

export function getCategoryStats(category) {
  const terms = Object.values(getCategoryProgress(category))
  if (!terms.length) return { totalLearned: 0, mastered: 0, learning: 0, struggling: 0, averageScore: 0 }
  return {
    totalLearned: terms.filter((t) => t.learned).length,
    mastered: terms.filter((t) => t.score >= 3).length,
    learning: terms.filter((t) => t.score >= 1 && t.score < 3).length,
    struggling: terms.filter((t) => t.score <= 0 && t.learned).length,
    averageScore: Math.round((terms.reduce((s, t) => s + t.score, 0) / terms.length) * 10) / 10,
  }
}

export function getGroupProgress(groupItems, category) {
  if (!groupItems?.length) return 0
  const progress = getCategoryProgress(category)
  const mastered = groupItems.filter((item) => (progress[item.id]?.score ?? 0) >= 3).length
  return Math.round((mastered / groupItems.length) * 100)
}

export function getOverallStats() {
  try {
    let totalLearned = 0, totalMastered = 0
    Object.values(loadLocal()).forEach((cat) => {
      Object.values(cat.progress || {}).forEach((t) => {
        if (t.learned) totalLearned++
        if (t.score >= 3) totalMastered++
      })
    })
    return { totalLearned, totalMastered }
  } catch {
    return { totalLearned: 0, totalMastered: 0 }
  }
}

export function clearAllProgress() { localStorage.removeItem(LOCAL_KEY) }

export function clearCategoryProgress(category) {
  const all = loadLocal()
  if (all[category]) all[category].progress = {}
  saveLocal(all)
}
