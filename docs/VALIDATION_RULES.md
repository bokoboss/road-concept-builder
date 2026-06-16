# Validation Rules

## Philosophy

Validation should guide the user without blocking concept work.

Most validation issues should be advisory.

Severity levels:

- `info`: assumption or helpful note;
- `warning`: likely issue or incomplete concept;
- `error`: internally impossible or contradictory geometry.

Only errors should block operations that cannot be completed.

## General Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `GEN-001` | info | Diagram uses concept geometry and should not be treated as a construction drawing. |
| `GEN-002` | warning | Standard-sensitive value has `TODO_VERIFY` source status. |
| `GEN-003` | error | Referenced target object does not exist. |

## Geometry Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `GEO-001` | warning | Phase 1 lane width must be finite and between 2.5 and 5.0 m. |
| `GEO-002` | warning | Straight road preview must have at least one lane across either direction. |
| `GEO-003` | warning | Lane drop should include taper. |
| `GEO-004` | warning | Lane addition should include taper or transition marking. |
| `GEO-006` | warning | U-turn pocket should include storage length and taper length. |

## Left-Hand Traffic Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `LHT-001` | info | Default context is left-hand traffic. |
| `LHT-002` | warning | Right-turn pocket should usually be median-side in left-hand traffic. |
| `LHT-003` | warning | U-turn pocket should usually be median-side. |

## Road Segment Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `SEG-001` | warning | Two-way road should include direction-separation marking. |
| `SEG-002` | warning | Painted or raised median width must be greater than zero. Ignored when median type is `none`. |
| `SEG-003` | info | Shoulder width is treated as a concept parameter unless verified. |
| `SEG-101` | warning | Phase 1 lane count must be a finite integer within the configured safe maximum: 8 by default, with an absolute geometry cap of 16 per direction. |
| `SEG-103` | warning | Phase 1 outer shoulder width must be finite and between 0 and 5.0 m. |
| `SEG-104` | warning | Phase 1 painted or raised median width must be finite and between 0 and 20.0 m. Ignored when median type is `none`. |

The Phase 1 numeric ranges are practical safeguards for stable concept preview rendering. They are not formal Thai-standard limits. Lane-count warning instances use direction-specific issue IDs so eastbound and westbound problems remain distinguishable.

## U-turn / Median Opening Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `UTN-001` | warning | Enabled Phase 2 U-turn opening requires two-way operation with lanes in both directions. |
| `UTN-002` | warning | Enabled Phase 2 U-turn opening requires a painted or raised median. |
| `UTN-003` | warning | Opening width must be finite and between 2 and 12 m. |
| `UTN-004` | warning | Opening position must be finite and the full opening must fit within the straight-road preview segment. |

The Phase 2 opening-width range is a practical preview safeguard and project assumption, not a formal Thai-standard limit. Invalid U-turn configurations keep the base straight-road preview and do not render partial U-turn geometry.

## Intersection Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `INT-001` | warning | Signalized approach should include stop line. |
| `INT-002` | warning | Stop-controlled approach should include stop line. |
| `INT-003` | warning | Yield-controlled approach should include give-way line. |
| `INT-004` | warning | Approach with crosswalk should have stop line or give-way logic upstream where applicable. |
| `INT-005` | warning | Lane movement arrows should be present when lane movements are assigned. |
| `INT-006` | warning | Inbound/outbound lane imbalance may require explanation or taper. |

## Pocket Lane Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `PKT-001` | warning | Pocket lane should have lane-use arrow. |
| `PKT-002` | warning | Pocket lane should define storage length. |
| `PKT-003` | warning | Pocket lane should define taper length. |
| `PKT-004` | warning | Right-turn pocket should connect logically to intersection or U-turn movement. |

## Slip Lane Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `SLP-001` | warning | Yield-controlled slip lane should include give-way line. |
| `SLP-002` | warning | Slip lane should include left-turn arrow. |
| `SLP-003` | warning | Slip lane with pedestrian crossing should define crossing position. |
| `SLP-004` | warning | Slip lane merge type should be specified. |

## Pavement Marking Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `MRK-001` | error | Marking target must exist. |
| `MRK-002` | warning | Lane-use arrow should match lane movement. |
| `MRK-003` | warning | U-turn pocket should include U-turn arrow. |
| `MRK-004` | warning | Stop line should not overlap crosswalk. |
| `MRK-005` | warning | Crosswalk should not conflict with island geometry. |
| `MRK-006` | info | Transverse warning bars use project assumption unless verified. |
| `MRK-007` | warning | Automatic rotation requires target direction geometry. |
| `MRK-008` | warning | Text marking should be short enough for selected lane/area. |

## Export Rules

| Rule ID | Severity | Rule |
|---|---:|---|
| `EXP-001` | info | SVG export is vector and presentation-oriented. |
| `EXP-002` | warning | Exported diagram includes unverified standard assumptions. |
| `EXP-003` | info | Validation issues are not printed on export unless the user enables them. |

## Validation UX

Validation should appear in the right panel or a bottom drawer.

Do not use modal popups for ordinary warnings.

Each issue should eventually support:

- severity;
- message;
- target element;
- suggested action;
- source/status note.
