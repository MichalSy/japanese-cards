const fs = require('fs')
const { randomUUID } = require('crypto')
const { createClient } = require('@supabase/supabase-js')

const cp = (...xs) => String.fromCodePoint(...xs)

function loadEnv(path) {
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

async function upsertInfoCard(supabase, slug, groupId, data) {
  const { data: existing, error: selectError } = await supabase
    .from('language_cards_cards')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (selectError) throw selectError

  if (existing) {
    const { error } = await supabase
      .from('language_cards_cards')
      .update({ data, is_active: true })
      .eq('id', existing.id)

    if (error) throw error
    return existing.id
  }

  const id = randomUUID()
  const { error } = await supabase
    .from('language_cards_cards')
    .insert({
      id,
      group_id: groupId,
      slug,
      card_type: 'info',
      native: null,
      transliteration: null,
      image_id: null,
      audio_url: null,
      sort_order: 0,
      is_active: true,
      data,
    })

  if (error) throw error
  return id
}

async function main() {
  loadEnv('.env.local')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const kana = {
    ma: cp(0x307e),
    mi: cp(0x307f),
    mu: cp(0x3080),
    me: cp(0x3081),
    mo: cp(0x3082),
    nu: cp(0x306c),
  }

  const updates = {
    'info-ma-row-intro': {
      content_md: {
        de: '# Willkommen zur\nMa-Reihe!\n\nDie M-Reihe ist weich und rund: Ma Mi Mu Me Mo.\n\n| ' + kana.ma + ' | ' + kana.mi + ' | ' + kana.mu + ' | ' + kana.me + ' | ' + kana.mo + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ma | Mi | Mu | Me | Mo |',
        en: '# Welcome to the\nMa Row!\n\nThe M row is soft and round: Ma Mi Mu Me Mo.\n\n| ' + kana.ma + ' | ' + kana.mi + ' | ' + kana.mu + ' | ' + kana.me + ' | ' + kana.mo + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ma | Mi | Mu | Me | Mo |',
      },
    },
    'h-ma': {
      mnemonic: {
        de: 'Die Maus beginnt mit Ma\nOhren und Schwanz führen zu ' + kana.ma,
        en: 'The mouse starts with Ma\nears and tail lead to ' + kana.ma,
      },
    },
    'h-mi': {
      mnemonic: {
        de: 'Das Mikro beginnt mit Mi\ndrei Klanglinien schwingen wie ' + kana.mi,
        en: 'The mic starts with Mi\nthree sound lines swing like ' + kana.mi,
      },
    },
    'h-mu': {
      mnemonic: {
        de: 'Der Muffin beginnt mit Mu\nKrümel und Schleife drehen sich wie ' + kana.mu,
        en: 'The muffin starts with Mu\ncrumbs and loop curl like ' + kana.mu,
      },
    },
    'h-me': {
      mnemonic: {
        de: 'Die Melone beginnt mit Me\nRinde und Kerne kreuzen sich wie ' + kana.me,
        en: 'The melon starts with Me\nrind and seeds cross like ' + kana.me,
      },
    },
    'h-mo': {
      mnemonic: {
        de: 'Das Moped beginnt mit Mo\nRad und Lenker erinnern an ' + kana.mo,
        en: 'The moped starts with Mo\nwheel and handle point to ' + kana.mo,
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
    .eq('slug', 'ma-row')
    .single()

  if (lessonError) throw lessonError

  const { data: anchorCard, error: anchorError } = await supabase
    .from('language_cards_cards')
    .select('group_id')
    .eq('slug', 'h-ma')
    .single()

  if (anchorError) throw anchorError

  const compareSlug = 'info-ma-row-me-nu-compare'
  await upsertInfoCard(supabase, compareSlug, anchorCard.group_id, {
    content_md: {
      de: '# ' + kana.me + ' oder ' + kana.nu + '\n\n| ' + kana.me + ' | ' + kana.nu + ' |\n|:---:|:---:|\n| Me | Nu |\n\n' + kana.me + ' ist die einfache Melonen-Kreuzung.\n' + kana.nu + ' hat rechts unten den extra Haken.',
      en: '# ' + kana.me + ' or ' + kana.nu + '\n\n| ' + kana.me + ' | ' + kana.nu + ' |\n|:---:|:---:|\n| Me | Nu |\n\n' + kana.me + ' is the simple melon crossing.\n' + kana.nu + ' has the extra hook at the lower right.',
    },
  })
  changed.push(compareSlug)

  const desiredOrder = [
    'info-ma-row-intro',
    'h-ma',
    'h-mi',
    'h-mu',
    'h-me',
    compareSlug,
    'h-mo',
    'quiz-h-ma',
    'quiz-h-mi',
    'quiz-h-mu',
    'quiz-h-me',
    'quiz-h-mo',
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
    .eq('slug', 'ma-row')

  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'ma-row', order: desiredOrder }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
