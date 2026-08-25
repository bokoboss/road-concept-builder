# Technical Design — Rebaseline v0.1

## Technical goal

Build a standalone map-first engineering concept editor in which one renderer-independent semantic road/network model drives 2D plan, cross-section and 3D output.

The current React/TypeScript/SVG Phase 2E application is a prototype, not a permanent architecture constraint.

## Current architecture status

### Preserved prototype stack
- React 19;
- TypeScript;
- Vite;
- Vitest;
- SVG preview/export.

### Not frozen yet
- final geometry-kernel language;
- final high-object-count 2D editing renderer;
- final desktop packaging stack;
- map renderer/provider implementation;
- state-management library.

Stage R1 must reduce geometry/kernel uncertainty before these production choices are locked.

## High-level architecture

```text
Desktop Application
  UI / Workspace
  Command Bus + Undo/Redo
  Project / Scenario Model
             |
             v
     Semantic Road Kernel
       alignment/station
       cross sections
       lane lifecycle
       junction geometry
       topology/connectivity
             |
      +------+-------+
      |              |
      v              v
   2D Derived     3D Derived
   Geometry       Mesh/Scene Data
      |              |
      v              v
   2D Renderer     3D Renderer

Independent systems:
- Map/reference context
- Standards/profile validation
- Asset library/provenance
- Export/presentation
- AI intent -> typed command proposals
```

## Separation of concerns

### Canonical engineering model

Owns:
- roads;
- alignment/stationing;
- lane/component semantics;
- junction topology;
- lane connectivity;
- engineering markings/attachments;
- dimensions;
- standards-profile references.

Must not reference React, DOM, SVG nodes, Canvas objects or Three.js mesh objects.

### Geometry kernel

Transforms semantic state into deterministic geometric results.

Responsibilities:
- evaluate alignments;
- station/lateral transforms;
- component/lane boundaries;
- station-based transitions;
- junction envelopes/corners;
- polygon cleanup;
- triangulation-ready surfaces;
- movement/connection guide geometry;
- geometry invariants.

### Topology

Separate from final pavement polygons.

Owns:
- connected roads/approaches;
- candidate vs actual junction states;
- lane-to-lane connections;
- movement semantics.

### Command bus

All committed edits should use typed semantic commands.

Responsibilities:
- input validation;
- preview/change set where applicable;
- apply;
- undo/redo transaction;
- dirty/dependency notification;
- common boundary for manual UI and future AI intent.

### 2D renderer

Consumes derived road/network geometry and editor overlays.

SVG remains acceptable for diagnostic/export use, but the production editing renderer is not frozen. Evaluate hybrid/GPU/vector approaches in R2 after R1 geometry proof.

### 3D renderer

Consumes derived mesh/surface data from the same semantic geometry pipeline.

Initial candidate: Three.js/WebGL/WebGPU ecosystem, subject to R1/R2 integration review.

3D owns presentation, not engineering truth.

### Map/reference system

Separate map renderer from tile/provider source/licensing.

Requirements:
- online provider abstraction;
- imported local image/plan;
- scale calibration;
- optional CRS/georeference;
- local-origin transform;
- opacity/dim/lock;
- offline blank/local project support.

### Validation

Two conceptual layers:
1. geometry/model feasibility and invariants;
2. standards/profile advisory rules.

Do not make prototype numeric safety bounds equivalent to standards.

### Assets

Use typed asset families:
- procedural road components;
- procedural markings;
- semantic assemblies;
- props;
- distributions.

Keep licensing/provenance machine-readable.

## Suggested production source layout

Exact names are not frozen, but boundaries should resemble:

```text
src/
  app/
  editor/
  commands/
  project/
  scenarios/
  render2d/
  render3d/
  map/
  assets/
  standards/
  validation/
  export/

kernel or kernel-next/
  alignment/
  road/
  junction/
  topology/
  geometry/
  fixtures/
```

If R1 selects Rust/WASM, kernel code may live under `crates/road-kernel/` with a narrow typed bridge.

## Coordinate strategy

- canonical domain dimensions: meters;
- engineering coordinates may be local or georeferenced;
- render using a project-local origin to avoid precision issues at large coordinate magnitudes;
- screen pixels/view scale are renderer/session state;
- panning/zooming never modifies engineering dimensions.

## Alignment strategy

R1 minimum:
- line;
- circular arc;
- smooth cubic/Bezier conceptual curve;
- chained primitives;
- station API.

Later architecture hook:
- clothoid/spiral;
- vertical profile;
- terrain.

Do not add full vertical/corridor design before a product need is proven.

## Longitudinal road strategy

Represent width/lifecycle by station profiles.

This should support through one general mechanism:
- taper;
- widening;
- lane add/drop;
- turn pocket;
- bus bay;
- median transition;
- roadside component transition.

Avoid one-off polygon types for each feature.

## Junction strategy

Pipeline direction:
1. candidate geometric detection;
2. explicit topology decision;
3. approach/cut-station derivation;
4. per-corner geometry;
5. pavement envelope cleanup;
6. islands/medians as semantic features;
7. triangulation;
8. lane connectivity.

Do not conflate visual intersection with network connection.

## Incremental regeneration

Changes should eventually dirty dependencies rather than recompute the whole project.

Example:

```text
Road R1 alignment edit
 -> R1 station samples
 -> R1 lane/component geometry
 -> R1 attached markings/assets
 -> connected junctions
 -> R1/Junction 2D geometry
 -> R1/Junction 3D mesh
 -> affected validation
```

## Kernel language decision

TypeScript vs Rust/WASM remains intentionally unresolved until R1.

Do not perform a large migration based on preference alone.

Evaluate:
- numeric robustness;
- dependency maturity/license;
- property/fuzz test tooling;
- WASM/native integration;
- performance;
- developer/agent ergonomics;
- build complexity;
- maintenance cost.

## Testing strategy

Geometry/kernel:
- unit tests;
- canonical fixtures;
- invariants;
- deterministic repeated-run tests;
- property/random tests;
- fuzz tests where feasible;
- benchmarks.

UI/editor later:
- functional/component tests;
- golden-workflow E2E;
- visual regression;
- keyboard/accessibility;
- window-size checks;
- human/domain UAT.

## Immediate implementation boundary

The next coding stage is `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`.

Do not build the polished production shell before R1 proves the core semantic/geometry architecture.