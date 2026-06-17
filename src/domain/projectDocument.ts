import {
  defaultDrawingViewOptions,
  defaultStraightRoadParameters,
  phase1DrawingSettings,
  type DrawingViewOptions,
  type PavementMarkingType,
  type Phase1DrawingSettings,
  type SourceStatus,
  type StraightRoadParameters,
  type UTurnDirection,
} from './straightRoad'
import { buildStraightRoadGeometry, type RoadDirection } from '../geometry/straightRoadGeometry'

export type CanvasObjectSource = 'generated' | 'manual'
export type CanvasObjectLayer = 'marking' | 'label' | 'symbol'

export type CanvasObjectBase = {
  id: string
  type: string
  source: CanvasObjectSource
  layer: CanvasObjectLayer
  x: number
  y: number
  rotationDeg: number
  scale: number
  visible: boolean
  locked: boolean
  zIndex: number
}

export type MarkingCanvasObject = CanvasObjectBase & {
  layer: 'marking'
  type: PavementMarkingType
  sourceStatus: SourceStatus
  direction?: RoadDirection | UTurnDirection
  targetY?: number
}

export type CanvasObject = MarkingCanvasObject

export type ProjectDocument = {
  parametricRoad: StraightRoadParameters
  canvasObjects: CanvasObject[]
  viewOptions: DrawingViewOptions
  selectedObjectId: string | null
  deletedGeneratedObjectIds: string[]
}

function generatedMarkingObjects(
  parameters: StraightRoadParameters,
  settings: Phase1DrawingSettings,
): CanvasObject[] {
  return buildStraightRoadGeometry({ ...parameters, markingAdjustments: {} }, settings)
    .pavementMarkings.map((marking, index) => ({
      id: marking.id,
      type: marking.type,
      source: 'generated',
      layer: 'marking',
      x: marking.x,
      y: marking.y,
      rotationDeg: marking.rotationDeg,
      scale: marking.scale,
      visible: marking.visible,
      locked: false,
      zIndex: index,
      sourceStatus: marking.sourceStatus,
      direction: marking.direction,
      targetY: marking.targetY,
    }))
}

function nextManualObjectId(objects: CanvasObject[]) {
  const existingIds = new Set(objects.map((object) => object.id))
  let index = 1

  while (existingIds.has(`manual-through-arrow-${index}`)) index += 1

  return `manual-through-arrow-${index}`
}

function highestZIndex(objects: CanvasObject[]) {
  return objects.reduce((highest, object) => Math.max(highest, object.zIndex), 0)
}

export function syncGeneratedCanvasObjects(
  document: ProjectDocument,
  settings: Phase1DrawingSettings = phase1DrawingSettings,
): ProjectDocument {
  const existingById = new Map(document.canvasObjects.map((object) => [object.id, object]))
  const deletedGeneratedObjectIds = document.deletedGeneratedObjectIds ?? []
  const deletedGeneratedIds = new Set(deletedGeneratedObjectIds)
  const manualObjects = document.canvasObjects.filter((object) => object.source === 'manual')
  const generatedObjects = generatedMarkingObjects(document.parametricRoad, settings).map(
    (object) => {
      const existing = existingById.get(object.id)
      if (!existing || existing.source !== 'generated') return object

      return {
        ...object,
        visible: existing.visible,
        locked: existing.locked,
        scale: existing.scale,
        zIndex: existing.zIndex,
      }
    },
  ).filter((object) => !deletedGeneratedIds.has(object.id))
  const canvasObjects = [...generatedObjects, ...manualObjects].sort(
    (left, right) => left.zIndex - right.zIndex,
  )
  const selectedObjectId = canvasObjects.some((object) => object.id === document.selectedObjectId)
    ? document.selectedObjectId
    : null

  return { ...document, canvasObjects, selectedObjectId, deletedGeneratedObjectIds }
}

export function createDefaultProjectDocument(): ProjectDocument {
  const document = syncGeneratedCanvasObjects({
    parametricRoad: defaultStraightRoadParameters,
    canvasObjects: [],
    viewOptions: defaultDrawingViewOptions,
    selectedObjectId: null,
    deletedGeneratedObjectIds: [],
  })

  return {
    ...document,
    selectedObjectId: document.canvasObjects[0]?.id ?? null,
  }
}

export function updateParametricRoad(
  document: ProjectDocument,
  values: Partial<StraightRoadParameters>,
): ProjectDocument {
  return syncGeneratedCanvasObjects({
    ...document,
    parametricRoad: { ...document.parametricRoad, ...values },
  })
}

export function selectCanvasObject(
  document: ProjectDocument,
  selectedObjectId: string | null,
): ProjectDocument {
  return {
    ...document,
    selectedObjectId: document.canvasObjects.some((object) => object.id === selectedObjectId)
      ? selectedObjectId
      : null,
  }
}

