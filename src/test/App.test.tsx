import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from '../app/App'
import { StraightRoadPreview } from '../components/StraightRoadPreview'
import {
  defaultStraightRoadParameters,
  phase1DrawingSettings,
  type StraightRoadParameters,
} from '../domain/straightRoad'

function preview(overrides: Partial<StraightRoadParameters> = {}) {
  return renderToStaticMarkup(
    <StraightRoadPreview
      parameters={{ ...defaultStraightRoadParameters, ...overrides }}
      settings={phase1DrawingSettings}
    />,
  )
}

describe('Phase 1 app shell', () => {
  it('preserves the editor shell and bounded parametric inspector', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('Road Concept Builder')
    expect(markup).toContain('Pavement Markings')
    expect(markup).toContain('Parametric straight road segment')
    expect(markup).toContain('min="0" max="8"')
    expect(markup).toContain('min="2.5" max="5"')
    expect(markup).toContain('Export SVG · Later')
    expect(markup).toContain('GEN-001')
  })

  it('keeps the Thailand left-hand traffic orientation regression', () => {
    const markup = preview()
    const eastboundLabelIndex = markup.indexOf('data-testid="eastbound-carriageway-label"')
    const westboundLabelIndex = markup.indexOf('data-testid="westbound-carriageway-label"')

    expect(eastboundLabelIndex).toBeGreaterThan(-1)
    expect(westboundLabelIndex).toBeGreaterThan(-1)
    expect(eastboundLabelIndex).toBeLessThan(westboundLabelIndex)
    expect(markup).toContain(
      'Eastbound traffic uses the upper carriageway and moves left-to-right. Westbound traffic uses the lower carriageway and moves right-to-left.',
    )
  })

  it('renders eastbound-only without westbound label or center separation', () => {
    const markup = preview({ westboundLaneCount: 0, medianType: 'none' })

    expect(markup).toContain('data-testid="eastbound-carriageway-label"')
    expect(markup).not.toContain('data-testid="westbound-carriageway-label"')
    expect(markup).not.toContain('data-testid="direction-separation-line"')
    expect(markup).toContain('rotate(90)')
    expect(markup).not.toContain('rotate(-90)')
  })

  it('renders westbound-only without eastbound label or center separation', () => {
    const markup = preview({ eastboundLaneCount: 0, medianType: 'none' })

    expect(markup).not.toContain('data-testid="eastbound-carriageway-label"')
    expect(markup).toContain('data-testid="westbound-carriageway-label"')
    expect(markup).not.toContain('data-testid="direction-separation-line"')
    expect(markup).not.toContain('rotate(90)')
    expect(markup).toContain('rotate(-90)')
  })

  it('renders a center direction-separation line only for two-way no-median roads', () => {
    const markup = preview({ medianType: 'none' })

    expect(markup).toContain('data-testid="direction-separation-line"')
    expect(markup).not.toContain('class="raised-median"')
    expect(markup).not.toContain('class="painted-median"')
  })

  it('renders a no-lanes placeholder without crashing', () => {
    const markup = preview({ eastboundLaneCount: 0, westboundLaneCount: 0 })

    expect(markup).toContain('data-testid="no-lanes-placeholder"')
    expect(markup).not.toContain('data-testid="generated-road"')
  })

  it('uses pxPerMeter supplied through drawing settings', () => {
    const markup = renderToStaticMarkup(
      <StraightRoadPreview
        parameters={defaultStraightRoadParameters}
        settings={{ ...phase1DrawingSettings, pxPerMeter: 10, segmentLengthMeters: 30 }}
      />,
    )

    expect(markup).toContain('width="300"')
  })

  it('uses safe fallbacks for invalid preview drawing settings', () => {
    const markup = renderToStaticMarkup(
      <StraightRoadPreview
        parameters={defaultStraightRoadParameters}
        settings={{
          pxPerMeter: Number.NaN,
          segmentLengthMeters: Number.POSITIVE_INFINITY,
          maxLaneCountPerDirection: Number.NaN,
        }}
      />,
    )

    expect(markup).toContain('width="756"')
    expect(markup).not.toContain('NaN')
    expect(markup).not.toContain('Infinity')
  })

  it('keeps SVG geometry finite for excessively large finite drawing settings', () => {
    const markup = renderToStaticMarkup(
      <StraightRoadPreview
        parameters={defaultStraightRoadParameters}
        settings={{
          pxPerMeter: 1e308,
          segmentLengthMeters: 1e308,
          maxLaneCountPerDirection: 1e308,
        }}
      />,
    )

    expect(markup).not.toContain('NaN')
    expect(markup).not.toContain('Infinity')
  })
})
