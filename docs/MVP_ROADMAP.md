# Roadmap — Rebaseline v0.1

## Principle

The project no longer follows the legacy Phase 0/1/2 roadmap as the authoritative forward plan.

The existing Phase 2E prototype remains recoverable in Git history and may contribute reusable patterns, but future work follows stage gates below.

The roadmap is **evidence-gated** rather than feature-count gated. A stage is not complete because an agent reports that code exists; it is complete when the required acceptance evidence passes.

## R0 — Product / Architecture Rebaseline

Goal:
- establish one authoritative product direction before additional feature implementation.

Deliverables:
- repository rebaseline audit;
- product baseline/PRD;
- UX architecture;
- asset-system architecture;
- technical rebaseline;
- development operating model;
- updated `AGENTS.md` and project skills;
- executable R1 geometry-spike specification.

Gate:
- authoritative docs no longer conflict on 2D/3D/map/AI/product boundaries;
- old implementation is explicitly classified as prototype/reuse candidate rather than architecture constraint;
- next executable task is bounded and testable.

## R1 — Geometry & Semantic Kernel Spike

Goal:
- remove the largest technical uncertainty before rebuilding the production editor.

Must prove:
- generalized alignment and stationing;
- straight/arc/smooth conceptual curves;
- semantic cross-section components;
- station-based variable width/lifecycle;
- lane add/drop/taper;
- right-turn pocket as general lifecycle behavior;
- candidate vs connected junction topology;
- T/four-leg/skewed junction proof;
- explicit lane connectivity;
- one semantic model driving diagnostic 2D and 3D;
- deterministic fixtures/tests/invariants;
- performance measurements;
- evidence-based TypeScript vs Rust/WASM kernel recommendation.

Reference:
- `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`

Gate:
- R1 qualification report passes geometry-gate criteria.

## R2 — Production Editor Foundation

Start only after R1 passes.

Goal:
- create the actual map-first desktop editor architecture around the proven semantic kernel.

Expected capabilities:
- final canonical project/scenario state separation;
- command bus + undo/redo;
- dependency/dirty regeneration model;
- editor/session state separation;
- Layers / Map / Library / Properties workspace;
- Select/Hand navigation model;
- 2D / Split / 3D modes;
- synchronized selection;
- local project save/open with schema versioning;
- initial standalone desktop shell candidate;
- baseline autosave/recovery design.

Decisions during R2:
- whether to reuse or replace the Phase 2E React shell;
- final interactive 2D renderer (SVG/hybrid/Pixi/WebGL etc.);
- desktop packaging stack;
- map-renderer/provider interface.

Gate:
- one small project can be created, saved, reopened, edited and viewed in synchronized 2D/3D without legacy prototype assumptions leaking into canonical state.

## R3 — Golden Workflow Alpha

Goal:
- make the first real traffic-engineering workflow useful end to end.

Primary golden workflow:

```text
Map/reference
 -> trace/create divided road
 -> configure cross section
 -> create project access
 -> add right-turn pocket
 -> add median opening
 -> generated markings
 -> live 3D
 -> duplicate Alternative B
 -> compare
 -> export
```

Capabilities expected:
- road creation/editing;
- reusable cross-section configuration;
- exact numeric property editing + direct manipulation;
- project access/junction handling;
- turn pocket/taper/storage;
- median/opening;
- procedural basic markings;
- Existing / Alternative scenarios;
- basic validation/issues workflow;
- high-quality 2D export;
- useful 3D presentation output.

Gate:
- domain-owner UAT confirms the workflow is materially easier than the previous manual/CAD/Illustrator-style concept workflow.

## R4 — Intersection & Road-Feature Alpha

Goal:
- broaden from one access workflow to common intersection/road-improvement concepts.

Candidate features:
- T and four-leg intersection editing;
- skewed junction refinement;
- per-corner geometry;
- lane movements/connections;
- channelizing islands;
- stop/yield lines;
- crosswalks;
- lane additions/drops;
- road widening;
- bus bay;
- parking/bike/sidewalk/verge components;
- U-turn / median-treatment module using the generalized kernel.

Roundabout should be a specialized later sub-stage after ordinary junctions are robust.

Gate:
- canonical fixture set and real workflow UAT pass for representative intersection cases.

## R5 — Asset & Presentation Beta

Goal:
- make engineering concepts presentation-ready without requiring manual Illustrator/Blender work.

Capabilities:
- procedural marking library;
- semantic traffic signs;
- signal/streetlight assemblies;
- barriers/guardrails/bollards/delineators;
- coherent vehicle starter set;
- trees/landscape/context props;
- simple buildings/massing;
- asset placement along point/path/edge/area;
- 2D + 3D representation linkage;
- Engineering vs Presentation 3D modes;
- saved camera views;
- improved materials/shadows/environment;
- asset license/provenance manifest.

Gate:
- asset/library workflow requires no manual asset production by the normal user;
- license/provenance review passes;
- visual regression/performance acceptable for representative projects.

## R6 — Thailand Engineering Profile Beta

Goal:
- turn Thailand/LHT support from defaults/assumptions into a structured versioned engineering profile.

Work:
- authoritative standards source register;
- DOH/DRR applicability review;
- versioned pavement marking definitions;
- sign/sign-face starter library;
- signals/safety-device/lighting source references where applicable;
- advisory validation rules;
- explicit source/version/section provenance;
- project-pinned standards profile;
- override explanations.

Gate:
- no unverified value is presented as official;
- standard-sensitive assets/rules trace back to recorded sources;
- traffic-side behavior passes LHT regression tests.

## R7 — AI-Assisted Authoring Beta

Goal:
- let the user express engineering intent in natural language without bypassing deterministic product behavior.

Capabilities:
- typed command schemas;
- intent -> command proposal;
- preview/change summary;
- validation before apply;
- Apply / Cancel;
- one-transaction undo;
- explain selection;
- identify missing/invalid concept elements;
- propose alternative scenario without auto-overwriting Existing.

Example:

> Add a 3 m right-turn pocket, 30 m taper and 50 m storage before Hotel Access A.

AI must produce semantic command(s), never direct mesh or raw project-state mutation.

Gate:
- deterministic command equivalence tests prove AI and manual UI operations reach the same domain behavior;
- invalid/ambiguous requests are safely constrained;
- AI changes are previewable and undoable.

## R8 — Product Beta / Hardening

Work:
- performance profiling and large-scene handling;
- autosave/crash recovery;
- project schema migration;
- accessibility/keyboard QA;
- window-size/responsive desktop QA;
- installer/desktop packaging;
- offline behavior;
- map-provider/licensing hardening;
- dependency/SBOM/license review;
- clean-environment qualification;
- documentation/help.

Gate:
- production-beta qualification report.

## R9 — Release Candidate

Required evidence:
- clean build/package;
- deterministic regression suite;
- geometry gate;
- UX/golden-workflow UAT;
- asset/license gate;
- project migration tests;
- Windows target validation;
- known limitations documented;
- no critical unresolved source-of-truth/geometry defects.

## Deferred / separate future modules

Do not pull these into early stages without explicit product review:
- detailed vertical alignment;
- terrain/cut-fill;
- drainage;
- BIM authoring;
- full swept-path analysis;
- traffic microsimulation;
- signal timing optimization;
- cloud collaboration;
- multi-user editing;
- large plugin marketplace;
- full CAD/DWG replacement;
- detailed highway-construction design.

These may later integrate with the concept model, but they should not distort the core product before R3/R4 workflows are excellent.