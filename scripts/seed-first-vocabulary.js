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

function allItems(data) {
  return data.groups.flatMap((group) => group.items.map((item, index) => ({ group, item, index })))
}

async function uploadImageIfNeeded(supabase, item, existingImageId) {
  if (existingImageId && process.env.FORCE_FIRST_VOCAB_IMAGES !== '1') return existingImageId

  const imageId = randomUUID()
  const filePath = path.join('tmp', 'first-vocabulary-images', `${item.slug}.jpg`)
  const body = fs.readFileSync(filePath)

  const { error } = await supabase.storage
    .from('language-cards')
    .upload(`${imageId}.jpg`, body, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (error) throw error
  return imageId
}

async function upsertTranslations(supabase, table, keyName, keyValue, translations) {
  const rows = Object.entries(translations).map(([lang_code, value]) => ({
    [keyName]: keyValue,
    lang_code,
    ...(typeof value === 'string' ? { name: value } : value),
  }))

  const conflict = `${keyName},lang_code`
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict })
  if (error) throw error
}

async function main() {
  loadEnv('.env.local')
  const data = JSON.parse(fs.readFileSync('scripts/first-vocabulary.json', 'utf8'))
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const categoryId = randomUUID()
  const { data: existingCategory, error: categorySelectError } = await supabase
    .from('language_cards_categories')
    .select('id')
    .eq('language_id', 'ja')
    .eq('slug', data.category.slug)
    .maybeSingle()
  if (categorySelectError) throw categorySelectError

  const finalCategoryId = existingCategory?.id ?? categoryId
  const { error: categoryError } = await supabase
    .from('language_cards_categories')
    .upsert({
      id: finalCategoryId,
      language_id: 'ja',
      slug: data.category.slug,
      native_name: data.category.native_name,
      emoji: data.category.emoji,
      color: data.category.color,
      card_type: 'vocabulary',
      game_modes: ['swipe', 'multiChoice', 'flashcard'],
      show_all_option: true,
      sort_order: data.category.sort_order,
      is_active: true,
    }, { onConflict: 'language_id,slug' })
  if (categoryError) throw categoryError

  await upsertTranslations(supabase, 'language_cards_category_translations', 'category_id', finalCategoryId, data.category.translations)

  const created = { groups: 0, cards: 0, images: 0 }

  for (const group of data.groups) {
    const groupId = randomUUID()
    const { data: existingGroup, error: groupSelectError } = await supabase
      .from('language_cards_practice_groups')
      .select('id')
      .eq('category_id', finalCategoryId)
      .eq('slug', group.slug)
      .maybeSingle()
    if (groupSelectError) throw groupSelectError

    const finalGroupId = existingGroup?.id ?? groupId
    const { error: groupError } = await supabase
      .from('language_cards_practice_groups')
      .upsert({
        id: finalGroupId,
        category_id: finalCategoryId,
        slug: group.slug,
        sort_order: group.sort_order,
        game_modes: ['swipe', 'multiChoice', 'flashcard'],
        is_active: true,
      }, { onConflict: 'category_id,slug' })
    if (groupError) throw groupError

    await upsertTranslations(supabase, 'language_cards_practice_group_translations', 'practice_group_id', finalGroupId, group.translations)
    created.groups += existingGroup ? 0 : 1

    for (let index = 0; index < group.items.length; index++) {
      const item = group.items[index]
      const { data: existingCard, error: cardSelectError } = await supabase
        .from('language_cards_cards')
        .select('id,image_id')
        .eq('slug', item.slug)
        .maybeSingle()
      if (cardSelectError) throw cardSelectError

      const cardId = existingCard?.id ?? randomUUID()
      const imageId = await uploadImageIfNeeded(supabase, item, existingCard?.image_id)
      if (!existingCard?.image_id || process.env.FORCE_FIRST_VOCAB_IMAGES === '1') created.images++

      const { error: cardError } = await supabase
        .from('language_cards_cards')
        .upsert({
          id: cardId,
          group_id: null,
          slug: item.slug,
          card_type: 'vocabulary',
          native: item.native,
          transliteration: item.transliteration,
          word_type: 'noun',
          difficulty: 'beginner',
          context: 'first-words',
          sort_order: index + 1,
          is_active: true,
          image_id: imageId,
          data: { lesson_slug: group.slug, kind: item.kind },
        })
      if (cardError) throw cardError
      created.cards += existingCard ? 0 : 1

      const { error: translationError } = await supabase
        .from('language_cards_card_translations')
        .upsert([
          { card_id: cardId, lang_code: 'de', translation: item.de, example_translation: null, hint: null },
          { card_id: cardId, lang_code: 'en', translation: item.en, example_translation: null, hint: null },
        ], { onConflict: 'card_id,lang_code' })
      if (translationError) throw translationError

      const { error: linkError } = await supabase
        .from('language_cards_practice_group_cards')
        .upsert({ practice_group_id: finalGroupId, card_id: cardId, sort_order: index + 1 }, { onConflict: 'practice_group_id,card_id' })
      if (linkError) throw linkError
    }
  }

  console.log(JSON.stringify({ category: data.category.slug, totalItems: allItems(data).length, ...created }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
