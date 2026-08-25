# Product Requirements Document — Rebaseline v0.1

## Product name

Working name: **Road Concept Builder**.

The name may change later without affecting architecture.

## Product vision

Create a standalone, map-first street and intersection concept design environment for traffic engineers and transport planners.

The product should let a user move from a real location or imported plan to an engineering-aware 2D concept, synchronized 3D visualization, alternatives, and presentation-ready outputs without requiring CAD-level drafting, Illustrator, Blender, or manual asset production.

## Problem statement

Traffic engineers frequently need to communicate roadway concepts such as:
- project accesses;
- turn pockets;
- median openings/U-turn treatments;
- intersection improvements;
- road widening;
- bus bays;
- parking/bike/sidewalk/street components;
- Existing vs Proposed alternatives.

Existing workflows have gaps:
- CAD/highway-design tools are powerful but heavy for fast concept iteration;
- generic illustration tools lack road/lane/junction semantics;
- cross-section tools do not adequately handle plan-view intersections and longitudinal transitions;
- presentation-focused 3D tools may look convincing without maintaining engineering structure;
- manual 2D/3D asset production requires skills/tools that should not be prerequisites for this product.

Road Concept Builder should occupy the gap between lightweight visual street tools and detailed civil-design platforms.

## Target users

Primary:
- traffic engineers;
- transport planners;
- TIA consultants;
- road/intersection concept designers.

Secondary:
- highway/urban designers during early concept stages;
- road-safety analysts;
- project managers;
- public-agency/developer stakeholders reviewing alternatives.

## Product positioning

The product is:
- map first;
- plan-authoring first;
- semantic/engineering aware;
- metric native;
- Thailand/LHT first;
- synchronized 2D/3D;
- scenario/alternative oriented;
- automation assisted;
- presentation capable;
- AI-command ready.

The product is not initially:
- a construction drawing package;
- a detailed highway corridor/grading tool;
- a cut/fill/earthworks system;
- a drainage-design package;
- BIM authoring software;
- a full traffic simulator;
- a signal-timing optimizer;
- a full swept-path replacement;
- a cloud collaboration platform.

## Core requirements

### 1. Project/reference context

Must ultimately support:
- blank/local project;
- online map/street basemap;
- satellite/aerial reference where licensing permits;
- imported JPG/PNG/site plan;
- scale calibration for un-georeferenced images;
- optional real CRS/georeference;
- local rendering origin for numeric stability;
- reference-layer visibility/lock/opacity/dim controls.

### 2. Road model

Road source of truth must use:
- generalized reference alignment;
- stationing;
- ordered semantic cross-section components;
- station-based component/lane lifecycle and width profiles.

Required conceptual capabilities include:
- straight/curved roads;
- lane-count and width changes;
- median/shoulder/sidewalk/verge/bike/parking components;
- taper;
- widening/narrowing;
- lane add/drop;
- turn pocket;
- median width transition.

Presets/configurations instantiate editable components and must not remain opaque graphic templates.

### 3. Junction/network model

Junctions must be first-class semantic objects.

Required direction:
- T and four-leg intersections first;
- skewed geometry;
- divided/undivided combinations;
- per-corner geometry/radius;
- approaches;
- explicit lane-to-lane connectivity/movements;
- islands/medians/openings;
- crossings;
- stop/yield lines.

A visual/geometric crossing must create a **candidate junction**, not automatic topology.

### 4. 2D / 3D views

The same canonical engineering model must drive:
- 2D plan;
- contextual cross section;
- synchronized 3D.

2D is the primary engineering authoring environment.

3D initially focuses on inspect/present and limited direct manipulation, not Blender-style modelling.

### 5. Scenarios/alternatives

Scenarios are core product state.

Must support an architecture for:
- Existing;
- Alternative A/B/etc.;
- duplicate/new alternative;
- scenario visibility/selection;
- overlay comparison;
- later side-by-side/before-after/change summary.

### 6. Markings and traffic-control assets

Engineering-sensitive markings should be procedural/semantic where practical:
- lane/edge lines;
- solid/dashed/double lines;
- stop/yield lines;
- arrows/stencils;
- crosswalks;
- hatch/chevrons;
- parking/bike/motorcycle markings.

Signs/signals/lights should use semantic assemblies rather than being only decorative meshes.

### 7. Presentation/context assets

Library should eventually cover:
- common vehicles;
- motorcycles;
- buses/coaches;
- trucks;
- trees/landscape;
- people;
- simple buildings;
- street furniture.

Each reusable asset should support machine-readable source/license metadata. A semantic asset may have both 2D and 3D representations.

The normal user workflow must not require manual SVG/GLB creation.

### 8. Standards and validation

Validation is advisory unless geometry is impossible or internally inconsistent.

Requirements:
- Thailand-first source hierarchy;
- explicit authority/document/version provenance;
- unverified/project assumptions clearly distinguished from official standards;
- project can remain pinned to an explicit standards-profile version;
- warning explanation should identify affected object and reference/source where applicable;
- engineer may intentionally override advisory guidance.

### 9. AI-assisted authoring

AI is an alternate authoring interface, not a separate geometry engine.

Natural-language requests must be translated into typed semantic commands that use the same:
- validation;
- preview;
- apply/cancel;
- undo/redo;
- dependency/regeneration path
as manual operations.

AI must never mutate raw mesh/render/project JSON directly as a shortcut.

### 10. Project state and persistence

Canonical engineering state must remain independent from React/DOM/render nodes.

Keep distinct concepts for:
- canonical engineering state;
- scenario state;
- presentation state;
- editor/session state.

Project schema requires versioning/migration once the production model is established.

## UX requirements

Baseline interaction:
- large viewport;
- compact persistent panels;
- Layers / Map / Library on the left;
- contextual Properties/Validation/AI on the right;
- small contextual bottom/tool area;
- visible scenarios;
- 2D / Split / 3D modes;
- clear Select vs Hand/Pan/Orbit modes;
- direct manipulation + exact numeric input;
- progressive disclosure;
- synchronized selection across views;
- reliable undo/redo;
- non-modal issue handling.

See `docs/UX_ARCHITECTURE_V0_1.md`.

## Engineering/geometry requirements

Canonical geometry must satisfy documented invariants and deterministic regression tests.

Do not accept a geometry feature based only on a visually plausible screenshot.

Required qualification strategy includes, where applicable:
- unit tests;
- canonical/golden fixtures;
- invariants;
- deterministic repeated-run tests;
- property/random tests;
- fuzz tests for risky polygon/junction operations;
- performance measurements.

## Current implementation relationship

The existing Phase 2E straight-road SVG implementation is a prototype and may be reused or replaced.

Backward compatibility with prototype-only abstractions is **not a product requirement** unless real project data later demonstrates a migration need.

Git history is the recoverable baseline.

## First architecture gate

Before production editor rewrite, complete `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`.

R1 must prove:
- generalized alignment/stationing;
- station-based variable-width components;
- generic turn-pocket lifecycle;
- candidate/connected T and four-leg junctions;
- explicit lane connectivity;
- shared derived 2D/3D geometry;
- deterministic qualification evidence;
- evidence-based TypeScript vs Rust/WASM kernel recommendation.

## Success criteria

Road Concept Builder succeeds when a traffic engineer can create a real-world roadway concept alternative materially faster than their current CAD/Illustrator/manual workflow while retaining:
- engineering dimensions;
- semantic road/lane/junction meaning;
- alternative/scenario structure;
- standards provenance;
- editability;
- clean 2D and 3D communication output.