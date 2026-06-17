import { describe, expect, it } from 'vitest'
import {
  defaultStraightRoadParameters,
  MAX_STRAIGHT_ROAD_PREVIEW_LENGTH_METERS,
  phase1DrawingSettings,
  sanitizePhase1DrawingSettings,
  type StraightRoadParameters,
} from '../domain/straightRoad'
import { buildStraightRoadGeometry } from '../geometry/straightRoadGeometry'

function geometry(overrides: Partial<StraightRoadParameters> = {}) {
  return buildStraightRoadGeometry(
    { ...defaultStraightRoadParameters, ...overrides },
    phase1DrawingSettings,
  )
}

function numericValues(value: unknown): number[] {
  if (typeof value === 'number') return [value]
  if (Array.isArray(value)) return value.flatMap(numericValues)
  if (value && typeof value === 'object') return Object.values(value).flatMap(numericValues)
  return []
}

type Bounds = { x: number; y: number; width: number; height: number }

function polygonBounds(points: Array<{ x: number; y: number }>): Bounds {
  const xValues = points.map((point) => point.x)
  const yValues = points.map((point) => point.y)
  const minX = Math.min(...xValues)
  const minY = Math.min(...yValues)

  return {
    x: minX,
    y: minY,
    width: Math.max(...xValues) - minX,
    height: Math.max(...yValues) - minY,
  }
}

function overlaps(a: Bounds, b: Bounds) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function expectPocketDoesNotOverlap(
  pocket: NonNullable<ReturnType<typeof geometry>['uTurnPocket']>,
  restrictedAreas: Bounds[],
) {
  const pocketSurfaces = [pocket.storage, polygonBounds(pocket.taper.points)]

  for (const surface of pocketSurfaces) {
    for (const restrictedArea of restrictedAreas) {
      expect(overlaps(surface, restrictedArea)).toBe(false)
    }
  }
}

