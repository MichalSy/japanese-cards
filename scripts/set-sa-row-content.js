const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(path) {
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

async function main() {
  loadEnv('.env.local')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const updates = {
    'h-sa': {
      mnemonic: {
        de: 'Die Sandale beginnt mit Sa\nRiemen und Sohle führen zu さ',
        en: 'The sandal starts with Sa\nstrap and sole lead to さ',
      },
    },
    'h-si': {
      mnemonic: {
        de: 'Schiff klingt am Anfang wie Shi\nder Rumpf zieht die lange し-Kurve',
        en: 'The ship starts with Shi\nthe hull draws the long し curve',
      },
    },
    'h-su': {
      mnemonic: {
        de: 'Beim Sushi liegt oben ein Stäbchen\ndie Rolle dreht sich zu す',
        en: 'The sushi has a chopstick on top\nthe roll curls into す',
      },
    },
    'h-se': {
      mnemonic: {
        de: 'Der Sessel beginnt mit Se\nLehne und Sitz formen せ',
        en: 'The seat starts with Se\nback and seat form せ',
      },
    },
    'h-so': {
      mnemonic: {
        de: 'Die Socke beginnt mit So\nFerse und Fuß knicken wie そ',
        en: 'The sock starts with So\nheel and foot bend like そ',
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

  const { error: activeError } = await supabase
    .from('language_cards_course_lessons')
    .update({ is_active: true })
    .eq('slug', 'sa-row')

  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'sa-row' }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
