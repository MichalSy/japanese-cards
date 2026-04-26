const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(path) {
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

const replacements = [
  [/f\?r/g, 'für'],
  [/F\?r/g, 'Für'],
  [/R\?cken/g, 'Rücken'],
  [/r\?cken/g, 'rücken'],
  [/Fl\?gel/g, 'Flügel'],
  [/fl\?gel/g, 'flügel'],
  [/Bl\?te/g, 'Blüte'],
  [/bl\?te/g, 'blüte'],
  [/Br\?cke/g, 'Brücke'],
  [/br\?cke/g, 'brücke'],
  [/B\?nder/g, 'Bänder'],
  [/b\?nder/g, 'bänder'],
  [/schr\?ge/g, 'schräge'],
  [/schr\?ger/g, 'schräger'],
  [/schr\?ges/g, 'schräges'],
  [/St\?cke/g, 'Stücke'],
  [/st\?cke/g, 'stücke'],
  [/f\?llt/g, 'fällt'],
  [/F\?llt/g, 'Fällt'],
  [/gro\?e/g, 'große'],
  [/Gro\?e/g, 'Große'],
  [/K\?rper/g, 'Körper'],
  [/k\?rper/g, 'körper'],
  [/flie\?en/g, 'fließen'],
  [/\?ber/g, 'über'],
  [/H\?he/g, 'Höhe'],
  [/h\?her/g, 'höher'],
  [/h\?lt/g, 'hält'],
]

function repairString(value, native) {
  let next = value
  for (const [pattern, replacement] of replacements) {
    next = next.replace(pattern, replacement)
  }

  if (native) {
    next = next.replace(/(wie|bei|ist|zeigt|zeigen|show|shows|help with|helps with|point to|points to) \?/g, `$1 ${native}`)
  }

  return next
}

function repairJson(value, native) {
  if (typeof value === 'string') return repairString(value, native)
  if (Array.isArray(value)) return value.map((item) => repairJson(item, native))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, repairJson(item, native)])
    )
  }
  return value
}

async function main() {
  loadEnv('.env.local')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: cards, error } = await supabase
    .from('language_cards_cards')
    .select('id,slug,native,data')

  if (error) throw error

  const changed = []

  for (const card of cards) {
    const before = JSON.stringify(card.data ?? {})
    const data = repairJson(card.data ?? {}, card.native)
    const after = JSON.stringify(data)

    if (before === after) continue

    const { error: updateError } = await supabase
      .from('language_cards_cards')
      .update({ data })
      .eq('id', card.id)

    if (updateError) throw updateError
    changed.push(card.slug)
  }

  console.log(JSON.stringify({ changed }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
