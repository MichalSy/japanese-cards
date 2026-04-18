export const fetchCategories = async () => {
  const res = await fetch('/api/data/categories')
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export const fetchCategoryConfig = async (categoryId) => {
  const res = await fetch(`/api/data/categories/${categoryId}`)
  if (!res.ok) throw new Error(`Failed to fetch ${categoryId} config`)
  return res.json()
}

export const fetchGroupData = async (categoryId, groupId) => {
  const res = await fetch(`/api/data/categories/${categoryId}/groups/${groupId}`)
  if (!res.ok) throw new Error('Failed to fetch group data')
  return res.json()
}

export const fetchGameModes = async () => {
  const res = await fetch('/api/data/gamemodes')
  if (!res.ok) throw new Error('Failed to fetch game modes')
  return res.json()
}

export const fetchAllItemsFromCategory = (categoryId) => fetchGroupData(categoryId, 'all')
