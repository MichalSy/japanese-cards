const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(path) {
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

function isSuspicious(text) {
  return /[\uFFFD]|Ã|ã|[A-Za-zÄÖÜäöüß]\?[A-Za-zÄÖÜäöüß]/.test(text)
}

async function main() {
  loadEnv('.env.local')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: lessons, error: lessonsError } = await supabase
    .from('language_cards_course_lessons')
    .select('id,slug,is_active,sort_order')
    .order('sort_order')

  if (lessonsError) throw lessonsError

  const { data: links, error: linksError } = await supabase
    .from('language_cards_course_lesson_cards')
    .select('lesson_id,card_id,sort_order')
    .order('sort_order')

  if (linksError) throw linksError

  const cardIds = [...new Set(links.map((link) => link.card_id))]
  const { data: cards, error: cardsError } = await supabase
    .from('language_cards_cards')
    .select('id,slug,card_type,native,transliteration,data')
    .in('id', cardIds)

  if (cardsError) throw cardsError

  const cardsById = Object.fromEntries(cards.map((card) => [card.id, card]))
  const lessonsById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]))
  const findings = []
  const activeCards = []

  for (const link of links) {
    const lesson = lessonsById[link.lesson_id]
    const card = cardsById[link.card_id]
    const text = JSON.stringify(card?.data ?? {})

    if (isSuspicious(text)) {
      findings.push({
        lesson: lesson?.slug,
        active: lesson?.is_active,
        order: link.sort_order,
        card: card?.slug,
        type: card?.card_type,
        native: card?.native,
        transliteration: card?.transliteration,
        data: card?.data,
      })
    }

    if (lesson?.is_active) {
      activeCards.push({
        lesson: lesson.slug,
        order: link.sort_order,
        card: card?.slug,
        type: card?.card_type,
        native: card?.native,
        transliteration: card?.transliteration,
        data: card?.data,
      })
    }
  }

  console.log(JSON.stringify({
    activeLessons: lessons
      .filter((lesson) => lesson.is_active)
      .map((lesson) => lesson.slug),
    findings,
    activeCards: process.argv.includes('--dump-active') ? activeCards : undefined,
  }, null, 2))

  if (findings.length > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
