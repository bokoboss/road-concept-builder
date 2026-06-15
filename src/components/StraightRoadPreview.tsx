import {
  sanitizePhase1DrawingSettings,
  type MedianType,
  type Phase1DrawingSettings,
  type StraightRoadParameters,
} from '../domain/straightRoad'
import {
  buildStraightRoadGeometry,
  type RectGeometry,
  type RoadOperationMode,
} from '../geometry/straightRoadGeometry'

const ROAD_X = 122
const ROAD_CENTER_Y = 285
const MAX_ROAD_RENDER_HEIGHT = 360

function RoadRect({
  rect,
  className,
  roadTop,
  px,
}: {
  rect: RectGeometry
  className: string
  roadTop: number
  px: (value: number) => number
}) {
  return (
    <rect
      className={className}
      x={ROAD_X + px(rect.x)}
      y={roadTop + px(rect.y)}
      width={px(rect.width)}
      height={px(rect.height)}
    />
  )
}

function ThroughArrow({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} className="road-arrow">
      <path d="M0 20V-16" />
      <path d="m-7-9 7-9 7 9" />
    </g>
  )
}

function medianClassName(medianType: MedianType) {
  return medianType === 'painted' ? 'painted-median' : 'raised-median'
}

function operationDescription(operationMode: RoadOperationMode) {
  if (operationMode === 'eastboundOnly') {
    return 'One-way eastbound traffic moves left-to-right.'
  }
  if (operationMode === 'westboundOnly') {
    return 'One-way westbound traffic moves right-to-left.'
  }
  if (operationMode === 'noLanes') {
    return 'No lanes are configured. Add at least one lane to generate the road preview.'
  }
  return 'Eastbound traffic uses the upper carriageway and moves left-to-right. Westbound traffic uses the lower carriageway and moves right-to-left.'
}

function trafficNote(operationMode: RoadOperationMode) {
  if (operationMode === 'eastboundOnly') return 'One-way eastbound concept: traffic moves right.'
  if (operationMode === 'westboundOnly') return 'One-way westbound concept: traffic moves left.'
  if (operationMode === 'noLanes') return 'No lanes configured. Validation remains non-blocking.'
  return 'Thailand left-hand traffic: eastbound traffic uses the upper carriageway, westbound traffic uses the lower carriageway.'
}

