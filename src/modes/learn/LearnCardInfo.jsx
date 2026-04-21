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
      i % 2 === 1 ? <em key={`${ni}-${i}`} style={{ color: 'rgba(236,72,153,0.9)' }}>{part}</em> : part
    )
  })
}

function parseInline(text) {
  return parseItalic(parseBold(text))
}

function renderMarkdown(md) {
  const lines = md.split('\n')
  const elements = []
  let tableRows = []
  let listItems = []
  let key = 0

  const flushTable = () => {
    if (!tableRows.length) return
    elements.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '8px 0' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {tableRows.map((cells, ri) => (
              <tr key={ri}>
                {cells.map((cell, ci) => (
                  <td key={ci} style={{ padding: '6px 14px', textAlign: 'center', fontSize: '22px', fontWeight: ri === 0 ? '600' : '400', color: ri === 0 ? 'white' : 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableRows = []
  }

  const flushList = () => {
    if (!listItems.length) return
    elements.push(
      <ul key={key++} style={{ margin: '8px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

    if (line.startsWith('- ')) {
      listItems.push(line.slice(2))
      continue
    }
    flushList()

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: '4px 0 8px' }}>{parseInline(line.slice(3))}</h2>)
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: '4px 0 10px' }}>{parseInline(line.slice(2))}</h1>)
    } else if (line.trim()) {
      elements.push(<p key={key++} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.7', margin: '4px 0' }}>{parseInline(line)}</p>)
    }
  }
  flushTable()
  flushList()

  return elements
}

export default function LearnCardInfo({ card, lang }) {
  const contentMd = card.data?.content_md?.[lang] ?? card.data?.content_md?.en ?? ''

  return (
    <div style={{ padding: '8px 4px', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {renderMarkdown(contentMd)}
      </div>
    </div>
  )
}
