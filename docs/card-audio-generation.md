# Card Audio Generation

Japanese Cards stores card audio in the Supabase Storage bucket `language-cards` and writes the public URL to `language_cards_cards.audio_url`.

## German / Deutsch A1

Use ElevenLabs for Deutsch A1.

Default German voice:

```text
xLCJR8xcZX2YjImGFyGw
```

The project script is:

```bash
node scripts/generate-de-a1-audio.js
```

It reads the ElevenLabs API key from `ELEVENLABS_API_KEY` or from the local OpenClaw config at `/home/aiko/.openclaw/openclaw.json`. It must never print the API key.

Useful options:

```bash
# Generate only one lesson
DE_A1_AUDIO_LESSON=de-a1-start-greetings node scripts/generate-de-a1-audio.js

# Generate only one card
DE_A1_AUDIO_SLUG=de-a1-start-hallo node scripts/generate-de-a1-audio.js

# Regenerate even if audio_url already exists
FORCE_DE_A1_AUDIO=1 node scripts/generate-de-a1-audio.js

# Override only if Michal explicitly changes the German voice
ELEVENLABS_GERMAN_VOICE_ID=<voice-id> node scripts/generate-de-a1-audio.js
```

Default model is `eleven_multilingual_v2`.

Default German voice settings:

```json
{
  "stability": 0.45,
  "similarity_boost": 0.78,
  "style": 0.12,
  "use_speaker_boost": true,
  "speed": 0.95
}
```

These German defaults are deliberately independent from the global OpenClaw TTS voice settings. Do not inherit high-speed/global chat settings for language-learning cards; short A1 phrases need slower, clearer pronunciation.

## Japanese N5

Existing script:

```bash
node scripts/generate-n5-vocabulary-audio.js
```

It uses the configured ElevenLabs provider from OpenClaw unless overridden in the script/environment.

## Verification

After generation:

1. Check DB coverage:
   - German A1 target cards with `audio_url` should match the number of vocabulary cards.
2. HEAD-check a sample public audio URL returns HTTP 200.
3. Open a Learn card and verify the native text area is clickable/speaks if `audio_url` exists.
4. Update `docs/current-state.md` / curriculum docs when audio coverage changes.
