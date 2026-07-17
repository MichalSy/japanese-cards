'use client'

export default function LearnSentenceQuiz({ card, lang, options, answerData, onAnswer, t }) {
  const question = card.data?.question?.[lang] ?? card.data?.question?.en ?? 'Choose the matching sentence:'
  const prompt = card.data?.prompt?.[lang] ?? card.data?.prompt?.en ?? card.native
  const correct = answerData?.isCorrect ?? false
  const correctOption = options.find(option => option.is_correct)
  const correctText = correctOption?.translations?.de ?? correctOption?.default_text

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '24px 20px', background: 'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(168,85,247,0.13) 0%, transparent 100%)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', color: 'rgba(255,255,255,0.42)', background: 'rgba(255,255,255,0.06)', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.09)' }}>
          {question}
        </div>
        <div style={{ fontSize: 'clamp(28px, 8vw, 44px)', fontWeight: '900', lineHeight: 1.15, textAlign: 'center', maxWidth: '100%', overflowWrap: 'anywhere', background: 'linear-gradient(135deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 28px rgba(236,72,153,0.32))' }}>
          {prompt}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', padding: '11px 20px', fontSize: '14px', fontWeight: '700', color: correct ? '#34d399' : '#f87171', background: correct ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', borderTop: `1px solid ${correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, opacity: answerData ? 1 : 0, pointerEvents: 'none' }}>
          {answerData ? (correct ? t('learn.correct') : `${t('learn.wrong')} ${correctText}`) : ''}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', padding: '14px 16px 16px' }}>
        {options.map((option, index) => {
          const selected = answerData?.selectedIndex === index
          let background = 'rgba(255,255,255,0.05)'
          let border = 'rgba(255,255,255,0.11)'
          let color = 'rgba(255,255,255,0.92)'
          let opacity = 1
          if (answerData) {
            if (option.is_correct) { background = 'rgba(16,185,129,0.13)'; border = 'rgba(52,211,153,0.55)'; color = '#34d399' }
            else if (selected) { background = 'rgba(239,68,68,0.13)'; border = 'rgba(248,113,113,0.55)'; color = '#f87171' }
            else opacity = 0.3
          }
          const text = option.translations?.de ?? option.default_text
          return (
            <button key={index} type="button" disabled={Boolean(answerData)} onClick={() => !answerData && onAnswer(index, option.is_correct)} style={{ width: '100%', minHeight: '64px', padding: '12px 16px', borderRadius: '16px', border: `1.5px solid ${border}`, background, color, opacity, fontSize: 'clamp(17px, 4.6vw, 22px)', fontWeight: '800', lineHeight: 1.22, cursor: answerData ? 'default' : 'pointer', transition: 'background 0.15s, border-color 0.15s, opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              {text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
