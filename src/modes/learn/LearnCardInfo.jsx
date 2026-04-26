'use client'

function parseBold(text) {
  return text.split(/\*\*(.*?)\*\*/).map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: 'white', fontWeight: '700' }}>{part}</strong> : part
  )
}

function parseItalic(nodes) {
  return nodes.flatMap((node, ni) => {
    if (typeof node !== 'string') return [node]
    return node.split(/\*(.*?)\*/).map((part, i) =>
      i % 2 === 1 ? <em key={`${ni}-${i}`} style={{ color: 'rgba(236,72,153,0.9)', fontStyle: 'normal', fontWeight: '600' }}>{part}</em> : part
    )
  })
}

function parseInline(text) {
  return parseItalic(parseBold(text))
}

function extractContent(md) {
  const lines = md.split('\n')
  let title = null
  const paragraphs = []
  const tableRows = []

  for (const line of lines) {
    if (line.startsWith('# ')) { title = line.slice(2); continue }
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim() && !c.trim().match(/^[-: ]+$/))
      if (cells.length) tableRows.push(cells.map(c => c.trim()))
      continue
    }
    if (line.trim() && !line.startsWith('#')) paragraphs.push(line.trim())
  }

  return { title, paragraphs, tableRows }
}

const GRADIENT_TITLE = {
  fontSize: '28px', fontWeight: '800', lineHeight: '1.3', margin: 0,
  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
}

function renderIntroTitle(title) {
  const match = title.match(/^(Willkommen zur )(.+)$/)
  if (!match) return title

  return (
    <>
      <span>{match[1].trim()}</span>
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{match[2]}</span>
    </>
  )
}

function TableEl({ rows, charSize = 48 }) {
  if (!rows.length) return null
  const colCount = Math.max(...rows.map(cells => cells.length))
  const colWidth = `${100 / colCount}%`
  return (
    <div style={{ overflowX: 'hidden', width: '100%', maxWidth: '100%' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
        <colgroup>
          {Array.from({ length: colCount }).map((_, i) => (
            <col key={i} style={{ width: colWidth }} />
          ))}
        </colgroup>
        <tbody>
          {rows.map((cells, ri) => (
            <tr key={ri}>
              {cells.map((cell, ci) => (
                <td key={ci} style={{
                  padding: ri === 0 ? `${Math.round(charSize * 0.2)}px 0 ${Math.round(charSize * 0.12)}px` : '2px 0 12px',
                  textAlign: 'center',
                  width: colWidth,
                  maxWidth: 0,
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  fontSize: ri === 0 ? `${charSize}px` : '13px',
                  fontWeight: ri === 0 ? '300' : '600',
                  color: ri === 0 ? 'white' : 'rgba(255,255,255,0.4)',
                  letterSpacing: ri === 0 ? '0' : '0.04em',
                  textTransform: 'none',
                  textShadow: ri === 0 ? '0 2px 20px rgba(236,72,153,0.3)' : 'none',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Intro layout: title alone in header -> divider -> dark box with subtitle + table
function IntroVariant({ title, paragraphs, tableRows }) {
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ padding: '30px 20px 22px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {title && <h1 style={GRADIENT_TITLE}>{renderIntroTitle(title)}</h1>}
      </div>
      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        {paragraphs[0] && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', margin: 0 }}>{parseInline(paragraphs[0])}</p>}
        <TableEl rows={tableRows} charSize={48} />
      </div>
    </div>
  )
}

// Comparison layout: title in header -> divider -> two big characters side by side with descriptions
function ComparisonVariant({ title, tableRows, paragraphs }) {
  const chars = tableRows[0] ?? []
  const labels = tableRows[1] ?? []

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ padding: '30px 20px 22px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {title && <h1 style={GRADIENT_TITLE}>{title}</h1>}
      </div>
      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ background: 'rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {chars.map((char, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />}
              <div style={{ flex: 1, padding: '24px 12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ fontSize: '80px', fontWeight: '300', lineHeight: 1, color: 'white', textShadow: '0 2px 24px rgba(236,72,153,0.35)' }}>{char}</div>
                {labels[i] && <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.4)' }}>{labels[i]}</div>}
                {paragraphs[i] && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '6px 0 0', lineHeight: '1.5' }}>{parseInline(paragraphs[i])}</p>}
              </div>
            </div>
          ))}
        </div>
        {paragraphs[chars.length] && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '14px 20px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{parseInline(paragraphs[chars.length])}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Fallback for cards using ## headings, lists etc.
function renderMarkdown(md) {
  const lines = md.split('\n')
  const elements = []
  let tableRows = []
  let listItems = []
  let key = 0

  const flushTable = () => {
    if (!tableRows.length) return
    elements.push(<TableEl key={key++} rows={tableRows} charSize={38} />)
    tableRows = []
  }

  const flushList = () => {
    if (!listItems.length) return
    elements.push(
      <ul key={key++} style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', textAlign: 'left' }}>
        {listItems.map((item, i) => (
          <li key={i} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>{parseInline(item)}</li>
        ))}
      </ul>
    )
    listItems = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('|')) {
      flushList()
      const cells = line.split('|').filter(c => c.trim() && !c.trim().match(/^[-: ]+$/))
      if (cells.length) tableRows.push(cells.map(c => c.trim()))
      continue
    }
    flushTable()
    if (line.startsWith('- ')) { listItems.push(line.slice(2)); continue }
    flushList()
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0, lineHeight: '1.3' }}>{parseInline(line.slice(3))}</h2>)
    } else if (line.trim()) {
      elements.push(<p key={key++} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.8', margin: 0 }}>{parseInline(line)}</p>)
    }
  }
  flushTable()
  flushList()
  return elements
}

export default function LearnCardInfo({ card, lang }) {
  const contentMd = card.data?.content_md?.[lang] ?? card.data?.content_md?.en ?? ''
  const { title, paragraphs, tableRows } = extractContent(contentMd)

  if (title) {
    if (tableRows.length && tableRows[0].length === 2) {
      return <ComparisonVariant title={title} tableRows={tableRows} paragraphs={paragraphs} />
    }
    return <IntroVariant title={title} paragraphs={paragraphs} tableRows={tableRows} />
  }

  return (
    <div style={{ padding: '28px 16px 32px', width: '100%', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        {renderMarkdown(contentMd)}
      </div>
    </div>
  )
}
