import { NextResponse } from 'next/server'

const GAME_MODES = [
  { id: 'swipe', name: 'Swipe Game', emoji: 'swipe', description: 'Wische links oder rechts um zu antworten', enabled: true },
  { id: 'multiChoice', name: 'Multiple Choice', emoji: 'multiChoice', description: 'Wähle die richtige Antwort aus 4 Optionen', enabled: false },
  { id: 'flashcard', name: 'Flashcard', emoji: 'flashcard', description: 'Klassische Lernkarten zum Umschlagen', enabled: false },
  { id: 'typing', name: 'Typing Challenge', emoji: 'typing', description: 'Tippe die Antwort ein', enabled: false },
]

export async function GET() {
  return NextResponse.json({ gameModes: GAME_MODES })
}
