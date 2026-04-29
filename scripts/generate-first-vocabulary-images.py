#!/usr/bin/env python3
"""Prepare Imagegen 2 prompts for the first vocabulary course.

Final course assets must be generated with OpenAI Image 2 / imagegen 2, not with
local placeholder drawing. This script intentionally does not draw fallback art;
it writes one production prompt per vocabulary card so the prompts can be fed to
OpenClaw's image generation tool (`openai/gpt-image-2`) and the resulting JPGs
saved as `tmp/first-vocabulary-images/{slug}.jpg`.

Project rules are documented in `docs/kana-course-generation.md`:
- imagegen 2 is the default final generator
- cute kawaii/chibi scenic look
- no frame, border, panel, card design, or text
- full object visible, centered slightly upward
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'scripts' / 'first-vocabulary.json').read_text(encoding='utf-8'))
OUT = ROOT / 'tmp' / 'first-vocabulary-image2-prompts.json'

BASE_STYLE = (
    'single cute kawaii mascot illustration in a charming scenic pastel background, '
    'background fills the whole square edge to edge as one continuous scene, '
    'no panel, no border, no frame, no rounded rectangle, no white edge, '
    'full object visible, visually centered with a slight upward bias, '
    'natural breathing room, not cropped, clean thick outline, soft anime/chibi style, '
    'no text, no letters, no kana, no watermark'
)

CONCEPTS = {
    'desk': 'a small friendly wooden desk in a cozy Japanese study room',
    'chair': 'a small friendly chair in a cozy pastel room',
    'book': 'a friendly closed book in a warm reading nook',
    'key': 'a shiny friendly key in a soft pastel entryway',
    'clock': 'a round friendly clock on a soft pastel bedroom wall, no readable numbers',
    'window': 'a friendly window with soft curtains looking out to blue sky and greenery',
    'door': 'a friendly door with a round knob in a cozy hallway',
    'bag': 'a small friendly school bag with visible handles in a pastel entryway',
    'phone': 'a friendly phone on a cozy desk',
    'cup': 'a friendly cup with warm steam on a pastel kitchen table',
    'water': 'a clear water droplet character near a soft spring',
    'tea': 'a friendly cup of green tea with soft steam on a Japanese tea table',
    'rice': 'a small bowl of white rice with a happy face on a kitchen table',
    'bread': 'a fluffy bread roll with a tiny smiling face in a warm bakery',
    'apple': 'a red apple with a tiny smiling face and leaf in an orchard picnic scene',
    'banana': 'a ripe yellow banana with a tiny smiling face on a breakfast table',
    'egg': 'a whole egg character with a gentle smiling face in a pastel kitchen',
    'fish': 'a friendly small fish with a happy face in a clear pastel pond',
    'meat': 'a small cooked meat steak character with a tiny smiling face on a simple plate',
    'cake': 'a slice of cake with strawberries and a tiny smiling face in a pastel cafe',
}

COLOR_CONCEPTS = {
    '#ef4444': 'a bright red paint blob character with a happy face and tiny brush',
    '#3b82f6': 'a bright blue paint blob character with a happy face and tiny brush',
    '#facc15': 'a sunny yellow paint blob character with a happy face and warm light',
    '#22c55e': 'a fresh green paint blob character with a happy face and tiny leaf',
    '#f8fafc': 'a fluffy white cloud paint blob character with a gentle smiling face',
    '#111827': 'a soft black paint blob character with glossy highlights in a starry scene',
    '#ec4899': 'a bright pink paint blob character with a happy face and tiny heart sparkle',
    '#f97316': 'a vivid orange paint blob character with a happy face and tiny brush',
    '#8b5cf6': 'a soft purple paint blob character with a happy face and tiny sparkle',
    '#92400e': 'a warm brown paint blob character with a friendly face and tiny leaf',
}


def concept_for(item):
    if item.get('kind') == 'number':
        n = item['number']
        layouts = {
            1: 'exactly one smiling star character',
            2: 'exactly two smiling star characters',
            3: 'exactly three smiling star characters',
            4: 'exactly four smiling star characters',
            5: 'exactly five smiling star characters, all countable',
            6: 'exactly six smiling star characters in two neat rows, all countable',
            7: 'exactly seven smiling star characters in a gentle arc, all countable',
            8: 'exactly eight smiling star characters in two rows of four, all countable',
            9: 'exactly nine smiling star characters in a three by three grid, all countable',
            10: 'exactly ten smiling star characters in two rows of five, all countable',
        }
        return f"representing {item['en']}: {layouts[n]} in a pastel sky background, no numerals"
    if item.get('kind') == 'color':
        return f"representing the color {item['en']}: {COLOR_CONCEPTS[item['color']]} in a pastel art-room scene"
    return CONCEPTS[item['kind']]


def main():
    prompts = []
    for group in DATA['groups']:
        for item in group['items']:
            prompts.append({
                'slug': item['slug'],
                'filename': f"{item['slug']}.jpg",
                'model': 'openai/gpt-image-2',
                'size': '1024x1024',
                'quality': 'high',
                'outputFormat': 'jpeg',
                'prompt': f"{concept_for(item)}, {BASE_STYLE}.",
            })
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(prompts, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'wrote {len(prompts)} Imagegen 2 prompts to {OUT}')


if __name__ == '__main__':
    main()
