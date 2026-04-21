'use client'

export default function LearnCardQuiz({ card, lang, answer, onAnswer }) {
  const question = card.data?.question?.[lang] ?? card.data?.question?.default ?? `Which character represents "${card.transliteration}"?`
  const options = card.data?.options ?? []

  const answered = answer != null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
          {question}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {options
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((opt, i) => {
            const optText = opt.translations?.[lang] ?? opt.default_text
            const isSelected = answer === i
            const isCorrect = opt.is_correct

            let bg = 'rgba(255,255,255,0.07)'
            let border = '1px solid rgba(255,255,255,0.12)'
            let color = 'white'

            if (answered) {
              if (isCorrect) {
                bg = 'rgba(16,185,129,0.2)'
                border = '1px solid rgba(16,185,129,0.5)'
                color = '#10b981'
              } else if (isSelected && !isCorrect) {
                bg = 'rgba(239,68,68,0.2)'
                border = '1px solid rgba(239,68,68,0.5)'
                color = '#ef4444'
              } else {
                color = 'rgba(255,255,255,0.3)'
              }
            }

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => !answered && onAnswer(i)}
                style={{
                  padding: '20px 12px', background: bg, border, borderRadius: '16px',
                  color, fontSize: '32px', fontWeight: '400', cursor: answered ? 'default' : 'pointer',
                  transition: 'all 0.2s', textAlign: 'center', minHeight: '80px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: isSelected && !answered ? 'scale(0.97)' : 'scale(1)',
                }}
                onMouseEnter={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              >
                {optText}
              </button>
            )
          })}
      </div>

      {answered && (
        <div style={{
          textAlign: 'center', fontSize: '15px', fontWeight: '600',
          color: options[answer]?.is_correct ? '#10b981' : '#ef4444',
          animation: 'fadeIn 0.2s ease',
        }}>
          {options[answer]?.is_correct
            ? '✓ Richtig!'
            : `✗ Falsch — die Antwort war: ${options.find(o => o.is_correct)?.default_text}`}
        </div>
      )}
    </div>
  )
}
