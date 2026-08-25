# Stage R1 — Geometry & Semantic Kernel Spike

## Status

Proposed next executable stage after the rebaseline PR is accepted.

This is a **technical proof**, not a polished user-facing release.

## Mission

Prove that Road Concept Builder can represent generalized roads and intersections as semantic engineering data and derive synchronized diagnostic 2D and 3D geometry from the same source without relying on the Phase 2E straight-road/SVG-first assumptions.

## Why this stage exists

The largest architectural risks are not colors, panels, or asset polish. They are:
- generalized alignment/stationing;
- longitudinal cross-section change;
- lane lifecycle and turn pockets;
- junction geometry/topology;
- robust polygon/mesh generation;
- one source of truth for 2D/3D;
- coordinate precision at map scale.

R1 must resolve those risks before substantial product-shell or asset-library implementation.

## Rewrite permission

The Phase 2E implementation may be reused, bypassed, isolated, or replaced.

Do not preserve old abstractions merely for compatibility. Keep Git history/recoverability, but optimize for the rebaselined architecture.

## Authoritative inputs

Read before implementation:
- `AGENTS.md`;
- `docs/REBASELINE_AUDIT_2026-08-25.md`;
- `docs/PRODUCT_BASELINE_V0_1.md`;
- `docs/TECHNICAL_REBASELINE_V0_1.md`;
- `docs/DEVELOPMENT_OPERATING_MODEL_V0_1.md`;
- `.agents/skills/thai-road-diagram/SKILL.md`.

## Required spike capabilities

### R1.1 Reference alignment

Implement a generalized horizontal alignment abstraction with at least:
- straight segment;
- circular arc;
- conceptual smooth cubic/Bezier curve;
- chained primitives;
- station 0 at alignment start;
- cumulative monotonic stationing.

Required API behavior:

```text
length()
pointAt(s)
tangentAt(s)
normalAt(s)
curvatureAt(s)
projectPoint(x,y) -> { station, lateralOffset }
sampleAdaptive(tolerance)
```

No compass-specific eastbound/westbound assumptions.

### R1.2 Semantic cross-section components

Represent road cross sections as ordered semantic components that can include at least:
- traffic lane;
- median;
- shoulder;
- sidewalk/verge placeholder types sufficient to prove extensibility.

Each component must have:
- stable id;
- type;
- side/order semantics;
- width profile;
- station lifecycle where applicable.

Preset/configuration instantiation may be demonstrated but is not the primary spike goal.

### R1.3 Station-based width/lifecycle

Support piecewise-linear width profiles sufficient to model:
- constant width;
- widening/narrowing;
- taper from zero to full width;
- taper from full width to zero;
- lane add/drop;
- median width transition.

Width must never become negative after validation/sanitization.

### R1.4 General turn pocket

Represent a right-turn pocket using the general lane/component lifecycle, not a U-turn-only special-case type.

Canonical fixture:
- four-lane divided road;
- right-turn pocket width 3.00 m;
- taper 30 m;
- storage 50 m;
- station-based attachment before a conceptual access/junction anchor.

The implementation should prove that changing taper/storage/width updates both 2D and 3D derived geometry from the same semantic source.

### R1.5 Candidate junction detection

Prove geometric candidate detection for:
- 90-degree T;
- skewed T;
- 90-degree four-leg;
- skewed four-leg.

A geometric crossing/meeting must not automatically become network topology.

Represent decision state explicitly enough to distinguish:
- candidate;
- connected junction;
- grade-separated/ignore.

### R1.6 Junction semantic object

For a connected junction, represent at least:
- junction id;
- participating roads/approaches;
- approach headings/cut stations;
- per-corner geometry parameters;
- lane connections/movements;
- generated pavement envelope/surface.

Per-corner radius/geometry must be independently adjustable.

### R1.7 Lane connectivity proof

Represent explicit lane connections:

```text
fromLane -> movement -> toLane
```

Generate a simple conceptual connection path for visualization.

This is not swept-path analysis and must not be described as vehicle-dynamic feasibility.

### R1.8 Shared 2D/3D derivation

Produce two minimal diagnostic renderings from one canonical model:

**2D diagnostic view**
- alignment;
- road/component boundaries;
- lane boundaries;
- junction envelope;
- lane-connection guides;
- selected fixture highlighting if convenient.

**3D diagnostic view**
- pavement/median/sidewalk placeholder surfaces;
- lane/marking indication sufficient to prove synchronization;
- junction pavement mesh.

No production visual polish is required.

## Coordinate requirements

- domain geometry in meters;
- finite numeric values only;
- local-origin rendering path;
- fixture proving large georeferenced-style coordinates can be translated to a local rendering origin without visible geometry corruption.

Actual online map integration is out of scope for R1.

## Kernel language study

The spike should compare two credible approaches before committing:

### Option A — structured TypeScript kernel

Pros to test:
- simplest integration with existing code;
- fastest iteration;
- reduced build complexity.

### Option B — Rust core + WASM/native boundary

Pros to test:
- strong isolation of geometry logic;
- native/WASM reuse;
- property/fuzz tooling;
- numerical/core-code maintainability.

Do not perform a complete rewrite in Rust before a small proof demonstrates the benefit.

The spike report must recommend one approach based on evidence: robustness, ergonomics, dependency quality, WASM/native fit, testing, performance, and maintenance complexity.

