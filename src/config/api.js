export const API_CONFIG = {
  BASE_URL: '/GameData',
}

export const buildUrl = (path) => `${API_CONFIG.BASE_URL}/${path}`

export const fetchCategories = async () => {
  const response = await fetch(buildUrl('categories.json'))
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export const fetchCategoryConfig = async (categoryId) => {
  const response = await fetch(buildUrl(`${categoryId}/category.json`))
  if (!response.ok) throw new Error(`Failed to fetch ${categoryId} config`)
  return response.json()
}

export const fetchGroupData = async (categoryId, groupId) => {
  const response = await fetch(buildUrl(`${categoryId}/data/${categoryId}-${groupId}.json`))
  if (!response.ok) throw new Error('Failed to fetch group data')
  return response.json()
}

export const fetchGameModes = async () => {
  const response = await fetch(buildUrl('gamemodes.json'))
  if (!response.ok) throw new Error('Failed to fetch game modes')
  return response.json()
}

export const fetchAllItemsFromCategory = async (categoryId) => {
  const config = await fetchCategoryConfig(categoryId)
  const groupsData = await Promise.all(config.groups.map(group => fetchGroupData(categoryId, group.id)))
  const allItems = groupsData.reduce((acc, groupData) => [...acc, ...(groupData.items || [])], [])
  return {
    id: `${categoryId}-all`,
    name: `${config.name} - Alle kombiniert`,
    type: config.type,
    items: allItems,
  }
}
