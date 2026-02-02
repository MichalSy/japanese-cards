// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://raw.githubusercontent.com/MichalSy/japanese-cards/refs/heads/main/public/GameData',
}

// Helper function to build URLs
export const buildUrl = (path) => {
  return `${API_CONFIG.BASE_URL}/${path}`
}

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(buildUrl('categories.json'))
    if (!response.ok) throw new Error('Failed to fetch categories')
    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Fetch category config
export const fetchCategoryConfig = async (categoryId) => {
  try {
    const response = await fetch(buildUrl(`${categoryId}/category.json`))
    if (!response.ok) throw new Error(`Failed to fetch ${categoryId} config`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching category config for ${categoryId}:`, error)
    throw error
  }
}

// Fetch group data
export const fetchGroupData = async (categoryId, groupId) => {
  try {
    const response = await fetch(buildUrl(`${categoryId}/data/${categoryId}-${groupId}.json`))
    if (!response.ok) throw new Error(`Failed to fetch group data`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching group data for ${categoryId}/${groupId}:`, error)
    throw error
  }
}

// Fetch game modes config
export const fetchGameModes = async () => {
  try {
    const response = await fetch(buildUrl('gamemodes.json'))
    if (!response.ok) throw new Error('Failed to fetch game modes')
    return await response.json()
  } catch (error) {
    console.error('Error fetching game modes:', error)
    throw error
  }
}
