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
    ha: cp(0x306f),
    hi: cp(0x3072),
    fu: cp(0x3075),
    he: cp(0x3078),
    ho: cp(0x307b),
  }

  const updates = {
    'info-ha-row-intro': {
      content_md: {
        de: '# Willkommen zur\nHa-Reihe!\n\nIn dieser Reihe klingt Hu wie Fu.\n\n| ' + kana.ha + ' | ' + kana.hi + ' | ' + kana.fu + ' | ' + kana.he + ' | ' + kana.ho + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |',
        en: '# Welcome to the\nHa Row!\n\nIn this row, Hu sounds like Fu.\n\n| ' + kana.ha + ' | ' + kana.hi + ' | ' + kana.fu + ' | ' + kana.he + ' | ' + kana.ho + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |',
      },
    },
    'h-ha': {
      mnemonic: {
        de: 'Der Hase beginnt mit Ha\nOhr und Pfote stehen wie ' + kana.ha,
        en: 'The hare starts with Ha\near and paw stand like ' + kana.ha,
      },
    },
    'h-hi': {
      mnemonic: {
        de: 'Der Hibiskus beginnt mit Hi\nStiel und Blüte biegen sich wie ' + kana.hi,
        en: 'The hibiscus starts with Hi\nstem and flower bend like ' + kana.hi,
      },
    },
    'h-hu': {
      mnemonic: {
        de: 'Der Fuji beginnt mit Fu\nBerg und Wind schweben wie ' + kana.fu,
        en: 'Fuji starts with Fu\nmountain and wind float like ' + kana.fu,
      },
    },
    'h-he': {
      mnemonic: {
        de: 'Der Helm beginnt mit He\nsein Dach zeigt klar ' + kana.he,
        en: 'The helmet starts with He\nits roof clearly shows ' + kana.he,
      },
    },
    'h-ho': {
      mnemonic: {
        de: 'Das Horn beginnt mit Ho\nRohr und Ventile führen zu ' + kana.ho,
        en: 'The horn starts with Ho\ntube and valves lead to ' + kana.ho,
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

  const compareSlug = 'info-ha-row-ha-ho-compare'
  const compareData = {
    content_md: {
      de: '# ' + kana.ha + ' oder ' + kana.ho + '\n\n| ' + kana.ha + ' | ' + kana.ho + ' |\n|:---:|:---:|\n| Ha | Ho |\n\n' + kana.ha + ' hat rechts nur eine kleine Schleife.\n' + kana.ho + ' hat zwei Querlinien und die Schleife unten.',
      en: '# ' + kana.ha + ' or ' + kana.ho + '\n\n| ' + kana.ha + ' | ' + kana.ho + ' |\n|:---:|:---:|\n| Ha | Ho |\n\n' + kana.ha + ' has only one small loop on the right.\n' + kana.ho + ' has two cross lines and the loop below.',
    },
  }

  const { data: lesson, error: lessonError } = await supabase
    .from('language_cards_course_lessons')
    .select('id')
    .eq('slug', 'ha-row')
    .single()

  if (lessonError) throw lessonError

  const { data: anchorCard, error: anchorError } = await supabase
    .from('language_cards_cards')
    .select('group_id')
    .eq('slug', 'h-ha')
    .single()

  if (anchorError) throw anchorError

  await upsertInfoCard(supabase, compareSlug, anchorCard.group_id, compareData)
  changed.push(compareSlug)

  const desiredOrder = [
    'info-ha-row-intro',
    'h-ha',
    'h-hi',
    'h-hu',
    'h-he',
    'h-ho',
    compareSlug,
    'quiz-h-ha',
    'quiz-h-hi',
    'quiz-h-hu',
    'quiz-h-he',
    'quiz-h-ho',
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
    .eq('slug', 'ha-row')

  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'ha-row', order: desiredOrder }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
