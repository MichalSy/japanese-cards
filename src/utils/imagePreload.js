const imagePromises = new Map()
const PRELOAD_TIMEOUT_MS = 2500

export function preloadImage(src) {
  if (!src) return Promise.resolve(null)
  if (imagePromises.has(src)) return imagePromises.get(src)

  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    const timeout = window.setTimeout(() => resolve(src), PRELOAD_TIMEOUT_MS)
    img.onload = () => {
      window.clearTimeout(timeout)
      resolve(src)
    }
    img.onerror = (error) => {
      window.clearTimeout(timeout)
      reject(error)
    }
    img.src = src
  })

  imagePromises.set(src, promise)
  return promise
}

export function preloadImagesInBackground(urls) {
  urls.forEach(url => {
    preloadImage(url).catch(() => {
      imagePromises.delete(url)
    })
  })
}
