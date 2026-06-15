/goal

Perform a Phase 1 hardening pass before Phase 2.

Fix the one-way rendering issue and all Phase 1 review findings. Stay strictly within Phase 1. Do not add U-turns, intersections, pocket lanes, slip lanes, roundabouts, save/load, drag-and-drop, real pavement marking placement, or real SVG export.

Problems to fix:

1. One-way rendering logic
The current generator still renders some two-way visual elements when one direction has zero lanes.

Add a derived road operation mode:
- twoWay: eastboundLaneCount > 0 and westboundLaneCount > 0
- eastboundOnly: eastboundLaneCount > 0 and westboundLaneCount <= 0
- westboundOnly: westboundLaneCount > 0 and eastboundLaneCount <= 0
- noLanes: eastboundLaneCount <= 0 and westboundLaneCount <= 0

Rendering rules:
- twoWay + painted/raised median:
  - render two carriageways separated by the median.
- twoWay + no median:
  - render a single road surface with a center direction-separation line.
  - do not show a physical median gap.
- eastboundOnly:
  - render one centered one-way carriageway.
  - arrows point right.
  - do not render westbound carriageway label.
  - do not render center direction-separation line.
  - do not render physical median gap.
- westboundOnly:
  - render one centered one-way carriageway.
  - arrows point left.
  - do not render eastbound carriageway label.
  - do not render center direction-separation line.
  - do not render physical median gap.
- noLanes:
  - do not crash.
  - render a simple empty/placeholder state or no-lane road placeholder with validation warning.

2. Lane label rules
- For twoWay + painted/raised median:
  - use “Outer / near-side lane” and “Median-side lane”.
- For twoWay + no median:
  - do not use “Median-side lane”.
  - use “Outer / near-side lane” and “Centerline-side lane”.
- For one-way:
  - do not use “Median-side lane”.
  - for eastbound one-way, use simple labels such as “Left / near-side lane” and “Right / off-side lane”.
  - for westbound one-way, use simple labels such as “Left / near-side lane” and “Right / off-side lane”, positioned consistently with the travel direction.
  - avoid clutter for high lane counts.

3. Numeric input contract
Add practical Phase 1 bounds to prevent UI freezes and misleading geometry:
- lane counts must be integers.
- lane counts must be between 0 and 8 per direction.
- lane width must be finite and within 2.5 to 5.0 m.
- outer shoulder width must be finite and within 0 to 5.0 m.
- median width must be finite and within 0 to 20.0 m.
- when medianType is painted or raised, median width must be greater than 0.
- when medianType is none, median width should be disabled or visually de-emphasized and ignored by rendering.

Use HTML input min/max/step where appropriate, but also validate in pure validation logic. Do not rely only on input attributes.

4. Geometry safety
- Geometry generation must never loop over unbounded lane counts.
- Clamp or safely normalize render lane counts before loops.
- Prefer validation warnings plus safe rendering.
- Do not silently collapse invalid lane widths or shoulder widths to zero without validation.
- Geometry should tolerate invalid values without throwing, but the validation panel must explain the issue.

5. Drawing scale ownership
Move pxPerMeter out of the geometry module as a hard-coded constant.
Introduce a minimal DrawingSettings object or constant owned outside the geometry module, for example:
- pxPerMeter
- segmentLengthMeters
- maxLaneCountPerDirection

Pass the drawing settings into the geometry builder or renderer.
Keep this simple. Do not add global state or a settings UI in Phase 1.

6. Validation updates
Update validation rules so they match implemented behavior:
- no warning for one direction being zero if the other direction has at least one lane.
- warning/error when both directions have zero lanes.
- warning when lane counts are fractional, non-finite, below 0, or above the Phase 1 max.
- warning when lane width is invalid or outside the Phase 1 range.
- warning when shoulder width is invalid or outside the Phase 1 range.
- warning when median width is invalid or outside the Phase 1 range.
- warning when painted/raised median width is not greater than 0.
- persistent info message that concept geometry is not a construction drawing.

7. Documentation consistency
Update:
- README.md
- docs/PRD.md
- docs/MVP_ROADMAP.md
- docs/VALIDATION_RULES.md
- docs/DATA_MODEL.md if needed

Make docs consistent with current Phase 1 behavior:
- SVG export remains disabled / later.
- Phase 1 scope is straight road parametric preview only.
- Document one-way behavior.
- Document numeric input limits as Phase 1 safeguards, not formal Thai standards.
- Document implemented validation rule IDs.

8. Tests
Add or update tests for:
- eastboundOnly renders no westbound label and arrows point right.
- westboundOnly renders no eastbound label and arrows point left.
- one-way mode does not render a center direction-separation line.
- twoWay + no median still renders a direction-separation line.
- both lane counts zero produces a validation warning and does not crash.
- lane counts above max produce validation warnings and do not freeze geometry.
- fractional lane counts produce validation warnings.
- invalid lane width produces validation warnings.
- invalid shoulder width produces validation warnings.
- painted/raised median with zero width produces validation warning.
- pxPerMeter is passed through drawing settings, not hard-coded inside geometry.
- existing Thailand left-hand traffic orientation tests still pass.

Visual verification:
- 2 eastbound / 0 westbound / no median
- 0 eastbound / 2 westbound / no median
- 2 eastbound / 2 westbound / no median
- 2 eastbound / 2 westbound / raised median
- 4 eastbound / 1 westbound / no median
- 9 eastbound / 2 westbound
- fractional lane count such as 1.9
- invalid lane width such as 0 or -1
- raised median with median width 0

Run:
- npm run typecheck
- npm test
- npm run build

Report what changed and confirm no Phase 2 scope was introduced.