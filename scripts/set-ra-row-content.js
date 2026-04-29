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
    ra: cp(0x3089),
    ri: cp(0x308a),
    ru: cp(0x308b),
    re: cp(0x308c),
    ro: cp(0x308d),
    ne: cp(0x306d),
  }

  const updates = {
    'info-ra-row-intro': {
      content_md: {
        de: '# Willkommen zur\nRa-Reihe!\n\nDie R-Reihe klingt leicht zwischen R und L.\n\n| ' + kana.ra + ' | ' + kana.ri + ' | ' + kana.ru + ' | ' + kana.re + ' | ' + kana.ro + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ra | Ri | Ru | Re | Ro |',
        en: '# Welcome to the\nRa Row!\n\nThe R row sounds lightly between R and L.\n\n| ' + kana.ra + ' | ' + kana.ri + ' | ' + kana.ru + ' | ' + kana.re + ' | ' + kana.ro + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ra | Ri | Ru | Re | Ro |',
      },
    },
    'h-ra': {
      mnemonic: {
        de: 'Die Rakete beginnt mit Ra\nSpitze und Flamme führen zu ' + kana.ra,
        en: 'The rocket starts with Ra\nnose and flame lead to ' + kana.ra,
      },
    },
    'h-ri': {
      mnemonic: {
        de: 'Der Ring beginnt mit Ri\nzwei Bänder stehen wie ' + kana.ri,
        en: 'The ring starts with Ri\ntwo ribbons stand like ' + kana.ri,
      },
    },
    'h-ru': {
      mnemonic: {
        de: 'Der Rubin beginnt mit Ru\nSchlaufe und Haken drehen sich wie ' + kana.ru,
        en: 'The ruby starts with Ru\nloop and hook curl like ' + kana.ru,
      },
    },
    'h-re': {
      mnemonic: {
        de: 'Das Reh beginnt mit Re\nHals und Bein zeigen ' + kana.re,
        en: 'The red deer starts with Re\nneck and leg show ' + kana.re,
      },
    },
    'h-ro': {
      mnemonic: {
        de: 'Der Roboter beginnt mit Ro\nKopf und Arm drehen sich wie ' + kana.ro,
        en: 'The robot starts with Ro\nhead and arm turn like ' + kana.ro,
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
    .eq('slug', 'ra-row')
    .single()
  if (lessonError) throw lessonError

  const { data: anchorCard, error: anchorError } = await supabase
    .from('language_cards_cards')
    .select('group_id')
    .eq('slug', 'h-ra')
    .single()
  if (anchorError) throw anchorError

  const compareReSlug = 'info-ra-row-re-ne-compare'
  await upsertInfoCard(supabase, compareReSlug, anchorCard.group_id, {
    content_md: {
      de: '# ' + kana.re + ' oder ' + kana.ne + '\n\n| ' + kana.ne + ' | ' + kana.re + ' |\n|:---:|:---:|\n| Ne | Re |\n\n' + kana.ne + ' hat unten rechts die Nest-Schleife.\n' + kana.re + ' läuft ohne Schleife nach rechts aus.',
      en: '# ' + kana.re + ' or ' + kana.ne + '\n\n| ' + kana.ne + ' | ' + kana.re + ' |\n|:---:|:---:|\n| Ne | Re |\n\n' + kana.ne + ' has the nest loop at the lower right.\n' + kana.re + ' runs out to the right without a loop.',
    },
  })
  changed.push(compareReSlug)

  const compareRoSlug = 'info-ra-row-ru-ro-compare'
  await upsertInfoCard(supabase, compareRoSlug, anchorCard.group_id, {
    content_md: {
      de: '# ' + kana.ru + ' oder ' + kana.ro + '\n\n| ' + kana.ru + ' | ' + kana.ro + ' |\n|:---:|:---:|\n| Ru | Ro |\n\n' + kana.ru + ' hat oben den kleinen Einstieg.\n' + kana.ro + ' ist die glatte Roboter-Kurve ohne oberen Haken.',
      en: '# ' + kana.ru + ' or ' + kana.ro + '\n\n| ' + kana.ru + ' | ' + kana.ro + ' |\n|:---:|:---:|\n| Ru | Ro |\n\n' + kana.ru + ' has the small entry hook at the top.\n' + kana.ro + ' is the smooth robot curve without the top hook.',
    },
  })
  changed.push(compareRoSlug)

  const desiredOrder = [
    'info-ra-row-intro',
    'h-ra',
    'h-ri',
    'h-ru',
    'h-re',
    compareReSlug,
    'h-ro',
    compareRoSlug,
    'quiz-h-ra',
    'quiz-h-ri',
    'quiz-h-ru',
    'quiz-h-re',
    'quiz-h-ro',
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
    .eq('slug', 'ra-row')
  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'ra-row', order: desiredOrder }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
