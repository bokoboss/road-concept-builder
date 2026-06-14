type ValidationItemProps = {
  severity: 'warning' | 'info'
  rule: string
  children: React.ReactNode
}

function ValidationItem({ severity, rule, children }: ValidationItemProps) {
  return (
    <div className={`validation-item ${severity}`}>
      <span className="validation-symbol" aria-hidden="true">
        {severity === 'warning' ? '!' : 'i'}
      </span>
      <div>
        <span className="validation-rule">{rule}</span>
        <p>{children}</p>
      </div>
    </div>
  )
}

export function ValidationPanel() {
  return (
    <section className="validation-panel">
      <div className="section-heading">
        <h2>Validation</h2>
        <span className="issue-count">2 issues</span>
      </div>
      <ValidationItem severity="warning" rule="MRK-006">
        Transverse warning bars use a project assumption and require verification.
      </ValidationItem>
      <ValidationItem severity="info" rule="GEN-001">
        Concept geometry should not be treated as a construction drawing.
      </ValidationItem>
    </section>
  )
}
