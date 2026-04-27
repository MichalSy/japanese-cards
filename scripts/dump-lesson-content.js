const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(path) {
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

async function main() {
  const slug = process.argv[2]
  if (!slug) throw new Error('Usage: node scripts/dump-lesson-content.js <lesson-slug>')

  loadEnv('.env.local')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: lesson, error: lessonError } = await supabase
    .from('language_cards_course_lessons')
    .select('id,slug,is_active,sort_order')
    .eq('slug', slug)
    .single()

  if (lessonError) throw lessonError

  const { data: cards, error: cardsError } = await supabase
    .from('language_cards_course_lesson_cards')
    .select(`
      sort_order,
      language_cards_cards (
        id, slug, card_type, native, transliteration, image_id, data
      )
    `)
    .eq('lesson_id', lesson.id)
    .order('sort_order')

  if (cardsError) throw cardsError

  console.log(JSON.stringify({
    lesson,
    cards: cards.map((entry) => ({
      sort_order: entry.sort_order,
      ...entry.language_cards_cards,
    })),
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
