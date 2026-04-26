# Kana Course Generation

This document is the production checklist for creating full Hiragana and Katakana courses.

## Research

Research each row before creating content:

- Tofugu kana guides and charts
- Dr. Moku mnemonic ideas
- Japanese Ammo / common kana charts
- Reddit and forum discussions
- German mnemonic ideas where available

Use these sources as inspiration only. Do not copy full wording or artwork.

## Images

Style:

- cute kawaii / chibi / soft anime look
- rounded shapes
- friendly face when it fits the object
- pastel full-bleed background
- clean thick outline
- simple scene
- no text unless the kana is intentionally included and correct

Hard rule: no visible frame.

Avoid these prompt words because they often create framed images:

- flashcard
- card design
- border
- frame
- rounded rectangle
- sticker
- poster
- white edge
- margin
- panel

Use this framing language instead:

```text
single cute mascot illustration directly on one continuous plain pastel background,
background fills the whole square edge to edge,
no panel, no border, no frame, no rounded rectangle, no white edge,
full object visible, centered, natural breathing room, not cropped
```

Reject images when:

- the subject touches the canvas edge
- a limb, spout, tail, ear, hand, or foot is cut off
- the subject is too large
- the subject is too small to read
- a frame or card panel appears
- kana or Latin text is malformed
- the object is cute but does not help memory
- the mnemonic only works in English or only works in German
- the object name in the prompt does not match the German and English mnemonic text
- the German word and English word point to different objects in the image
- the image only makes sense through an English wordplay
- the German text sounds translated instead of natural

Kana in images is optional. Keep it only when it is rendered correctly.

Do not bulk-approve generated images. Generate at row scale, create a montage, inspect it, reject weak candidates, and only then upload selected finals.

## Mnemonics

Every card needs a bridge:

- sound bridge: the object starts with or strongly suggests the kana sound
- shape bridge: a visible part of the object or action resembles the kana
- ideally both

The bridge must work in German and English. If one language needs a completely different object, choose a different motif or split the idea before generating the image.

Before generating an image, write the intended German and English mnemonic pair first. If the pair is weak, do not generate the image yet.

Use motifs whose names are strong in both languages:

- same or near-same word: Sushi, Sofa, Ninja, Ring, Yuzu
- clear German/English pair for the same object: Schiff/ship, Kessel/kettle, Rakete/rocket
- accepted loanword in both languages: Senbei, Karate, Kimono

Avoid motifs that only work in one language:

- English-only puns
- German-only compounds that do not map to the same image in English
- vague shape captions such as "this shows the kana"
- mismatched pairs such as German Hase with English hamster

Good:

```text
Der Kessel beginnt mit Ke
Griff und Ausguss helfen bei け
```

Bad:

```text
Stell dir vor, け sieht aus wie ein Kessel.
```

Text rules:

- German and English are both required
- no "Stell dir vor"
- no "Imagine"
- no meta explanations
- no long image captions
- use two short lines when possible
- line 1 should be the sound anchor
- line 2 should be the shape anchor
- Romaji style is `Ka`, `Ki`, `Shi`, `Tsu`, not `KA`
- avoid em dashes and AI-looking punctuation
- validate UTF-8 after every DB update
- use real German umlauts in user-facing German text: `ä`, `ö`, `ü`
- never leave ASCII replacements such as `ae`, `oe`, `ue`, `fuer`, `grosse`, `Ruecken`

## Info And Comparison Cards

Info cards should teach one idea.

Comparison cards are only useful when the learner has already seen both characters.

Rules:

- never compare with a character that appears later in the course
- place the comparison card after the newly introduced character
- use comparison cards for real confusion risks, not generic theory
- keep wording short

Examples:

- after `け`, compare `け` vs `い`
- in Katakana, compare `シ` vs `ツ` only after both were learned
- compare `ソ` vs `ン` only after both were learned

## Course Structure

Create Hiragana and Katakana rows in gojuon order:

1. A row
2. Ka row
3. Sa row
4. Ta row
5. Na row
6. Ha row
7. Ma row
8. Ya row
9. Ra row
10. Wa/N row
11. Dakuten and handakuten
12. Small kana and combinations

Each row should contain:

- intro info card
- character cards
- comparison cards only after relevant characters
- quiz cards with strong distractors

## Validation Checklist

For every row:

1. Research mnemonic ideas.
2. Decide image concepts.
3. Generate multiple candidates if needed.
4. Build a montage for the row and inspect it.
5. Reject framed, cropped, boring, language-mismatched, or malformed images.
6. Save final images as JPG, max 800x800, below 300 KB where possible.
7. Upload to Supabase Storage bucket `language-cards` as `{image_id}.jpg`.
8. Update `language_cards_cards.image_id`.
9. Update German and English mnemonic text.
10. Validate UTF-8 and check for `?`, replacement characters, and ASCII umlaut replacements.
11. Open the lesson in the in-app browser and inspect the cards.
12. If the in-app browser gets stuck, close the tab or open a new in-app browser tab and continue.

## Encoding

On Windows/PowerShell, do not type umlauts or kana directly into inline Node scripts that update Supabase.

Use codepoints:

```javascript
const cp = (...xs) => String.fromCodePoint(...xs)
const text = 'Der Kessel beginnt mit Ke\nGriff und Ausguss helfen bei ' + cp(0x3051)
```

After DB updates, validate:

```javascript
/[?\uFFFD]/.test(text) === false
```

## Browser QA

Use the Codex in-app browser for visual QA.

Required checks:

- lesson opens
- direct card URL works
- images render
- images are not cropped badly
- mnemonic overlay is readable
- Romaji casing is correct
- comparison cards appear after the relevant character
- mobile-width layout does not overlap

If the browser gets stuck:

1. close the in-app browser tab or create a new one
2. reopen the lesson URL
3. continue testing there

Do not switch to external Chrome for this project unless the user explicitly asks.
