import { NextResponse } from 'next/server'

const GAME_MODES = [
  { id: 'learn', enabled: true },
  { id: 'swipe', enabled: true },
  { id: 'multiChoice', enabled: false },
  { id: 'flashcard', enabled: false },
  { id: 'typing', enabled: false },
]

export async function GET() {
  return NextResponse.json({ gameModes: GAME_MODES })
}
