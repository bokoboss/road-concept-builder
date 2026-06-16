import {
  defaultStraightRoadParameters,
  phase1NumericLimits,
  phase2UTurnNumericLimits,
  sanitizePhase1DrawingSettings,
  type Phase1DrawingSettings,
  type StraightRoadParameters,
  type UTurnDirection,
} from '../domain/straightRoad'

export type RoadDirection = 'eastbound' | 'westbound'
export type RoadOperationMode = 'twoWay' | 'eastboundOnly' | 'westboundOnly' | 'noLanes'

export type RectGeometry = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export type LineGeometry = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type LanePositionLabel =
  | 'Outer / near-side lane'
  | 'Median-side lane'
  | 'Centerline-side lane'
  | 'Outer / centerline-side lane'
  | 'Left / near-side lane'
  | 'Right / off-side lane'
  | 'Single one-way lane'

export type LaneGeometry = RectGeometry & {
  direction: RoadDirection
  orderFromOuter: number
  centerY: number
  positionLabel: LanePositionLabel | null
}

export type ArrowGeometry = {
  id: string
  direction: RoadDirection
  x: number
  y: number
  rotationDegrees: 90 | -90
}

export type MedianOpeningGeometry = RectGeometry & {
  direction: UTurnDirection
}

export type UTurnArrowGeometry = {
  id: string
  direction: UTurnDirection
  sourceLaneId: string
  targetLaneId: string
  x: number
  y: number
  targetY: number
}

