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
  const count = objects.filter((object) => object.source === 'manual').length + 1
  return `manual-through-arrow-${count}`
}

function highestZIndex(objects: CanvasObject[]) {
  return objects.reduce((highest, object) => Math.max(highest, object.zIndex), 0)
}

export function syncGeneratedCanvasObjects(
  document: ProjectDocument,
  settings: Phase1DrawingSettings = phase1DrawingSettings,
): ProjectDocument {
  const existingById = new Map(document.canvasObjects.map((object) => [object.id, object]))
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
  )
  const canvasObjects = [...generatedObjects, ...manualObjects].sort(
    (left, right) => left.zIndex - right.zIndex,
  )
  const selectedObjectId = canvasObjects.some((object) => object.id === document.selectedObjectId)
    ? document.selectedObjectId
    : null

  return { ...document, canvasObjects, selectedObjectId }
}

export function createDefaultProjectDocument(): ProjectDocument {
  const document = syncGeneratedCanvasObjects({
    parametricRoad: defaultStraightRoadParameters,
    canvasObjects: [],
    viewOptions: defaultDrawingViewOptions,
    selectedObjectId: null,
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
