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

async function upsertLesson(supabase, courseId, slug, sortOrder, titles) {
  const { data: existing, error: selectError } = await supabase
    .from('language_cards_course_lessons')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (selectError) throw selectError

  const id = existing?.id ?? randomUUID()
  const payload = {
    id,
    course_id: courseId,
    slug,
    sort_order: sortOrder,
    is_active: true,
  }

  const { error } = await supabase
    .from('language_cards_course_lessons')
    .upsert(payload, { onConflict: 'id' })

  if (error) throw error

  for (const [lang_code, title] of Object.entries(titles)) {
    const { error: translationError } = await supabase
      .from('language_cards_course_lesson_translations')
      .upsert({
        lesson_id: id,
        lang_code,
        title,
        description: null,
      }, { onConflict: 'lesson_id,lang_code' })

    if (translationError) throw translationError
  }

  return id
}

async function upsertCard(supabase, card) {
  const { data: existing, error: selectError } = await supabase
    .from('language_cards_cards')
    .select('id')
    .eq('slug', card.slug)
    .maybeSingle()

  if (selectError) throw selectError

  const id = existing?.id ?? randomUUID()
  const payload = {
    id,
    group_id: card.group_id ?? null,
    slug: card.slug,
    card_type: card.card_type,
    native: card.native ?? null,
    transliteration: card.transliteration ?? null,
    image_id: card.image_id ?? null,
    audio_url: card.audio_url ?? null,
    sort_order: card.sort_order ?? 0,
    is_active: true,
    data: card.data,
  }

  const { error } = await supabase
    .from('language_cards_cards')
    .upsert(payload, { onConflict: 'id' })

  if (error) throw error
  return id
}

function info(slug, de, en) {
  return {
    slug,
    card_type: 'info',
    data: {
      content_md: { de, en },
    },
  }
}

function character(slug, native, transliteration, de, en, groupId) {
  return {
    slug,
    card_type: 'character',
    native,
    transliteration,
    group_id: groupId,
    data: {
      mnemonic: { de, en },
    },
  }
}

function quiz(slug, native, transliteration, deQuestion, enQuestion, options) {
  return {
    slug,
    card_type: 'quiz_4_option',
    native,
    transliteration,
    data: {
      question: { de: deQuestion, en: enQuestion },
      options: options.map((text, index) => ({
        default_text: text,
        is_correct: index === 0,
        sort_order: index + 1,
      })),
    },
  }
}

async function replaceLessonCards(supabase, lessonId, cardIds) {
  const { error: deleteError } = await supabase
    .from('language_cards_course_lesson_cards')
    .delete()
    .eq('lesson_id', lessonId)

  if (deleteError) throw deleteError

  const rows = cardIds.map((card_id, index) => ({
    lesson_id: lessonId,
    card_id,
    sort_order: index + 1,
  }))

  const { error: insertError } = await supabase
    .from('language_cards_course_lesson_cards')
    .insert(rows)

  if (insertError) throw insertError
}

