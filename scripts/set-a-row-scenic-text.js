const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const cp = (...xs) => String.fromCodePoint(...xs)

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

  const kana = {
    a: cp(0x3042),
    i: cp(0x3044),
    u: cp(0x3046),
    e: cp(0x3048),
    o: cp(0x304a),
  }

  const updates = {
    'info-hiragana-a-row-intro': {
      content_md: {
        de: '# Willkommen zur\nA-Reihe!\n\nDie 5 Grundvokale des Hiragana:\n\n| ' + kana.a + ' | ' + kana.i + ' | ' + kana.u + ' | ' + kana.e + ' | ' + kana.o + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| a | i | u | e | o |',
        en: '# Welcome to the\nA Row!\n\nThe 5 basic vowels of Hiragana:\n\n| ' + kana.a + ' | ' + kana.i + ' | ' + kana.u + ' | ' + kana.e + ' | ' + kana.o + ' |\n|:---:|:---:|:---:|:---:|:---:|\n| a | i | u | e | o |',
      },
    },
    'h-a': {
      mnemonic: {
        de: 'Das Mädchen ruft laut AH\nArm und Schwung erinnern an ' + kana.a,
        en: 'The girl shouts AH\narm and motion recall ' + kana.a,
      },
      translations: {
        de: 'A - erster Vokal',
        en: 'A - first vowel',
      },
    },
    'h-i': {
      mnemonic: {
        de: 'Zwei Mäuse halten Stäbchen\nzwei gerade Striche wie ' + kana.i,
        en: 'Two mice hold chopsticks\ntwo straight strokes like ' + kana.i,
      },
      translations: {
        de: 'I - klingt wie i',
        en: 'I - sounds like ee',
      },
    },
    'h-u': {
      mnemonic: {
        de: 'Der Fisch macht einen U-Mund\ndie runde Kurve führt zu ' + kana.u,
        en: 'The fish makes a U-shaped mouth\nthe round curve leads to ' + kana.u,
      },
      translations: {
        de: 'U - runder Vokal',
        en: 'U - rounded vowel',
      },
    },
    'h-e': {
      mnemonic: {
        de: 'Die Vogelscheuche streckt die Arme\nKörper und Hut zeigen ' + kana.e,
        en: 'The scarecrow stretches its arms\nbody and hat point to ' + kana.e,
      },
      translations: {
        de: 'E - wie e in Berg',
        en: 'E - like e in bed',
      },
    },
    'h-o': {
      mnemonic: {
        de: 'Der Otter hat einen runden O-Bauch\nBauch und Pfote erinnern an ' + kana.o,
        en: 'The otter has a round O belly\nbelly and paw recall ' + kana.o,
      },
      translations: {
        de: 'O - wie o in Boot',
        en: 'O - like o in old',
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

  console.log(JSON.stringify({ changed }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
