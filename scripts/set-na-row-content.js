const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const cp = (...xs) => String.fromCodePoint(...xs)

function loadEnv(path) {
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

async function main() {
  loadEnv('.env.local')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const kana = {
    na: cp(0x306a),
    ni: cp(0x306b),
    nu: cp(0x306c),
    ne: cp(0x306d),
    no: cp(0x306e),
  }

  const updates = {
    'info-na-row-intro': {
      content_md: {
        de: '# Willkommen zur\nNa-Reihe!\n\nDie N-Reihe bleibt gleichmäßig: Na Ni Nu Ne No.\n\n| ' + kana.na + ' | ' + kana.ni + ' | ' + kana.nu + ' | ' + kana.ne + ' | ' + kana.no + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Na | Ni | Nu | Ne | No |',
        en: '# Welcome to the\nNa Row!\n\nThe N row stays regular: Na Ni Nu Ne No.\n\n| ' + kana.na + ' | ' + kana.ni + ' | ' + kana.nu + ' | ' + kana.ne + ' | ' + kana.no + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Na | Ni | Nu | Ne | No |',
      },
    },
    'h-na': {
      mnemonic: {
        de: 'Der Nacho beginnt mit Na\nSalsa-Haken und Chip formen ' + kana.na,
        en: 'The nacho starts with Na\nsalsa hook and chip form ' + kana.na,
      },
    },
    'h-ni': {
      mnemonic: {
        de: 'Der Ninja beginnt mit Ni\nzwei Stäbe stehen wie ' + kana.ni,
        en: 'The ninja starts with Ni\ntwo sticks stand like ' + kana.ni,
      },
    },
    'h-nu': {
      mnemonic: {
        de: 'Die Nudel beginnt mit Nu\nihre Schleife dreht sich wie ' + kana.nu,
        en: 'The noodle starts with Nu\nits loop curls like ' + kana.nu,
      },
    },
    'h-ne': {
      mnemonic: {
        de: 'Das Nest beginnt mit Ne\nAst und Nestschleife formen ' + kana.ne,
        en: 'The nest starts with Ne\ntwig and nest loop form ' + kana.ne,
      },
    },
    'h-no': {
      mnemonic: {
        de: 'Der Nori-Ring beginnt mit No\nseine Runde ist ' + kana.no,
        en: 'The nori ring starts with No\nits circle is ' + kana.no,
      },
    },
  }

  const changed = []

  for (const [slug, data] of Object.entries(updates)) {
    const { error } = await supabase
      .from('language_cards_cards')
      .update({ data })
      .eq('slug', slug)

    if (error) throw error
    changed.push(slug)
  }

  const { data: lesson, error: lessonError } = await supabase
    .from('language_cards_course_lessons')
    .select('id')
    .eq('slug', 'na-row')
    .single()

  if (lessonError) throw lessonError

  const desiredOrder = [
    'info-na-row-intro',
    'h-na',
    'h-ni',
    'h-nu',
    'h-ne',
    'h-no',
    'quiz-h-na',
    'quiz-h-ni',
    'quiz-h-nu',
    'quiz-h-ne',
    'quiz-h-no',
  ]

  const { data: cards, error: cardsError } = await supabase
    .from('language_cards_cards')
    .select('id,slug')
    .in('slug', desiredOrder)

  if (cardsError) throw cardsError

  const cardIdBySlug = Object.fromEntries(cards.map((card) => [card.slug, card.id]))

  const { error: removeError } = await supabase
    .from('language_cards_course_lesson_cards')
    .delete()
    .eq('lesson_id', lesson.id)

  if (removeError) throw removeError

  const rows = desiredOrder.map((slug, index) => ({
    lesson_id: lesson.id,
    card_id: cardIdBySlug[slug],
    sort_order: index + 1,
  }))

  const { error: insertError } = await supabase
    .from('language_cards_course_lesson_cards')
    .insert(rows)

  if (insertError) throw insertError

  const { error: activeError } = await supabase
    .from('language_cards_course_lessons')
    .update({ is_active: true })
    .eq('slug', 'na-row')

  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'na-row', order: desiredOrder }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
