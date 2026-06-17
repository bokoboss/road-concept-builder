import { useMemo, useState } from 'react'
import { LeftPalette } from '../components/LeftPalette'
import { RightInspector } from '../components/RightInspector'
import { StraightRoadPreview } from '../components/StraightRoadPreview'
import { TopBar } from '../components/TopBar'
import {
  phase1DrawingSettings,
} from '../domain/straightRoad'
import {
  createDefaultProjectDocument,
  placeManualMarking,
  selectCanvasObject,
  updateCanvasObjectPosition,
} from '../domain/projectDocument'
import { validateStraightRoad } from '../validation/validateStraightRoad'

export function App() {
  const [document, setDocument] = useState(createDefaultProjectDocument)
  const issues = useMemo(
    () => validateStraightRoad(document.parametricRoad, phase1DrawingSettings),
    [document.parametricRoad],
  )

  return (
    <div className="app-shell">
      <TopBar issueCount={issues.length} />
      <main className="workspace">
        <LeftPalette
          onAddManualThroughArrow={() =>
            setDocument((current) => placeManualMarking(current, 'through-arrow'))
          }
        />
        <section className="canvas-panel" aria-label="Parametric road concept preview">
          <div className="canvas-heading">
            <div>
              <span className="eyebrow">Edit mode</span>
              <h1>Straight road concept</h1>
            </div>
            <div className="canvas-meta" aria-label="Drawing context">
              <span>Thailand</span>
              <span>Left-hand traffic</span>
              <span>Concept scale</span>
            </div>
          </div>

          <div className="canvas-stage">
            <StraightRoadPreview
              parameters={document.parametricRoad}
              settings={phase1DrawingSettings}
              viewOptions={document.viewOptions}
              canvasObjects={document.canvasObjects}
              selectedObjectId={document.selectedObjectId}
              onSelectObject={(id) => setDocument((current) => selectCanvasObject(current, id))}
              onMoveObject={(id, x, y) =>
                setDocument((current) => updateCanvasObjectPosition(current, id, x, y))
              }
            />
          </div>

          <div className="canvas-footer">
            <span>Live Phase 2 preview</span>
            <span>SVG canvas - approximate scale</span>
          </div>
        </section>
        <RightInspector
          document={document}
          issues={issues}
          onDocumentChange={setDocument}
        />
      </main>
    </div>
  )
}
