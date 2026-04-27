const fs = require('fs')
const path = require('path')
const { randomUUID } = require('crypto')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(filePath) {
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

async function main() {
  const pairs = process.argv.slice(2)
  if (pairs.length === 0 || pairs.some((pair) => !pair.includes('='))) {
    throw new Error('Usage: node scripts/upload-card-images.js card-slug=path/to/image.jpg ...')
  }

  loadEnv('.env.local')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const uploaded = []

  for (const pair of pairs) {
    const [slug, filePath] = pair.split('=')
    const imageId = randomUUID()
    const storagePath = `${imageId}${path.extname(filePath).toLowerCase()}`
    const body = fs.readFileSync(filePath)

    const { error: uploadError } = await supabase.storage
      .from('language-cards')
      .upload(storagePath, body, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { error: updateError } = await supabase
      .from('language_cards_cards')
      .update({ image_id: imageId })
      .eq('slug', slug)

    if (updateError) throw updateError

    uploaded.push({ slug, imageId, storagePath })
  }

  console.log(JSON.stringify({ uploaded }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
