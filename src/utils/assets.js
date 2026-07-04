const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const CONFIGURED_ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

export function getCardImageUrl(imageId) {
  if (!imageId) return null
  const baseUrl = CONFIGURED_ASSETS_URL
    || (SUPABASE_URL ? `${SUPABASE_URL}/storage/v1/render/image/public/language-cards` : null)
  return baseUrl ? `${baseUrl}/${imageId}.jpg` : null
}
