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
    'h-ta': {
      mnemonic: {
        de: 'Links steht die T-Kreuzung\nrechts führen zwei Kurven zu た',
        en: 'The T-junction is on the left\ntwo right-side curves make た',
      },
    },
    'h-ti': {
      mnemonic: {
        de: 'Die Chili beginnt mit Chi\nder rote Schwung biegt sich wie ち',
        en: 'The chili starts with Chi\nthe red curve bends like ち',
      },
    },
    'info-ta-row-chi-compare': {
      content_md: {
        de: '# ち oder さ\n\n| さ | ち |\n|:---:|:---:|\n| Sa | Chi |\n\nさ hast du schon gelernt.\nち kippt stärker nach rechts und öffnet sich unten wie die Chili-Kurve.',
        en: '# ち or さ\n\n| さ | ち |\n|:---:|:---:|\n| Sa | Chi |\n\nYou already know さ.\nち leans further right and opens at the bottom like the chili curve.',
      },
    },
    'h-tu': {
      mnemonic: {
        de: 'Der Tsunami beginnt mit Tsu\ndie große Welle rollt wie つ',
        en: 'The tsunami starts with Tsu\nthe big wave rolls like つ',
      },
    },
    'info-ta-row-tsu-compare': {
      content_md: {
        de: '# つ oder う\n\n| う | つ |\n|:---:|:---:|\n| U | Tsu |\n\nう hat oben den kleinen Zusatzstrich.\nつ ist die reine Welle ohne Tropfen darüber.',
        en: '# つ or う\n\n| う | つ |\n|:---:|:---:|\n| U | Tsu |\n\nう has the small extra stroke on top.\nつ is the clean wave without a drop above it.',
      },
    },
    'h-te': {
      mnemonic: {
        de: 'Das Teleskop beginnt mit Te\nder gebogene Tubus zeigt die Linie von て',
        en: 'The telescope starts with Te\nthe curved tube follows て',
      },
    },
    'h-to': {
      mnemonic: {
        de: 'Die Tomate beginnt mit To\nStiel und Rundung erinnern an と',
        en: 'The tomato starts with To\nstem and round body point to と',
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
    .eq('slug', 'ta-row')

  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'ta-row' }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
