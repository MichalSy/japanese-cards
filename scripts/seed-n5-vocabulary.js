const fs = require('fs')
const { randomUUID } = require('crypto')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(filePath) {
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
}

function quizOptions(items, correctIndex) {
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

async function upsertTranslations(supabase, table, keyName, keyValue, translations) {
  const rows = Object.entries(translations).map(([lang_code, value]) => ({
    [keyName]: keyValue,
    lang_code,
    ...(typeof value === 'string' ? { name: value } : value),
  }))
  const { error } = await supabase.from(table).upsert(rows, { onConflict: `${keyName},lang_code` })
  if (error) throw error
}

async function upsertLearningTranslations(supabase, table, keyName, keyValue, translations) {
  const rows = Object.entries(translations).map(([lang_code, value]) => ({
    [keyName]: keyValue,
    lang_code,
    title: value.title,
    description: value.description ?? null,
  }))
  const { error } = await supabase.from(table).upsert(rows, { onConflict: `${keyName},lang_code` })
  if (error) throw error
}

async function upsertCategory(supabase, data, categoryId, collectionId) {
  const base = {
    id: categoryId,
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
  }

  const withCollection = collectionId
    ? { ...base, collection_id: collectionId, collection_sort_order: data.category.collection_sort_order }
    : base

  let { error } = await supabase
    .from('language_cards_categories')
    .upsert(withCollection, { onConflict: 'language_id,slug' })

  if (error && /collection_id|collection_sort_order/.test(error.message)) {
    ;({ error } = await supabase
      .from('language_cards_categories')
      .upsert(base, { onConflict: 'language_id,slug' }))
  }

  if (error) throw error
}

async function main() {
  loadEnv('.env.local')
  const data = JSON.parse(fs.readFileSync('scripts/n5-vocabulary.json', 'utf8'))
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: collection } = await supabase
    .from('language_cards_category_collections')
    .select('id')
    .eq('language_id', 'ja')
    .eq('slug', 'jlpt-n5')
    .maybeSingle()

  const { data: existingCategory, error: categorySelectError } = await supabase
    .from('language_cards_categories')
    .select('id')
    .eq('language_id', 'ja')
    .eq('slug', data.category.slug)
    .maybeSingle()
  if (categorySelectError) throw categorySelectError

  const categoryId = existingCategory?.id ?? randomUUID()
  await upsertCategory(supabase, data, categoryId, collection?.id)
  await upsertTranslations(supabase, 'language_cards_category_translations', 'category_id', categoryId, data.category.translations)

  const { data: existingCourse, error: courseSelectError } = await supabase
    .from('language_cards_learning_courses')
    .select('id')
    .eq('category_id', categoryId)
    .eq('slug', data.course.slug)
    .maybeSingle()
  if (courseSelectError) throw courseSelectError

  const courseId = existingCourse?.id ?? randomUUID()
  const { error: courseError } = await supabase
    .from('language_cards_learning_courses')
    .upsert({
      id: courseId,
      category_id: categoryId,
      slug: data.course.slug,
      level: data.course.level,
      sort_order: data.course.sort_order,
      is_active: true,
    }, { onConflict: 'category_id,slug' })
  if (courseError) throw courseError

  await upsertLearningTranslations(supabase, 'language_cards_learning_course_translations', 'course_id', courseId, data.course.translations)

  const summary = { lessons: 0, vocabularyCards: 0, quizCards: 0, links: 0 }

  for (const lesson of data.lessons) {
    if (lesson.items.length > 5) throw new Error(`${lesson.slug} has too many items; max 5 items + 5 quiz cards = 10 cards`)

    const { data: existingLesson, error: lessonSelectError } = await supabase
      .from('language_cards_learning_lessons')
      .select('id')
      .eq('course_id', courseId)
      .eq('slug', lesson.slug)
      .maybeSingle()
    if (lessonSelectError) throw lessonSelectError

    const lessonId = existingLesson?.id ?? randomUUID()
    const { error: lessonError } = await supabase
      .from('language_cards_learning_lessons')
      .upsert({
        id: lessonId,
        course_id: courseId,
        slug: lesson.slug,
        sort_order: lesson.sort_order,
        is_active: true,
      }, { onConflict: 'course_id,slug' })
    if (lessonError) throw lessonError

    await upsertLearningTranslations(
      supabase,
      'language_cards_learning_lesson_translations',
      'lesson_id',
      lessonId,
      {
        de: { title: lesson.translations.de, description: '5 Vokabeln + 5 Quizkarten' },
        en: { title: lesson.translations.en, description: '5 vocabulary cards + 5 quiz cards' },
      }
    )
    if (!existingLesson) summary.lessons++

    for (let index = 0; index < lesson.items.length; index++) {
      const item = lesson.items[index]
      const { data: existingCard, error: cardSelectError } = await supabase
        .from('language_cards_cards')
        .select('id')
        .eq('slug', item.slug)
        .maybeSingle()
      if (cardSelectError) throw cardSelectError

      const cardId = existingCard?.id ?? randomUUID()
      const { error: cardError } = await supabase
        .from('language_cards_cards')
        .upsert({
          id: cardId,
          group_id: null,
          slug: item.slug,
          card_type: 'vocabulary',
          native: item.native,
          transliteration: item.transliteration,
          word_type: item.kind,
          difficulty: 'beginner',
          context: data.category.slug,
          sort_order: lesson.sort_order * 100 + index + 1,
          is_active: true,
          image_id: null,
          audio_url: null,
          data: { lesson_slug: lesson.slug, kind: item.kind },
        })
      if (cardError) throw cardError
      if (!existingCard) summary.vocabularyCards++

      const { error: translationError } = await supabase
        .from('language_cards_card_translations')
        .upsert([
          { card_id: cardId, lang_code: 'de', translation: item.de, example_translation: null, hint: null },
          { card_id: cardId, lang_code: 'en', translation: item.en, example_translation: null, hint: null },
        ], { onConflict: 'card_id,lang_code' })
      if (translationError) throw translationError

      const { error: linkError } = await supabase
        .from('language_cards_learning_lesson_cards')
        .upsert({ lesson_id: lessonId, card_id: cardId, sort_order: index + 1 }, { onConflict: 'lesson_id,card_id' })
      if (linkError) throw linkError
      summary.links++
    }

    for (let index = 0; index < lesson.items.length; index++) {
      const item = lesson.items[index]
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
          context: data.category.slug,
          sort_order: lesson.sort_order * 100 + lesson.items.length + index + 1,
          is_active: true,
          image_id: null,
          audio_url: null,
          data: {
            quiz_type: 'vocabulary_translation',
            source_card_slug: item.slug,
            question: {
              de: `Was bedeutet ${item.native}?`,
              en: `What does ${item.native} mean?`,
            },
            options: quizOptions(lesson.items, index),
          },
        })
      if (quizError) throw quizError
      if (!existingQuiz) summary.quizCards++

      const { error: quizLinkError } = await supabase
        .from('language_cards_learning_lesson_cards')
        .upsert({ lesson_id: lessonId, card_id: quizCardId, sort_order: lesson.items.length + index + 1 }, { onConflict: 'lesson_id,card_id' })
      if (quizLinkError) throw quizLinkError
      summary.links++
    }
  }

  console.log(JSON.stringify(summary, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
