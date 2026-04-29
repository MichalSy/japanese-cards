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

function quizOptions(group, correctIndex) {
  const items = group.items
  const ordered = [items[correctIndex]]
  for (let offset = 1; ordered.length < 4 && offset < items.length; offset++) {
    ordered.push(items[(correctIndex + offset) % items.length])
  }

  return ordered.map((item, index) => ({
    default_text: item.en,
    translations: { de: item.de, en: item.en },
    is_correct: index === 0,
    sort_order: index + 1,
  }))
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

async function upsertLearningTranslations(supabase, table, keyName, keyValue, translations) {
  const rows = Object.entries(translations).map(([lang_code, value]) => ({
    [keyName]: keyValue,
    lang_code,
    title: value.title,
    description: value.description ?? null,
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
      game_modes: [],
      show_all_option: false,
      sort_order: data.category.sort_order,
      is_active: true,
    }, { onConflict: 'language_id,slug' })
  if (categoryError) throw categoryError

  await upsertTranslations(supabase, 'language_cards_category_translations', 'category_id', finalCategoryId, data.category.translations)

  const { data: existingCourse, error: courseSelectError } = await supabase
    .from('language_cards_learning_courses')
    .select('id')
    .eq('category_id', finalCategoryId)
    .eq('slug', data.course.slug)
    .maybeSingle()
  if (courseSelectError) throw courseSelectError

  const finalCourseId = existingCourse?.id ?? randomUUID()
  const { error: courseError } = await supabase
    .from('language_cards_learning_courses')
    .upsert({
      id: finalCourseId,
      category_id: finalCategoryId,
      slug: data.course.slug,
      level: data.course.level,
      sort_order: data.course.sort_order,
      is_active: true,
    }, { onConflict: 'category_id,slug' })
  if (courseError) throw courseError

  await upsertLearningTranslations(supabase, 'language_cards_learning_course_translations', 'course_id', finalCourseId, data.course.translations)

  const created = { lessons: 0, cards: 0, quizzes: 0, images: 0 }

  for (const group of data.groups) {
    const { data: existingLesson, error: lessonSelectError } = await supabase
      .from('language_cards_learning_lessons')
      .select('id')
      .eq('course_id', finalCourseId)
      .eq('slug', group.slug)
      .maybeSingle()
    if (lessonSelectError) throw lessonSelectError

    const finalLessonId = existingLesson?.id ?? randomUUID()
    const { error: lessonError } = await supabase
      .from('language_cards_learning_lessons')
      .upsert({
        id: finalLessonId,
        course_id: finalCourseId,
        slug: group.slug,
        sort_order: group.sort_order,
        is_active: true,
      }, { onConflict: 'course_id,slug' })
    if (lessonError) throw lessonError

    await upsertLearningTranslations(
      supabase,
      'language_cards_learning_lesson_translations',
      'lesson_id',
      finalLessonId,
      {
        de: { title: group.translations.de, description: `${group.items.length} einfache Wörter` },
        en: { title: group.translations.en, description: `${group.items.length} simple words` },
      }
    )
    created.lessons += existingLesson ? 0 : 1

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

      const { error: learningLinkError } = await supabase
        .from('language_cards_learning_lesson_cards')
        .upsert({ lesson_id: finalLessonId, card_id: cardId, sort_order: index + 1 }, { onConflict: 'lesson_id,card_id' })
      if (learningLinkError) throw learningLinkError
    }

    for (let index = 0; index < group.items.length; index++) {
      const item = group.items[index]
      const quizSlug = `${item.slug}-quiz`
      const { data: existingQuiz, error: quizSelectError } = await supabase
        .from('language_cards_cards')
        .select('id')
        .eq('slug', quizSlug)
        .maybeSingle()
      if (quizSelectError) throw quizSelectError

      const quizCardId = existingQuiz?.id ?? randomUUID()
      const { error: quizError } = await supabase
        .from('language_cards_cards')
        .upsert({
          id: quizCardId,
          group_id: null,
          slug: quizSlug,
          card_type: 'quiz_4_option',
          native: item.native,
          transliteration: item.transliteration,
          word_type: null,
          difficulty: 'beginner',
          context: 'first-words',
          sort_order: group.items.length + index + 1,
          is_active: true,
          image_id: null,
          data: {
            quiz_type: 'vocabulary_translation',
            source_card_slug: item.slug,
            question: {
              de: `Was bedeutet ${item.native}?`,
              en: `What does ${item.native} mean?`,
            },
            options: quizOptions(group, index),
          },
        })
      if (quizError) throw quizError
      created.quizzes += existingQuiz ? 0 : 1

      const { error: quizLinkError } = await supabase
        .from('language_cards_learning_lesson_cards')
        .upsert({ lesson_id: finalLessonId, card_id: quizCardId, sort_order: group.items.length + index + 1 }, { onConflict: 'lesson_id,card_id' })
      if (quizLinkError) throw quizLinkError
    }
  }

  console.log(JSON.stringify({ category: data.category.slug, totalItems: allItems(data).length, ...created }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
