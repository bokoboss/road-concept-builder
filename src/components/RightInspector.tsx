import { ValidationPanel } from './ValidationPanel'

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="inspector-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function RightInspector() {
  return (
    <aside className="right-panel">
      <section className="inspector-panel">
        <div className="panel-intro">
          <span className="eyebrow">Selected marking</span>
          <h2>Transverse warning bars</h2>
          <p>Static inspector preview for a road-segment marking.</p>
        </div>

        <div className="status-card">
          <span>Source status</span>
          <strong>PROJECT_ASSUMPTION</strong>
          <p>Verify dimensions against the applicable project or agency guidance.</p>
        </div>

        <div className="inspector-group">
          <h3>Placement</h3>
          <InspectorRow label="Target" value="Westbound lanes" />
          <InspectorRow label="Bar count" value="4" />
          <InspectorRow label="Spacing" value="Concept" />
          <InspectorRow label="Rotation" value="Auto" />
        </div>

        <div className="inspector-group">
          <h3>Appearance</h3>
          <InspectorRow label="Profile" value="Thailand concept" />
          <InspectorRow label="Color" value="White" />
        </div>
      </section>
      <ValidationPanel />
    </aside>
  )
}
