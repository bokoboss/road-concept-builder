import { useMemo, useState } from 'react'
import { LeftPalette } from '../components/LeftPalette'
import { RightInspector } from '../components/RightInspector'
import { StraightRoadPreview } from '../components/StraightRoadPreview'
import { TopBar } from '../components/TopBar'
import { defaultStraightRoadParameters, phase1DrawingSettings } from '../domain/straightRoad'
import { validateStraightRoad } from '../validation/validateStraightRoad'

export function App() {
  const [parameters, setParameters] = useState(defaultStraightRoadParameters)
  const issues = useMemo(
    () => validateStraightRoad(parameters, phase1DrawingSettings),
    [parameters],
  )

  return (
    <div className="app-shell">
      <TopBar issueCount={issues.length} />
      <main className="workspace">
        <LeftPalette />
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
            <StraightRoadPreview parameters={parameters} settings={phase1DrawingSettings} />
          </div>

          <div className="canvas-footer">
            <span>Live Phase 1 preview</span>
            <span>SVG canvas · approximate scale</span>
          </div>
        </section>
        <RightInspector parameters={parameters} issues={issues} onChange={setParameters} />
      </main>
    </div>
  )
}
