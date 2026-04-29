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

async function upsertLesson(supabase, courseId, slug, sortOrder, titles, descriptions = {}, isActive = true) {
  const { data: existing, error: selectError } = await supabase
    .from('language_cards_course_lessons')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (selectError) throw selectError

  const id = existing?.id ?? randomUUID()
  const { error } = await supabase
    .from('language_cards_course_lessons')
    .upsert({
      id,
      course_id: courseId,
      slug,
      sort_order: sortOrder,
      is_active: isActive,
    }, { onConflict: 'id' })

  if (error) throw error

  for (const [lang_code, title] of Object.entries(titles)) {
    const { error: translationError } = await supabase
      .from('language_cards_course_lesson_translations')
      .upsert({
        lesson_id: id,
        lang_code,
        title,
        description: descriptions[lang_code] ?? null,
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
  const { error } = await supabase
    .from('language_cards_cards')
    .upsert({
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
    }, { onConflict: 'id' })

  if (error) throw error
  return id
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

async function fetchImageIds(supabase, slugs) {
  const { data, error } = await supabase
    .from('language_cards_cards')
    .select('slug,image_id')
    .in('slug', slugs)

  if (error) throw error
  return Object.fromEntries(data.map((row) => [row.slug, row.image_id]))
}

function info(slug, de, en, groupId) {
  return {
    slug,
    group_id: groupId,
    card_type: 'info',
    data: { content_md: { de, en } },
  }
}

function character(slug, native, transliteration, de, en, groupId, imageId = null) {
  return {
    slug,
    group_id: groupId,
    card_type: 'character',
    native,
    transliteration,
    image_id: imageId,
    data: { mnemonic: { de, en } },
  }
}

function quiz(slug, native, transliteration, deQuestion, enQuestion, options, groupId) {
  return {
    slug,
    group_id: groupId,
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

function dakutenCard(baseName, baseKana, voicedName, voicedKana, groupId, imageId = null) {
  return character(
    `h-${voicedName.toLowerCase()}`,
    voicedKana,
    voicedName,
    `${baseName} bekommt zwei Striche\n${baseKana} wird ${voicedKana}`,
    `${baseName} gets two marks\n${baseKana} becomes ${voicedKana}`,
    groupId,
    imageId
  )
}

function handakutenCard(baseName, baseKana, pName, pKana, groupId, imageId = null) {
  return character(
    `h-${pName.toLowerCase()}`,
    pKana,
    pName,
    `${baseName} bekommt einen Kreis\n${baseKana} wird ${pKana}`,
    `${baseName} gets a circle\n${baseKana} becomes ${pKana}`,
    groupId,
    imageId
  )
}

async function writeLesson(supabase, courseId, lesson, groupId) {
  const lessonId = await upsertLesson(
    supabase,
    courseId,
    lesson.slug,
    lesson.sortOrder,
    lesson.titles,
    lesson.descriptions ?? {},
    lesson.isActive !== false
  )

  const ids = []
  for (const [index, card] of lesson.cards.entries()) {
    ids.push(await upsertCard(supabase, {
      ...card,
      group_id: card.group_id ?? groupId,
      sort_order: index + 1,
    }))
  }
  await replaceLessonCards(supabase, lessonId, ids)
  return { slug: lesson.slug, cards: ids.length }
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
    ma: cp(0x307e),
    ri: cp(0x308a),
    ya: cp(0x3084), yu: cp(0x3086), yo: cp(0x3088), smallYa: cp(0x3083), smallYu: cp(0x3085), smallYo: cp(0x3087), smallTsu: cp(0x3063),
  }

  const imageIds = await fetchImageIds(supabase, [
    'h-ka', 'h-ki', 'h-ku', 'h-ke', 'h-ko',
    'h-sa', 'h-si', 'h-su', 'h-se', 'h-so',
    'h-ta', 'h-te', 'h-to',
    'h-ha', 'h-hi', 'h-hu', 'h-he', 'h-ho',
    'h-ya', 'h-yu', 'h-yo', 'h-tu',
  ])

  const lessons = [
    {
      slug: 'hiragana-dakuten-k-row',
      sortOrder: 11,
      titles: { de: 'G-Reihe', en: 'G row' },
      descriptions: { de: `${k.ga}${k.gi}${k.gu}${k.ge}${k.go}`, en: `${k.ga}${k.gi}${k.gu}${k.ge}${k.go}` },
      groupId: dakutenGroupId,
      cards: [
        info(
          'info-hiragana-dakuten-k-row-split',
          `# K wird G\n\nDakuten sind zwei kleine Striche rechts oben.\nOben steht die neue G-Reihe.\n\n| ${k.ga} | ${k.gi} | ${k.gu} | ${k.ge} | ${k.go} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ga | Gi | Gu | Ge | Go |\n\nDarunter steht die bekannte K-Reihe.\n\n| ${k.ka} | ${k.ki} | ${k.ku} | ${k.ke} | ${k.ko} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ka | Ki | Ku | Ke | Ko |`,
          `# K becomes G\n\nDakuten are two small marks at the upper right.\nThe new G row is on top.\n\n| ${k.ga} | ${k.gi} | ${k.gu} | ${k.ge} | ${k.go} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ga | Gi | Gu | Ge | Go |\n\nThe known K row is below.\n\n| ${k.ka} | ${k.ki} | ${k.ku} | ${k.ke} | ${k.ko} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ka | Ki | Ku | Ke | Ko |`,
          dakutenGroupId
        ),
        dakutenCard('Ka', k.ka, 'Ga', k.ga, dakutenGroupId, imageIds['h-ka']),
        dakutenCard('Ki', k.ki, 'Gi', k.gi, dakutenGroupId, imageIds['h-ki']),
        dakutenCard('Ku', k.ku, 'Gu', k.gu, dakutenGroupId, imageIds['h-ku']),
        dakutenCard('Ke', k.ke, 'Ge', k.ge, dakutenGroupId, imageIds['h-ke']),
        dakutenCard('Ko', k.ko, 'Go', k.go, dakutenGroupId, imageIds['h-ko']),
        quiz('quiz-h-ga', k.ga, 'Ga', 'Welches Zeichen steht für Ga?', 'Which character represents Ga?', [k.ga, k.ka, k.sa, k.ha], dakutenGroupId),
        quiz('quiz-h-gi', k.gi, 'Gi', 'Welches Zeichen steht für Gi?', 'Which character represents Gi?', [k.gi, k.ki, k.ji, k.ri], dakutenGroupId),
      ],
    },
    {
      slug: 'hiragana-dakuten-s-row',
      sortOrder: 12,
      titles: { de: 'Z-Reihe', en: 'Z row' },
      descriptions: { de: `${k.za}${k.ji}${k.zu}${k.ze}${k.zo}`, en: `${k.za}${k.ji}${k.zu}${k.ze}${k.zo}` },
      groupId: dakutenGroupId,
      cards: [
        info(
          'info-hiragana-dakuten-s-row-split',
          `# S wird Z\n\nDie gleiche Form bleibt.\nOben steht die neue Z-Reihe.\n\n| ${k.za} | ${k.ji} | ${k.zu} | ${k.ze} | ${k.zo} |\n|:---:|:---:|:---:|:---:|:---:|\n| Za | Ji | Zu | Ze | Zo |\n\nDarunter steht die bekannte S-Reihe.\n\n| ${k.sa} | ${k.shi} | ${k.su} | ${k.se} | ${k.so} |\n|:---:|:---:|:---:|:---:|:---:|\n| Sa | Shi | Su | Se | So |\n\nAchtung: ${k.ji} liest du Ji.`,
          `# S becomes Z\n\nThe shape stays the same.\nThe new Z row is on top.\n\n| ${k.za} | ${k.ji} | ${k.zu} | ${k.ze} | ${k.zo} |\n|:---:|:---:|:---:|:---:|:---:|\n| Za | Ji | Zu | Ze | Zo |\n\nThe known S row is below.\n\n| ${k.sa} | ${k.shi} | ${k.su} | ${k.se} | ${k.so} |\n|:---:|:---:|:---:|:---:|:---:|\n| Sa | Shi | Su | Se | So |\n\nCareful: ${k.ji} is read Ji.`,
          dakutenGroupId
        ),
        dakutenCard('Sa', k.sa, 'Za', k.za, dakutenGroupId, imageIds['h-sa']),
        dakutenCard('Shi', k.shi, 'Ji', k.ji, dakutenGroupId, imageIds['h-si']),
        dakutenCard('Su', k.su, 'Zu', k.zu, dakutenGroupId, imageIds['h-su']),
        dakutenCard('Se', k.se, 'Ze', k.ze, dakutenGroupId, imageIds['h-se']),
        dakutenCard('So', k.so, 'Zo', k.zo, dakutenGroupId, imageIds['h-so']),
        quiz('quiz-h-ji', k.ji, 'Ji', 'Welches Zeichen steht für Ji?', 'Which character represents Ji?', [k.ji, k.shi, k.chi, k.gi], dakutenGroupId),
        quiz('quiz-h-zu', k.zu, 'Zu', 'Welches Zeichen steht für Zu?', 'Which character represents Zu?', [k.zu, k.su, k.tsu, k.gu], dakutenGroupId),
      ],
    },
    {
      slug: 'hiragana-dakuten-t-row',
      sortOrder: 13,
      titles: { de: 'D-Reihe', en: 'D row' },
      descriptions: { de: `${k.da}${k.de}${k.do_}`, en: `${k.da}${k.de}${k.do_}` },
      groupId: dakutenGroupId,
      cards: [
        info(
          'info-hiragana-dakuten-t-row-split',
          `# T wird D\n\nIn der T-Reihe nutzt du Dakuten nur bei drei Zeichen.\nOben stehen die neuen D-Zeichen.\n\n| ${k.da} | ${k.de} | ${k.do_} |\n|:---:|:---:|:---:|\n| Da | De | Do |\n\nDarunter stehen die bekannten T-Zeichen.\n\n| ${k.ta} | ${k.te} | ${k.to} |\n|:---:|:---:|:---:|\n| Ta | Te | To |`,
          `# T becomes D\n\nIn the T row you use dakuten on three characters.\nThe new D characters are on top.\n\n| ${k.da} | ${k.de} | ${k.do_} |\n|:---:|:---:|:---:|\n| Da | De | Do |\n\nThe known T characters are below.\n\n| ${k.ta} | ${k.te} | ${k.to} |\n|:---:|:---:|:---:|\n| Ta | Te | To |`,
          dakutenGroupId
        ),
        dakutenCard('Ta', k.ta, 'Da', k.da, dakutenGroupId, imageIds['h-ta']),
        dakutenCard('Te', k.te, 'De', k.de, dakutenGroupId, imageIds['h-te']),
        dakutenCard('To', k.to, 'Do', k.do_, dakutenGroupId, imageIds['h-to']),
        quiz('quiz-h-da', k.da, 'Da', 'Welches Zeichen steht für Da?', 'Which character represents Da?', [k.da, k.ta, k.ba, k.pa], dakutenGroupId),
        quiz('quiz-h-do', k.do_, 'Do', 'Welches Zeichen steht für Do?', 'Which character represents Do?', [k.do_, k.to, k.go, k.zo], dakutenGroupId),
      ],
    },
    {
      slug: 'hiragana-dakuten-h-row',
      sortOrder: 14,
      titles: { de: 'B-Reihe', en: 'B row' },
      descriptions: { de: `${k.ba}${k.bi}${k.bu}${k.be}${k.bo}`, en: `${k.ba}${k.bi}${k.bu}${k.be}${k.bo}` },
      groupId: dakutenGroupId,
      cards: [
        info(
          'info-hiragana-dakuten-h-row-split',
          `# H wird B\n\nZwei Dakuten-Striche machen aus der H-Reihe die B-Reihe.\nOben steht die neue B-Reihe.\n\n| ${k.ba} | ${k.bi} | ${k.bu} | ${k.be} | ${k.bo} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ba | Bi | Bu | Be | Bo |\n\nDarunter steht die bekannte H-Reihe.\n\n| ${k.ha} | ${k.hi} | ${k.fu} | ${k.he} | ${k.ho} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |`,
          `# H becomes B\n\nTwo dakuten marks turn the H row into the B row.\nThe new B row is on top.\n\n| ${k.ba} | ${k.bi} | ${k.bu} | ${k.be} | ${k.bo} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ba | Bi | Bu | Be | Bo |\n\nThe known H row is below.\n\n| ${k.ha} | ${k.hi} | ${k.fu} | ${k.he} | ${k.ho} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |`,
          dakutenGroupId
        ),
        dakutenCard('Ha', k.ha, 'Ba', k.ba, dakutenGroupId, imageIds['h-ha']),
        dakutenCard('Hi', k.hi, 'Bi', k.bi, dakutenGroupId, imageIds['h-hi']),
        dakutenCard('Fu', k.fu, 'Bu', k.bu, dakutenGroupId, imageIds['h-hu']),
        dakutenCard('He', k.he, 'Be', k.be, dakutenGroupId, imageIds['h-he']),
        dakutenCard('Ho', k.ho, 'Bo', k.bo, dakutenGroupId, imageIds['h-ho']),
        quiz('quiz-h-ba', k.ba, 'Ba', 'Welches Zeichen steht für Ba?', 'Which character represents Ba?', [k.ba, k.ha, k.pa, k.ma], dakutenGroupId),
        quiz('quiz-h-bo', k.bo, 'Bo', 'Welches Zeichen steht für Bo?', 'Which character represents Bo?', [k.bo, k.ho, k.po, k.do_], dakutenGroupId),
      ],
    },
    {
      slug: 'hiragana-handakuten-p-row',
      sortOrder: 15,
      titles: { de: 'P-Reihe', en: 'P row' },
      descriptions: { de: `${k.pa}${k.pi}${k.pu}${k.pe}${k.po}`, en: `${k.pa}${k.pi}${k.pu}${k.pe}${k.po}` },
      groupId: handakutenGroupId,
      cards: [
        info(
          'info-hiragana-handakuten-p-row-split',
          `# H wird P\n\nHandakuten ist der kleine Kreis rechts oben.\nOben steht die neue P-Reihe.\n\n| ${k.pa} | ${k.pi} | ${k.pu} | ${k.pe} | ${k.po} |\n|:---:|:---:|:---:|:---:|:---:|\n| Pa | Pi | Pu | Pe | Po |\n\nDarunter steht die bekannte H-Reihe.\n\n| ${k.ha} | ${k.hi} | ${k.fu} | ${k.he} | ${k.ho} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |`,
          `# H becomes P\n\nHandakuten is the small circle at the upper right.\nThe new P row is on top.\n\n| ${k.pa} | ${k.pi} | ${k.pu} | ${k.pe} | ${k.po} |\n|:---:|:---:|:---:|:---:|:---:|\n| Pa | Pi | Pu | Pe | Po |\n\nThe known H row is below.\n\n| ${k.ha} | ${k.hi} | ${k.fu} | ${k.he} | ${k.ho} |\n|:---:|:---:|:---:|:---:|:---:|\n| Ha | Hi | Fu | He | Ho |`,
          handakutenGroupId
        ),
        handakutenCard('Ha', k.ha, 'Pa', k.pa, handakutenGroupId, imageIds['h-ha']),
        handakutenCard('Hi', k.hi, 'Pi', k.pi, handakutenGroupId, imageIds['h-hi']),
        handakutenCard('Fu', k.fu, 'Pu', k.pu, handakutenGroupId, imageIds['h-hu']),
        handakutenCard('He', k.he, 'Pe', k.pe, handakutenGroupId, imageIds['h-he']),
        handakutenCard('Ho', k.ho, 'Po', k.po, handakutenGroupId, imageIds['h-ho']),
        quiz('quiz-h-pa', k.pa, 'Pa', 'Welches Zeichen steht für Pa?', 'Which character represents Pa?', [k.pa, k.ba, k.ha, k.ma], handakutenGroupId),
        quiz('quiz-h-po', k.po, 'Po', 'Welches Zeichen steht für Po?', 'Which character represents Po?', [k.po, k.bo, k.ho, k.do_], handakutenGroupId),
      ],
    },
    {
      slug: 'hiragana-small-ya-yu-yo',
      sortOrder: 16,
      isActive: false,
      titles: { de: 'Kleine Ya Yu Yo', en: 'Small Ya Yu Yo' },
      groupId: defaultGroupId,
      cards: [
        info(
          'info-hiragana-small-ya-yu-yo-intro',
          `# Kleine Ya Yu Yo\n\nKleine Zeichen stehen nicht allein.\nOben steht die neue kleine Form.\n\n| ${k.smallYa} | ${k.smallYu} | ${k.smallYo} |\n|:---:|:---:|:---:|\n| klein ya | klein yu | klein yo |\n\nDarunter stehen die großen Zeichen.\n\n| ${k.ya} | ${k.yu} | ${k.yo} |\n|:---:|:---:|:---:|\n| Ya | Yu | Yo |`,
          `# Small Ya Yu Yo\n\nSmall characters do not stand alone.\nThe new small forms are on top.\n\n| ${k.smallYa} | ${k.smallYu} | ${k.smallYo} |\n|:---:|:---:|:---:|\n| small ya | small yu | small yo |\n\nThe large characters are below.\n\n| ${k.ya} | ${k.yu} | ${k.yo} |\n|:---:|:---:|:---:|\n| Ya | Yu | Yo |`,
          defaultGroupId
        ),
        character('h-small-ya', k.smallYa, 'small ya', 'Kleines Ya hängt sich an i-Laute\nKi plus kleines Ya wird Kya', 'Small ya attaches to i sounds\nKi plus small ya becomes Kya', defaultGroupId, imageIds['h-ya']),
        character('h-small-yu', k.smallYu, 'small yu', 'Kleines Yu hängt sich an i-Laute\nShi plus kleines Yu wird Shu', 'Small yu attaches to i sounds\nShi plus small yu becomes Shu', defaultGroupId, imageIds['h-yu']),
        character('h-small-yo', k.smallYo, 'small yo', 'Kleines Yo hängt sich an i-Laute\nChi plus kleines Yo wird Cho', 'Small yo attaches to i sounds\nChi plus small yo becomes Cho', defaultGroupId, imageIds['h-yo']),
        info(
          'info-hiragana-yoon-examples',
          `# Kombinationen\n\n| ${k.ki}${k.smallYa} | ${k.ki}${k.smallYu} | ${k.ki}${k.smallYo} |\n|:---:|:---:|:---:|\n| Kya | Kyu | Kyo |\n\n| ${k.shi}${k.smallYa} | ${k.shi}${k.smallYu} | ${k.shi}${k.smallYo} |\n|:---:|:---:|:---:|\n| Sha | Shu | Sho |\n\n| ${k.chi}${k.smallYa} | ${k.chi}${k.smallYu} | ${k.chi}${k.smallYo} |\n|:---:|:---:|:---:|\n| Cha | Chu | Cho |`,
          `# Combinations\n\n| ${k.ki}${k.smallYa} | ${k.ki}${k.smallYu} | ${k.ki}${k.smallYo} |\n|:---:|:---:|:---:|\n| Kya | Kyu | Kyo |\n\n| ${k.shi}${k.smallYa} | ${k.shi}${k.smallYu} | ${k.shi}${k.smallYo} |\n|:---:|:---:|:---:|\n| Sha | Shu | Sho |\n\n| ${k.chi}${k.smallYa} | ${k.chi}${k.smallYu} | ${k.chi}${k.smallYo} |\n|:---:|:---:|:---:|\n| Cha | Chu | Cho |`,
          defaultGroupId
        ),
        quiz('quiz-h-kya', `${k.ki}${k.smallYa}`, 'Kya', 'Welche Kombination steht für Kya?', 'Which combination represents Kya?', [`${k.ki}${k.smallYa}`, `${k.ki}${k.smallYu}`, `${k.ki}${k.smallYo}`, `${k.ki}${k.ya}`], defaultGroupId),
        quiz('quiz-h-shu', `${k.shi}${k.smallYu}`, 'Shu', 'Welche Kombination steht für Shu?', 'Which combination represents Shu?', [`${k.shi}${k.smallYu}`, `${k.shi}${k.smallYa}`, `${k.shi}${k.smallYo}`, `${k.shi}${k.yu}`], defaultGroupId),
        quiz('quiz-h-cho', `${k.chi}${k.smallYo}`, 'Cho', 'Welche Kombination steht für Cho?', 'Which combination represents Cho?', [`${k.chi}${k.smallYo}`, `${k.chi}${k.smallYa}`, `${k.chi}${k.smallYu}`, `${k.chi}${k.yo}`], defaultGroupId),
      ],
    },
    {
      slug: 'hiragana-small-tsu',
      sortOrder: 17,
      isActive: false,
      titles: { de: 'Kleines Tsu', en: 'Small Tsu' },
      groupId: defaultGroupId,
      cards: [
        info(
          'info-hiragana-small-tsu-intro',
          `# Kleines Tsu\n\nKlein ${k.smallTsu} macht eine kurze Pause.\nDer nächste Konsonant wird verdoppelt.`,
          `# Small Tsu\n\nSmall ${k.smallTsu} creates a short pause.\nThe next consonant is doubled.`,
          defaultGroupId
        ),
        character('h-small-tsu', k.smallTsu, 'small tsu', `Kleines Tsu ist eine kurze Pause\n${k.ki}${k.smallTsu}${k.te} liest du Kitte`, `Small tsu is a short pause\n${k.ki}${k.smallTsu}${k.te} is read Kitte`, defaultGroupId, imageIds['h-tu']),
        info(
          'info-hiragana-small-tsu-examples',
          `# Kleine Pause\n\nOben steht die neue Schreibweise mit Pause.\n\n| ${k.ki}${k.smallTsu}${k.te} |\n|:---:|\n| Kitte |\n\nDarunter steht die bekannte Schreibweise ohne Pause.\n\n| ${k.ki}${k.te} |\n|:---:|\n| Kite |\n\nMit ${k.smallTsu} stoppst du kurz vor dem nächsten Konsonanten.`,
          `# Small Pause\n\nThe new spelling with a pause is on top.\n\n| ${k.ki}${k.smallTsu}${k.te} |\n|:---:|\n| Kitte |\n\nThe known spelling without a pause is below.\n\n| ${k.ki}${k.te} |\n|:---:|\n| Kite |\n\nWith ${k.smallTsu}, you stop briefly before the next consonant.`,
          defaultGroupId
        ),
        quiz('quiz-h-kitte', `${k.ki}${k.smallTsu}${k.te}`, 'Kitte', 'Welche Schreibweise enthält die kleine Pause?', 'Which spelling contains the small pause?', [`${k.ki}${k.smallTsu}${k.te}`, `${k.ki}${k.te}`, `${k.ki}${k.tsu}${k.te}`, `${k.ki}${cp(0x3044)}${k.te}`], defaultGroupId),
      ],
    },
  ]

  const deprecatedSlugs = [
    'hiragana-dakuten-handakuten',
    'hiragana-small-kana-combinations',
  ]

  for (const slug of deprecatedSlugs) {
    const { error } = await supabase
      .from('language_cards_course_lessons')
      .update({ is_active: false })
      .eq('slug', slug)
    if (error) throw error
  }

  const written = []
  for (const lesson of lessons) {
    written.push(await writeLesson(supabase, course.id, lesson, lesson.groupId))
  }

  console.log(JSON.stringify({
    deactivated: deprecatedSlugs,
    activated: written,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
