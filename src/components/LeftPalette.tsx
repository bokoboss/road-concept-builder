type PaletteItemProps = {
  icon: string
  title: string
  detail: string
  selected?: boolean
  onActivate?: () => void
}

function PaletteItem({ icon, title, detail, selected = false, onActivate }: PaletteItemProps) {
  const className = `palette-item${selected ? ' is-selected' : ''}`
  const content = (
    <>
      <span className="palette-icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
    </>
  )

  if (onActivate) {
    return (
      <button className={className} type="button" onClick={onActivate}>
        {content}
      </button>
    )
  }

  return (
    <div className={className}>
      {content}
    </div>
  )
}

function PaletteSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="palette-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <span aria-hidden="true">+</span>
      </div>
      <div className="palette-list">{children}</div>
    </section>
  )
}

export function LeftPalette({
  onAddManualThroughArrow,
}: {
  onAddManualThroughArrow?: () => void
}) {
  return (
    <aside className="left-panel">
      <div className="panel-intro">
        <span className="eyebrow">Library</span>
        <p>Choose a starting point, then configure it in the inspector.</p>
      </div>

      <PaletteSection title="Templates">
        <PaletteItem icon="2W" title="Divided road segment" detail="4 lanes - raised median" selected />
        <PaletteItem icon="1W" title="Undivided road" detail="Available in Phase 1" />
      </PaletteSection>

      <PaletteSection title="Road Components">
        <PaletteItem icon="M" title="Median" detail="Raised or painted" />
        <PaletteItem icon="LL" title="Lane line" detail="Dashed or solid" />
      </PaletteSection>

      <PaletteSection title="Pavement Markings">
        <PaletteItem icon="AR" title="Lane-use arrows" detail="Through and turn" />
        <PaletteItem
          icon="+AR"
          title="Manual through arrow"
          detail="Place editable marking"
          onActivate={onAddManualThroughArrow}
        />
        <PaletteItem icon="SL" title="Stop line" detail="Transverse line" />
        <PaletteItem icon="WB" title="Warning bars" detail="Project assumption" />
      </PaletteSection>

      <PaletteSection title="Presets">
        <PaletteItem icon="TH" title="Thailand concept" detail="Left-hand traffic" />
      </PaletteSection>
    </aside>
  )
}
