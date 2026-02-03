/**
 * Progress Storage for Japanese Cards
 * 
 * Structure:
 * {
 *   "hiragana": {
 *     "progress": {
 *       "h-a": { "score": 3, "learned": true },
 *       "h-ka": { "score": -2, "learned": true }
 *     },
 *     "lastPlayed": "2026-02-03T15:00:00Z"
 *   },
 *   "katakana": {
 *     "progress": { ... }
 *   }
 * }
 * 
 * Score Logic:
 * - Correct: score++ (no max)
 * - Wrong when positive: score = -1
 * - Wrong when negative: score-- (min: -5)
 * - learned: true once practiced
 */

const STORAGE_KEY = 'japanese-cards'
const MIN_SCORE = -5

/**
 * Get all data for a category
 */
export function getCategoryData(category) {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const allData = data ? JSON.parse(data) : {}
    return allData[category] || { progress: {} }
  } catch (e) {
    console.error('Failed to load data:', e)
    return { progress: {} }
  }
}

/**
 * Save category data
 */
function saveCategoryData(category, data) {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    allData[category] = data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
  } catch (e) {
    console.error('Failed to save data:', e)
  }
}

/**
 * Get progress for a specific category
 */
export function getCategoryProgress(category) {
  const categoryData = getCategoryData(category)
  return categoryData.progress || {}
}

/**
 * Get progress for a specific term
 */
export function getTermProgress(category, termId) {
  const progress = getCategoryProgress(category)
  return progress[termId] || { score: 0, learned: false }
}

/**
 * Record a correct answer
 */
export function recordCorrect(category, termId) {
  const categoryData = getCategoryData(category)
  const progress = categoryData.progress || {}
  
  const current = progress[termId] || { score: 0, learned: false }
  
  progress[termId] = {
    score: current.score + 1,
    learned: true
  }
  
  categoryData.progress = progress
  categoryData.lastPlayed = new Date().toISOString()
  saveCategoryData(category, categoryData)
  
  return progress[termId]
}

/**
 * Record a wrong answer
 * - If score was positive: reset to -1
 * - If score was negative: decrement (min -5)
 */
export function recordWrong(category, termId) {
  const categoryData = getCategoryData(category)
  const progress = categoryData.progress || {}
  
  const current = progress[termId] || { score: 0, learned: false }
  
  let newScore
  if (current.score >= 0) {
    newScore = -1
  } else {
    newScore = Math.max(MIN_SCORE, current.score - 1)
  }
  
  progress[termId] = {
    score: newScore,
    learned: true
  }
  
  categoryData.progress = progress
  categoryData.lastPlayed = new Date().toISOString()
  saveCategoryData(category, categoryData)
  
  return progress[termId]
}

/**
 * Record multiple results at once (batch update)
 */
export function recordResults(category, results) {
  const categoryData = getCategoryData(category)
  const progress = categoryData.progress || {}
  
  results.forEach(({ termId, isCorrect }) => {
    const current = progress[termId] || { score: 0, learned: false }
    
    let newScore
    if (isCorrect) {
      newScore = current.score + 1
    } else if (current.score >= 0) {
      newScore = -1
    } else {
      newScore = Math.max(MIN_SCORE, current.score - 1)
    }
    
    progress[termId] = {
      score: newScore,
      learned: true
    }
  })
  
  categoryData.progress = progress
  categoryData.lastPlayed = new Date().toISOString()
  saveCategoryData(category, categoryData)
  
  return progress
}

/**
 * Get statistics for a category
 */
export function getCategoryStats(category) {
  const progress = getCategoryProgress(category)
  const terms = Object.values(progress)
  
  if (terms.length === 0) {
    return {
      totalLearned: 0,
      mastered: 0,
      learning: 0,
      struggling: 0,
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
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    let totalLearned = 0
    let totalMastered = 0
    
    Object.values(data).forEach(category => {
      const progress = category.progress || {}
      Object.values(progress).forEach(term => {
        if (term.learned) totalLearned++
        if (term.score >= 3) totalMastered++
      })
    })
    
    return { totalLearned, totalMastered }
  } catch (e) {
    console.error('Failed to get overall stats:', e)
    return { totalLearned: 0, totalMastered: 0 }
  }
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
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  if (data[category]) {
    data[category].progress = {}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * Calculate progress percentage for a group
 * @param {Array} groupItems - Array of items in the group (from API)
 * @param {string} category - Category name (hiragana, katakana, etc.)
 * @returns {number} Percentage of items with score > 0
 */
export function getGroupProgress(groupItems, category) {
  if (!groupItems || groupItems.length === 0) return 0
  
  const progress = getCategoryProgress(category)
  const itemsWithPositiveScore = groupItems.filter(item => {
    const termProgress = progress[item.id] || { score: 0, learned: false }
    return termProgress.score > 0
  }).length
  
  return Math.round((itemsWithPositiveScore / groupItems.length) * 100)
}
