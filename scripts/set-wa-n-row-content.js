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
    wa: cp(0x308f),
    wo: cp(0x3092),
    n: cp(0x3093),
    ne: cp(0x306d),
    so: cp(0x305d),
  }

  const updates = {
    'info-wa-n-row-intro': {
      content_md: {
        de: '# Willkommen zur\nWa/N-Reihe!\n\nZum Schluss kommen Wa, Wo und das einzelne N.\n\n| ' + kana.wa + ' | ' + kana.wo + ' | ' + kana.n + ' |\n|:---:|:---:|:---:|\n| Wa | Wo | N |',
        en: '# Welcome to the\nWa/N Row!\n\nLast come Wa, Wo, and the single N.\n\n| ' + kana.wa + ' | ' + kana.wo + ' | ' + kana.n + ' |\n|:---:|:---:|:---:|\n| Wa | Wo | N |',
      },
    },
    'h-wa': {
      mnemonic: {
        de: 'Die Waffel beginnt mit Wa\nKante und Kurve führen zu ' + kana.wa,
        en: 'The waffle starts with Wa\nedge and curve lead to ' + kana.wa,
      },
    },
    'h-wo': {
      mnemonic: {
        de: 'Der Wok beginnt mit Wo\nRand und Griff erinnern an ' + kana.wo,
        en: 'The wok starts with Wo\nrim and handle point to ' + kana.wo,
      },
    },
    'h-n': {
      mnemonic: {
        de: 'Die Nase endet mit N\ndie einzelne Kurve ist ' + kana.n,
        en: 'The nose ends with N\nthe single curve is ' + kana.n,
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
    .eq('slug', 'wa-n-row')
    .single()
  if (lessonError) throw lessonError

  const { data: anchorCard, error: anchorError } = await supabase
    .from('language_cards_cards')
    .select('group_id')
    .eq('slug', 'h-wa')
    .single()
  if (anchorError) throw anchorError

  const waCompareSlug = 'info-wa-n-row-wa-ne-compare'
  await upsertInfoCard(supabase, waCompareSlug, anchorCard.group_id, {
    content_md: {
      de: '# ' + kana.wa + ' oder ' + kana.ne + '\n\n| ' + kana.ne + ' | ' + kana.wa + ' |\n|:---:|:---:|\n| Ne | Wa |\n\n' + kana.ne + ' hat unten rechts die Nest-Schleife.\n' + kana.wa + ' öffnet sich wie die Waffel-Kurve.',
      en: '# ' + kana.wa + ' or ' + kana.ne + '\n\n| ' + kana.ne + ' | ' + kana.wa + ' |\n|:---:|:---:|\n| Ne | Wa |\n\n' + kana.ne + ' has the nest loop at the lower right.\n' + kana.wa + ' opens like the waffle curve.',
    },
  })
  changed.push(waCompareSlug)

  const nCompareSlug = 'info-wa-n-row-n-so-compare'
  await upsertInfoCard(supabase, nCompareSlug, anchorCard.group_id, {
    content_md: {
      de: '# ' + kana.n + ' oder ' + kana.so + '\n\n| ' + kana.so + ' | ' + kana.n + ' |\n|:---:|:---:|\n| So | N |\n\n' + kana.so + ' hat oben den deutlichen Startstrich.\n' + kana.n + ' ist nur die glatte Nasen-Kurve.',
      en: '# ' + kana.n + ' or ' + kana.so + '\n\n| ' + kana.so + ' | ' + kana.n + ' |\n|:---:|:---:|\n| So | N |\n\n' + kana.so + ' has the clear starting stroke on top.\n' + kana.n + ' is only the smooth nose curve.',
    },
  })
  changed.push(nCompareSlug)

  const desiredOrder = [
    'info-wa-n-row-intro',
    'h-wa',
    waCompareSlug,
    'h-wo',
    'h-n',
    nCompareSlug,
    'quiz-h-wa',
    'quiz-h-wo',
    'quiz-h-n',
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
    .eq('slug', 'wa-n-row')
  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'wa-n-row', order: desiredOrder }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
