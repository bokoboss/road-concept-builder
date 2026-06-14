import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from '../app/App'

describe('Phase 0 app shell', () => {
  it('renders the static editor shell and road preview', () => {
    const markup = renderToStaticMarkup(<App />)
    const eastboundLabelIndex = markup.indexOf('data-testid="eastbound-carriageway-label"')
    const westboundLabelIndex = markup.indexOf('data-testid="westbound-carriageway-label"')

    expect(markup).toContain('Road Concept Builder')
    expect(markup).toContain('Pavement Markings')
    expect(markup).toContain('Static divided road concept')
    expect(markup).toContain('Westbound carriageway')
    expect(markup).toContain('Eastbound carriageway')
    expect(eastboundLabelIndex).toBeGreaterThan(-1)
    expect(westboundLabelIndex).toBeGreaterThan(-1)
    expect(eastboundLabelIndex).toBeLessThan(westboundLabelIndex)
    expect(markup).toContain(
      'Eastbound traffic uses the upper carriageway and moves left-to-right. Westbound traffic uses the lower carriageway and moves right-to-left.',
    )
    expect(markup).toContain(
      'Thailand left-hand traffic: eastbound traffic uses the upper carriageway, westbound traffic uses the lower carriageway.',
    )
    expect(markup).toContain('Warning bars sample')
    expect(markup).toContain('Stop line sample')
    expect(markup).toContain('PROJECT_ASSUMPTION')
    expect(markup).toContain('MRK-006')
    expect(markup).toContain('Target</span><strong>Westbound lanes')
    expect(markup).toContain('class="button-count">2</span>')
  })
})