export function updateCanvasObject(
  document: ProjectDocument,
  id: string,
  values: Partial<Omit<CanvasObject, 'id' | 'source' | 'type' | 'layer'>>,
): ProjectDocument {
  return {
    ...document,
    canvasObjects: document.canvasObjects.map((object) =>
      object.id === id ? { ...object, ...values } : object,
    ),
  }
}

export function deleteSelectedCanvasObject(document: ProjectDocument): ProjectDocument {
  const selected = document.canvasObjects.find((object) => object.id === document.selectedObjectId)
  if (!selected) return document

  return {
    ...document,
    canvasObjects: document.canvasObjects.filter((object) => object.id !== selected.id),
    selectedObjectId: null,
    deletedGeneratedObjectIds:
      selected.source === 'generated'
        ? [...new Set([...document.deletedGeneratedObjectIds, selected.id])]
        : document.deletedGeneratedObjectIds,
  }
}

export function duplicateSelectedManualObject(document: ProjectDocument): ProjectDocument {
  const selected = document.canvasObjects.find(
    (object) => object.id === document.selectedObjectId && object.source === 'manual',
  )
  if (!selected) return document

  const copy: CanvasObject = {
    ...selected,
    id: nextManualObjectId(document.canvasObjects),
    x: selected.x + 1,
    y: selected.y + 1,
    zIndex: highestZIndex(document.canvasObjects) + 1,
  }

  return {
    ...document,
    canvasObjects: [...document.canvasObjects, copy],
    selectedObjectId: copy.id,
  }
}

export function moveSelectedCanvasObjectZ(
  document: ProjectDocument,
  direction: 'forward' | 'backward',
): ProjectDocument {
  const sorted = [...document.canvasObjects].sort((left, right) => left.zIndex - right.zIndex)
  const selectedIndex = sorted.findIndex((object) => object.id === document.selectedObjectId)
  const targetIndex = direction === 'forward' ? selectedIndex + 1 : selectedIndex - 1
  const selected = sorted[selectedIndex]
  const target = sorted[targetIndex]
  if (!selected || !target) return document

  return {
    ...document,
    canvasObjects: document.canvasObjects
      .map((object) => {
        if (object.id === selected.id) return { ...object, zIndex: target.zIndex }
        if (object.id === target.id) return { ...object, zIndex: selected.zIndex }
        return object
      })
      .sort((left, right) => left.zIndex - right.zIndex),
  }
}

export function updateCanvasObjectPosition(
  document: ProjectDocument,
  id: string,
  x: number,
  y: number,
): ProjectDocument {
  const object = document.canvasObjects.find((candidate) => candidate.id === id)
  if (!object || object.locked) return document
  const deltaY = y - object.y

  return updateCanvasObject(document, id, {
    x,
    y,
    targetY: object.targetY === undefined ? undefined : object.targetY + deltaY,
  })
}

