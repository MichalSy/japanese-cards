const fs = require('fs')
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
  const lessonSlug = process.argv[2] || process.env.N5_VOCAB_LESSON
  if (!lessonSlug) throw new Error('Lesson slug is required')
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: lessons, error: lessonError } = await supabase
    .from('language_cards_learning_lessons')
    .select('id,slug,is_active')
    .eq('slug', lessonSlug)
  if (lessonError) throw lessonError
  const lesson = lessons?.[0]
  if (!lesson) throw new Error(`Lesson not found: ${lessonSlug}`)

  const { data: links, error: linkError } = await supabase
    .from('language_cards_learning_lesson_cards')
    .select('sort_order, language_cards_cards(slug,card_type,native,transliteration,image_id,audio_url)')
    .eq('lesson_id', lesson.id)
    .order('sort_order')
  if (linkError) throw linkError

  const cards = (links ?? []).map((link) => link.language_cards_cards).filter(Boolean)
  const vocab = cards.filter((card) => card.card_type === 'vocabulary')
  const quiz = cards.filter((card) => card.card_type === 'quiz_4_option')
  const missing = vocab.filter((card) => !card.image_id || !card.audio_url)
  console.log(JSON.stringify({
    lesson: lesson.slug,
    active: lesson.is_active,
    total: cards.length,
    vocabulary: vocab.length,
    quiz: quiz.length,
    withImage: vocab.filter((card) => !!card.image_id).length,
    withAudio: vocab.filter((card) => !!card.audio_url).length,
    missing: missing.map((card) => card.slug),
    natives: vocab.map((card) => `${card.slug}:${card.native}`),
  }, null, 2))

  if (vocab.length !== 10 || quiz.length !== 10 || missing.length) process.exit(2)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
