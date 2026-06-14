function ThroughArrow({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} className="road-arrow">
      <path d="M0 24V-18" />
      <path d="m-8-10 8-10 8 10" />
    </g>
  )
}

export function StaticRoadPreview() {
  return (
    <svg
      className="road-preview"
      viewBox="0 0 1000 600"
      role="img"
      aria-labelledby="road-preview-title road-preview-description"
    >
      <title id="road-preview-title">Static divided road concept</title>
      <desc id="road-preview-description">
        A Thailand left-hand-traffic divided road. Eastbound traffic uses the upper
        carriageway and moves left-to-right. Westbound traffic uses the lower carriageway
        and moves right-to-left.
      </desc>

      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#dfe5e9" strokeWidth="1" />
        </pattern>
        <filter id="roadShadow" x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#12232f" floodOpacity=".18" />
        </filter>
      </defs>

      <rect width="1000" height="600" fill="#f5f7f8" />
      <rect width="1000" height="600" fill="url(#grid)" />

      <g filter="url(#roadShadow)">
        <rect x="55" y="105" width="890" height="350" rx="6" fill="#c8cdd0" />
        <rect x="55" y="125" width="890" height="310" fill="#41494d" />
        <rect x="55" y="265" width="890" height="30" fill="#d2a83d" />
        <rect x="55" y="271" width="890" height="18" fill="#c8cdd0" />

        <path d="M55 125H945M55 435H945" className="edge-line" />
        <path d="M55 195H945M55 365H945" className="lane-line" />
        <path d="M55 257H945M55 303H945" className="median-line" />

        <ThroughArrow x={620} y={160} rotate={90} />
        <ThroughArrow x={790} y={230} rotate={90} />
        <ThroughArrow x={395} y={330} rotate={-90} />
        <ThroughArrow x={225} y={400} rotate={-90} />

        <g className="warning-bars">
          <rect x="600" y="375" width="7" height="50" rx="2" />
          <rect x="624" y="375" width="7" height="50" rx="2" />
          <rect x="651" y="375" width="7" height="50" rx="2" />
          <rect x="681" y="375" width="7" height="50" rx="2" />
          <rect x="590" y="367" width="108" height="66" rx="5" className="selection-outline" />
        </g>

        <rect x="850" y="307" width="12" height="126" rx="2" className="stop-line" />
      </g>

      <g transform="translate(692 358)" className="validation-marker">
        <circle r="15" />
        <path d="M0-7v8M0 7v.5" />
      </g>

      <g className="road-label" data-testid="eastbound-carriageway-label">
        <rect x="75" y="72" width="176" height="28" rx="14" />
        <text x="163" y="91" textAnchor="middle">
          Eastbound carriageway
        </text>
      </g>
      <g className="road-label" data-testid="westbound-carriageway-label">
        <rect x="75" y="462" width="172" height="28" rx="14" />
        <text x="161" y="481" textAnchor="middle">
          Westbound carriageway
        </text>
      </g>

      <g className="lane-position-label">
        <text x="75" y="151">Outer / near-side lane</text>
        <text x="75" y="247">Median-side lane</text>
        <text x="75" y="329">Median-side lane</text>
        <text x="75" y="425">Outer / near-side lane</text>
      </g>

      <g className="sample-marking-label">
        <path d="M645 443V458" />
        <rect x="577" y="458" width="136" height="24" rx="5" />
        <text x="645" y="474" textAnchor="middle">
          Warning bars sample
        </text>
        <path d="M856 443V494H824" />
        <rect x="715" y="482" width="109" height="24" rx="5" />
        <text x="769.5" y="498" textAnchor="middle">
          Stop line sample
        </text>
      </g>

      <g className="north-indicator" transform="translate(910 74)">
        <path d="M0 22V-8" />
        <path d="m-6 0 6-10L6 0" />
        <text x="0" y="-19" textAnchor="middle">
          N
        </text>
      </g>

      <g className="traffic-note">
        <rect x="105" y="535" width="790" height="38" rx="7" />
        <text x="500" y="559" textAnchor="middle">
          Thailand left-hand traffic: eastbound traffic uses the upper carriageway,
          westbound traffic uses the lower carriageway.
        </text>
      </g>
    </svg>
  )
}
