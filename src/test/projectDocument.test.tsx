import { describe, expect, it } from 'vitest'
import { StraightRoadPreview } from '../components/StraightRoadPreview'
import {
  createDefaultProjectDocument,
  placeManualMarking,
  selectCanvasObject,
  updateCanvasObject,
  updateCanvasObjectPosition,
  updateParametricRoad,
} from '../domain/projectDocument'
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
})
