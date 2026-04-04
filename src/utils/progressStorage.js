const STORAGE_KEY = 'japanese-cards'
const MIN_SCORE = -5

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

function saveCategoryData(category, data) {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    allData[category] = data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
  } catch (e) {
    console.error('Failed to save data:', e)
  }
}

export function getCategoryProgress(category) {
  return getCategoryData(category).progress || {}
}

export function getTermProgress(category, termId) {
  return getCategoryProgress(category)[termId] || { score: 0, learned: false }
}

export function recordCorrect(category, termId) {
  const categoryData = getCategoryData(category)
  const progress = categoryData.progress || {}
  const current = progress[termId] || { score: 0, learned: false }
  progress[termId] = { score: current.score + 1, learned: true }
  categoryData.progress = progress
  categoryData.lastPlayed = new Date().toISOString()
  saveCategoryData(category, categoryData)
  return progress[termId]
}

export function recordWrong(category, termId) {
  const categoryData = getCategoryData(category)
  const progress = categoryData.progress || {}
  const current = progress[termId] || { score: 0, learned: false }
  const newScore = current.score >= 0 ? -1 : Math.max(MIN_SCORE, current.score - 1)
  progress[termId] = { score: newScore, learned: true }
  categoryData.progress = progress
  categoryData.lastPlayed = new Date().toISOString()
  saveCategoryData(category, categoryData)
  return progress[termId]
}

export function recordResults(category, results) {
  const categoryData = getCategoryData(category)
  const progress = categoryData.progress || {}
  results.forEach(({ termId, isCorrect }) => {
    const current = progress[termId] || { score: 0, learned: false }
    const newScore = isCorrect
      ? current.score + 1
      : current.score >= 0 ? -1 : Math.max(MIN_SCORE, current.score - 1)
    progress[termId] = { score: newScore, learned: true }
  })
  categoryData.progress = progress
  categoryData.lastPlayed = new Date().toISOString()
  saveCategoryData(category, categoryData)
  return progress
}

export function getCategoryStats(category) {
  const progress = getCategoryProgress(category)
  const terms = Object.values(progress)
  if (terms.length === 0) return { totalLearned: 0, mastered: 0, learning: 0, struggling: 0, averageScore: 0 }
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

export function getOverallStats() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    let totalLearned = 0, totalMastered = 0
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

export function clearAllProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

export function clearCategoryProgress(category) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  if (data[category]) data[category].progress = {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getGroupProgress(groupItems, category) {
  if (!groupItems || groupItems.length === 0) return 0
  const progress = getCategoryProgress(category)
  const masteredItems = groupItems.filter(item => {
    const termProgress = progress[item.id] || { score: 0, learned: false }
    return termProgress.score >= 3
  }).length
  return Math.round((masteredItems / groupItems.length) * 100)
}