export type StraightRoadGeometry = {
  operationMode: RoadOperationMode
  lengthMeters: number
  totalWidthMeters: number
  carriageways: RectGeometry[]
  shoulders: RectGeometry[]
  median: RectGeometry | null
  medianSections: RectGeometry[]
  medianOpening: MedianOpeningGeometry | null
  lanes: LaneGeometry[]
  laneDividerLines: LineGeometry[]
  edgeLines: LineGeometry[]
  medianEdgeLines: LineGeometry[]
  directionSeparationLine: LineGeometry | null
  arrows: ArrowGeometry[]
  uTurnArrow: UTurnArrowGeometry | null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeLaneCount(value: number, maxLaneCount: number) {
  if (!Number.isFinite(value)) return 0
  return clamp(Math.floor(value), 0, maxLaneCount)
}

function normalizeDimension(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return clamp(value, min, max)
}

function hasUsablePhysicalMedianForUTurn(parameters: StraightRoadParameters) {
  return (
    parameters.medianType !== 'none' &&
    Number.isFinite(parameters.medianWidthMeters) &&
    parameters.medianWidthMeters > 0 &&
    parameters.medianWidthMeters >= phase1NumericLimits.medianWidthMeters.min &&
    parameters.medianWidthMeters <= phase1NumericLimits.medianWidthMeters.max
  )
}

function deriveOperationMode(
  eastboundLaneCount: number,
  westboundLaneCount: number,
): RoadOperationMode {
  if (eastboundLaneCount > 0 && westboundLaneCount > 0) return 'twoWay'
  if (eastboundLaneCount > 0) return 'eastboundOnly'
  if (westboundLaneCount > 0) return 'westboundOnly'
  return 'noLanes'
}

function horizontalLine(y: number, lengthMeters: number): LineGeometry {
  return { x1: 0, y1: y, x2: lengthMeters, y2: y }
}

function lanePositionLabel(
  operationMode: RoadOperationMode,
  direction: RoadDirection,
  index: number,
  laneCount: number,
  hasPhysicalMedian: boolean,
): LanePositionLabel | null {
  if (laneCount === 1) {
    if (operationMode === 'twoWay') {
      return hasPhysicalMedian ? 'Outer / near-side lane' : 'Outer / centerline-side lane'
    }
    return 'Single one-way lane'
  }

  if (operationMode === 'eastboundOnly') {
    if (index === 0) return 'Left / near-side lane'
    if (index === laneCount - 1) return 'Right / off-side lane'
    return null
  }

  if (operationMode === 'westboundOnly') {
    if (index === 0) return 'Right / off-side lane'
    if (index === laneCount - 1) return 'Left / near-side lane'
    return null
  }

  if (direction === 'eastbound') {
    if (index === 0) return 'Outer / near-side lane'
    if (index === laneCount - 1) {
      return hasPhysicalMedian ? 'Median-side lane' : 'Centerline-side lane'
    }
    return null
  }

  if (index === 0) return hasPhysicalMedian ? 'Median-side lane' : 'Centerline-side lane'
  if (index === laneCount - 1) return 'Outer / near-side lane'
  return null
}

export function buildStraightRoadGeometry(
  parameters: StraightRoadParameters,
  settings: Phase1DrawingSettings,
): StraightRoadGeometry {
  const safeSettings = sanitizePhase1DrawingSettings(settings)
  const lengthMeters = safeSettings.segmentLengthMeters
  const maxLaneCount = safeSettings.maxLaneCountPerDirection
  const eastboundLaneCount = normalizeLaneCount(parameters.eastboundLaneCount, maxLaneCount)
  const westboundLaneCount = normalizeLaneCount(parameters.westboundLaneCount, maxLaneCount)
  const laneWidth = normalizeDimension(
    parameters.laneWidthMeters,
    phase1NumericLimits.laneWidthMeters.min,
    phase1NumericLimits.laneWidthMeters.max,
    defaultStraightRoadParameters.laneWidthMeters,
  )
  const shoulderWidth = normalizeDimension(
    parameters.shoulderWidthMeters,
    phase1NumericLimits.shoulderWidthMeters.min,
    phase1NumericLimits.shoulderWidthMeters.max,
    defaultStraightRoadParameters.shoulderWidthMeters,
  )
  const operationMode = deriveOperationMode(eastboundLaneCount, westboundLaneCount)
  const hasPhysicalMedian = operationMode === 'twoWay' && parameters.medianType !== 'none'
  const medianWidth = hasPhysicalMedian
    ? Number.isFinite(parameters.medianWidthMeters) && parameters.medianWidthMeters > 0
      ? clamp(parameters.medianWidthMeters, 0, phase1NumericLimits.medianWidthMeters.max)
      : defaultStraightRoadParameters.medianWidthMeters
    : 0

  const eastboundHeight = eastboundLaneCount * laneWidth
  const westboundHeight = westboundLaneCount * laneWidth
  const carriageways: RectGeometry[] = []
  const shoulders: RectGeometry[] = []
  let eastboundY = 0
  let westboundY = 0
  let medianY = 0
  let totalWidthMeters = 0

  if (operationMode === 'twoWay') {
    eastboundY = shoulderWidth
    medianY = eastboundY + eastboundHeight
    westboundY = medianY + medianWidth
    const westboundShoulderY = westboundY + westboundHeight
    totalWidthMeters = westboundShoulderY + shoulderWidth
    shoulders.push(
      { id: 'eastbound-outer-shoulder', x: 0, y: 0, width: lengthMeters, height: shoulderWidth },
      {
        id: 'westbound-outer-shoulder',
        x: 0,
        y: westboundShoulderY,
        width: lengthMeters,
        height: shoulderWidth,
      },
    )
    carriageways.push(
      {
        id: 'eastbound-carriageway',
        x: 0,
        y: eastboundY,
        width: lengthMeters,
        height: eastboundHeight,
      },
      {
        id: 'westbound-carriageway',
        x: 0,
        y: westboundY,
        width: lengthMeters,
        height: westboundHeight,
      },
    )
  } else if (operationMode === 'eastboundOnly') {
    eastboundY = shoulderWidth
    totalWidthMeters = shoulderWidth + eastboundHeight
    shoulders.push({
      id: 'eastbound-outer-shoulder',
      x: 0,
      y: 0,
      width: lengthMeters,
      height: shoulderWidth,
    })
    carriageways.push({
      id: 'eastbound-carriageway',
      x: 0,
      y: eastboundY,
      width: lengthMeters,
      height: eastboundHeight,
    })
  } else if (operationMode === 'westboundOnly') {
    const westboundShoulderY = westboundHeight
    totalWidthMeters = westboundHeight + shoulderWidth
    shoulders.push({
      id: 'westbound-outer-shoulder',
      x: 0,
      y: westboundShoulderY,
      width: lengthMeters,
      height: shoulderWidth,
    })
    carriageways.push({
      id: 'westbound-carriageway',
      x: 0,
      y: westboundY,
      width: lengthMeters,
      height: westboundHeight,
    })
  }

  const lanes: LaneGeometry[] = []
  const laneDividerLines: LineGeometry[] = []

  const addLanes = (direction: RoadDirection, count: number, startY: number) => {
    for (let index = 0; index < count; index += 1) {
      const y = startY + index * laneWidth
      lanes.push({
        id: `${direction}-lane-${index + 1}`,
        direction,
        orderFromOuter: direction === 'eastbound' ? index + 1 : count - index,
        x: 0,
        y,
        width: lengthMeters,
        height: laneWidth,
        centerY: y + laneWidth / 2,
        positionLabel: lanePositionLabel(
          operationMode,
          direction,
          index,
          count,
          hasPhysicalMedian,
        ),
      })
      if (index > 0) laneDividerLines.push(horizontalLine(y, lengthMeters))
    }
  }

  addLanes('eastbound', eastboundLaneCount, eastboundY)
  addLanes('westbound', westboundLaneCount, westboundY)

  const edgeLines =
    operationMode === 'twoWay'
      ? [
          horizontalLine(eastboundY, lengthMeters),
          horizontalLine(westboundY + westboundHeight, lengthMeters),
        ]
      : carriageways.flatMap((carriageway) => [
          horizontalLine(carriageway.y, lengthMeters),
          horizontalLine(carriageway.y + carriageway.height, lengthMeters),
        ])
  const median =
    hasPhysicalMedian && medianWidth > 0
      ? { id: 'median', x: 0, y: medianY, width: lengthMeters, height: medianWidth }
      : null
  const arrows: ArrowGeometry[] = parameters.showLaneArrows
    ? lanes.map((lane) => ({
        id: `${lane.id}-arrow`,
        direction: lane.direction,
        x: lane.direction === 'eastbound' ? lengthMeters * 0.64 : lengthMeters * 0.36,
        y: lane.centerY,
        rotationDegrees: lane.direction === 'eastbound' ? 90 : -90,
      }))
    : []
  const openingWidth = parameters.uTurn.openingWidthMeters
  const openingPosition = parameters.uTurn.positionMeters
  const openingStart = openingPosition - openingWidth / 2
  const openingEnd = openingPosition + openingWidth / 2
  const hasValidUTurn =
    parameters.uTurn.enabled &&
    operationMode === 'twoWay' &&
    median !== null &&
    hasUsablePhysicalMedianForUTurn(parameters) &&
    Number.isFinite(openingWidth) &&
    openingWidth >= phase2UTurnNumericLimits.openingWidthMeters.min &&
    openingWidth <= phase2UTurnNumericLimits.openingWidthMeters.max &&
    Number.isFinite(openingPosition) &&
    openingStart >= 0 &&
    openingEnd <= lengthMeters
  const medianOpening: MedianOpeningGeometry | null = hasValidUTurn
    ? {
        id: 'uturn-median-opening',
        direction: parameters.uTurn.direction,
        x: openingStart,
        y: median.y,
        width: openingWidth,
        height: median.height,
      }
    : null
  const medianSections: RectGeometry[] = median
    ? medianOpening
      ? [
          { ...median, id: 'median-before-opening', width: medianOpening.x },
          {
            id: 'median-after-opening',
            x: openingEnd,
            y: median.y,
            width: lengthMeters - openingEnd,
            height: median.height,
          },
        ].filter((section) => section.width > 0)
      : [median]
    : []
  const medianEdgeLines = median
    ? medianOpening
      ? [median.y, median.y + median.height].flatMap((y) => [
          { x1: 0, y1: y, x2: openingStart, y2: y },
          { x1: openingEnd, y1: y, x2: lengthMeters, y2: y },
        ])
      : [horizontalLine(median.y, lengthMeters), horizontalLine(median.y + median.height, lengthMeters)]
    : []
  const sourceDirection =
    parameters.uTurn.direction === 'eastbound-to-westbound' ? 'eastbound' : 'westbound'
  const sourceLanes = hasValidUTurn
    ? lanes.filter((lane) => lane.direction === sourceDirection)
    : []
  const sourceLane =
    sourceDirection === 'eastbound' ? sourceLanes.at(-1) : sourceLanes.at(0)
  const targetDirection = sourceDirection === 'eastbound' ? 'westbound' : 'eastbound'
  const targetLanes = hasValidUTurn
    ? lanes.filter((lane) => lane.direction === targetDirection)
    : []
  const targetLane =
    targetDirection === 'eastbound' ? targetLanes.at(-1) : targetLanes.at(0)
  const uTurnArrow: UTurnArrowGeometry | null =
    sourceLane && targetLane && parameters.uTurn.showArrow
      ? {
          id: 'uturn-arrow',
          direction: parameters.uTurn.direction,
          sourceLaneId: sourceLane.id,
          targetLaneId: targetLane.id,
          x: openingPosition,
          y: sourceLane.centerY,
          targetY: targetLane.centerY,
        }
      : null

  return {
    operationMode,
    lengthMeters,
    totalWidthMeters,
    carriageways,
    shoulders,
    median,
    medianSections,
    medianOpening,
    lanes,
    laneDividerLines,
    edgeLines,
    medianEdgeLines,
    directionSeparationLine:
      operationMode === 'twoWay' && !hasPhysicalMedian
        ? horizontalLine(eastboundY + eastboundHeight, lengthMeters)
        : null,
    arrows,
    uTurnArrow,
  }
}
