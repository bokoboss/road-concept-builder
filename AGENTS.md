# AGENTS.md

Repository-level instructions for Codex and other coding agents.

## Current transition status

The repository contains a working **Phase 2E prototype** built around a straight-road, 2D SVG, parameter-driven editor. That prototype is preserved as migration evidence, but its old product roadmap is **not authoritative for new feature development**.

The project is being rebaselined under GitHub issue #1 toward a map-first, engineering-aware 2D/3D street and intersection concept designer.

Before substantial implementation, read the documents relevant to the task. For R1 geometry work, the minimum authoritative set is:
- `docs/PRODUCT_BASELINE_V0_1.md`;
- `docs/PRD.md`;
- `docs/DECISIONS.md`;
- `docs/TECHNICAL_REBASELINE_V0_1.md`;
- `docs/DATA_MODEL.md`;
- `docs/GEOMETRY_SCALE_POLICY.md`;
- `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`;
- `docs/CODEX_R1_EXECUTION_PACKET.md`;
- `docs/DEVELOPMENT_OPERATING_MODEL_V0_1.md`;
- `docs/REBASELINE_AUDIT_2026-08-25.md`;
- `docs/PHASE2E_CODE_REUSE_MATRIX.md`.

For UX/editor work also read:
- `docs/UX_ARCHITECTURE_V0_1.md`;
- `docs/UI_UX_GUIDELINES.md`;
- `docs/TOOL_TAXONOMY_V0_1.md`;
- `docs/VISUAL_DESIGN_SYSTEM_V0_1.md`.

For assets/Thailand-profile work also read:
- `docs/ASSET_SYSTEM_V0_1.md`;
- `docs/ASSET_STARTER_CATALOG_V0_1.md`;
- `docs/THAILAND_STANDARDS_SOURCE_REGISTER_V0_1.md`;
- `.agents/skills/thai-road-diagram/SKILL.md`.

Historical Phase 2E detail documents may remain useful as prototype evidence, but they must not override the rebaseline documents above when they conflict.

## Product intent

Build a lightweight professional concept-design environment for traffic engineers and transport planners.

Core direction:
- standalone desktop target;
- map/satellite/imported-plan first workflow;
- 2D plan view as the primary engineering authoring surface;
- synchronized live 3D from the same semantic model;
- metric-native;
- Thailand/LHT default with LHT/RHT-configurable architecture;
- reference-alignment + station-based road model;
- component-based cross sections;
- native taper/widening/lane-add/drop/turn-pocket lifecycle;
- first-class junction geometry + topology;
- Existing / Alternative scenarios;
- procedural and semantic asset system;
- advisory standards with source/version provenance;
- future natural-language AI actions translated to typed, previewable, undoable semantic commands.

The product remains a concept-design tool, not a Civil 3D/OpenRoads replacement.

## Hard architecture rules

Do not violate these without an explicit architecture decision:

1. Project source of truth is semantic engineering data, not SVG, Canvas nodes, or 3D meshes.
2. 2D and 3D must derive from one model/geometry pipeline.
3. Road geometry must support a generalized reference alignment and stationing.
4. Longitudinal changes must be general station-based behavior, not one-off feature polygons.
5. Junction geometry and topology are separate; geometric crossing is only a candidate connection.
6. Junctions and lane connections are first-class semantic objects.
7. Render/view scale is not engineering/project truth.
8. Standards/rules are separate from geometry feasibility.
9. AI must not mutate raw mesh or project JSON directly; it may propose typed commands through the same command/validation/undo path used by the UI.
10. Do not hard-code unverified Thai-standard values as authoritative requirements.
11. Do not copy competitor source code or assets. Research is architectural inspiration only unless license review explicitly approves reuse.

## Rewrite / migration policy

The Phase 2E implementation is not protected for its own sake.

- Preserve Git history and a recoverable baseline.
- Reuse code only when reuse clearly reduces risk/cost without distorting the rebaselined architecture.
- Replace old data model, geometry, renderer, state design, tests, or UI when they materially conflict with the new source of truth.
- Do not spend significant effort creating compatibility shims for prototype-only behavior unless real project data demonstrates a migration need.
- Keep legacy tests/code only for the minimum transition period required to prove the replacement.
- Prefer a clean production cutover over a long-lived dual architecture.

