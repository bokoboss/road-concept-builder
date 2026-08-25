# Technical Rebaseline v0.1

## Objective

Define the architecture constraints for moving from the Phase 2E straight-road SVG prototype to a generalized map-first 2D/3D engineering concept editor without committing prematurely to an unproven geometry stack.

## Hard architectural constraints

1. **Canonical model is semantic engineering data, not SVG, Canvas nodes, or 3D meshes.**
2. **2D and 3D derive from one model and one geometry pipeline.**
3. **Roads use a reference alignment and station-based longitudinal model.**
4. **Cross section is component based.**
5. **Lane/component widths may vary by station.**
6. **Junction geometry and network topology are separate concerns.**
7. **Junctions are first-class objects with approaches and lane connectivity.**
8. **Render scale and screen coordinates are view state, not engineering state.**
9. **Road-attached assets can reference station/lateral/edge/lane semantics.**
10. **All engineering edits are commands/transactions that can validate and undo.**
11. **AI may propose commands but may not mutate raw meshes/project JSON directly.**
12. **Standards/rules are separate from geometry feasibility.**

## Proposed canonical object hierarchy

```text
Project
  metadata
  coordinateReference
  standardsProfiles[]
  scenarios[]

Scenario
  roadNetwork
  assets
  annotations
  presentation

RoadNetwork
  roads[]
  junctions[]

Road
  referenceAlignment
  crossSectionSections[]
  laneComponents[]
  markings[]
  attachments[]

Junction
  approaches[]
  corners[]
  laneConnections[]
  movements[]
  islands[]
  crossings[]
  stopYieldLines[]
```

The exact schema is not frozen by this document; the semantic boundaries are.

## Alignment model

Minimum primitives for the first spike:
- straight line;
- circular arc;
- smooth cubic/Bezier-style quick curve for conceptual editing.

Architecture hook, but not required in first spike:
- clothoid/spiral;
- vertical profile;
- terrain-aware elevation.

Required alignment operations:

```text
length()
pointAt(s)
tangentAt(s)
normalAt(s)
curvatureAt(s)
projectPoint(x,y) -> {s,t}
sampleAdaptive(tolerance)
```

## Station-based cross section

A road does not have one permanent uniform cross section.

Model longitudinal change explicitly so these become general cases of the same mechanism:
- taper;
- widening;
- lane add/drop;
- turn pocket;
- auxiliary lane;
- bus bay;
- median widening/narrowing;
- roadside component transitions.

Conceptual lane profile:

```text
Lane L3
startStation 100
endStation   200
widthProfile
  s=100  width=0.00
  s=130  width=3.00
  s=200  width=3.00
```

The first implementation may use piecewise-linear width interpolation. Do not require OpenDRIVE-style polynomial width functions until there is a demonstrated use case.

## Geometry vs topology

A geometric crossing is only a candidate connection.

```text
Road A intersects Road B geometrically
        -> Candidate Junction
        -> Connect / Grade-separated / Ignore
```

Never silently create network topology solely because polylines cross in plan.

## Junction kernel responsibilities

Initial junction generation pipeline:

1. detect candidate reference-line intersection;
2. identify approaches and approach headings;
3. determine junction cut stations;
4. generate approach envelopes/edges;
5. generate per-corner geometry;
6. build/clean pavement boundary;
7. generate/subtract medians/islands as required;
8. triangulate 3D pavement surface;
9. generate or infer lane-to-lane connections;
10. expose all important decisions for review/override.

First required junction cases:
- 90-degree T;
- skewed T;
- 90-degree four-leg;
- skewed four-leg;
- unequal approach widths;
- divided vs undivided case after basic cases are robust.

Roundabout is a later specialized module, not a generic-junction shortcut.

## Lane connectivity

Connections must be semantic data:

```text
LaneConnection
  fromLane
  toLane
  movement
  path
```

Initial connection path may use a tangent-constrained cubic Bezier/Hermite curve for conceptual visualization. This is not a swept-path engineering solution.

## Command architecture

All committed edits should go through typed semantic commands.

Examples:
- `CreateRoadCommand`;
- `MoveAlignmentControlPointCommand`;
- `ChangeComponentWidthCommand`;
- `AddTurnPocketCommand`;
- `CreateJunctionCommand`;
- `SetCornerRadiusCommand`;
- `AddMarkingCommand`;
- `PlaceAssetCommand`.

Command requirements:
- input schema validation;
- change preview where appropriate;
- deterministic application;
- one undo transaction;
- dirty/dependency tracking;
- validation refresh.

This command bus is also the safe integration boundary for a future AI Copilot.

## Project state layers

Keep these separate:

### Canonical engineering state
Roads, lanes/components, topology, markings, attachments, dimensions, standards/profile references.

### Scenario state
Existing / Alternative models and scenario-specific design changes.

### Presentation state
Materials, visibility presets, environment, saved camera views, labels/styles.

