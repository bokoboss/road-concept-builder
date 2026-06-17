import { useRef, useState } from 'react'
import {
  defaultDrawingViewOptions,
  type DrawingViewOptions,
  sanitizePhase1DrawingSettings,
  type MedianType,
  type Phase1DrawingSettings,
  type StraightRoadParameters,
} from '../domain/straightRoad'
import type { CanvasObject } from '../domain/projectDocument'
import {
  buildStraightRoadGeometry,
  type PolygonGeometry,
  type RectGeometry,
  type RoadOperationMode,
} from '../geometry/straightRoadGeometry'

const ROAD_X = 122
const ROAD_CENTER_Y = 285
const MAX_ROAD_RENDER_HEIGHT = 360

function svgNumber(value: number) {
  return Number(value.toFixed(3))
}

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

function RoadPolygon({
  polygon,
  className,
  roadTop,
  px,
}: {
  polygon: PolygonGeometry
  className: string
  roadTop: number
  px: (value: number) => number
}) {
  return (
    <polygon
      className={className}
      points={polygon.points
        .map((point) => `${ROAD_X + px(point.x)},${roadTop + px(point.y)}`)
        .join(' ')}
    />
  )
}

function ThroughArrow({
  x,
  y,
  rotate,
  scale = 1,
}: {
  x: number
  y: number
  rotate: number
  scale?: number
}) {
  return (
    <g
      transform={`translate(${svgNumber(x)} ${svgNumber(y)}) rotate(${rotate}) scale(${svgNumber(scale)})`}
      className="road-arrow"
    >
      <path d="M0 20V-16" />
      <path d="m-7-9 7-9 7 9" />
    </g>
  )
}

function UTurnArrow({
  x,
  y,
  targetY,
  direction,
  scale = 1,
  testId = 'uturn-arrow',
}: {
  x: number
  y: number
  targetY: number
  direction: 'eastbound-to-westbound' | 'westbound-to-eastbound'
  scale?: number
  testId?: string
}) {
  const horizontalScale = direction === 'eastbound-to-westbound' ? 1 : -1
  const targetOffset = targetY - y

  return (
    <g
      data-testid={testId}
      data-direction={direction}
      transform={`translate(${svgNumber(x)} ${svgNumber(y)}) scale(${svgNumber(horizontalScale * scale)} ${svgNumber(scale)})`}
      className="uturn-arrow"
    >
      <path d={`M-25 0H3C22 0 22 ${targetOffset} 3 ${targetOffset}H-12`} />
      <path d={`m-4 ${targetOffset - 8}-8 8 8 8`} />
    </g>
  )
}

