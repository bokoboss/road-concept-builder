# Road Concept Builder

Road Concept Builder is being rebaselined as a **map-first, engineering-aware street and intersection concept design environment** for traffic engineers and transport planners.

The goal is to make real-world roadway concepts substantially faster to create than CAD-heavy workflows while preserving engineering dimensions, semantic road/lane/junction structure, editability, and presentation quality.

## Current repository status

`main` currently contains a working **Phase 2E prototype** focused on a parameter-driven straight-road SVG editor. It includes:
- straight-road lane/median/shoulder parameters;
- median opening/U-turn and a prototype pocket lane;
- pavement-marking objects;
- object selection/lock/visibility/z-order;
- non-blocking validation;
- local JSON save/load;
- SVG export;
- TypeScript/Vitest tests.

That prototype is useful evidence, but its old 2D-SVG-only roadmap is no longer the intended final product architecture.

The current rebaseline is tracked by GitHub issue #1 and the rebaseline PR/branch. New implementation work should follow the rebaseline documents and `AGENTS.md` rather than extending the old roadmap by default.

## Product direction

The rebaselined product targets:
- standalone desktop use;
- map/satellite/imported-plan starting workflows;
- 2D plan view as the primary engineering authoring surface;
- synchronized live 3D derived from the same semantic model;
- metric-native geometry;
- Thailand and left-hand traffic as the default context;
- configurable LHT/RHT architecture;
- reference-alignment and station-based road geometry;
- component-based cross sections;
- native longitudinal taper/widening/lane-add/drop/turn-pocket behavior;
- first-class junction geometry and topology;
- Existing / Alternative scenarios;
- procedural markings and semantic sign/signal/street-furniture assets;
- reusable 2D/3D asset library;
- advisory, source-versioned standards profiles;
- future AI-assisted natural-language actions translated into typed, previewable, validated, undoable semantic commands.

The product remains a **concept-design tool**, not a construction drawing package or a Civil 3D/OpenRoads replacement.

## Core product principles

1. Map first.
2. Plan authoring first.
3. One semantic model drives 2D, cross section, and 3D.
4. Semantic engineering objects come before graphics.
5. Automation first; manual override second.
6. Direct manipulation and exact numeric input coexist.
7. Presets instantiate editable components; they are not opaque/static graphics.
8. Longitudinal road changes are station-based primitives, not detached feature polygons.
9. Geometry and topology are separate; visual crossing does not automatically create a junction.
10. Standards warnings are advisory and provenance-aware.
11. AI uses the same command/validation/undo pipeline as manual editing.
12. The normal workflow must not require the user to manually create SVG/GLB assets or use Illustrator/Blender.

## Authoritative rebaseline documents

Read these before new implementation work:

- `AGENTS.md`
- `docs/REBASELINE_AUDIT_2026-08-25.md`
- `docs/PRODUCT_BASELINE_V0_1.md`
- `docs/UX_ARCHITECTURE_V0_1.md`
- `docs/ASSET_SYSTEM_V0_1.md`
- `docs/TECHNICAL_REBASELINE_V0_1.md`
- `docs/DEVELOPMENT_OPERATING_MODEL_V0_1.md`
- `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`

Project skills:
- `.agents/skills/thai-road-diagram/SKILL.md`
- `.agents/skills/scrutinize-change/SKILL.md`
- `.agents/skills/geometry-gate/SKILL.md`
- `.agents/skills/ux-gate/SKILL.md`

Older files such as `docs/PRD.md`, `docs/MVP_ROADMAP.md`, `docs/UI_UX_GUIDELINES.md`, and legacy Phase 2E data-model notes remain historical/prototype context. When they conflict with the rebaseline documents above, the rebaseline documents are authoritative.

## Next executable stage

After the rebaseline is accepted, the preferred next stage is **R1 — Geometry & Semantic Kernel Spike**.

R1 must prove before a production editor rewrite:
- generalized horizontal alignment and stationing;
- station-based variable-width components/lanes;
- right-turn pocket as a general lane lifecycle/transition;
- candidate T/four-leg junction geometry;
- explicit lane connectivity/topology;
- shared derived geometry for minimal 2D and 3D views;
- deterministic tests, invariants, stress fixtures, and benchmark evidence;
- an evidence-based TypeScript vs Rust/WASM kernel recommendation.

The Phase 2E implementation may be reused or replaced. Backward compatibility with prototype-only abstractions must not constrain a better architecture. Git history remains the recoverable baseline.

## Current prototype commands

The preserved Phase 2E prototype currently uses:

```text
Install: npm install
Run: npm run dev
Test: npm test
Type check: npm run typecheck
Build: npm run build
```

Current stack:
- React 19;
- TypeScript;
- Vite;
- Vitest;
- SVG preview/export.

A future geometry spike may add Rust/WASM and 3D diagnostic dependencies; those choices are not frozen until the R1 evidence gate is complete.

## Development approach

Substantial work follows:

```text
Research -> Specify -> Plan -> Scrutinize -> Implement -> Verify -> Independent Review -> UAT -> Merge
```

Use the cheapest model that can reliably complete a bounded task. Research/specification/review should remove ambiguity before Codex implementation. See `docs/DEVELOPMENT_OPERATING_MODEL_V0_1.md`.