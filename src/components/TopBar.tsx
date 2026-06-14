function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" rx="7" fill="currentColor" />
      <path d="M10 23 14.5 9h3L22 23" fill="none" stroke="white" strokeWidth="2.2" />
      <path d="M16 11v3.2M16 17v4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="brand">
        <span className="brand-mark">
          <BrandMark />
        </span>
        <div>
          <strong>Road Concept Builder</strong>
          <span>Untitled Road Concept</span>
        </div>
      </div>

      <div className="top-actions" aria-label="Project actions">
        <div className="action-group">
          <button type="button" disabled aria-label="Undo placeholder">
            Undo
          </button>
          <button type="button" disabled aria-label="Redo placeholder">
            Redo
          </button>
        </div>
        <button type="button" className="validate-button" disabled>
          Validate
          <span className="button-count">2</span>
        </button>
        <button type="button" className="primary-button" disabled>
          Export SVG
        </button>
      </div>
    </header>
  )
}