export function StraightRoadPreview({
  parameters,
  settings,
}: {
  parameters: StraightRoadParameters
  settings: Phase1DrawingSettings
}) {
  const safeSettings = sanitizePhase1DrawingSettings(settings)
  const geometry = buildStraightRoadGeometry(parameters, safeSettings)
  const renderPxPerMeter = Math.min(
    safeSettings.pxPerMeter,
    MAX_ROAD_RENDER_HEIGHT / Math.max(geometry.totalWidthMeters, 1),
  )
  const px = (value: number) => value * renderPxPerMeter
  const roadHeight = px(geometry.totalWidthMeters)
  const roadTop = ROAD_CENTER_Y - roadHeight / 2
  const toSvgY = (yMeters: number) => roadTop + px(yMeters)
  const roadEndX = ROAD_X + px(geometry.lengthMeters)
  const showEastboundLabel =
    geometry.operationMode === 'twoWay' || geometry.operationMode === 'eastboundOnly'
  const showWestboundLabel =
    geometry.operationMode === 'twoWay' || geometry.operationMode === 'westboundOnly'

  return (
    <svg
      className="road-preview"
      viewBox="0 0 1000 600"
      role="img"
      aria-labelledby="road-preview-title road-preview-description"
    >
      <title id="road-preview-title">Parametric straight road segment</title>
      <desc id="road-preview-description">{operationDescription(geometry.operationMode)}</desc>

      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#dfe5e9" strokeWidth="1" />
        </pattern>
        <filter id="roadShadow" x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#12232f" floodOpacity=".18" />
        </filter>
      </defs>

      <rect width="1000" height="600" fill="#f5f7f8" />
      <rect width="1000" height="600" fill="url(#grid)" />

      {geometry.operationMode === 'noLanes' ? (
        <g className="empty-road-placeholder" data-testid="no-lanes-placeholder">
          <rect x="275" y="235" width="450" height="100" rx="10" />
          <text x="500" y="277" textAnchor="middle">
            No lanes configured
          </text>
          <text x="500" y="303" textAnchor="middle">
            Add at least one eastbound or westbound lane.
          </text>
        </g>
      ) : (
        <g filter="url(#roadShadow)" data-testid="generated-road">
          {geometry.shoulders.map((shoulder) => (
            <RoadRect
              key={shoulder.id}
              rect={shoulder}
              className="road-shoulder"
              roadTop={roadTop}
              px={px}
            />
          ))}
          {geometry.carriageways.map((carriageway) => (
            <RoadRect
              key={carriageway.id}
              rect={carriageway}
              className="road-surface"
              roadTop={roadTop}
              px={px}
            />
          ))}
          {geometry.median && (
            <RoadRect
              rect={geometry.median}
              className={medianClassName(parameters.medianType)}
              roadTop={roadTop}
              px={px}
            />
          )}

          {geometry.edgeLines.map((line, index) => (
            <line
              key={`edge-${index}`}
              className="edge-line"
              x1={ROAD_X + px(line.x1)}
              y1={toSvgY(line.y1)}
              x2={ROAD_X + px(line.x2)}
              y2={toSvgY(line.y2)}
            />
          ))}
          {geometry.medianEdgeLines.map((line, index) => (
            <line
              key={`median-edge-${index}`}
              className="median-line"
              x1={ROAD_X + px(line.x1)}
              y1={toSvgY(line.y1)}
              x2={ROAD_X + px(line.x2)}
              y2={toSvgY(line.y2)}
            />
          ))}
          {geometry.directionSeparationLine && (
            <line
              data-testid="direction-separation-line"
              className="direction-separation-line"
              x1={ROAD_X + px(geometry.directionSeparationLine.x1)}
              y1={toSvgY(geometry.directionSeparationLine.y1)}
              x2={ROAD_X + px(geometry.directionSeparationLine.x2)}
              y2={toSvgY(geometry.directionSeparationLine.y2)}
            />
          )}
          {geometry.laneDividerLines.map((line, index) => (
            <line
              key={`lane-divider-${index}`}
              className="lane-line"
              x1={ROAD_X + px(line.x1)}
              y1={toSvgY(line.y1)}
              x2={ROAD_X + px(line.x2)}
              y2={toSvgY(line.y2)}
            />
          ))}
          {geometry.arrows.map((arrow) => (
            <ThroughArrow
              key={arrow.id}
              x={ROAD_X + px(arrow.x)}
              y={toSvgY(arrow.y)}
              rotate={arrow.rotationDegrees}
            />
          ))}

          <g className="lane-position-label">
            {geometry.lanes
              .filter((lane) => lane.positionLabel)
              .map((lane) => (
                <text key={`${lane.id}-label`} x={ROAD_X + 14} y={toSvgY(lane.centerY) + 3}>
                  {lane.positionLabel}
                </text>
              ))}
          </g>
        </g>
      )}

      {showEastboundLabel && (
        <g className="road-label" data-testid="eastbound-carriageway-label">
          <rect x={ROAD_X} y={Math.max(48, roadTop - 42)} width="176" height="28" rx="14" />
          <text x={ROAD_X + 88} y={Math.max(67, roadTop - 23)} textAnchor="middle">
            Eastbound carriageway
          </text>
        </g>
      )}
      {showWestboundLabel && (
        <g className="road-label" data-testid="westbound-carriageway-label">
          <rect
            x={ROAD_X}
            y={Math.min(516, roadTop + roadHeight + 14)}
            width="176"
            height="28"
            rx="14"
          />
          <text x={ROAD_X + 88} y={Math.min(535, roadTop + roadHeight + 33)} textAnchor="middle">
            Westbound carriageway
          </text>
        </g>
      )}

      <g className="north-indicator" transform="translate(920 70)">
        <path d="M0 22V-8" />
        <path d="m-6 0 6-10L6 0" />
        <text x="0" y="-19" textAnchor="middle">
          N
        </text>
      </g>

      {geometry.operationMode !== 'noLanes' && (
        <g className="road-dimension-note">
          <rect x={roadEndX - 178} y={roadTop - 39} width="178" height="24" rx="5" />
          <text x={roadEndX - 89} y={roadTop - 23} textAnchor="middle">
            Approx. width {geometry.totalWidthMeters.toFixed(1)} m
          </text>
        </g>
      )}

      <g className="traffic-note">
        <rect x="105" y="535" width="790" height="38" rx="7" />
        <text x="500" y="559" textAnchor="middle">
          {trafficNote(geometry.operationMode)}
        </text>
      </g>
    </svg>
  )
}
