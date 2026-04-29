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
    ya: cp(0x3084),
    yu: cp(0x3086),
    yo: cp(0x3088),
    nu: cp(0x306c),
  }

  const updates = {
    'info-ya-row-intro': {
      content_md: {
        de: '# Willkommen zur\nYa-Reihe!\n\nDie Y-Reihe hat nur drei Zeichen: Ya Yu Yo.\n\n| ' + kana.ya + ' | ' + kana.yu + ' | ' + kana.yo + ' |\n|:---:|:---:|:---:|\n| Ya | Yu | Yo |',
        en: '# Welcome to the\nYa Row!\n\nThe Y row has only three characters: Ya Yu Yo.\n\n| ' + kana.ya + ' | ' + kana.yu + ' | ' + kana.yo + ' |\n|:---:|:---:|:---:|\n| Ya | Yu | Yo |',
      },
    },
    'h-ya': {
      mnemonic: {
        de: 'Der Yak beginnt mit Ya\nHörner und Kopf formen ' + kana.ya,
        en: 'The yak starts with Ya\nhorns and head form ' + kana.ya,
      },
    },
    'h-yu': {
      mnemonic: {
        de: 'Die Yuzu beginnt mit Yu\ndie Schale dreht sich wie ' + kana.yu,
        en: 'The yuzu starts with Yu\nthe peel curls like ' + kana.yu,
      },
    },
    'h-yo': {
      mnemonic: {
        de: 'Yoga beginnt mit Yo\nArm und Körper zeigen ' + kana.yo,
        en: 'Yoga starts with Yo\narm and body show ' + kana.yo,
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
    .eq('slug', 'ya-row')
    .single()
  if (lessonError) throw lessonError

  const { data: anchorCard, error: anchorError } = await supabase
    .from('language_cards_cards')
    .select('group_id')
    .eq('slug', 'h-ya')
    .single()
  if (anchorError) throw anchorError

  const compareSlug = 'info-ya-row-yu-nu-compare'
  await upsertInfoCard(supabase, compareSlug, anchorCard.group_id, {
    content_md: {
      de: '# ' + kana.yu + ' oder ' + kana.nu + '\n\n| ' + kana.yu + ' | ' + kana.nu + ' |\n|:---:|:---:|\n| Yu | Nu |\n\n' + kana.yu + ' hat links und rechts offene Yuzu-Schalen.\n' + kana.nu + ' kreuzt sich stärker und endet unten mit Haken.',
      en: '# ' + kana.yu + ' or ' + kana.nu + '\n\n| ' + kana.yu + ' | ' + kana.nu + ' |\n|:---:|:---:|\n| Yu | Nu |\n\n' + kana.yu + ' has open yuzu peel on both sides.\n' + kana.nu + ' crosses more strongly and ends with a lower hook.',
    },
  })
  changed.push(compareSlug)

  const desiredOrder = [
    'info-ya-row-intro',
    'h-ya',
    'h-yu',
    compareSlug,
    'h-yo',
    'quiz-h-ya',
    'quiz-h-yu',
    'quiz-h-yo',
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
    .eq('slug', 'ya-row')
  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'ya-row', order: desiredOrder }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