export function placeManualMarking(
  document: ProjectDocument,
  type: PavementMarkingType = 'through-arrow',
): ProjectDocument {
  const geometry = buildStraightRoadGeometry(document.parametricRoad, phase1DrawingSettings)
  const object: CanvasObject = {
    id: nextManualObjectId(document.canvasObjects),
    type,
    source: 'manual',
    layer: 'marking',
    x: geometry.lengthMeters / 2,
    y: geometry.totalWidthMeters / 2,
    rotationDeg: 90,
    scale: 1,
    visible: true,
    locked: false,
    zIndex: highestZIndex(document.canvasObjects) + 1,
    sourceStatus: 'CUSTOM_CONCEPT',
  }

  return {
    ...document,
    canvasObjects: [...document.canvasObjects, object],
    selectedObjectId: object.id,
  }
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function booleanOr(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function stringFrom<T extends string>(value: unknown, allowed: readonly T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback
}

function sanitizeRoadParameters(value: unknown): StraightRoadParameters {
  const input = asObject(value) ?? {}
  const defaults = defaultStraightRoadParameters
  const uTurnInput = asObject(input.uTurn) ?? {}
  const pocketInput = asObject(uTurnInput.pocket) ?? {}

  return {
    eastboundLaneCount: numberOr(input.eastboundLaneCount, defaults.eastboundLaneCount),
    westboundLaneCount: numberOr(input.westboundLaneCount, defaults.westboundLaneCount),
    laneWidthMeters: numberOr(input.laneWidthMeters, defaults.laneWidthMeters),
    shoulderWidthMeters: numberOr(input.shoulderWidthMeters, defaults.shoulderWidthMeters),
    medianType: stringFrom(input.medianType, ['none', 'painted', 'raised'], defaults.medianType),
    medianWidthMeters: numberOr(input.medianWidthMeters, defaults.medianWidthMeters),
    showLaneArrows: booleanOr(input.showLaneArrows, defaults.showLaneArrows),
    markingAdjustments: {},
    uTurn: {
      enabled: booleanOr(uTurnInput.enabled, defaults.uTurn.enabled),
      direction: stringFrom(
        uTurnInput.direction,
        ['eastbound-to-westbound', 'westbound-to-eastbound'],
        defaults.uTurn.direction,
      ),
      positionMeters: numberOr(uTurnInput.positionMeters, defaults.uTurn.positionMeters),
      openingWidthMeters: numberOr(
        uTurnInput.openingWidthMeters,
        defaults.uTurn.openingWidthMeters,
      ),
      showArrow: booleanOr(uTurnInput.showArrow, defaults.uTurn.showArrow),
      pocket: {
        enabled: booleanOr(pocketInput.enabled, defaults.uTurn.pocket.enabled),
        storageLengthMeters: numberOr(
          pocketInput.storageLengthMeters,
          defaults.uTurn.pocket.storageLengthMeters,
        ),
        taperLengthMeters: numberOr(
          pocketInput.taperLengthMeters,
          defaults.uTurn.pocket.taperLengthMeters,
        ),
        showArrow: booleanOr(pocketInput.showArrow, defaults.uTurn.pocket.showArrow),
      },
    },
  }
}

function sanitizeCanvasObject(value: unknown, usedIds: Set<string>): CanvasObject | null {
  const input = asObject(value)
  if (!input || typeof input.id !== 'string' || usedIds.has(input.id)) return null

  const type = stringFrom(
    input.type,
    ['through-arrow', 'u-turn-arrow', 'pocket-u-turn-arrow'],
    'through-arrow',
  )
  const source = stringFrom(input.source, ['generated', 'manual'], 'manual')
  const direction =
    input.direction === 'eastbound' ||
    input.direction === 'westbound' ||
    input.direction === 'eastbound-to-westbound' ||
    input.direction === 'westbound-to-eastbound'
      ? input.direction
      : undefined

  usedIds.add(input.id)

  return {
    id: input.id,
    type,
    source,
    layer: 'marking',
    x: numberOr(input.x, 0),
    y: numberOr(input.y, 0),
    rotationDeg: numberOr(input.rotationDeg, 0),
    scale: Math.max(0.1, numberOr(input.scale, 1)),
    visible: booleanOr(input.visible, true),
    locked: booleanOr(input.locked, false),
    zIndex: numberOr(input.zIndex, 0),
    sourceStatus: stringFrom(
      input.sourceStatus,
      [
        'THAI_AUTHORITY',
        'AGENCY_MANUAL',
        'INTERNATIONAL_BEST_PRACTICE',
        'PROJECT_ASSUMPTION',
        'CUSTOM_CONCEPT',
        'TODO_VERIFY',
      ],
      source === 'generated' ? 'PROJECT_ASSUMPTION' : 'CUSTOM_CONCEPT',
    ),
    direction,
    targetY: typeof input.targetY === 'number' && Number.isFinite(input.targetY)
      ? input.targetY
      : undefined,
  }
}

export function sanitizeProjectDocument(value: unknown): ProjectDocument {
  const input = asObject(value) ?? {}
  const usedIds = new Set<string>()
  const canvasObjects = Array.isArray(input.canvasObjects)
    ? input.canvasObjects.flatMap((object) => {
        const sanitized = sanitizeCanvasObject(object, usedIds)
        return sanitized ? [sanitized] : []
      })
    : []
  const viewInput = asObject(input.viewOptions) ?? {}
  const defaults = defaultDrawingViewOptions
  const deletedGeneratedObjectIds = Array.isArray(input.deletedGeneratedObjectIds)
    ? input.deletedGeneratedObjectIds.filter((id): id is string => typeof id === 'string')
    : []
  const document = syncGeneratedCanvasObjects({
    parametricRoad: sanitizeRoadParameters(input.parametricRoad),
    canvasObjects,
    viewOptions: {
      showLabels: booleanOr(viewInput.showLabels, defaults.showLabels),
      showLaneLabels: booleanOr(viewInput.showLaneLabels, defaults.showLaneLabels),
      showFeatureLabels: booleanOr(viewInput.showFeatureLabels, defaults.showFeatureLabels),
      showPavementMarkings: booleanOr(
        viewInput.showPavementMarkings,
        defaults.showPavementMarkings,
      ),
    },
    selectedObjectId: typeof input.selectedObjectId === 'string' ? input.selectedObjectId : null,
    deletedGeneratedObjectIds,
  })

  return selectCanvasObject(document, document.selectedObjectId)
}

export function serializeProjectDocument(document: ProjectDocument): string {
  return `${JSON.stringify(document, null, 2)}\n`
}

export function parseProjectDocumentJson(text: string): ProjectDocument {
  try {
    return sanitizeProjectDocument(JSON.parse(text))
  } catch {
    return createDefaultProjectDocument()
  }
}