async function main() {
  loadEnv('.env.local')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: course, error: courseError } = await supabase
    .from('language_cards_courses')
    .select('id')
    .eq('slug', 'hiragana-basics')
    .single()

  if (courseError) throw courseError

  const { data: groups, error: groupsError } = await supabase
    .from('language_cards_groups')
    .select('id,slug')
    .in('slug', ['basic-1', 'dakuten-1', 'dakuten-2', 'dakuten-3'])

  if (groupsError) throw groupsError

  const groupBySlug = Object.fromEntries(groups.map((group) => [group.slug, group.id]))
  const defaultGroupId = groupBySlug['basic-1'] ?? null
  const dakutenGroupId = groupBySlug['dakuten-1'] ?? defaultGroupId
  const handakutenGroupId = groupBySlug['dakuten-3'] ?? dakutenGroupId

  const k = {
    ka: cp(0x304b), ga: cp(0x304c), ki: cp(0x304d), gi: cp(0x304e), ku: cp(0x304f), gu: cp(0x3050), ke: cp(0x3051), ge: cp(0x3052), ko: cp(0x3053), go: cp(0x3054),
    sa: cp(0x3055), za: cp(0x3056), shi: cp(0x3057), ji: cp(0x3058), su: cp(0x3059), zu: cp(0x305a), se: cp(0x305b), ze: cp(0x305c), so: cp(0x305d), zo: cp(0x305e),
    ta: cp(0x305f), da: cp(0x3060), chi: cp(0x3061), tsu: cp(0x3064), te: cp(0x3066), de: cp(0x3067), to: cp(0x3068), do_: cp(0x3069),
    ha: cp(0x306f), ba: cp(0x3070), pa: cp(0x3071), hi: cp(0x3072), bi: cp(0x3073), pi: cp(0x3074), fu: cp(0x3075), bu: cp(0x3076), pu: cp(0x3077), he: cp(0x3078), be: cp(0x3079), pe: cp(0x307a), ho: cp(0x307b), bo: cp(0x307c), po: cp(0x307d),
    ya: cp(0x3084), yu: cp(0x3086), yo: cp(0x3088), smallYa: cp(0x3083), smallYu: cp(0x3085), smallYo: cp(0x3087), smallTsu: cp(0x3063),
  }

  const dakutenLessonId = await upsertLesson(
    supabase,
    course.id,
    'hiragana-dakuten-handakuten',
    11,
    { de: 'Dakuten und Handakuten', en: 'Dakuten and Handakuten' }
  )

  const dakutenCards = [
    info(
      'info-hiragana-dakuten-intro',
      '# Dakuten\nund Handakuten\n\nDakuten sind zwei kleine Striche rechts oben.\nSie machen den Laut weicher oder stimmhaft.\n\n| ' + k.ka + ' | ' + k.ga + ' |\n|:---:|:---:|\n| Ka | Ga |\n\nHandakuten ist der kleine Kreis.\nEr macht aus H ein P.\n\n| ' + k.ha + ' | ' + k.pa + ' |\n|:---:|:---:|\n| Ha | Pa |',
      '# Dakuten\nand Handakuten\n\nDakuten are two small marks at the upper right.\nThey make the sound voiced.\n\n| ' + k.ka + ' | ' + k.ga + ' |\n|:---:|:---:|\n| Ka | Ga |\n\nHandakuten is the small circle.\nIt turns H into P.\n\n| ' + k.ha + ' | ' + k.pa + ' |\n|:---:|:---:|\n| Ha | Pa |'
    ),
    info(
      'info-hiragana-dakuten-k-row',
      '# K wird G\n\n| ' + k.ka + ' | ' + k.ki + ' | ' + k.ku + ' | ' + k.ke + ' | ' + k.ko + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ka | Ki | Ku | Ke | Ko |\n\n| ' + k.ga + ' | ' + k.gi + ' | ' + k.gu + ' | ' + k.ge + ' | ' + k.go + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ga | Gi | Gu | Ge | Go |',
      '# K becomes G\n\n| ' + k.ka + ' | ' + k.ki + ' | ' + k.ku + ' | ' + k.ke + ' | ' + k.ko + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ka | Ki | Ku | Ke | Ko |\n\n| ' + k.ga + ' | ' + k.gi + ' | ' + k.gu + ' | ' + k.ge + ' | ' + k.go + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ga | Gi | Gu | Ge | Go |'
    ),
    character('h-ga', k.ga, 'Ga', 'Ka bekommt zwei Striche\n' + k.ka + ' wird ' + k.ga, 'Ka gets two marks\n' + k.ka + ' becomes ' + k.ga, dakutenGroupId),
    character('h-gi', k.gi, 'Gi', 'Ki bekommt zwei Striche\n' + k.ki + ' wird ' + k.gi, 'Ki gets two marks\n' + k.ki + ' becomes ' + k.gi, dakutenGroupId),
    character('h-gu', k.gu, 'Gu', 'Ku bekommt zwei Striche\n' + k.ku + ' wird ' + k.gu, 'Ku gets two marks\n' + k.ku + ' becomes ' + k.gu, dakutenGroupId),
    character('h-ge', k.ge, 'Ge', 'Ke bekommt zwei Striche\n' + k.ke + ' wird ' + k.ge, 'Ke gets two marks\n' + k.ke + ' becomes ' + k.ge, dakutenGroupId),
    character('h-go', k.go, 'Go', 'Ko bekommt zwei Striche\n' + k.ko + ' wird ' + k.go, 'Ko gets two marks\n' + k.ko + ' becomes ' + k.go, dakutenGroupId),
    info(
      'info-hiragana-dakuten-s-t-row',
      '# S wird Z\nT wird D\n\n| ' + k.sa + ' | ' + k.shi + ' | ' + k.su + ' | ' + k.se + ' | ' + k.so + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Sa | Shi | Su | Se | So |\n\n| ' + k.za + ' | ' + k.ji + ' | ' + k.zu + ' | ' + k.ze + ' | ' + k.zo + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Za | Ji | Zu | Ze | Zo |\n\nAchtung: ' + k.ji + ' liest du Ji.',
      '# S becomes Z\nT becomes D\n\n| ' + k.sa + ' | ' + k.shi + ' | ' + k.su + ' | ' + k.se + ' | ' + k.so + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Sa | Shi | Su | Se | So |\n\n| ' + k.za + ' | ' + k.ji + ' | ' + k.zu + ' | ' + k.ze + ' | ' + k.zo + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Za | Ji | Zu | Ze | Zo |\n\nCareful: ' + k.ji + ' is read Ji.'
    ),
    character('h-za', k.za, 'Za', 'Sa bekommt zwei Striche\n' + k.sa + ' wird ' + k.za, 'Sa gets two marks\n' + k.sa + ' becomes ' + k.za, dakutenGroupId),
    character('h-ji', k.ji, 'Ji', 'Shi bekommt zwei Striche\n' + k.shi + ' wird ' + k.ji, 'Shi gets two marks\n' + k.shi + ' becomes ' + k.ji, dakutenGroupId),
    character('h-zu', k.zu, 'Zu', 'Su bekommt zwei Striche\n' + k.su + ' wird ' + k.zu, 'Su gets two marks\n' + k.su + ' becomes ' + k.zu, dakutenGroupId),
    character('h-ze', k.ze, 'Ze', 'Se bekommt zwei Striche\n' + k.se + ' wird ' + k.ze, 'Se gets two marks\n' + k.se + ' becomes ' + k.ze, dakutenGroupId),
    character('h-zo', k.zo, 'Zo', 'So bekommt zwei Striche\n' + k.so + ' wird ' + k.zo, 'So gets two marks\n' + k.so + ' becomes ' + k.zo, dakutenGroupId),
    character('h-da', k.da, 'Da', 'Ta bekommt zwei Striche\n' + k.ta + ' wird ' + k.da, 'Ta gets two marks\n' + k.ta + ' becomes ' + k.da, dakutenGroupId),
    character('h-de', k.de, 'De', 'Te bekommt zwei Striche\n' + k.te + ' wird ' + k.de, 'Te gets two marks\n' + k.te + ' becomes ' + k.de, dakutenGroupId),
    character('h-do', k.do_, 'Do', 'To bekommt zwei Striche\n' + k.to + ' wird ' + k.do_, 'To gets two marks\n' + k.to + ' becomes ' + k.do_, dakutenGroupId),
    info(
      'info-hiragana-handakuten-h-row',
      '# H wird B oder P\n\n| ' + k.ha + ' | ' + k.hi + ' | ' + k.fu + ' | ' + k.he + ' | ' + k.ho + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |\n\n| ' + k.ba + ' | ' + k.bi + ' | ' + k.bu + ' | ' + k.be + ' | ' + k.bo + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ba | Bi | Bu | Be | Bo |\n\n| ' + k.pa + ' | ' + k.pi + ' | ' + k.pu + ' | ' + k.pe + ' | ' + k.po + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Pa | Pi | Pu | Pe | Po |',
      '# H becomes B or P\n\n| ' + k.ha + ' | ' + k.hi + ' | ' + k.fu + ' | ' + k.he + ' | ' + k.ho + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |\n\n| ' + k.ba + ' | ' + k.bi + ' | ' + k.bu + ' | ' + k.be + ' | ' + k.bo + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Ba | Bi | Bu | Be | Bo |\n\n| ' + k.pa + ' | ' + k.pi + ' | ' + k.pu + ' | ' + k.pe + ' | ' + k.po + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| Pa | Pi | Pu | Pe | Po |'
    ),
    character('h-ba', k.ba, 'Ba', 'Ha bekommt zwei Striche\n' + k.ha + ' wird ' + k.ba, 'Ha gets two marks\n' + k.ha + ' becomes ' + k.ba, dakutenGroupId),
    character('h-bi', k.bi, 'Bi', 'Hi bekommt zwei Striche\n' + k.hi + ' wird ' + k.bi, 'Hi gets two marks\n' + k.hi + ' becomes ' + k.bi, dakutenGroupId),
    character('h-bu', k.bu, 'Bu', 'Fu bekommt zwei Striche\n' + k.fu + ' wird ' + k.bu, 'Fu gets two marks\n' + k.fu + ' becomes ' + k.bu, dakutenGroupId),
    character('h-be', k.be, 'Be', 'He bekommt zwei Striche\n' + k.he + ' wird ' + k.be, 'He gets two marks\n' + k.he + ' becomes ' + k.be, dakutenGroupId),
    character('h-bo', k.bo, 'Bo', 'Ho bekommt zwei Striche\n' + k.ho + ' wird ' + k.bo, 'Ho gets two marks\n' + k.ho + ' becomes ' + k.bo, dakutenGroupId),
    character('h-pa', k.pa, 'Pa', 'Ha bekommt einen Kreis\n' + k.ha + ' wird ' + k.pa, 'Ha gets a circle\n' + k.ha + ' becomes ' + k.pa, handakutenGroupId),
    character('h-pi', k.pi, 'Pi', 'Hi bekommt einen Kreis\n' + k.hi + ' wird ' + k.pi, 'Hi gets a circle\n' + k.hi + ' becomes ' + k.pi, handakutenGroupId),
    character('h-pu', k.pu, 'Pu', 'Fu bekommt einen Kreis\n' + k.fu + ' wird ' + k.pu, 'Fu gets a circle\n' + k.fu + ' becomes ' + k.pu, handakutenGroupId),
    character('h-pe', k.pe, 'Pe', 'He bekommt einen Kreis\n' + k.he + ' wird ' + k.pe, 'He gets a circle\n' + k.he + ' becomes ' + k.pe, handakutenGroupId),
    character('h-po', k.po, 'Po', 'Ho bekommt einen Kreis\n' + k.ho + ' wird ' + k.po, 'Ho gets a circle\n' + k.ho + ' becomes ' + k.po, handakutenGroupId),
    quiz('quiz-h-ga', k.ga, 'Ga', 'Welches Zeichen steht für Ga?', 'Which character represents Ga?', [k.ga, k.ka, k.sa, k.ha]),
    quiz('quiz-h-ji', k.ji, 'Ji', 'Welches Zeichen steht für Ji?', 'Which character represents Ji?', [k.ji, k.shi, k.chi, k.gi]),
    quiz('quiz-h-zu', k.zu, 'Zu', 'Welches Zeichen steht für Zu?', 'Which character represents Zu?', [k.zu, k.su, k.tsu, k.gu]),
    quiz('quiz-h-ba', k.ba, 'Ba', 'Welches Zeichen steht für Ba?', 'Which character represents Ba?', [k.ba, k.ha, k.pa, k.ma]),
    quiz('quiz-h-pa', k.pa, 'Pa', 'Welches Zeichen steht für Pa?', 'Which character represents Pa?', [k.pa, k.ba, k.ha, k.ma]),
  ]

  const dakutenIds = []
  for (const [index, card] of dakutenCards.entries()) {
    dakutenIds.push(await upsertCard(supabase, {
      ...card,
      group_id: card.group_id ?? dakutenGroupId,
      sort_order: index + 1,
    }))
  }
  await replaceLessonCards(supabase, dakutenLessonId, dakutenIds)

  const comboLessonId = await upsertLesson(
    supabase,
    course.id,
    'hiragana-small-kana-combinations',
    12,
    { de: 'Kleine Kana und Kombinationen', en: 'Small Kana and Combinations' }
  )

  const comboCards = [
    info(
      'info-hiragana-small-kana-intro',
      '# Kleine Kana\n\nKleine Zeichen ändern den Klang der Silbe davor.\nSie stehen nicht allein.\n\n| ' + k.ya + ' | ' + k.smallYa + ' |\n|:---:|:---:|\n| Ya | klein ya |\n\nKlein ' + k.smallTsu + ' macht eine kurze Pause und verdoppelt den nächsten Konsonanten.',
      '# Small Kana\n\nSmall characters change the sound before them.\nThey do not stand alone.\n\n| ' + k.ya + ' | ' + k.smallYa + ' |\n|:---:|:---:|\n| Ya | small ya |\n\nSmall ' + k.smallTsu + ' creates a short pause and doubles the next consonant.'
    ),
    character('h-small-ya', k.smallYa, 'small ya', 'Kleines Ya hängt sich an i-Laute\nKi plus kleines Ya wird Kya', 'Small ya attaches to i sounds\nKi plus small ya becomes Kya', defaultGroupId),
    character('h-small-yu', k.smallYu, 'small yu', 'Kleines Yu hängt sich an i-Laute\nShi plus kleines Yu wird Shu', 'Small yu attaches to i sounds\nShi plus small yu becomes Shu', defaultGroupId),
    character('h-small-yo', k.smallYo, 'small yo', 'Kleines Yo hängt sich an i-Laute\nChi plus kleines Yo wird Cho', 'Small yo attaches to i sounds\nChi plus small yo becomes Cho', defaultGroupId),
    info(
      'info-hiragana-yoon-examples',
      '# Kombinationen\n\n| きゃ | きゅ | きょ |\n|:---:|:---:|:---:|\n| Kya | Kyu | Kyo |\n\n| しゃ | しゅ | しょ |\n|:---:|:---:|:---:|\n| Sha | Shu | Sho |\n\n| ちゃ | ちゅ | ちょ |\n|:---:|:---:|:---:|\n| Cha | Chu | Cho |',
      '# Combinations\n\n| きゃ | きゅ | きょ |\n|:---:|:---:|:---:|\n| Kya | Kyu | Kyo |\n\n| しゃ | しゅ | しょ |\n|:---:|:---:|:---:|\n| Sha | Shu | Sho |\n\n| ちゃ | ちゅ | ちょ |\n|:---:|:---:|:---:|\n| Cha | Chu | Cho |'
    ),
    character('h-small-tsu', k.smallTsu, 'small tsu', 'Kleines Tsu ist eine kurze Pause\nきって liest du Kitte', 'Small tsu is a short pause\nきって is read Kitte', defaultGroupId),
    info(
      'info-hiragana-small-tsu-examples',
      '# Kleine Pause\n\n| きて | きって |\n|:---:|:---:|\n| Kite | Kitte |\n\nOhne ' + k.smallTsu + ' fließt der Laut weiter.\nMit ' + k.smallTsu + ' stoppst du kurz vor dem nächsten Konsonanten.',
      '# Small Pause\n\n| きて | きって |\n|:---:|:---:|\n| Kite | Kitte |\n\nWithout ' + k.smallTsu + ', the sound flows on.\nWith ' + k.smallTsu + ', you stop briefly before the next consonant.'
    ),
    quiz('quiz-h-kya', 'きゃ', 'Kya', 'Welche Kombination steht für Kya?', 'Which combination represents Kya?', ['きゃ', 'きゅ', 'きょ', 'きや']),
    quiz('quiz-h-shu', 'しゅ', 'Shu', 'Welche Kombination steht für Shu?', 'Which combination represents Shu?', ['しゅ', 'しゃ', 'しょ', 'しゆ']),
    quiz('quiz-h-cho', 'ちょ', 'Cho', 'Welche Kombination steht für Cho?', 'Which combination represents Cho?', ['ちょ', 'ちゃ', 'ちゅ', 'ちよ']),
    quiz('quiz-h-kitte', 'きって', 'Kitte', 'Welche Schreibweise enthält die kleine Pause?', 'Which spelling contains the small pause?', ['きって', 'きて', 'きつて', 'きいて']),
  ]

  const comboIds = []
  for (const [index, card] of comboCards.entries()) {
    comboIds.push(await upsertCard(supabase, {
      ...card,
      group_id: card.group_id ?? defaultGroupId,
      sort_order: index + 1,
    }))
  }
  await replaceLessonCards(supabase, comboLessonId, comboIds)

  console.log(JSON.stringify({
    activated: ['hiragana-dakuten-handakuten', 'hiragana-small-kana-combinations'],
    dakutenCards: dakutenCards.map((card) => card.slug),
    comboCards: comboCards.map((card) => card.slug),
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
