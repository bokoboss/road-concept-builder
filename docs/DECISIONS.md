# Decisions Log

This log records current authoritative product/architecture decisions. Legacy Phase 2E decisions are retained only where they still apply.

Status values:
- `ACTIVE` — current authoritative direction;
- `SUPERSEDED` — historical decision, no longer authoritative;
- `DEFERRED` — intentionally not frozen yet.

## D001 — Concept design, not construction design

**Status:** ACTIVE

Road Concept Builder is an engineering-aware concept design and communication environment, not a construction drawing package or a Civil 3D/OpenRoads replacement.

Detailed grading, drainage, earthworks, BIM, full swept path, traffic simulation, and signal optimization are separate/deferred domains.

## D002 — Thailand/LHT default, not compass-specific logic

**Status:** ACTIVE

Default jurisdiction/context is Thailand and left-hand traffic.

The canonical model must support LHT/RHT without encoding permanent eastbound/westbound special cases.

## D003 — Map-first project workflow

**Status:** ACTIVE

A project should be able to start from a real map/satellite/reference plan, imported image, or blank/local canvas.

Map/reference state is first-class but not canonical road geometry.

## D004 — 2D plan authoring is primary

**Status:** ACTIVE

2D plan is the primary engineering authoring environment.

Cross section is contextual, and 3D is synchronized from the same model for inspection/presentation and limited editing.

## D005 — One semantic source of truth for 2D and 3D

**Status:** ACTIVE

SVG, Canvas/WebGL objects, and 3D meshes are derived representations.

Canonical road/lane/junction/asset engineering semantics live in renderer-independent project data.

## D006 — Reference alignment + stationing

**Status:** ACTIVE

Generalized roads use reference alignment and stationing.

Longitudinal changes such as taper, widening, lane add/drop, turn pocket, and median transition should use station-based component/lane profiles rather than detached special-case polygons.

## D007 — Cross section is component based

**Status:** ACTIVE

Road configurations/presets instantiate ordered editable semantic components.

A preset is a generator, not an opaque graphic object.

## D008 — Geometry and topology are separate

**Status:** ACTIVE

Roads that visually/geometrically cross create a candidate junction only.

Network connection requires explicit connected-junction/topology state. Grade-separated or ignored candidates remain disconnected.

## D009 — Junctions and lane connections are first-class semantic objects

**Status:** ACTIVE

Junctions model approaches, per-corner geometry, and explicit lane connectivity/movements.

Do not infer all network behavior from final pavement polygons.

## D010 — Direct manipulation + exact numeric input

**Status:** ACTIVE

The editor should support fast grips/drag interaction and precise property entry against the same semantic parameters.

## D011 — Automation first, manual override second

**Status:** ACTIVE

Common road geometry, markings, signs/assemblies, and repeated assets should be generated from semantic parameters where possible.

The engineer may override generated results when project context requires it.

The normal workflow must not require the user to manually draw SVG assets, model GLB assets, or use Illustrator/Blender.

## D012 — Advisory validation

**Status:** ACTIVE

Engineering/standards validation guides rather than interrupts unless geometry is impossible or internally inconsistent.

Unverified values must not be presented as official standards.

## D013 — Standards require provenance/versioning

**Status:** ACTIVE

Standard-sensitive rules/assets should identify authority, document/manual, version/edition/effective date where available, and applicability.

Projects should eventually pin an explicit standards-profile version rather than silently adopting new values.

## D014 — Markings are semantic/procedural where practical

**Status:** ACTIVE

Lane/edge lines, crosswalks, arrows, hatching, stop/yield lines, and similar engineering markings should normally be procedural or semantic objects rather than raster artwork.

## D015 — Asset system uses typed families

**Status:** ACTIVE

Asset families:
- procedural road components;
- procedural markings;
- semantic assemblies;
- props;
- distributions.

A semantic asset may expose both 2D and 3D representations.

## D016 — Third-party assets require license provenance

**Status:** ACTIVE

Prefer generated/project-controlled assets for core engineering content and permissive/CC0-style sources for generic context assets when appropriate.

Do not copy competitor assets/code without explicit license confirmation.

## D017 — Scenarios/alternatives are core state

**Status:** ACTIVE

Existing and proposed alternatives are visible first-class project concepts rather than separate unrelated project files.

Comparison behavior must not mutate compared scenarios.

## D018 — Command architecture is the editing boundary

**Status:** ACTIVE

Committed engineering edits should use typed semantic commands/transactions that support validation and undo/redo.

This is also the future AI integration boundary.

## D019 — AI proposes semantic commands, not raw scene mutations

**Status:** ACTIVE

Natural-language AI actions may propose/edit through typed commands with preview, validation, Apply/Cancel, and undo.

AI must not directly edit meshes, SVG nodes, renderer objects, or raw project JSON as an implementation shortcut.

## D020 — Prototype backward compatibility is not a hard requirement

**Status:** ACTIVE

The existing Phase 2E prototype may be reused, partially salvaged, or replaced.

Preserve Git history/recoverability. Do not build significant compatibility debt around prototype-only abstractions unless real project data creates a demonstrated migration need.

## D021 — Geometry changes require machine-verifiable evidence

**Status:** ACTIVE

Screenshots alone cannot qualify geometry.

Use canonical fixtures, invariants, deterministic tests, property/fuzz testing where applicable, and performance evidence.

## D022 — Kernel language is not frozen until R1 evidence

**Status:** DEFERRED

TypeScript and Rust/WASM are credible candidates.

Stage R1 must recommend the kernel approach based on robustness, dependency quality, testing, performance, WASM/native integration, and maintenance complexity.

## D023 — Interactive 2D renderer is not frozen until R1/R2

**Status:** DEFERRED

SVG remains a useful export/diagnostic representation, but is no longer assumed to be the production editing renderer.

Potential approaches include SVG/hybrid and GPU/vector renderers.

## D024 — Standalone desktop is the target product form

**Status:** ACTIVE

The intended product is a standalone desktop application, with Windows as the first practical target unless later evidence changes this decision.

Core design should work offline; online map/satellite providers may require connectivity.

## D025 — Legacy SVG-first decision

**Status:** SUPERSEDED

Legacy decision: use SVG as primary rendering and export architecture.

Current direction: retain SVG as a useful output/diagnostic path but do not make it the canonical editor architecture.

## D026 — Legacy template-first workflow

**Status:** SUPERSEDED

Legacy decision: choose a fixed situation/template then configure parameters.

Current direction: map/reference + alignment authoring is primary, with presets used as generators for editable road configurations.

## D027 — Legacy static three-panel shell before geometry

**Status:** SUPERSEDED

The Phase 0 UI-first prototype served its purpose.

Current risk priority is generalized semantic/geometry proof before rebuilding the production editor shell.