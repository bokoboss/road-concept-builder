import {
  phase1NumericLimits,
  phase2BPocketNumericLimits,
  phase2UTurnNumericLimits,
  sanitizePhase1DrawingSettings,
  type Phase1DrawingSettings,
  type StraightRoadParameters,
} from '../domain/straightRoad'

export type ValidationIssue = {
  id: string
  severity: 'warning' | 'info'
  ruleId: string
  message: string
}

function validRange(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max
}

function hasValidPhysicalMedian(parameters: StraightRoadParameters) {
  return (
    parameters.medianType !== 'none' &&
    validRange(
      parameters.medianWidthMeters,
      phase1NumericLimits.medianWidthMeters.min,
      phase1NumericLimits.medianWidthMeters.max,
    ) &&
    parameters.medianWidthMeters > 0
  )
}

function laneCountIssue(
  direction: 'Eastbound' | 'Westbound',
  value: number,
  maxLaneCount: number,
): ValidationIssue | null {
  if (Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= maxLaneCount) {
    return null
  }
  return {
    id: `${direction.toLowerCase()}-lane-count`,
    severity: 'warning',
    ruleId: 'SEG-101',
    message: `${direction} lane count must be an integer from 0 to ${maxLaneCount}.`,
  }
}

export function validateStraightRoad(
  parameters: StraightRoadParameters,
  settings: Phase1DrawingSettings,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const safeSettings = sanitizePhase1DrawingSettings(settings)
  const eastboundIssue = laneCountIssue(
    'Eastbound',
    parameters.eastboundLaneCount,
    safeSettings.maxLaneCountPerDirection,
  )
  const westboundIssue = laneCountIssue(
    'Westbound',
    parameters.westboundLaneCount,
    safeSettings.maxLaneCountPerDirection,
  )

  if (eastboundIssue) issues.push(eastboundIssue)
  if (westboundIssue) issues.push(westboundIssue)

  const eastboundHasRenderedLane =
    Number.isFinite(parameters.eastboundLaneCount) && Math.floor(parameters.eastboundLaneCount) >= 1
  const westboundHasRenderedLane =
    Number.isFinite(parameters.westboundLaneCount) && Math.floor(parameters.westboundLaneCount) >= 1

  if (!eastboundHasRenderedLane && !westboundHasRenderedLane) {
    issues.push({
      id: 'no-lanes',
      severity: 'warning',
      ruleId: 'GEO-002',
      message: 'Road segment must have at least one lane in either direction.',
    })
  }

  if (
    !validRange(
      parameters.laneWidthMeters,
      phase1NumericLimits.laneWidthMeters.min,
      phase1NumericLimits.laneWidthMeters.max,
    )
  ) {
    issues.push({
      id: 'lane-width',
      severity: 'warning',
      ruleId: 'GEO-001',
      message: 'Lane width must be finite and between 2.5 and 5.0 m.',
    })
  }

  if (
    !validRange(
      parameters.shoulderWidthMeters,
      phase1NumericLimits.shoulderWidthMeters.min,
      phase1NumericLimits.shoulderWidthMeters.max,
    )
  ) {
    issues.push({
      id: 'shoulder-width',
      severity: 'warning',
      ruleId: 'SEG-103',
      message: 'Outer shoulder width must be finite and between 0 and 5.0 m.',
    })
  }

  if (parameters.medianType !== 'none') {
    if (
      !validRange(
        parameters.medianWidthMeters,
        phase1NumericLimits.medianWidthMeters.min,
        phase1NumericLimits.medianWidthMeters.max,
      )
    ) {
      issues.push({
        id: 'physical-median-width-range',
        severity: 'warning',
        ruleId: 'SEG-104',
        message: 'Physical median width must be finite and between 0 and 20.0 m.',
      })
    }

    if (!Number.isFinite(parameters.medianWidthMeters) || parameters.medianWidthMeters <= 0) {
      issues.push({
        id: 'physical-median-width-positive',
        severity: 'warning',
        ruleId: 'SEG-002',
        message: 'Painted or raised median width must be greater than 0.',
      })
    }
  }

  if (parameters.uTurn.enabled) {
    const eastboundHasLane =
      Number.isFinite(parameters.eastboundLaneCount) &&
      Math.floor(parameters.eastboundLaneCount) >= 1
    const westboundHasLane =
      Number.isFinite(parameters.westboundLaneCount) &&
      Math.floor(parameters.westboundLaneCount) >= 1

    if (!eastboundHasLane || !westboundHasLane) {
      issues.push({
        id: 'uturn-requires-two-way',
        severity: 'warning',
        ruleId: 'UTN-001',
        message: 'U-turn opening requires two-way operation with lanes in both directions.',
      })
    }

    if (parameters.medianType === 'none') {
      issues.push({
        id: 'uturn-requires-median',
        severity: 'warning',
        ruleId: 'UTN-002',
        message: 'U-turn opening requires a painted or raised median.',
      })
    }

    if (
      !validRange(
        parameters.uTurn.openingWidthMeters,
        phase2UTurnNumericLimits.openingWidthMeters.min,
        phase2UTurnNumericLimits.openingWidthMeters.max,
      )
    ) {
      issues.push({
        id: 'uturn-opening-width',
        severity: 'warning',
        ruleId: 'UTN-003',
        message: 'U-turn opening width must be finite and between 2 and 12 m.',
      })
    }

    const safeSettings = sanitizePhase1DrawingSettings(settings)
    const openingStart =
      parameters.uTurn.positionMeters - parameters.uTurn.openingWidthMeters / 2
    const openingEnd =
      parameters.uTurn.positionMeters + parameters.uTurn.openingWidthMeters / 2
    if (
      !Number.isFinite(parameters.uTurn.positionMeters) ||
      !Number.isFinite(openingStart) ||
      !Number.isFinite(openingEnd) ||
      openingStart < 0 ||
      openingEnd > safeSettings.segmentLengthMeters
    ) {
      issues.push({
        id: 'uturn-opening-position',
        severity: 'warning',
        ruleId: 'UTN-004',
        message: 'The full U-turn opening must fit within the straight-road preview segment.',
      })
    }
  }

  if (parameters.uTurn.pocket.enabled) {
    const eastboundHasLane =
      Number.isFinite(parameters.eastboundLaneCount) &&
      Math.floor(parameters.eastboundLaneCount) >= 1
    const westboundHasLane =
      Number.isFinite(parameters.westboundLaneCount) &&
      Math.floor(parameters.westboundLaneCount) >= 1
    const openingStart =
      parameters.uTurn.positionMeters - parameters.uTurn.openingWidthMeters / 2
    const openingEnd =
      parameters.uTurn.positionMeters + parameters.uTurn.openingWidthMeters / 2
    const hasValidOpening =
      parameters.uTurn.enabled &&
      eastboundHasLane &&
      westboundHasLane &&
      hasValidPhysicalMedian(parameters) &&
      validRange(
        parameters.uTurn.openingWidthMeters,
        phase2UTurnNumericLimits.openingWidthMeters.min,
        phase2UTurnNumericLimits.openingWidthMeters.max,
      ) &&
      Number.isFinite(parameters.uTurn.positionMeters) &&
      Number.isFinite(openingStart) &&
      Number.isFinite(openingEnd) &&
      openingStart >= 0 &&
      openingEnd <= safeSettings.segmentLengthMeters

    if (!parameters.uTurn.enabled) {
      issues.push({
        id: 'uturn-pocket-requires-opening-enabled',
        severity: 'warning',
        ruleId: 'UTP-001',
        message: 'U-turn pocket requires the U-turn opening to be enabled.',
      })
    }

    if (!eastboundHasLane || !westboundHasLane) {
      issues.push({
        id: 'uturn-pocket-requires-two-way',
        severity: 'warning',
        ruleId: 'UTP-002',
        message: 'U-turn pocket requires two-way operation with lanes in both directions.',
      })
    }

    if (!hasValidPhysicalMedian(parameters)) {
      issues.push({
        id: 'uturn-pocket-requires-median',
        severity: 'warning',
        ruleId: 'UTP-003',
        message: 'U-turn pocket requires a painted or raised median with positive width.',
      })
    }

    if (!hasValidOpening) {
      issues.push({
        id: 'uturn-pocket-requires-valid-opening',
        severity: 'warning',
        ruleId: 'UTP-004',
        message: 'U-turn pocket requires valid Phase 2 median-opening geometry.',
      })
    }

    const hasValidStorageLength = validRange(
      parameters.uTurn.pocket.storageLengthMeters,
      phase2BPocketNumericLimits.storageLengthMeters.min,
      phase2BPocketNumericLimits.storageLengthMeters.max,
    )
    if (!hasValidStorageLength) {
      issues.push({
        id: 'uturn-pocket-storage-length',
        severity: 'warning',
        ruleId: 'UTP-005',
        message: 'U-turn pocket storage length must be finite and between 5 and 100 m.',
      })
    }

    const hasValidTaperLength = validRange(
      parameters.uTurn.pocket.taperLengthMeters,
      phase2BPocketNumericLimits.taperLengthMeters.min,
      phase2BPocketNumericLimits.taperLengthMeters.max,
    )
    if (!hasValidTaperLength) {
      issues.push({
        id: 'uturn-pocket-taper-length',
        severity: 'warning',
        ruleId: 'UTP-006',
        message: 'U-turn pocket taper length must be finite and between 5 and 80 m.',
      })
    }

    const totalPocketLength =
      parameters.uTurn.pocket.storageLengthMeters + parameters.uTurn.pocket.taperLengthMeters
    const fitsUpstream =
      parameters.uTurn.direction === 'eastbound-to-westbound'
        ? openingStart - totalPocketLength >= 0
        : openingEnd + totalPocketLength <= safeSettings.segmentLengthMeters

    if (
      hasValidOpening &&
      hasValidStorageLength &&
      hasValidTaperLength &&
      (!Number.isFinite(totalPocketLength) || !fitsUpstream)
    ) {
      issues.push({
        id: 'uturn-pocket-fit',
        severity: 'warning',
        ruleId: 'UTP-007',
        message: 'The full U-turn pocket storage and taper must fit upstream of the opening.',
      })
    }

    if (!parameters.uTurn.pocket.showArrow) {
      issues.push({
        id: 'uturn-pocket-arrow',
        severity: 'info',
        ruleId: 'MRK-003',
        message: 'U-turn pocket is enabled without a pocket U-turn arrow.',
      })
    }
  }

  issues.push({
    id: 'concept-geometry',
    severity: 'info',
    ruleId: 'GEN-001',
    message: 'Concept geometry should not be treated as a construction drawing.',
  })

  return issues
}
