import { describe, expect, it } from 'vitest'
import { StraightRoadPreview } from '../components/StraightRoadPreview'
import {
  createDefaultProjectDocument,
  deleteSelectedCanvasObject,
  duplicateSelectedManualObject,
  moveSelectedCanvasObjectZ,
  parseProjectDocumentJson,
  placeManualMarking,
  selectCanvasObject,
  serializeProjectDocument,
  updateCanvasObject,
  updateCanvasObjectPosition,
  updateParametricRoad,
} from '../domain/projectDocument'
import { buildStandaloneSvgText } from '../export/projectExport'
import { phase1DrawingSettings } from '../domain/straightRoad'
import { renderToStaticMarkup } from 'react-dom/server'

describe('Phase 2D project document canvas objects', () => {
  it('selects existing canvas objects and clears missing selections', () => {
    const document = createDefaultProjectDocument()
    const firstObject = document.canvasObjects[0]

    const selected = selectCanvasObject(document, firstObject.id)
    const cleared = selectCanvasObject(selected, 'missing-object')

    expect(selected.selectedObjectId).toBe(firstObject.id)
    expect(cleared.selectedObjectId).toBeNull()
  })

  it('updates object position on drag without changing road parameters', () => {
    const document = createDefaultProjectDocument()
    const object = document.canvasObjects[0]
    const moved = updateCanvasObjectPosition(document, object.id, object.x + 2, object.y + 1)

    expect(moved.canvasObjects.find((candidate) => candidate.id === object.id)).toMatchObject({
      x: object.x + 2,
      y: object.y + 1,
    })
    expect(moved.parametricRoad).toEqual(document.parametricRoad)
  })

  it('places a manual through-arrow marking from the palette model action', () => {
    const document = placeManualMarking(createDefaultProjectDocument(), 'through-arrow')
    const manual = document.canvasObjects.find((object) => object.source === 'manual')

    expect(manual).toMatchObject({
      id: 'manual-through-arrow-1',
      type: 'through-arrow',
      layer: 'marking',
      source: 'manual',
      visible: true,
      locked: false,
      sourceStatus: 'CUSTOM_CONCEPT',
    })
    expect(document.selectedObjectId).toBe('manual-through-arrow-1')
  })

  it('deletes selected objects and keeps generated deletions through road sync', () => {
    const document = createDefaultProjectDocument()
    const object = document.canvasObjects[0]
    const deleted = deleteSelectedCanvasObject(selectCanvasObject(document, object.id))
    const synced = updateParametricRoad(deleted, { laneWidthMeters: 3.25 })

    expect(deleted.selectedObjectId).toBeNull()
    expect(deleted.canvasObjects.some((candidate) => candidate.id === object.id)).toBe(false)
    expect(deleted.deletedGeneratedObjectIds).toContain(object.id)
    expect(synced.canvasObjects.some((candidate) => candidate.id === object.id)).toBe(false)
  })

  it('duplicates only selected manual objects', () => {
    const withManual = placeManualMarking(createDefaultProjectDocument(), 'through-arrow')
    const duplicated = duplicateSelectedManualObject(withManual)
    const manualObjects = duplicated.canvasObjects.filter((object) => object.source === 'manual')
    const ignoredGenerated = duplicateSelectedManualObject(
      selectCanvasObject(createDefaultProjectDocument(), 'eastbound-lane-1-arrow'),
    )

    expect(manualObjects).toHaveLength(2)
    expect(manualObjects[1]).toMatchObject({
      id: 'manual-through-arrow-2',
      x: manualObjects[0].x + 1,
      y: manualObjects[0].y + 1,
    })
    expect(duplicated.selectedObjectId).toBe('manual-through-arrow-2')
    expect(ignoredGenerated.canvasObjects.filter((object) => object.source === 'manual')).toHaveLength(0)
  })

  it('brings selected objects forward and sends them backward by swapping z-index', () => {
    const document = createDefaultProjectDocument()
    const [first, second] = document.canvasObjects
    const forward = moveSelectedCanvasObjectZ(selectCanvasObject(document, first.id), 'forward')
    const backward = moveSelectedCanvasObjectZ(selectCanvasObject(forward, first.id), 'backward')

    expect(forward.canvasObjects.find((object) => object.id === first.id)?.zIndex).toBe(second.zIndex)
    expect(forward.canvasObjects.find((object) => object.id === second.id)?.zIndex).toBe(first.zIndex)
    expect(backward.canvasObjects.find((object) => object.id === first.id)?.zIndex).toBe(first.zIndex)
  })

  it('keeps hidden objects out of SVG and locked objects fixed during drag updates', () => {
    const document = createDefaultProjectDocument()
    const object = document.canvasObjects[0]
    const locked = updateCanvasObject(document, object.id, { locked: true, visible: false })
    const moved = updateCanvasObjectPosition(locked, object.id, object.x + 10, object.y + 10)
    const markup = renderToStaticMarkup(
      <StraightRoadPreview
        parameters={locked.parametricRoad}
        settings={phase1DrawingSettings}
        viewOptions={locked.viewOptions}
        canvasObjects={locked.canvasObjects}
      />,
    )

    expect(moved.canvasObjects.find((candidate) => candidate.id === object.id)).toMatchObject({
      x: object.x,
      y: object.y,
      locked: true,
    })
    expect(markup).not.toContain(`data-testid="${object.id}"`)
  })

  it('keeps generated markings in the document after road parameter changes', () => {
    const document = createDefaultProjectDocument()
    const updated = updateParametricRoad(document, { eastboundLaneCount: 1 })

    expect(updated.canvasObjects.some((object) => object.id === 'eastbound-lane-1-arrow')).toBe(
      true,
    )
    expect(updated.canvasObjects.some((object) => object.id === 'eastbound-lane-2-arrow')).toBe(
      false,
    )
  })

  it('serializes and sanitizes project JSON without trusting bad values', () => {
    const document = updateCanvasObject(
      placeManualMarking(createDefaultProjectDocument(), 'through-arrow'),
      'manual-through-arrow-1',
      { locked: true, visible: false },
    )
    const parsed = parseProjectDocumentJson(serializeProjectDocument(document))
    const sanitized = parseProjectDocumentJson(
      JSON.stringify({
        parametricRoad: { eastboundLaneCount: 'bad', medianType: 'bogus' },
        viewOptions: { showLabels: false, showPavementMarkings: 'yes' },
        canvasObjects: [
          {
            id: 'manual-loaded',
            source: 'manual',
            type: 'bad',
            x: Number.POSITIVE_INFINITY,
            y: 4,
          },
        ],
        selectedObjectId: 'missing',
      }),
    )
    const invalid = parseProjectDocumentJson('{')

    expect(parsed.canvasObjects.some((object) => object.id === 'manual-through-arrow-1')).toBe(true)
    expect(parsed.canvasObjects.find((object) => object.id === 'manual-through-arrow-1')).toMatchObject({
      locked: true,
      visible: false,
    })
    expect(sanitized.parametricRoad.eastboundLaneCount).toBe(2)
    expect(sanitized.parametricRoad.medianType).toBe('raised')
    expect(sanitized.viewOptions.showLabels).toBe(false)
    expect(sanitized.viewOptions.showPavementMarkings).toBe(true)
    expect(sanitized.selectedObjectId).toBeNull()
    expect(invalid.canvasObjects.length).toBeGreaterThan(0)
  })

  it('builds standalone SVG export text with namespace and embedded CSS', () => {
    const svg = buildStandaloneSvgText('<svg viewBox="0 0 1 1"><rect /></svg>', '.road{fill:red}')

    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('width="1000"')
    expect(svg).toContain('<style>.road{fill:red}</style>')
    expect(svg.endsWith('\n')).toBe(true)
  })
})
