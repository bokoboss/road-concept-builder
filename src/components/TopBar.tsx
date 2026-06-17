import { type ChangeEvent, useRef } from 'react'

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" rx="7" fill="currentColor" />
      <path d="M10 23 14.5 9h3L22 23" fill="none" stroke="white" strokeWidth="2.2" />
      <path d="M16 11v3.2M16 17v4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function TopBar({
  issueCount,
  onSaveProjectJson,
  onLoadProjectJson,
  onExportSvg,
}: {
  issueCount: number
  onSaveProjectJson?: () => void
  onLoadProjectJson?: (json: string) => void
  onExportSvg?: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    onLoadProjectJson?.(await file.text())
    event.target.value = ''
  }

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
        <button type="button" onClick={onSaveProjectJson}>
          Save JSON
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Load JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleFileChange}
        />
        <button type="button" className="validate-button" disabled>
          Validate
          <span className="button-count">{issueCount}</span>
        </button>
        <button type="button" className="primary-button" onClick={onExportSvg}>
          Export SVG
        </button>
      </div>
    </header>
  )
}