Useful Phase 2E concepts likely worth preserving or adapting:
- domain/UI/geometry/validation separation;
- meters as domain units;
- non-blocking validation;
- standard/source provenance statuses;
- selection/lock/visibility/z-order concepts;
- defensive serialization/sanitization patterns;
- SVG export as one output format;
- small deterministic geometry tests.

Prototype-specific structures such as `StraightRoadParameters`, eastbound/westbound orientation, a U-turn-specific pocket special case, and `pxPerMeter`-driven editor assumptions must not define the generalized model.

## UX direction

The product should be faster and easier than CAD but more precise than a generic diagram tool.

Principles:
- viewport first;
- 2D plan authoring first;
- Split 2D/3D as a signature view;
- direct manipulation + exact numeric input;
- progressive disclosure;
- small contextual tool set instead of a CAD ribbon;
- navigation and editing modes clearly separated;
- synchronized selection across 2D/3D/section;
- visible scenarios/alternatives;
- Issues panel + on-canvas validation, not modal warning spam;
- automation generates common geometry, engineer may override;
- user must not be required to manually create SVG/GLB assets or use Illustrator/Blender as part of the normal workflow.

## Asset direction

Prefer this order:
1. procedural geometry/marking generation;
2. semantic assemblies;
3. original project-generated vector/simple 3D assets;
4. permissively licensed third-party assets after provenance/license review.

Every third-party asset must have auditable source/license metadata.

Do not commit competitor assets without explicit license confirmation.

## Engineering/testing discipline

Geometry changes require evidence, not visual confidence alone.

For generalized geometry/kernel work, plan for:
- unit tests;
- canonical/golden geometry fixtures;
- invariants;
- deterministic output checks;
- property-based/randomized tests where appropriate;
- fuzz tests for risky geometry operations where feasible;
- benchmark/regression evidence.

Critical invariants include:
- finite coordinates;
- monotonic stationing;
- non-negative component/lane width;
- valid parent/topology references;
- no unintentional self-intersection/invalid holes after cleanup;
- no degenerate/NaN mesh triangles;
- valid lane-connection endpoints;
- no network connection created solely because paths visually cross.

## Work discipline

For substantial work:
1. inspect repository and authoritative rebaseline docs;
2. restate the task boundary and affected modules;
3. plan before editing;
4. use `.agents/skills/scrutinize-change/SKILL.md` when architectural blast radius is material;
5. implement in a bounded branch/worktree;
6. add/update tests with the implementation;
7. run all relevant deterministic checks;
8. review execution paths, not only diffs;
9. apply the appropriate qualification skill (`geometry-gate`, `ux-gate`, etc.);
10. update docs/qualification evidence when behavior changes;
11. stop if the task requires an unresolved product/architecture decision rather than inventing one silently.

Avoid speculative abstractions that are not required by the current or immediate next stage.

## Current development commands

The preserved Phase 2E prototype currently uses:

```text
Install: npm install
Run: npm run dev
Test: npm test
Type check: npm run typecheck
Build: npm run build
```

These commands describe the existing TypeScript prototype. A future kernel spike may add Rust/WASM commands; document them explicitly when that spike is created.

## Immediate next executable stage

After rebaseline approval, the preferred next task is **Stage R1 — Geometry & Semantic Kernel Spike**, not continuation of the old Phase 2E feature roadmap.

Use:
- `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`;
- `docs/CODEX_R1_EXECUTION_PACKET.md`;
- `.agents/skills/geometry-gate/SKILL.md`.

The spike should prove, at minimum:
- generalized alignment/station API;
- variable-width lane/component profiles;
- turn pocket as a general longitudinal transition;
- candidate T/four-leg junction and lane connectivity;
- shared derived geometry for a minimal 2D diagnostic view and minimal synchronized 3D view;
- deterministic tests/fixtures/benchmarks;
- evidence-based TypeScript vs Rust/WASM kernel recommendation.

Do not build polished production UI, a large asset library, terrain, simulation, or AI integration before this spike passes its qualification gate.