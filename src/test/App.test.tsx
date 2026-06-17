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
    expect(markup).toContain('Export SVG - Later')
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

  it('exposes compact Phase 2 U-turn inspector controls', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('U-turn / median opening')
    expect(markup).toContain('Enable U-turn opening')
    expect(markup).toContain('Eastbound to westbound')
    expect(markup).toContain('Opening position (m)')
    expect(markup).toContain('Opening width (m)')
    expect(markup).toContain('Show U-turn arrow')
  })

  it('exposes compact Phase 2B U-turn pocket controls', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('U-turn pocket')
    expect(markup).toContain('Enable U-turn pocket')
    expect(markup).toContain('Storage length (m)')
    expect(markup).toContain('Taper length (m)')
    expect(markup).toContain('Show pocket arrow')
  })

  it('keeps Phase 1 SVG rendering unchanged when U-turn is disabled', () => {
    const markup = preview()

    expect(markup).not.toContain('data-testid="uturn-median-opening"')
    expect(markup).not.toContain('data-testid="uturn-arrow"')
    expect(markup).not.toContain('data-testid="uturn-pocket"')
    expect(markup).not.toContain('data-testid="uturn-pocket-arrow"')
    expect(markup).not.toContain('data-testid="uturn-opening-label"')
  })

  it('renders a valid median opening, label, and eastbound-to-westbound arrow', () => {
    const markup = preview({
      uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
    })

    expect(markup).toContain('data-testid="uturn-median-opening"')
    expect(markup).toContain('data-testid="uturn-opening-label"')
    expect(markup).toContain('data-testid="uturn-arrow"')
    expect(markup).toContain('data-direction="eastbound-to-westbound"')
    expect(markup).toContain('scale(1 1)')
  })

  it('mirrors westbound-to-eastbound U-turn arrows', () => {
    const markup = preview({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        direction: 'westbound-to-eastbound',
      },
    })

    expect(markup).toContain('data-direction="westbound-to-eastbound"')
    expect(markup).toContain('scale(-1 1)')
  })

  it('omits the optional U-turn arrow and invalid partial U-turn geometry', () => {
    const withoutArrow = preview({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        showArrow: false,
      },
    })
    const invalidOneWay = preview({
      westboundLaneCount: 0,
      uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
    })

    expect(withoutArrow).toContain('data-testid="uturn-median-opening"')
    expect(withoutArrow).not.toContain('data-testid="uturn-arrow"')
    expect(invalidOneWay).not.toContain('data-testid="uturn-median-opening"')
    expect(invalidOneWay).not.toContain('data-testid="uturn-arrow"')
  })

  it('renders a valid eastbound-to-westbound U-turn pocket and pocket arrow', () => {
    const markup = preview({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
      },
    })

    expect(markup).toContain('data-testid="uturn-pocket"')
    expect(markup).toContain('data-direction="eastbound-to-westbound"')
    expect(markup).toContain('data-testid="uturn-pocket-arrow"')
    expect(markup).toContain('scale(1 1)')
  })

  it('renders a valid westbound-to-eastbound U-turn pocket and mirrored pocket arrow', () => {
    const markup = preview({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        direction: 'westbound-to-eastbound',
        pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
      },
    })

    expect(markup).toContain('data-testid="uturn-pocket"')
    expect(markup).toContain('data-direction="westbound-to-eastbound"')
    expect(markup).toContain('data-testid="uturn-pocket-arrow"')
    expect(markup).toContain('scale(-1 1)')
  })

  it('omits invalid U-turn pocket geometry without removing a valid opening', () => {
    const markup = preview({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        pocket: {
          ...defaultStraightRoadParameters.uTurn.pocket,
          enabled: true,
          storageLengthMeters: 12,
          taperLengthMeters: 10,
        },
      },
    })

    expect(markup).toContain('data-testid="uturn-median-opening"')
    expect(markup).not.toContain('data-testid="uturn-pocket"')
    expect(markup).not.toContain('data-testid="uturn-pocket-arrow"')
  })

  it('omits the optional pocket arrow while keeping valid pocket geometry', () => {
    const markup = preview({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        pocket: {
          ...defaultStraightRoadParameters.uTurn.pocket,
          enabled: true,
          showArrow: false,
        },
      },
    })

    expect(markup).toContain('data-testid="uturn-pocket"')
    expect(markup).not.toContain('data-testid="uturn-pocket-arrow"')
  })

  it('does not render U-turn geometry when the physical median width is invalid', () => {
    for (const overrides of [
      { medianType: 'painted' as const, medianWidthMeters: 0 },
      { medianType: 'raised' as const, medianWidthMeters: Number.NaN },
      { medianType: 'raised' as const, medianWidthMeters: Number.POSITIVE_INFINITY },
    ]) {
      const markup = preview({
        ...overrides,
        uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
      })

      expect(markup).not.toContain('data-testid="uturn-median-opening"')
      expect(markup).not.toContain('data-testid="uturn-arrow"')
    }
  })
})
