# Card Image Generation

This is the shared production rule for Japanese Cards vocabulary / learning images.

The detailed origin checklist lives in `docs/kana-course-generation.md`; use this page as the short general reference for all learning languages, including Deutsch A1.

## Generator

Use OpenAI Image 2 / `gpt-image-2` / `imagegen 2` for final production card images.

Do not use hand-drawn placeholder scripts, SVG placeholders, or framed card mockups as finals unless Michal explicitly asks for that.

## Visual style

Keep the same style as the existing vocabulary images:

- cute kawaii / chibi / soft anime look
- rounded shapes and friendly readable silhouettes
- clean thick outline
- soft pastel lighting with warm highlights
- charming scenic full-bleed background, not a flat card panel
- object or character has a friendly face when it fits
- one clear motif per card
- subject centered with a slight upward bias, because the app may overlay text near the bottom
- full subject visible, not cropped
- no visible frame
- no text unless explicitly required and known to render correctly

## Hard prompt rules

Avoid words that often create unwanted card frames:

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
single cute kawaii mascot illustration in a charming scenic pastel background,
background fills the whole square edge to edge as one continuous scene,
no panel, no border, no frame, no rounded rectangle, no white edge,
full object visible, visually centered with a slight upward bias,
natural breathing room, not cropped,
clean thick outline, soft anime/chibi style,
no text, no letters, no watermark
```

For phrase cards such as German greetings, show the situation, not the literal written phrase. Example: `Guten Morgen` should be a sunrise / morning greeting scene, not text saying “Guten Morgen”.

## Acceptance checklist

Reject and regenerate if:

- subject touches the edge or is cropped
- subject is too low and would be hidden by the app text overlay
- subject is too small to read
- there is a visible frame, card panel, white border, poster edge, or sticker look
- text, letters, signs, or malformed writing appear
- the image is cute but the concept does not teach the card meaning
- the style clashes with the existing pastel kawaii/scenic assets

## Workflow

1. Inspect existing production assets before starting a new batch.
2. Generate one coherent row / lesson at a time.
3. Save images under `tmp/<course-or-category>/...` for inspection.
4. Create a montage.
5. Visually inspect the montage against this checklist.
6. Upload only accepted images to the `language-cards` Supabase storage bucket.
7. Update `language_cards_cards.image_id` for the corresponding vocabulary cards.
8. Verify public image URLs return HTTP 200.
9. Update docs/current audit notes if image coverage changed.

Do not bulk-approve a batch without visual inspection.
