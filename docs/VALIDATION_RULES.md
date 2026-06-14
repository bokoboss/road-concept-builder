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
| `GEO-001` | error | Lane width must be greater than zero. |
| `GEO-002` | error | Road segment must have at least one lane. |
| `GEO-003` | warning | Lane drop should include taper. |
| `GEO-004` | warning | Lane addition should include taper or transition marking. |
| `GEO-005` | error | U-turn opening requires a median or defined crossing area. |
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
| `SEG-002` | warning | Divided road should define median type and width. |
| `SEG-003` | info | Shoulder width is treated as a concept parameter unless verified. |

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
