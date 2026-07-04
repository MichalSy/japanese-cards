const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const GERMAN_VOICE_ID = 'KXxZd16DiBqt82nbarJx'
const GERMAN_MODEL_ID = 'eleven_multilingual_v2'
const GERMAN_VOICE_SETTINGS = {
  stability: 1.0,
  similarity_boost: 1.0,
  speed: 1.0,
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (!match) continue
    const key = match[1].trim()
    if (process.env[key]) continue
    process.env[key] = match[2].trim().replace(/^["']|["']$/g, '')
  }
}

function readOpenClawElevenLabsConfig() {
  const configPath = process.env.OPENCLAW_CONFIG || '/home/aiko/.openclaw/openclaw.json'
  if (!fs.existsSync(configPath)) return null
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const tts = config?.messages?.tts
  const providerName = tts?.provider || 'elevenlabs'
  const provider = tts?.providers?.[providerName]
  if (providerName !== 'elevenlabs' || !provider?.apiKey) return null
  return provider
}

function loadElevenLabsConfig() {
  const provider = readOpenClawElevenLabsConfig() || {}
  const apiKey = process.env.ELEVENLABS_API_KEY || provider.apiKey
  if (!apiKey) throw new Error('ElevenLabs API key not found in ELEVENLABS_API_KEY or OpenClaw config')
  return {
    apiKey,
    voiceId: process.env.ELEVENLABS_GERMAN_VOICE_ID || GERMAN_VOICE_ID,
    modelId: process.env.ELEVENLABS_GERMAN_MODEL_ID || GERMAN_MODEL_ID,
    voiceSettings: process.env.ELEVENLABS_GERMAN_VOICE_SETTINGS_JSON
      ? JSON.parse(process.env.ELEVENLABS_GERMAN_VOICE_SETTINGS_JSON)
      : GERMAN_VOICE_SETTINGS,
  }
}

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

function normalizeText(text) {
  return String(text ?? '')
    .replace(/…/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function generateAudio({ apiKey, voiceId, modelId, voiceSettings }, text) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: modelId, voice_settings: voiceSettings || undefined }),
  })
  if (!response.ok) throw new Error(`ElevenLabs failed ${response.status}: ${(await response.text()).slice(0, 500)}`)
  return Buffer.from(await response.arrayBuffer())
}

async function listGermanA1VocabularyCards(supabase) {
  const { data, error } = await supabase
    .from('language_cards_learning_lessons')
    .select(`
      slug,
      course:language_cards_learning_courses!inner(
        category:language_cards_categories!inner(language_id,slug,status,is_active)
      ),
      language_cards_learning_lesson_cards(
        sort_order,
        language_cards_cards(id,slug,native,card_type,audio_url,is_active)
      )
    `)
    .eq('course.category.language_id', 'de')
    .eq('course.category.status', 'active')
    .eq('course.category.is_active', true)

  if (error) throw error

  const rows = []
  for (const lesson of data || []) {
    for (const link of lesson.language_cards_learning_lesson_cards || []) {
      const card = link.language_cards_cards
      if (!card || card.card_type !== 'vocabulary' || card.is_active === false) continue
      rows.push({
        lessonSlug: lesson.slug,
        sortOrder: link.sort_order ?? 0,
        id: card.id,
        slug: card.slug,
        native: card.native,
        audio_url: card.audio_url,
      })
    }
  }

  rows.sort((a, b) => a.lessonSlug.localeCompare(b.lessonSlug) || a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug))
  return rows
}

async function main() {
  loadEnv('.env.local')
  const ttsConfig = loadElevenLabsConfig()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const force = process.env.FORCE_DE_A1_AUDIO === '1'
  const onlyLesson = process.env.DE_A1_AUDIO_LESSON
  const onlySlug = process.env.DE_A1_AUDIO_SLUG
  const version = process.env.DE_A1_AUDIO_VERSION || new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const cards = (await listGermanA1VocabularyCards(supabase))
    .filter(card => !onlyLesson || card.lessonSlug === onlyLesson)
    .filter(card => !onlySlug || card.slug === onlySlug)

  const results = []
  for (const card of cards) {
    if (!force && card.audio_url) {
      results.push({ lesson: card.lessonSlug, slug: card.slug, skipped: true, audio_url: card.audio_url })
      continue
    }

    const text = normalizeText(card.native)
    if (!text) throw new Error(`Missing native text for ${card.slug}`)

    const lessonKey = card.lessonSlug.replace(/^de-a1-/, '')
    const localDir = path.join('tmp', 'de-a1-audio', lessonKey)
    fs.mkdirSync(localDir, { recursive: true })

    const storagePath = `audio/de-a1/${lessonKey}-${version}/${card.slug}.mp3`
    const { data: publicUrlData } = supabase.storage.from('language-cards').getPublicUrl(storagePath)
    const audioUrl = publicUrlData.publicUrl

    console.log(`generating ${card.slug} ${text}`)
    const audio = await generateAudio(ttsConfig, text)
    fs.writeFileSync(path.join(localDir, `${card.slug}.mp3`), audio)

    const { error: uploadError } = await supabase.storage
      .from('language-cards')
      .upload(storagePath, audio, { contentType: 'audio/mpeg', upsert: true })
    if (uploadError) throw uploadError

    const { error: updateError } = await supabase
      .from('language_cards_cards')
      .update({ audio_url: audioUrl })
      .eq('id', card.id)
    if (updateError) throw updateError

    results.push({ lesson: card.lessonSlug, slug: card.slug, bytes: audio.length, audio_url: audioUrl })
    await sleep(700)
  }

  console.log(JSON.stringify({
    total: results.length,
    generated: results.filter(r => !r.skipped).length,
    skipped: results.filter(r => r.skipped).length,
    voiceId: ttsConfig.voiceId,
    modelId: ttsConfig.modelId,
    voiceSettings: ttsConfig.voiceSettings,
  }, null, 2))
}

main().catch(error => { console.error(error.message || error); process.exit(1) })
