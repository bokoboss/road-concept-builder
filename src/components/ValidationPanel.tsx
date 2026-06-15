import type { ValidationIssue } from '../validation/validateStraightRoad'

function ValidationItem({ issue }: { issue: ValidationIssue }) {
  return (
    <div className={`validation-item ${issue.severity}`}>
      <span className="validation-symbol" aria-hidden="true">
        {issue.severity === 'warning' ? '!' : 'i'}
      </span>
      <div>
        <span className="validation-rule">{issue.ruleId}</span>
        <p>{issue.message}</p>
      </div>
    </div>
  )
}

export function ValidationPanel({ issues }: { issues: ValidationIssue[] }) {
  return (
    <section className="validation-panel">
      <div className="section-heading">
        <h2>Validation</h2>
        <span className="issue-count">
          {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
        </span>
      </div>
      {issues.map((issue) => (
        <ValidationItem key={issue.id} issue={issue} />
      ))}
    </section>
  )
}
