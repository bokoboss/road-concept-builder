import { describe, expect, it } from 'vitest'
import {
  defaultStraightRoadParameters,
  phase1DrawingSettings,
  type StraightRoadParameters,
} from '../domain/straightRoad'
import { validateStraightRoad } from '../validation/validateStraightRoad'

function validate(overrides: Partial<StraightRoadParameters> = {}) {
  return validateStraightRoad(
    { ...defaultStraightRoadParameters, ...overrides },
    phase1DrawingSettings,
  )
}

describe('validateStraightRoad', () => {
  it('returns only the construction drawing information for valid defaults', () => {
    expect(validate()).toEqual([expect.objectContaining({ severity: 'info', ruleId: 'GEN-001' })])
  })

  it('allows one-way operation without warning for the zero-lane direction', () => {
    expect(validate({ westboundLaneCount: 0 }).map((issue) => issue.ruleId)).toEqual(['GEN-001'])
    expect(validate({ eastboundLaneCount: 0 }).map((issue) => issue.ruleId)).toEqual(['GEN-001'])
  })

  it('warns when both directions have zero lanes', () => {
    expect(validate({ eastboundLaneCount: 0, westboundLaneCount: 0 })).toEqual(
      expect.arrayContaining([expect.objectContaining({ ruleId: 'GEO-002' })]),
    )
  })

  it('warns when fractional values normalize to a no-lanes preview', () => {
    expect(validate({ eastboundLaneCount: 0.5, westboundLaneCount: 0 })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: 'SEG-101' }),
        expect.objectContaining({ ruleId: 'GEO-002' }),
      ]),
    )
  })

  it('warns for fractional, non-finite, negative, and above-maximum lane counts', () => {
    for (const value of [1.9, Number.NaN, -1, 9]) {
      expect(validate({ eastboundLaneCount: value })).toEqual(
        expect.arrayContaining([expect.objectContaining({ ruleId: 'SEG-101' })]),
      )
    }
  })

  it('uses distinct issue IDs for eastbound and westbound lane-count warnings', () => {
    const issues = validate({ eastboundLaneCount: 1.5, westboundLaneCount: 1.5 }).filter(
      (issue) => issue.ruleId === 'SEG-101',
    )

    expect(issues.map((issue) => issue.id)).toEqual([
      'eastbound-lane-count',
      'westbound-lane-count',
    ])
  })

  it('warns for invalid lane width', () => {
    for (const value of [Number.NaN, 0, -1, 2.4, 5.1]) {
      expect(validate({ laneWidthMeters: value })).toEqual(
        expect.arrayContaining([expect.objectContaining({ ruleId: 'GEO-001' })]),
      )
    }
  })

  it('warns for invalid shoulder width', () => {
    for (const value of [Number.NaN, -1, 5.1]) {
      expect(validate({ shoulderWidthMeters: value })).toEqual(
        expect.arrayContaining([expect.objectContaining({ ruleId: 'SEG-103' })]),
      )
    }
  })

  it('warns for invalid physical median width range', () => {
    for (const value of [Number.NaN, -1, 20.1]) {
      expect(validate({ medianType: 'raised', medianWidthMeters: value })).toEqual(
        expect.arrayContaining([expect.objectContaining({ ruleId: 'SEG-104' })]),
      )
    }
  })

  it('warns when a painted or raised median has no positive width', () => {
    for (const medianType of ['painted', 'raised'] as const) {
      expect(validate({ medianType, medianWidthMeters: 0 })).toEqual(
        expect.arrayContaining([expect.objectContaining({ ruleId: 'SEG-002' })]),
      )
    }
  })

  it('keeps median-width validation warnings when U-turn is enabled', () => {
    for (const overrides of [
      { medianType: 'painted' as const, medianWidthMeters: 0 },
      { medianType: 'raised' as const, medianWidthMeters: Number.NaN },
      { medianType: 'raised' as const, medianWidthMeters: Number.POSITIVE_INFINITY },
    ]) {
      expect(
        validate({
          ...overrides,
          uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
        }),
      ).toEqual(expect.arrayContaining([expect.objectContaining({ ruleId: 'SEG-002' })]))
    }
  })

  it('ignores invalid stored median width when median type is none', () => {
    const ruleIds = validate({ medianType: 'none', medianWidthMeters: Number.NaN }).map(
      (issue) => issue.ruleId,
    )

    expect(ruleIds).not.toContain('SEG-002')
    expect(ruleIds).not.toContain('SEG-104')
  })

  it('sanitizes unsafe drawing settings before validating lane-count limits', () => {
    const issues = validateStraightRoad(
      { ...defaultStraightRoadParameters, eastboundLaneCount: 17 },
      { pxPerMeter: Number.NaN, segmentLengthMeters: -1, maxLaneCountPerDirection: 1_000_000 },
    )

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'eastbound-lane-count',
          ruleId: 'SEG-101',
          message: 'Eastbound lane count must be an integer from 0 to 16.',
        }),
      ]),
    )
  })

  it('adds no U-turn warnings when U-turn is disabled', () => {
    expect(validate().map((issue) => issue.ruleId).filter((ruleId) => ruleId.startsWith('UTN-'))).toEqual([])
  })

  it('warns when an enabled U-turn has no median', () => {
    expect(
      validate({
        medianType: 'none',
        uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
      }),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ ruleId: 'UTN-002' })]))
  })

  it('warns when an enabled U-turn is not on a two-way road', () => {
    for (const overrides of [
      { westboundLaneCount: 0 },
      { eastboundLaneCount: 0 },
      { eastboundLaneCount: 0, westboundLaneCount: 0 },
    ]) {
      expect(
        validate({
          ...overrides,
          uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
        }),
      ).toEqual(expect.arrayContaining([expect.objectContaining({ ruleId: 'UTN-001' })]))
    }
  })

  it('warns for invalid U-turn opening widths', () => {
    for (const openingWidthMeters of [Number.NaN, 1.9, 12.1]) {
      expect(
        validate({
          uTurn: {
            ...defaultStraightRoadParameters.uTurn,
            enabled: true,
            openingWidthMeters,
          },
        }),
      ).toEqual(expect.arrayContaining([expect.objectContaining({ ruleId: 'UTN-003' })]))
    }
  })

  it('warns when the full U-turn opening does not fit within the preview segment', () => {
    for (const positionMeters of [Number.NaN, 2, 40]) {
      expect(
        validate({
          uTurn: {
            ...defaultStraightRoadParameters.uTurn,
            enabled: true,
            positionMeters,
            openingWidthMeters: 6,
          },
        }),
      ).toEqual(expect.arrayContaining([expect.objectContaining({ ruleId: 'UTN-004' })]))
    }
  })

  it('adds no U-turn warnings for a valid opening', () => {
    const ruleIds = validate({
      uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
    }).map((issue) => issue.ruleId)

    expect(ruleIds.filter((ruleId) => ruleId.startsWith('UTN-'))).toEqual([])
  })
})
