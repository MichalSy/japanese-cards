const imagePromises = new Map()
const loadedImages = new Set()
const PRELOAD_TIMEOUT_MS = 2500

export function isImagePreloaded(src) {
  return loadedImages.has(src)
}

export function preloadImage(src) {
  if (!src) return Promise.resolve(null)
  if (imagePromises.has(src)) return imagePromises.get(src)

  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    const markLoaded = () => {
      loadedImages.add(src)
      resolve(src)
    }
    const timeout = window.setTimeout(markLoaded, PRELOAD_TIMEOUT_MS)
    img.onload = () => {
      window.clearTimeout(timeout)
      markLoaded()
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
      loadedImages.delete(url)
    })
  })
}