## Candidate dependencies to evaluate

Research current versions/licenses/maintenance before adoption.

Possible Rust candidates:
- `geo`;
- `iOverlay`;
- `cavalier_contours`;
- `earcut`;
- `spade`;
- `rstar`.

Possible UI diagnostic renderer candidates:
- existing SVG for minimal 2D proof;
- PixiJS or lightweight WebGL only if necessary;
- Three.js for minimal 3D proof.

Do not adopt a large rendering framework merely to complete the spike if a smaller diagnostic path proves the architecture.

## Canonical fixtures

At minimum create stable fixtures for:

1. straight two-lane undivided road;
2. four-lane divided straight road;
3. circular curve;
4. smooth S/compound conceptual curve;
5. lane widening;
6. lane taper;
7. lane add;
8. lane drop;
9. right-turn pocket;
10. median widening/narrowing;
11. median opening representation if useful to prove lifecycle;
12. 90-degree T junction;
13. skewed T junction;
14. 90-degree four-leg junction;
15. skewed four-leg junction;
16. unequal approach widths;
17. divided vs undivided junction;
18. nearly parallel roads that must not accidentally connect;
19. very short segment stress case;
20. large source coordinates converted to local origin;
21. zero-width lane start/end;
22. near-degenerate corner geometry stress case.

Fixtures must be deterministic and suitable for regression testing.

## Required invariants

### Alignment
- no NaN/Infinity;
- positive primitive lengths;
- stationing monotonically increases;
- point/tangent evaluation remains finite at boundaries;
- chain joins meet the declared continuity requirement.

### Components/lanes
- width >= 0;
- start station <= end station;
- valid parent/reference;
- deterministic ordering;
- no orphan lane/component lifecycle.

### Junction/topology
- every connected approach references an existing road;
- lane connections reference existing lanes;
- no connection is created solely because plan paths cross;
- disconnected/ignored candidate remains topologically disconnected.

### Polygon/mesh
- valid finite vertices;
- no unintended self-intersection after cleanup;
- no invalid holes;
- no degenerate/zero-area triangles beyond explicit tolerance;
- consistent winding/normals;
- triangulated area approximately matches source pavement area within documented tolerance.

## Test layers

Required:
- unit tests;
- golden/canonical fixture outputs;
- invariant tests;
- deterministic repeated-run test;
- property-based/randomized tests for alignment/width/junction input ranges where feasible;
- fuzz tests for risky polygon/junction operations where feasible;
- performance benchmark for representative small/medium fixture sets.

If a test layer is omitted, the qualification report must justify why and define the replacement evidence.

## Performance targets

R1 is a spike, not a final product benchmark, but detect pathological approaches early.

Record at least:
- generation time for one road with multiple lane transitions;
- one T junction;
- one four-leg junction;
- a synthetic set of multiple connected roads;
- repeated regeneration after one local edit.

Do not optimize blindly before measurements.

## Deliverables

1. spike implementation isolated from or clearly separated from legacy Phase 2E paths;
2. semantic types/model;
3. alignment/station implementation;
4. lane/component profile implementation;
5. right-turn-pocket fixture using generic lifecycle;
6. junction/topology proof;
7. lane-connectivity proof;
8. minimal shared 2D/3D diagnostic views;
9. canonical fixtures;
10. deterministic tests/invariants;
11. benchmark data;
12. `R1_QUALIFICATION_REPORT.md`;
13. evidence-based kernel-language recommendation;
14. explicit list of legacy Phase 2E code to reuse, retire, or delete in the next stage.

## Non-goals

Do not implement during R1:
- polished production UI;
- online basemap integration;
- full standalone desktop packaging;
- large marking/sign/vehicle/tree library;
- photorealistic materials;
- terrain;
- vertical alignment;
- roundabout production module;
- swept-path analysis;
- traffic simulation;
- signal timing;
- AI/LLM integration;
- cloud/account system;
- DXF/DWG production export.

## Forbidden shortcuts

- Do not keep eastbound/westbound orientation in the generalized core.
- Do not model turn pockets as arbitrary detached polygons.
- Do not create separate engineering models for 2D and 3D.
- Do not make mesh vertices or SVG paths the canonical road representation.
- Do not auto-connect roads solely from visual crossing.
- Do not suppress invalid geometry merely to make screenshots look correct.
- Do not call conceptual connection paths swept-path validation.
- Do not claim Thai-standard compliance from prototype safeguards/defaults.
- Do not preserve legacy code when doing so makes the new model materially worse.

## Acceptance gate

R1 passes only when all of the following are demonstrated with machine-verifiable evidence:

1. one canonical semantic road model drives both 2D and 3D;
2. alignment stationing works on straight, arc, and smooth-curve fixtures;
3. a generic lane width/lifecycle model creates a correct turn pocket;
4. T and four-leg junction fixtures generate valid deterministic surfaces;
5. topology distinguishes visual crossing from actual connection;
6. lane connections are explicit and valid;
7. canonical fixtures and invariants pass repeatedly;
8. no unexplained NaN, invalid polygon, or degenerate-mesh failure remains in the acceptance fixture set;
9. performance data is recorded;
10. the kernel-language recommendation is justified by spike evidence rather than preference.

Do not begin the production editor rewrite until this gate is accepted.