### Editor/session state
Selection, active tool, hover, open panel, temporary drag preview, viewport transform.

Do not persist ephemeral editor state as engineering truth.

## Coordinate strategy

Canonical engineering geometry:
- meters;
- double precision where supported;
- optional project CRS/georeference;
- local project origin for renderer precision.

Renderers should receive local coordinates near the origin even when georeferenced source coordinates are large.

Imported un-georeferenced imagery must support scale calibration.

## Renderer strategy

### 2D

The current SVG renderer remains useful as:
- export format;
- diagnostic/reference renderer;
- possible lightweight overlays.

Do not assume SVG remains the final high-object-count editing renderer.

Candidates for the future interactive 2D renderer:
- PixiJS/WebGL-based scene;
- hybrid map + GPU/vector overlay;
- SVG/HTML overlays for dimensions/labels/handles where useful.

### 3D

Use a procedural 3D mesh built from station/cross-section samples rather than extruding one arbitrary road polygon.

Candidate runtime renderer: Three.js/WebGL/WebGPU stack.

3D must consume derived mesh buffers and presentation metadata, not own engineering semantics.

### Map

Separate map renderer from tile/provider licensing.

Candidate renderer: MapLibre GL JS or equivalent open map renderer.

Providers/sources may include:
- online street basemap;
- licensed satellite imagery;
- organization XYZ/WMS sources later;
- user-imported image/plan;
- blank/offline local canvas.

## Geometry kernel language decision

### Current state
Geometry is TypeScript and adequate for the Phase 2E prototype.

### Candidate future state
A Rust geometry kernel compiled to native/WASM is a strong candidate because of:
- deterministic numeric/core code;
- strong typing;
- property/fuzz testing ecosystem;
- native desktop reuse;
- WASM reuse from the UI;
- separation from rendering/UI.

### Decision status
**Not yet frozen.**

The next spike should validate whether Rust/WASM provides sufficient benefit and dependency compatibility over a well-structured TypeScript kernel before performing a large migration.

The UI/domain contract must therefore remain language-neutral enough that the spike can compare implementations.

## Candidate geometry dependencies for spike research

Rust candidates previously identified:
- `geo` — primitives/general algorithms;
- `iOverlay` — polygon boolean/cleanup;
- `cavalier_contours` — CAD-like line/arc offsets;
- `earcut` — polygon triangulation;
- `spade` — constrained Delaunay candidate later;
- `rstar` — spatial index.

These are candidates only. Confirm current API, WASM compatibility, maintenance, license, robustness and benchmarks before adoption.

## Incremental regeneration

Do not regenerate the whole project after every edit.

Example dependency chain:

```text
Road R1 alignment changed
  -> road station samples
  -> lane/component surfaces
  -> attached markings/assets
  -> connected junctions
  -> 2D geometry
  -> 3D mesh
  -> validation
```

Unrelated roads/scenarios should remain clean.

## Geometry invariants

Alignment:
- finite coordinates;
- positive primitive lengths;
- monotonic stationing;
- required positional/tangent continuity.

Lane/components:
- width >= 0;
- valid start/end station;
- valid parent/reference;
- no orphan lifecycle.

Polygon/mesh:
- no NaN/Infinity;
- no invalid holes/self-intersection after cleanup;
- no degenerate triangles;
- consistent winding;
- triangulated area reasonably matches source polygon area.

Topology:
- all connection endpoints exist;
- no accidental connection solely from visual crossing;
- lane connection references are valid.

## Test strategy for geometry spike

Minimum canonical cases:
1. straight two-lane road;
2. circular curve;
3. S/smooth curve;
4. constant widening;
5. lane taper;
6. lane add;
7. lane drop;
8. right-turn pocket;
9. median widening;
10. median opening;
11. 90-degree T;
12. skewed T;
13. four-leg junction;
14. unequal approach widths;
15. divided/undivided junction;
16. nearly parallel roads;
17. almost-tangent/corner stress case;
18. very short segment;
19. very large georeferenced coordinates converted to local origin;
20. zero-width lane start/end.

Test layers:
- unit tests;
- golden geometry snapshots/data;
- invariants;
- property-based/random tests;
- fuzz tests for kernel operations where feasible;
- deterministic output test;
- benchmark/regression measurements.

## Stage R1 — recommended next executable spike

Do **not** build polished product UI yet.

Deliver:
- generalized semantic road model proof;
- alignment and station API;
- variable-width component/lane generation;
- right-turn-pocket generated as a general lane transition;
- candidate T/four-leg junction proof;
- lane connectivity proof;
- one minimal diagnostic 2D view;
- one minimal synchronized 3D view from the same model;
- saveable spike fixtures/test cases;
- benchmark and qualification report;
- language/kernel recommendation based on evidence.

## Gate

Only after R1 proves robust shared geometry should the project commit to the final editor renderer, full desktop shell migration, large asset library, or AI integration.