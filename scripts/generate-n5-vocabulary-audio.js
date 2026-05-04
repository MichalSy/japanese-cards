const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(filePath) {
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
}

function loadOpenClawTtsConfig() {
  const config = JSON.parse(fs.readFileSync('/home/aiko/.openclaw/openclaw.json', 'utf8'))
  const tts = config?.messages?.tts
  const providerName = tts?.provider || 'elevenlabs'
  const provider = tts?.providers?.[providerName]
  if (providerName !== 'elevenlabs' || !provider?.apiKey || !provider?.voiceId) throw new Error('ElevenLabs TTS config not found')
  return provider
}

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function generateAudio({ apiKey, voiceId, modelId, voiceSettings }, text) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: modelId || 'eleven_flash_v2_5', voice_settings: voiceSettings || undefined }),
  })
  if (!response.ok) throw new Error(`ElevenLabs failed ${response.status}: ${(await response.text()).slice(0, 500)}`)
  return Buffer.from(await response.arrayBuffer())
}

async function main() {
  loadEnv('.env.local')
  const ttsConfig = loadOpenClawTtsConfig()
  const data = JSON.parse(fs.readFileSync('scripts/n5-vocabulary.json', 'utf8'))
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const force = process.env.FORCE_N5_VOCAB_AUDIO === '1'
  const onlyLesson = process.env.N5_VOCAB_AUDIO_LESSON
  const version = process.env.N5_VOCAB_AUDIO_VERSION || new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const results = []

  for (const lesson of data.lessons) {
    if (onlyLesson && lesson.slug !== onlyLesson) continue
    const lessonKey = lesson.slug.replace(/^n5-vocab-/, '')
    const localDir = path.join('tmp', 'n5-vocabulary-audio', lessonKey)
    fs.mkdirSync(localDir, { recursive: true })

    for (const item of lesson.items) {
      const { data: existingRows, error: selectError } = await supabase
        .from('language_cards_cards')
        .select('slug,audio_url')
        .eq('slug', item.slug)
        .eq('card_type', 'vocabulary')
      if (selectError) throw selectError

      if (!force && existingRows?.[0]?.audio_url) {
        results.push({ lesson: lesson.slug, slug: item.slug, skipped: true, audio_url: existingRows[0].audio_url })
        continue
      }

      const storagePath = `audio/n5-vocabulary/${lessonKey}-${version}/${item.slug}.mp3`
      const { data: publicUrlData } = supabase.storage.from('language-cards').getPublicUrl(storagePath)
      const audioUrl = publicUrlData.publicUrl
      console.log(`generating ${item.slug} ${item.native}`)
      const audio = await generateAudio(ttsConfig, item.native)
      fs.writeFileSync(path.join(localDir, `${item.slug}.mp3`), audio)

      const { error: uploadError } = await supabase.storage
        .from('language-cards')
        .upload(storagePath, audio, { contentType: 'audio/mpeg', upsert: true })
      if (uploadError) throw uploadError

      const { error: updateError } = await supabase
        .from('language_cards_cards')
        .update({ audio_url: audioUrl })
        .eq('slug', item.slug)
        .eq('card_type', 'vocabulary')
      if (updateError) throw updateError

      results.push({ lesson: lesson.slug, slug: item.slug, bytes: audio.length, audio_url: audioUrl })
      await sleep(700)
    }
  }

  console.log(JSON.stringify({ total: results.length, generated: results.filter(r => !r.skipped).length, skipped: results.filter(r => r.skipped).length }, null, 2))
}

main().catch(error => { console.error(error.message || error); process.exit(1) })
