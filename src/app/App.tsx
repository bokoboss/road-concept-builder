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
  parseProjectDocumentJson,
  placeManualMarking,
  selectCanvasObject,
  serializeProjectDocument,
  updateCanvasObjectPosition,
} from '../domain/projectDocument'
import { downloadTextFile, serializeSvgElement } from '../export/projectExport'
import { validateStraightRoad } from '../validation/validateStraightRoad'

export function App() {
  const [projectDocument, setProjectDocument] = useState(createDefaultProjectDocument)
  const issues = useMemo(
    () => validateStraightRoad(projectDocument.parametricRoad, phase1DrawingSettings),
    [projectDocument.parametricRoad],
  )
  const exportSvg = () => {
    const svg = window.document.querySelector<SVGSVGElement>('.road-preview')
    if (!svg) return
    downloadTextFile('road-concept.svg', serializeSvgElement(svg), 'image/svg+xml')
  }

  return (
    <div className="app-shell">
      <TopBar
        issueCount={issues.length}
        onSaveProjectJson={() =>
          downloadTextFile(
            'road-concept-project.json',
            serializeProjectDocument(projectDocument),
            'application/json',
          )
        }
        onLoadProjectJson={(json) => setProjectDocument(parseProjectDocumentJson(json))}
        onExportSvg={exportSvg}
      />
      <main className="workspace">
        <LeftPalette
          onAddManualThroughArrow={() =>
            setProjectDocument((current) => placeManualMarking(current, 'through-arrow'))
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
              parameters={projectDocument.parametricRoad}
              settings={phase1DrawingSettings}
              viewOptions={projectDocument.viewOptions}
              canvasObjects={projectDocument.canvasObjects}
              selectedObjectId={projectDocument.selectedObjectId}
              onSelectObject={(id) =>
                setProjectDocument((current) => selectCanvasObject(current, id))
              }
              onMoveObject={(id, x, y) =>
                setProjectDocument((current) => updateCanvasObjectPosition(current, id, x, y))
              }
            />
          </div>

          <div className="canvas-footer">
            <span>Live Phase 2 preview</span>
            <span>SVG canvas - approximate scale</span>
          </div>
        </section>
        <RightInspector
          document={projectDocument}
          issues={issues}
          onDocumentChange={setProjectDocument}
        />
      </main>
    </div>
  )
}
