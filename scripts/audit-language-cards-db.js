#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(file = '.env.local') {
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (!m) continue
    const key = m[1].trim()
    const value = m[2].trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

async function countTable(supabase, table) {
  const probe = await supabase.from(table).select('*').limit(1)
  if (probe.error) return { exists: false, error: probe.error.code || probe.error.message }

  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
  if (error) return { exists: false, error: error.code || error.message }
  return { exists: true, count: count ?? 0 }
}

async function selectRows(supabase, table, columns, order, fallbackColumns) {
  const run = async (cols) => {
    let q = supabase.from(table).select(cols)
    if (order) q = q.order(order)
    return q
  }
  let { data, error } = await run(columns)
  if (error && fallbackColumns) {
    const fallback = await run(fallbackColumns)
    data = fallback.data
    error = fallback.error
  }
  if (error) return { error: error.code || error.message, data: [] }
  return { data: data || [] }
}

function mdTable(headers, rows) {
  const esc = value => String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>')
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(esc).join(' | ')} |`),
  ].join('\n')
}

function groupCount(rows, keyFn) {
  const out = new Map()
  for (const row of rows) {
    const key = keyFn(row)
    out.set(key, (out.get(key) || 0) + 1)
  }
  return [...out.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])))
}

async function main() {
  loadEnv()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  const supabase = createClient(url, key)

  const tables = [
    'language_cards_languages',
    'language_cards_tracks',
    'language_cards_track_translations',
    'language_cards_track_categories',
    'language_cards_categories',
    'language_cards_category_translations',
    'language_cards_learning_courses',
    'language_cards_learning_course_translations',
    'language_cards_learning_lessons',
    'language_cards_learning_lesson_translations',
    'language_cards_learning_lesson_cards',
    'language_cards_practice_groups',
    'language_cards_practice_group_translations',
    'language_cards_practice_group_cards',
    'language_cards_cards',
    'language_cards_card_translations',
    'language_cards_user_settings',
    'language_cards_user_card_progress',
    'language_cards_category_snapshots',
    'language_cards_user_sessions',
    'language_cards_category_collections',
    'language_cards_category_collection_translations',
    'language_cards_groups',
    'language_cards_group_translations',
    'language_cards_courses',
    'language_cards_course_lessons',
    'language_cards_course_lesson_cards',
  ]

  const counts = []
  for (const table of tables) {
    const c = await countTable(supabase, table)
    counts.push({ table, ...c })
  }

  const languages = await selectRows(supabase, 'language_cards_languages', 'id,name_en,name_de,name_native,is_ui_language,is_learn_language,is_active,sort_order', 'sort_order')
  const categories = await selectRows(supabase, 'language_cards_categories', 'id,language_id,slug,native_name,card_type,is_active,status,sort_order,show_all_option,game_modes', 'sort_order', 'id,language_id,slug,native_name,card_type,is_active,sort_order,show_all_option,game_modes')
  const tracks = await selectRows(supabase, 'language_cards_tracks', 'id,language_id,slug,level_system,level_code,status,sort_order,emoji', 'sort_order')
  const trackCategories = await selectRows(supabase, 'language_cards_track_categories', 'track_id,category_id,sort_order,status_override', 'sort_order')
  const courses = await selectRows(supabase, 'language_cards_learning_courses', 'id,category_id,slug,level,is_active,status,sort_order', 'sort_order', 'id,category_id,slug,level,is_active,sort_order')
  const lessons = await selectRows(supabase, 'language_cards_learning_lessons', 'id,course_id,slug,is_active,status,sort_order', 'sort_order', 'id,course_id,slug,is_active,sort_order')
  const practiceGroups = await selectRows(supabase, 'language_cards_practice_groups', 'id,category_id,slug,is_active,status,sort_order,game_modes', 'sort_order', 'id,category_id,slug,is_active,sort_order,game_modes')
  const cards = await selectRows(supabase, 'language_cards_cards', 'id,slug,card_type,is_active', undefined)
  const lessonLinks = await selectRows(supabase, 'language_cards_learning_lesson_cards', 'lesson_id,card_id', undefined)
  const practiceLinks = await selectRows(supabase, 'language_cards_practice_group_cards', 'practice_group_id,card_id', undefined)

  const categoryById = Object.fromEntries((categories.data || []).map(c => [c.id, c]))
  const courseById = Object.fromEntries((courses.data || []).map(c => [c.id, c]))
  const trackById = Object.fromEntries((tracks.data || []).map(t => [t.id, t]))

  const lines = []
  lines.push('# Japanese Cards DB Audit')
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('## Tables')
  lines.push(mdTable(['Table', 'Status', 'Rows / Error'], counts.map(c => [c.table, c.exists ? 'exists' : 'missing', c.exists ? c.count : c.error])))
  lines.push('')
  lines.push('## Languages')
  lines.push(mdTable(['ID', 'Name EN', 'UI', 'Learn', 'Active', 'Sort'], (languages.data || []).map(l => [l.id, l.name_en, l.is_ui_language, l.is_learn_language, l.is_active, l.sort_order])))
  lines.push('')
  lines.push('## Tracks')
  if (tracks.error) lines.push(`Tracks query error: ${tracks.error}`)
  else lines.push(mdTable(['Language', 'Slug', 'System', 'Level', 'Status', 'Sort'], (tracks.data || []).map(t => [t.language_id, t.slug, t.level_system, t.level_code, t.status, t.sort_order])))
  lines.push('')
  lines.push('## Categories')
  lines.push(mdTable(['Language', 'Slug', 'Card Type', 'is_active', 'status', 'Sort', 'Show All', 'Game Modes'], (categories.data || []).map(c => [c.language_id, c.slug, c.card_type, c.is_active, c.status ?? '(missing)', c.sort_order, c.show_all_option, (c.game_modes || []).join(', ')])))
  lines.push('')
  lines.push('## Track → Categories')
  if (trackCategories.error) lines.push(`Track categories query error: ${trackCategories.error}`)
  else lines.push(mdTable(['Track', 'Category', 'Sort', 'Override'], (trackCategories.data || []).map(tc => [trackById[tc.track_id]?.slug || tc.track_id, categoryById[tc.category_id]?.slug || tc.category_id, tc.sort_order, tc.status_override ?? ''])))
  lines.push('')
  lines.push('## Courses by Category')
  lines.push(mdTable(['Category', 'Courses'], groupCount(courses.data || [], c => categoryById[c.category_id]?.slug || c.category_id)))
  lines.push('')
  lines.push('## Lessons by Course')
  lines.push(mdTable(['Course', 'Lessons'], groupCount(lessons.data || [], l => courseById[l.course_id]?.slug || l.course_id)))
  lines.push('')
  lines.push('## Practice Groups by Category')
  lines.push(mdTable(['Category', 'Practice Groups'], groupCount(practiceGroups.data || [], g => categoryById[g.category_id]?.slug || g.category_id)))
  lines.push('')
  lines.push('## Cards by Type / Active')
  lines.push(mdTable(['Type:Active', 'Cards'], groupCount(cards.data || [], c => `${c.card_type}:${c.is_active === false ? 'inactive' : 'active'}`)))
  lines.push('')
  lines.push('## Orphan Checks')
  const lessonIds = new Set((lessons.data || []).map(l => l.id))
  const practiceGroupIds = new Set((practiceGroups.data || []).map(g => g.id))
  const cardIds = new Set((cards.data || []).map(c => c.id))
  const orphanLessonLinks = (lessonLinks.data || []).filter(l => !lessonIds.has(l.lesson_id) || !cardIds.has(l.card_id)).length
  const orphanPracticeLinks = (practiceLinks.data || []).filter(l => !practiceGroupIds.has(l.practice_group_id) || !cardIds.has(l.card_id)).length
  const lessonsWithoutCards = (lessons.data || []).filter(l => !(lessonLinks.data || []).some(x => x.lesson_id === l.id)).length
  const practiceGroupsWithoutCards = (practiceGroups.data || []).filter(g => !(practiceLinks.data || []).some(x => x.practice_group_id === g.id)).length
  lines.push(mdTable(['Check', 'Count'], [
    ['Learning lesson links pointing to missing lesson/card', orphanLessonLinks],
    ['Practice group links pointing to missing group/card', orphanPracticeLinks],
    ['Lessons without cards', lessonsWithoutCards],
    ['Practice groups without cards', practiceGroupsWithoutCards],
  ]))

  const outPath = process.argv[2] || 'docs/db-audit-current.md'
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, lines.join('\n') + '\n')
  console.log(JSON.stringify({ ok: true, outPath, tables: counts.length }, null, 2))
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
