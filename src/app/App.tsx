import { LeftPalette } from '../components/LeftPalette'
import { RightInspector } from '../components/RightInspector'
import { StaticRoadPreview } from '../components/StaticRoadPreview'
import { TopBar } from '../components/TopBar'

export function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="workspace">
        <LeftPalette />
        <section className="canvas-panel" aria-label="Static road concept preview">
          <div className="canvas-heading">
            <div>
              <span className="eyebrow">Edit mode</span>
              <h1>Divided road concept</h1>
            </div>
            <div className="canvas-meta" aria-label="Drawing context">
              <span>Thailand</span>
              <span>Left-hand traffic</span>
              <span>Concept scale</span>
            </div>
          </div>

          <div className="canvas-stage">
            <StaticRoadPreview />
          </div>

          <div className="canvas-footer">
            <span>Static Phase 0 preview</span>
            <span>SVG canvas · 100%</span>
          </div>
        </section>
        <RightInspector />
      </main>
    </div>
  )
}
