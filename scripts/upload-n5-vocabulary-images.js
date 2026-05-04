const fs = require('fs')
const path = require('path')
const { randomUUID } = require('crypto')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(filePath) {
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
}

async function main() {
  loadEnv('.env.local')
  const lessonSlug = process.env.N5_VOCAB_IMAGE_LESSON
  if (!lessonSlug) throw new Error('N5_VOCAB_IMAGE_LESSON is required')
  const data = JSON.parse(fs.readFileSync('scripts/n5-vocabulary.json', 'utf8'))
  const lesson = data.lessons.find((entry) => entry.slug === lessonSlug)
  if (!lesson) throw new Error(`Lesson not found: ${lessonSlug}`)

  const imageDir = process.env.N5_VOCAB_IMAGE_DIR || path.join('tmp', 'n5-vocabulary-imagegen2', lessonSlug.replace(/^n5-vocab-/, ''))
  const activate = process.env.N5_VOCAB_ACTIVATE === '1'
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  let uploaded = 0
  for (const item of lesson.items) {
    const localPath = path.join(imageDir, `${item.slug}.jpg`)
    if (!fs.existsSync(localPath)) throw new Error(`Missing image: ${localPath}`)

    const { data: rows, error: selectError } = await supabase
      .from('language_cards_cards')
      .select('id')
      .eq('slug', item.slug)
      .eq('card_type', 'vocabulary')
    if (selectError) throw selectError
    const row = rows?.[0]
    if (!row) throw new Error(`Missing vocabulary card: ${item.slug}`)

    const imageId = randomUUID()
    const body = fs.readFileSync(localPath)
    const { error: uploadError } = await supabase.storage
      .from('language-cards')
      .upload(`${imageId}.jpg`, body, { contentType: 'image/jpeg', upsert: false })
    if (uploadError) throw uploadError

    const { error: updateError } = await supabase
      .from('language_cards_cards')
      .update({ image_id: imageId })
      .eq('id', row.id)
    if (updateError) throw updateError
    uploaded++
  }

  if (activate) {
    const { error: lessonError } = await supabase
      .from('language_cards_learning_lessons')
      .update({ is_active: true })
      .eq('slug', lessonSlug)
    if (lessonError) throw lessonError
  }

  console.log(JSON.stringify({ lesson: lessonSlug, uploaded, activated: activate }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
