const imagePromises = new Map()

export function preloadImage(src) {
  if (!src) return Promise.resolve(null)
  if (imagePromises.has(src)) return imagePromises.get(src)

  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = async () => {
      try {
        if (img.decode) await img.decode()
      } catch {
        // The image is already loaded; decode failures should not block display.
      }
      resolve(src)
    }
    img.onerror = reject
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
