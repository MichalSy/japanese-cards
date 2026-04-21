'use client'

export default function LearnCardQuiz({ card, lang, answer }) {
  const question = card.data?.question?.[lang] ?? card.data?.question?.default ?? `Which character represents "${card.transliteration}"?`
  const answered = answer != null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
        {question}
      </div>
      {answered && (
        <div style={{ fontSize: '32px', fontWeight: '300', color: 'white', marginTop: '8px' }}>
          {card.transliteration}
        </div>
      )}
    </div>
  )
}