describe('buildStraightRoadGeometry', () => {
  it('calculates default two-way geometry in meters', () => {
    const result = geometry()

    expect(result.operationMode).toBe('twoWay')
    expect(result.totalWidthMeters).toBe(19)
    expect(result.shoulders).toEqual([
      expect.objectContaining({ id: 'eastbound-outer-shoulder', y: 0, height: 1.5 }),
      expect.objectContaining({ id: 'westbound-outer-shoulder', y: 17.5, height: 1.5 }),
    ])
    expect(result.carriageways).toEqual([
      expect.objectContaining({ id: 'eastbound-carriageway', y: 1.5, height: 7 }),
      expect.objectContaining({ id: 'westbound-carriageway', y: 10.5, height: 7 }),
    ])
    expect(result.median).toMatchObject({ y: 8.5, height: 2 })
    expect(result.lanes.map((lane) => lane.centerY)).toEqual([3.25, 6.75, 12.25, 15.75])
  })

  it('keeps eastbound upper/rightward and westbound lower/leftward', () => {
    const result = geometry()
    const eastboundLanes = result.lanes.filter((lane) => lane.direction === 'eastbound')
    const westboundLanes = result.lanes.filter((lane) => lane.direction === 'westbound')
    const eastboundArrows = result.arrows.filter((arrow) => arrow.direction === 'eastbound')
    const westboundArrows = result.arrows.filter((arrow) => arrow.direction === 'westbound')

    expect(Math.max(...eastboundLanes.map((lane) => lane.centerY))).toBeLessThan(
      Math.min(...westboundLanes.map((lane) => lane.centerY)),
    )
    expect(eastboundArrows.every((arrow) => arrow.rotationDegrees === 90)).toBe(true)
    expect(westboundArrows.every((arrow) => arrow.rotationDegrees === -90)).toBe(true)
    expect(result.pavementMarkings.filter((marking) => marking.type === 'through-arrow')).toHaveLength(4)
  })

  it('renders eastbound-only geometry without median or center separation', () => {
    const result = geometry({ westboundLaneCount: 0, medianType: 'raised' })

    expect(result.operationMode).toBe('eastboundOnly')
    expect(result.carriageways.map((item) => item.id)).toEqual(['eastbound-carriageway'])
    expect(result.median).toBeNull()
    expect(result.directionSeparationLine).toBeNull()
    expect(result.arrows.every((arrow) => arrow.rotationDegrees === 90)).toBe(true)
    expect(result.lanes.map((lane) => lane.positionLabel)).toEqual([
      'Left / near-side lane',
      'Right / off-side lane',
    ])
  })

  it('renders westbound-only geometry with travel-relative lane labels', () => {
    const result = geometry({ eastboundLaneCount: 0, westboundLaneCount: 2, medianType: 'raised' })

    expect(result.operationMode).toBe('westboundOnly')
    expect(result.carriageways.map((item) => item.id)).toEqual(['westbound-carriageway'])
    expect(result.median).toBeNull()
    expect(result.directionSeparationLine).toBeNull()
    expect(result.arrows.every((arrow) => arrow.rotationDegrees === -90)).toBe(true)
    expect(result.lanes.map((lane) => lane.positionLabel)).toEqual([
      'Right / off-side lane',
      'Left / near-side lane',
    ])
  })

  it('uses centerline-side labels and one center line for two-way roads without a median', () => {
    const result = geometry({ medianType: 'none', medianWidthMeters: 8 })

    expect(result.operationMode).toBe('twoWay')
    expect(result.median).toBeNull()
    expect(result.directionSeparationLine).not.toBeNull()
    expect(result.edgeLines).toHaveLength(2)
    expect(result.lanes.map((lane) => lane.positionLabel)).toEqual([
      'Outer / near-side lane',
      'Centerline-side lane',
      'Centerline-side lane',
      'Outer / near-side lane',
    ])
  })

  it('produces a safe no-lanes state without throwing', () => {
    const result = geometry({ eastboundLaneCount: 0, westboundLaneCount: 0 })

    expect(result.operationMode).toBe('noLanes')
    expect(result.carriageways).toEqual([])
    expect(result.shoulders).toEqual([])
    expect(result.lanes).toEqual([])
    expect(result.totalWidthMeters).toBe(0)
  })

  it('bounds lane loops and safely normalizes invalid dimensions', () => {
    const result = geometry({
      eastboundLaneCount: 999,
      westboundLaneCount: 1.9,
      laneWidthMeters: -1,
      shoulderWidthMeters: Number.NaN,
      medianWidthMeters: -2,
    })

    expect(result.lanes.filter((lane) => lane.direction === 'eastbound')).toHaveLength(8)
    expect(result.lanes.filter((lane) => lane.direction === 'westbound')).toHaveLength(1)
    expect(result.lanes.every((lane) => lane.height === 2.5)).toBe(true)
    expect(result.shoulders.every((shoulder) => shoulder.height === 1.5)).toBe(true)
    expect(result.median?.height).toBe(defaultStraightRoadParameters.medianWidthMeters)
  })

  it('uses drawing settings for segment length and maximum lane count', () => {
    const result = buildStraightRoadGeometry(
      { ...defaultStraightRoadParameters, eastboundLaneCount: 8, westboundLaneCount: 8 },
      { pxPerMeter: 7, segmentLengthMeters: 30, maxLaneCountPerDirection: 3 },
    )

    expect(result.lengthMeters).toBe(30)
    expect(result.lanes).toHaveLength(6)
    expect(result.carriageways.every((item) => item.width === 30)).toBe(true)
  })

  it('sanitizes invalid and negative drawing settings to safe defaults', () => {
    for (const invalidValue of [Number.NaN, Number.POSITIVE_INFINITY, -1, 0]) {
      expect(
        sanitizePhase1DrawingSettings({
          pxPerMeter: invalidValue,
          segmentLengthMeters: invalidValue,
          maxLaneCountPerDirection: invalidValue,
        }),
      ).toEqual(phase1DrawingSettings)
    }
  })

  it('caps unsafe drawing settings before lane-generation loops', () => {
    const result = buildStraightRoadGeometry(
      {
        ...defaultStraightRoadParameters,
        eastboundLaneCount: 1_000_000_000,
        westboundLaneCount: 1_000_000_000,
      },
      {
        pxPerMeter: 1_000_000_000,
        segmentLengthMeters: 1_000_000_000,
        maxLaneCountPerDirection: 1_000_000_000,
      },
    )

    expect(result.lanes.filter((lane) => lane.direction === 'eastbound')).toHaveLength(16)
    expect(result.lanes.filter((lane) => lane.direction === 'westbound')).toHaveLength(16)
  })

  it('keeps a positive lane limit after sanitizing fractional drawing settings', () => {
    expect(
      sanitizePhase1DrawingSettings({
        ...phase1DrawingSettings,
        maxLaneCountPerDirection: 0.5,
      }).maxLaneCountPerDirection,
    ).toBe(1)
  })

  it('uses safe fallback segment length for invalid settings', () => {
    for (const segmentLengthMeters of [Number.NaN, Number.POSITIVE_INFINITY, -1]) {
      const result = buildStraightRoadGeometry(defaultStraightRoadParameters, {
        ...phase1DrawingSettings,
        segmentLengthMeters,
      })

      expect(result.lengthMeters).toBe(phase1DrawingSettings.segmentLengthMeters)
      expect(
        result.carriageways.every(
          (item) => item.width === phase1DrawingSettings.segmentLengthMeters,
        ),
      ).toBe(true)
    }
  })

  it('caps excessively large finite straight-road preview lengths', () => {
    const unsafeSettings = {
      ...phase1DrawingSettings,
      pxPerMeter: 1e308,
      segmentLengthMeters: 1e308,
    }
    const safeSettings = sanitizePhase1DrawingSettings(unsafeSettings)
    const result = buildStraightRoadGeometry(defaultStraightRoadParameters, unsafeSettings)

    expect(result.lengthMeters).toBe(MAX_STRAIGHT_ROAD_PREVIEW_LENGTH_METERS)
    expect(result.carriageways.every((item) => item.width === result.lengthMeters)).toBe(true)
    expect(Number.isFinite(safeSettings.pxPerMeter * safeSettings.segmentLengthMeters)).toBe(true)
  })

  it('keeps generated geometry finite for unsafe drawing settings', () => {
    const result = buildStraightRoadGeometry(defaultStraightRoadParameters, {
      pxPerMeter: 1e308,
      segmentLengthMeters: 1e308,
      maxLaneCountPerDirection: 1e308,
    })

    expect(result.lengthMeters).toBe(MAX_STRAIGHT_ROAD_PREVIEW_LENGTH_METERS)
    expect(numericValues(result).every(Number.isFinite)).toBe(true)
  })

  it('hides arrows when requested', () => {
    expect(geometry({ showLaneArrows: false }).arrows).toEqual([])
    expect(
      geometry({ showLaneArrows: false }).pavementMarkings.filter(
        (marking) => marking.type === 'through-arrow',
      ),
    ).toEqual([])
  })

  it('keeps lane arrows as generated pavement markings by default', () => {
    const result = geometry()

    expect(result.pavementMarkings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'eastbound-lane-1-arrow',
          type: 'through-arrow',
          x: 26.88,
          y: 3.25,
          rotationDeg: 90,
          visible: true,
          source: 'generated',
          sourceStatus: 'PROJECT_ASSUMPTION',
        }),
      ]),
    )
  })

  it('applies marking visibility and position adjustments without changing lane geometry', () => {
    const result = geometry({
      markingAdjustments: {
        'eastbound-lane-1-arrow': {
          offsetXMeters: 1.25,
          offsetYMeters: -0.5,
          visible: false,
          scale: 1.2,
        },
      },
    })

    expect(result.lanes.find((lane) => lane.id === 'eastbound-lane-1')).toMatchObject({
      centerY: 3.25,
      x: 0,
      width: 42,
    })
    expect(result.pavementMarkings.find((marking) => marking.id === 'eastbound-lane-1-arrow')).toMatchObject({
      x: 28.13,
      y: 2.75,
      offsetXMeters: 1.25,
      offsetYMeters: -0.5,
      visible: false,
      scale: 1.2,
    })
  })

  it('keeps Phase 1 median rendering unchanged when U-turn is disabled', () => {
    const result = geometry()

    expect(result.medianOpening).toBeNull()
    expect(result.uTurnArrow).toBeNull()
    expect(result.uTurnPocket).toBeNull()
    expect(result.uTurnPocketArrow).toBeNull()
    expect(result.medianSections).toEqual([result.median])
    expect(result.medianEdgeLines).toHaveLength(2)
  })

  it('splits the median surface and edge lines around a valid opening', () => {
    const result = geometry({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        positionMeters: 21,
        openingWidthMeters: 6,
      },
    })

    expect(result.medianOpening).toMatchObject({ x: 18, width: 6, y: 8.5, height: 2 })
    expect(result.medianSections).toEqual([
      expect.objectContaining({ id: 'median-before-opening', x: 0, width: 18 }),
      expect.objectContaining({ id: 'median-after-opening', x: 24, width: 18 }),
    ])
    expect(result.medianEdgeLines).toEqual([
      { x1: 0, y1: 8.5, x2: 18, y2: 8.5 },
      { x1: 24, y1: 8.5, x2: 42, y2: 8.5 },
      { x1: 0, y1: 10.5, x2: 18, y2: 10.5 },
      { x1: 24, y1: 10.5, x2: 42, y2: 10.5 },
    ])
  })

  it('places U-turn arrows from the correct Thailand median-side lane', () => {
    const eastboundToWestbound = geometry({
      uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
    })
    const westboundToEastbound = geometry({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        direction: 'westbound-to-eastbound',
      },
    })

    expect(eastboundToWestbound.uTurnArrow).toMatchObject({
      direction: 'eastbound-to-westbound',
      sourceLaneId: 'eastbound-lane-2',
      targetLaneId: 'westbound-lane-1',
      y: 6.75,
      targetY: 12.25,
    })
    expect(eastboundToWestbound.pavementMarkings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'uturn-arrow',
          type: 'u-turn-arrow',
          x: 21,
          y: 6.75,
          targetY: 12.25,
        }),
      ]),
    )
    expect(westboundToEastbound.uTurnArrow).toMatchObject({
      direction: 'westbound-to-eastbound',
      sourceLaneId: 'westbound-lane-1',
      targetLaneId: 'eastbound-lane-2',
      y: 12.25,
      targetY: 6.75,
    })
  })

  it('omits the optional U-turn arrow while keeping a valid opening', () => {
    const result = geometry({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        showArrow: false,
      },
    })

    expect(result.medianOpening).not.toBeNull()
    expect(result.uTurnArrow).toBeNull()
  })

  it('renders only the base road when U-turn prerequisites are invalid', () => {
    for (const overrides of [
      { medianType: 'none' as const },
      { medianType: 'painted' as const, medianWidthMeters: 0 },
      { medianType: 'raised' as const, medianWidthMeters: Number.NaN },
      { medianType: 'raised' as const, medianWidthMeters: Number.POSITIVE_INFINITY },
      { westboundLaneCount: 0 },
      { eastboundLaneCount: 0, westboundLaneCount: 0 },
      {
        uTurn: {
          ...defaultStraightRoadParameters.uTurn,
          enabled: true,
          openingWidthMeters: 20,
        },
      },
      {
        uTurn: {
          ...defaultStraightRoadParameters.uTurn,
          enabled: true,
          positionMeters: 1,
        },
      },
    ]) {
      const result = geometry({
        uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
        ...overrides,
      })

      expect(result.medianOpening).toBeNull()
      expect(result.uTurnArrow).toBeNull()
    }
  })

  it('still renders a valid U-turn on painted and raised medians', () => {
    for (const medianType of ['painted', 'raised'] as const) {
      const result = geometry({
        medianType,
        medianWidthMeters: 2,
        uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
      })

      expect(result.medianOpening).not.toBeNull()
      expect(result.uTurnArrow).not.toBeNull()
    }
  })

  it('does not add pocket geometry when the U-turn pocket is disabled', () => {
    const result = geometry({
      uTurn: { ...defaultStraightRoadParameters.uTurn, enabled: true },
    })

    expect(result.medianOpening).not.toBeNull()
    expect(result.uTurnPocket).toBeNull()
    expect(result.uTurnPocketArrow).toBeNull()
  })

  it('places an eastbound-to-westbound pocket upstream on the upper median-side approach', () => {
    const result = geometry({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
      },
    })

    expect(result.uTurnPocket).toMatchObject({
      direction: 'eastbound-to-westbound',
      sourceLaneId: 'eastbound-lane-2',
      sourceLaneCenterY: 6.75,
      storage: { x: 10, y: 5, width: 8, height: 3.5 },
    })
    expect(result.uTurnPocket?.taper.points).toEqual([
      { x: 2, y: 8.5 },
      { x: 10, y: 8.5 },
      { x: 10, y: 5 },
    ])
    expect(result.uTurnPocketArrow).toMatchObject({
      direction: 'eastbound-to-westbound',
      x: 14,
      y: 6.75,
      targetY: 12.25,
    })
    expect(result.pavementMarkings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'uturn-pocket-arrow',
          type: 'pocket-u-turn-arrow',
          x: 14,
          y: 6.75,
          targetY: 12.25,
        }),
      ]),
    )
  })

  it('keeps eastbound-to-westbound pocket surfaces out of median and westbound space', () => {
    const result = geometry({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
      },
    })
    const westboundCarriageway = result.carriageways.find(
      (carriageway) => carriageway.id === 'westbound-carriageway',
    )

    expect(result.uTurnPocket).not.toBeNull()
    expect(result.median).not.toBeNull()
    expect(result.medianOpening).not.toBeNull()
    expect(westboundCarriageway).toBeDefined()
    expectPocketDoesNotOverlap(result.uTurnPocket!, [
      result.median!,
      result.medianOpening!,
      westboundCarriageway!,
    ])
    expect(result.uTurnPocket!.storage.x + result.uTurnPocket!.storage.width).toBe(
      result.medianOpening!.x,
    )
    expect(Math.max(...result.uTurnPocket!.taper.points.map((point) => point.x))).toBeLessThan(
      result.medianOpening!.x,
    )
  })

  it('places a westbound-to-eastbound pocket upstream on the lower median-side approach', () => {
    const result = geometry({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        direction: 'westbound-to-eastbound',
        pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
      },
    })

    expect(result.uTurnPocket).toMatchObject({
      direction: 'westbound-to-eastbound',
      sourceLaneId: 'westbound-lane-1',
      sourceLaneCenterY: 12.25,
      storage: { x: 24, y: 10.5, width: 8, height: 3.5 },
    })
    expect(result.uTurnPocket?.taper.points).toEqual([
      { x: 40, y: 10.5 },
      { x: 32, y: 10.5 },
      { x: 32, y: 14 },
    ])
    expect(result.uTurnPocketArrow).toMatchObject({
      direction: 'westbound-to-eastbound',
      x: 28,
      y: 12.25,
      targetY: 6.75,
    })
  })

  it('keeps westbound-to-eastbound pocket surfaces out of median and eastbound space', () => {
    const result = geometry({
      uTurn: {
        ...defaultStraightRoadParameters.uTurn,
        enabled: true,
        direction: 'westbound-to-eastbound',
        pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
      },
    })
    const eastboundCarriageway = result.carriageways.find(
      (carriageway) => carriageway.id === 'eastbound-carriageway',
    )

    expect(result.uTurnPocket).not.toBeNull()
    expect(result.median).not.toBeNull()
    expect(result.medianOpening).not.toBeNull()
    expect(eastboundCarriageway).toBeDefined()
    expectPocketDoesNotOverlap(result.uTurnPocket!, [
      result.median!,
      result.medianOpening!,
      eastboundCarriageway!,
    ])
    expect(result.uTurnPocket!.storage.x).toBe(
      result.medianOpening!.x + result.medianOpening!.width,
    )
    expect(Math.min(...result.uTurnPocket!.taper.points.map((point) => point.x))).toBeGreaterThan(
      result.medianOpening!.x + result.medianOpening!.width,
    )
  })

  it('omits pocket geometry for invalid storage, taper, and upstream fit', () => {
    for (const pocketOverrides of [
      { storageLengthMeters: 4 },
      { taperLengthMeters: 4 },
      { storageLengthMeters: 12, taperLengthMeters: 10 },
    ]) {
      const result = geometry({
        uTurn: {
          ...defaultStraightRoadParameters.uTurn,
          enabled: true,
          pocket: {
            ...defaultStraightRoadParameters.uTurn.pocket,
            enabled: true,
            ...pocketOverrides,
          },
        },
      })

      expect(result.uTurnPocket).toBeNull()
      expect(result.uTurnPocketArrow).toBeNull()
    }
  })

  it('omits pocket geometry when the base U-turn prerequisites are invalid', () => {
    for (const overrides of [
      { medianType: 'none' as const },
      { westboundLaneCount: 0 },
      { eastboundLaneCount: 0 },
      {
        uTurn: {
          ...defaultStraightRoadParameters.uTurn,
          enabled: false,
          pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
        },
      },
    ]) {
      const result = geometry({
        uTurn: {
          ...defaultStraightRoadParameters.uTurn,
          enabled: true,
          pocket: { ...defaultStraightRoadParameters.uTurn.pocket, enabled: true },
        },
        ...overrides,
      })

      expect(result.uTurnPocket).toBeNull()
      expect(result.uTurnPocketArrow).toBeNull()
    }
  })

  it('omits only the pocket arrow when requested', () => {
    const result = geometry({
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

    expect(result.uTurnPocket).not.toBeNull()
    expect(result.uTurnPocketArrow).toBeNull()
  })
})