function PavementMarking({
  marking,
  roadTop,
  px,
  selected = false,
  onPointerDown,
}: {
  marking: Pick<
    CanvasObject,
    | 'id'
    | 'type'
    | 'x'
    | 'y'
    | 'rotationDeg'
    | 'scale'
    | 'direction'
    | 'targetY'
    | 'locked'
  >
  roadTop: number
  px: (value: number) => number
  selected?: boolean
  onPointerDown?: React.PointerEventHandler<SVGGElement>
}) {
  const x = ROAD_X + px(marking.x)
  const y = roadTop + px(marking.y)
  const targetY = marking.targetY === undefined ? undefined : roadTop + px(marking.targetY)
  const className = `canvas-object${selected ? ' is-selected' : ''}${marking.locked ? ' is-locked' : ''}`

  if (marking.type === 'through-arrow') {
    return (
      <g
        className={className}
        data-testid={marking.id}
        data-marking-type={marking.type}
        data-locked={marking.locked}
        onPointerDown={onPointerDown}
      >
        {selected && <circle className="selection-ring" cx={x} cy={y} r={24 * marking.scale} />}
        <ThroughArrow x={x} y={y} rotate={marking.rotationDeg} scale={marking.scale} />
      </g>
    )
  }

  if (targetY === undefined) return null

  return (
    <g
      className={className}
      data-locked={marking.locked}
      onPointerDown={onPointerDown}
    >
      {selected && <circle className="selection-ring" cx={x} cy={y} r={28 * marking.scale} />}
      <UTurnArrow
        testId={marking.id}
        x={x}
        y={y}
        targetY={targetY}
        direction={marking.direction as 'eastbound-to-westbound' | 'westbound-to-eastbound'}
        scale={marking.scale}
      />
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
  viewOptions = defaultDrawingViewOptions,
  canvasObjects,
  selectedObjectId = null,
  onSelectObject,
  onMoveObject,
}: {
  parameters: StraightRoadParameters
  settings: Phase1DrawingSettings
  viewOptions?: DrawingViewOptions
  canvasObjects?: CanvasObject[]
  selectedObjectId?: string | null
  onSelectObject?: (id: string | null) => void
  onMoveObject?: (id: string, x: number, y: number) => void
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [dragState, setDragState] = useState<{
    id: string
    offsetXMeters: number
    offsetYMeters: number
  } | null>(null)
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
  const showLabels = viewOptions.showLabels
  const showLaneLabels = showLabels && viewOptions.showLaneLabels
  const showFeatureLabels = showLabels && viewOptions.showFeatureLabels
  const markings = canvasObjects ?? geometry.pavementMarkings.map((marking) => ({
    ...marking,
    locked: false,
    layer: 'marking' as const,
    zIndex: 0,
  }))
  const visibleMarkings = markings
    .filter((marking) => marking.layer === 'marking' && marking.visible)
    .sort((left, right) => left.zIndex - right.zIndex)

  const eventToMeters = (event: React.PointerEvent<SVGSVGElement | SVGGElement>) => {
    const svg = svgRef.current
    if (!svg) return null
    const bounds = svg.getBoundingClientRect()
    const svgX = ((event.clientX - bounds.left) / bounds.width) * 1000
    const svgY = ((event.clientY - bounds.top) / bounds.height) * 600

    return {
      x: (svgX - ROAD_X) / renderPxPerMeter,
      y: (svgY - roadTop) / renderPxPerMeter,
    }
  }
  const startDrag = (marking: CanvasObject) => (event: React.PointerEvent<SVGGElement>) => {
    event.stopPropagation()
    onSelectObject?.(marking.id)
    if (marking.locked) return
    const point = eventToMeters(event)
    if (!point) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragState({
      id: marking.id,
      offsetXMeters: marking.x - point.x,
      offsetYMeters: marking.y - point.y,
    })
  }
  const moveDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragState) return
    const point = eventToMeters(event)
    if (!point) return
    onMoveObject?.(
      dragState.id,
      point.x + dragState.offsetXMeters,
      point.y + dragState.offsetYMeters,
    )
  }
  const endDrag = () => setDragState(null)

  return (
    <svg
      ref={svgRef}
      className="road-preview"
      viewBox="0 0 1000 600"
      role="img"
      aria-labelledby="road-preview-title road-preview-description"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onPointerDown={() => onSelectObject?.(null)}
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
          {geometry.medianSections.map((medianSection) => (
            <RoadRect
              key={medianSection.id}
              rect={medianSection}
              className={medianClassName(parameters.medianType)}
              roadTop={roadTop}
              px={px}
            />
          ))}
          {geometry.medianOpening && (
            <>
              <RoadRect
                rect={geometry.medianOpening}
                className="road-surface"
                roadTop={roadTop}
                px={px}
              />
              <rect
                data-testid="uturn-median-opening"
                className="uturn-opening-outline"
                x={ROAD_X + px(geometry.medianOpening.x)}
                y={toSvgY(geometry.medianOpening.y)}
                width={px(geometry.medianOpening.width)}
                height={px(geometry.medianOpening.height)}
              />
            </>
          )}
          {geometry.uTurnPocket && (
            <g data-testid="uturn-pocket" data-direction={geometry.uTurnPocket.direction}>
              <RoadPolygon
                polygon={geometry.uTurnPocket.taper}
                className="uturn-pocket-surface"
                roadTop={roadTop}
                px={px}
              />
              <RoadRect
                rect={geometry.uTurnPocket.storage}
                className="uturn-pocket-surface"
                roadTop={roadTop}
                px={px}
              />
              {geometry.uTurnPocket.boundaryLines.map((line, index) => (
                <line
                  key={`uturn-pocket-boundary-${index}`}
                  className="uturn-pocket-line"
                  x1={ROAD_X + px(line.x1)}
                  y1={toSvgY(line.y1)}
                  x2={ROAD_X + px(line.x2)}
                  y2={toSvgY(line.y2)}
                />
              ))}
            </g>
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
          {viewOptions.showPavementMarkings &&
            visibleMarkings
              .map((marking) => (
                <PavementMarking
                  key={marking.id}
                  marking={marking}
                  roadTop={roadTop}
                  px={px}
                  selected={marking.id === selectedObjectId}
                  onPointerDown={startDrag(marking)}
                />
              ))}

          {showFeatureLabels && geometry.medianOpening && (
            <g className="uturn-opening-label" data-testid="uturn-opening-label">
              <rect
                x={ROAD_X + px(geometry.medianOpening.x + geometry.medianOpening.width / 2) - 49}
                y={toSvgY(geometry.medianOpening.y) - 29}
                width="98"
                height="20"
                rx="5"
              />
              <text
                x={ROAD_X + px(geometry.medianOpening.x + geometry.medianOpening.width / 2)}
                y={toSvgY(geometry.medianOpening.y) - 15}
                textAnchor="middle"
              >
                U-turn opening
              </text>
            </g>
          )}

          {showLaneLabels && (
            <g className="lane-position-label">
              {geometry.lanes
                .filter((lane) => lane.positionLabel)
                .map((lane) => (
                  <text key={`${lane.id}-label`} x={ROAD_X + 14} y={toSvgY(lane.centerY) + 3}>
                    {lane.positionLabel}
                  </text>
                ))}
            </g>
          )}
        </g>
      )}

      {showFeatureLabels && showEastboundLabel && (
        <g className="road-label" data-testid="eastbound-carriageway-label">
          <rect x={ROAD_X} y={Math.max(48, roadTop - 42)} width="176" height="28" rx="14" />
          <text x={ROAD_X + 88} y={Math.max(67, roadTop - 23)} textAnchor="middle">
            Eastbound carriageway
          </text>
        </g>
      )}
      {showFeatureLabels && showWestboundLabel && (
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

      {showFeatureLabels && (
        <g className="north-indicator" transform="translate(920 70)">
          <path d="M0 22V-8" />
          <path d="m-6 0 6-10L6 0" />
          <text x="0" y="-19" textAnchor="middle">
            N
          </text>
        </g>
      )}

      {showFeatureLabels && geometry.operationMode !== 'noLanes' && (
        <g className="road-dimension-note">
          <rect x={roadEndX - 178} y={roadTop - 39} width="178" height="24" rx="5" />
          <text x={roadEndX - 89} y={roadTop - 23} textAnchor="middle">
            Approx. width {geometry.totalWidthMeters.toFixed(1)} m
          </text>
        </g>
      )}

      {showFeatureLabels && (
        <g className="traffic-note">
          <rect x="105" y="535" width="790" height="38" rx="7" />
          <text x="500" y="559" textAnchor="middle">
            {trafficNote(geometry.operationMode)}
          </text>
        </g>
      )}
    </svg>
  )
}
