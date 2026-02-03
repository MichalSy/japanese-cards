/**
 * Progress Storage for Japanese Cards
 * 
 * Structure:
 * {
 *   "hiragana": {
 *     "h-a": { "score": 3, "learned": true },
 *     "h-ka": { "score": -2, "learned": true }
 *   },
 *   "katakana": { ... },
 *   "words": { ... },
 *   "sentences": { ... }
 * }
 * 
 * Score Logic:
 * - Correct: score++ (no max)
 * - Wrong when positive: score = -1
 * - Wrong when negative: score-- (min: -5)
 * - learned: true once practiced
 */

const STORAGE_KEY = 'japanese-cards-progress'
const MIN_SCORE = -5

/**
 * Get all progress data
 */
export function getAllProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('Failed to load progress:', e)
    return {}
  }
}

/**
 * Save all progress data
 */
function saveAllProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

/**
 * Get progress for a specific category
 */
export function getCategoryProgress(category) {
  const all = getAllProgress()
  return all[category] || {}
}

/**
 * Get progress for a specific term
 */
export function getTermProgress(category, termId) {
  const categoryData = getCategoryProgress(category)
  return categoryData[termId] || { score: 0, learned: false }
}

/**
 * Record a correct answer
 */
export function recordCorrect(category, termId) {
  const all = getAllProgress()
  if (!all[category]) all[category] = {}
  
  const current = all[category][termId] || { score: 0, learned: false }
  
  all[category][termId] = {
    score: current.score + 1,
    learned: true
  }
  
  saveAllProgress(all)
  return all[category][termId]
}

/**
 * Record a wrong answer
 * - If score was positive: reset to -1
 * - If score was negative: decrement (min -5)
 */
export function recordWrong(category, termId) {
  const all = getAllProgress()
  if (!all[category]) all[category] = {}
  
  const current = all[category][termId] || { score: 0, learned: false }
  
  let newScore
  if (current.score >= 0) {
    // Was positive or zero, reset to -1
    newScore = -1
  } else {
    // Already negative, go more negative (min -5)
    newScore = Math.max(MIN_SCORE, current.score - 1)
  }
  
  all[category][termId] = {
    score: newScore,
    learned: true
  }
  
  saveAllProgress(all)
  return all[category][termId]
}

/**
 * Record multiple results at once (batch update)
 */
export function recordResults(category, results) {
  const all = getAllProgress()
  if (!all[category]) all[category] = {}
  
  results.forEach(({ termId, isCorrect }) => {
    const current = all[category][termId] || { score: 0, learned: false }
    
    let newScore
    if (isCorrect) {
      newScore = current.score + 1
    } else if (current.score >= 0) {
      newScore = -1
    } else {
      newScore = Math.max(MIN_SCORE, current.score - 1)
    }
    
    all[category][termId] = {
      score: newScore,
      learned: true
    }
  })
  
  saveAllProgress(all)
  return all[category]
}

/**
 * Get statistics for a category
 */
export function getCategoryStats(category) {
  const categoryData = getCategoryProgress(category)
  const terms = Object.values(categoryData)
  
  if (terms.length === 0) {
    return {
      totalLearned: 0,
      mastered: 0,      // score >= 3
      learning: 0,      // score 1-2
      struggling: 0,    // score <= 0
      averageScore: 0
    }
  }
  
  const learned = terms.filter(t => t.learned)
  const mastered = terms.filter(t => t.score >= 3)
  const learning = terms.filter(t => t.score >= 1 && t.score < 3)
  const struggling = terms.filter(t => t.score <= 0 && t.learned)
  const totalScore = terms.reduce((sum, t) => sum + t.score, 0)
  
  return {
    totalLearned: learned.length,
    mastered: mastered.length,
    learning: learning.length,
    struggling: struggling.length,
    averageScore: Math.round((totalScore / terms.length) * 10) / 10
  }
}

/**
 * Get overall statistics across all categories
 */
export function getOverallStats() {
  const all = getAllProgress()
  let totalLearned = 0
  let totalMastered = 0
  
  Object.values(all).forEach(category => {
    Object.values(category).forEach(term => {
      if (term.learned) totalLearned++
      if (term.score >= 3) totalMastered++
    })
  })
  
  return { totalLearned, totalMastered }
}

/**
 * Clear all progress (for testing/reset)
 */
export function clearAllProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Clear progress for a specific category
 */
export function clearCategoryProgress(category) {
  const all = getAllProgress()
  delete all[category]
  saveAllProgress(all)
}
