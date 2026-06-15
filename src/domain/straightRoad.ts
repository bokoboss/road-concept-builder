export type MedianType = 'none' | 'painted' | 'raised'

export type StraightRoadParameters = {
  eastboundLaneCount: number
  westboundLaneCount: number
  laneWidthMeters: number
  shoulderWidthMeters: number
  medianType: MedianType
  medianWidthMeters: number
  showLaneArrows: boolean
}

export type Phase1DrawingSettings = {
  pxPerMeter: number
  segmentLengthMeters: number
  maxLaneCountPerDirection: number
}

export const phase1DrawingSettings: Phase1DrawingSettings = {
  pxPerMeter: 18,
  segmentLengthMeters: 42,
  maxLaneCountPerDirection: 8,
}

const ABSOLUTE_MAX_LANE_COUNT_PER_DIRECTION = 16
export const MAX_STRAIGHT_ROAD_PREVIEW_LENGTH_METERS = 500
const MAX_STRAIGHT_ROAD_PREVIEW_PX_PER_METER = 100

export function sanitizePhase1DrawingSettings(
  settings: Phase1DrawingSettings,
): Phase1DrawingSettings {
  const maxLaneCountPerDirection =
    Number.isFinite(settings.maxLaneCountPerDirection) && settings.maxLaneCountPerDirection > 0
      ? Math.min(
          Math.max(1, Math.floor(settings.maxLaneCountPerDirection)),
          ABSOLUTE_MAX_LANE_COUNT_PER_DIRECTION,
        )
      : phase1DrawingSettings.maxLaneCountPerDirection

  const segmentLengthMeters =
    Number.isFinite(settings.segmentLengthMeters) && settings.segmentLengthMeters > 0
      ? Math.min(settings.segmentLengthMeters, MAX_STRAIGHT_ROAD_PREVIEW_LENGTH_METERS)
      : phase1DrawingSettings.segmentLengthMeters

  return {
    pxPerMeter:
      Number.isFinite(settings.pxPerMeter) && settings.pxPerMeter > 0
        ? Math.min(settings.pxPerMeter, MAX_STRAIGHT_ROAD_PREVIEW_PX_PER_METER)
        : phase1DrawingSettings.pxPerMeter,
    segmentLengthMeters,
    maxLaneCountPerDirection,
  }
}

export const phase1NumericLimits = {
  laneWidthMeters: { min: 2.5, max: 5 },
  shoulderWidthMeters: { min: 0, max: 5 },
  medianWidthMeters: { min: 0, max: 20 },
} as const

// Phase 1 uses eastbound/westbound names for this east-west diagram.
// Future phases may generalize directions for other road alignments.
export const defaultStraightRoadParameters: StraightRoadParameters = {
  eastboundLaneCount: 2,
  westboundLaneCount: 2,
  laneWidthMeters: 3.5,
  shoulderWidthMeters: 1.5,
  medianType: 'raised',
  medianWidthMeters: 2,
  showLaneArrows: true,
}
