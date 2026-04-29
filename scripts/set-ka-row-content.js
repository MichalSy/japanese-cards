const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(path) {
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

const cp = (...xs) => String.fromCodePoint(...xs)
const kana = {
  ka: cp(0x304b),
  ki: cp(0x304d),
  ku: cp(0x304f),
  ke: cp(0x3051),
  ko: cp(0x3053),
  i: cp(0x3044),
}

async function main() {
  loadEnv('.env.local')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const updates = {
    'h-ka': {
      mnemonic: {
        de: `Der Karate-Kick formt den Bogen\nrechts sitzt der kleine Strich von ${kana.ka}`,
        en: `The karate kick forms the curve\nthe small stroke on the right completes ${kana.ka}`,
      },
    },
    'h-ki': {
      mnemonic: {
        de: `Der Schlüssel beginnt mit Ki\nzwei Kerben erinnern an ${kana.ki}`,
        en: `The key starts with Ki\ntwo notches echo ${kana.ki}`,
      },
    },
    'h-ku': {
      mnemonic: {
        de: `Der Kuckuck öffnet den Schnabel\nals spitzen Winkel wie ${kana.ku}`,
        en: `The cuckoo opens its beak\ninto a sharp angle like ${kana.ku}`,
      },
    },
    'h-ke': {
      mnemonic: {
        de: `Der Kessel beginnt mit Ke\nGriff und Ausguss helfen bei ${kana.ke}`,
        en: `The kettle starts with Ke\nhandle and spout point to ${kana.ke}`,
      },
    },
    'info-hiragana-ka-row-ke-vs-i': {
      content_md: {
        de: `# ${kana.ke} oder ${kana.i}\n\n| ${kana.i} | ${kana.ke} |\n|:---:|:---:|\n| I | Ke |\n\nBei ${kana.i} bleiben zwei gerade Stäbchen.\nBei ${kana.ke} kommt links der Kessel-Griff dazu.\nDer kleine Haken rechts ist dein Ke-Signal.`,
        en: `# ${kana.ke} or ${kana.i}\n\n| ${kana.i} | ${kana.ke} |\n|:---:|:---:|\n| I | Ke |\n\n${kana.i} stays as two straight sticks.\n${kana.ke} adds the kettle handle on the left.\nThe little hook on the right is your Ke signal.`,
      },
    },
    'h-ko': {
      mnemonic: {
        de: `Der Koala beginnt mit Ko\nzwei Zweige in den Pfoten wie ${kana.ko}`,
        en: `The koala starts with Ko\ntwo twigs in its paws echo ${kana.ko}`,
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
    .eq('slug', 'ka-row')

  if (activeError) throw activeError

  console.log(JSON.stringify({ changed, activated: 'ka-row' }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
