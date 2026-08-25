# Phase 2E Code Reuse / Retire Matrix

## Purpose

Reduce migration ambiguity before Stage R1/R2. This matrix is based on direct review of the Phase 2E repository structure and representative source files at baseline `de13c5cae229f340054121bc9fa26cd56c914ef8`.

Categories:
- **REUSE** — code/pattern is likely directly useful;
- **SALVAGE PATTERN** — keep the idea/tests/behavior, but expect new implementation;
- **REPLACE** — architecture is tied to obsolete assumptions;
- **KEEP TEMPORARILY** — preserve while the replacement is being proven, then retire if superseded.

The product owner has explicitly allowed a rewrite. Therefore no file is protected merely because it already works.

## Executive conclusion

The repository is small and clean enough that **selective rewrite is preferable to compatibility-driven migration**.

Best reuse candidates are utilities and behavioral principles, not the central domain/geometry/UI architecture.

The current project has very few external dependencies, which lowers rewrite risk: React, React DOM, TypeScript, Vite and Vitest only at the reviewed baseline.

## File/module matrix

| Area / file | Decision | Rationale | R1/R2 action |
|---|---|---|---|
| `package.json` / Vite/TS/Vitest base | REUSE initially | Small, modern TypeScript toolchain and test runner. No heavy framework debt. | Keep for R1 unless Rust/WASM or diagnostic 3D requires additions. Reassess desktop packaging in R2. |
| `src/main.tsx` | REUSE initially | Thin React entrypoint, not product-specific. | Keep until production shell decision. |
| `src/app/App.tsx` | REPLACE | Hard-wires one `parametricRoad`, one SVG preview, current selection state, and straight-road validation directly in top-level React state. | R2 should use project/scenario/command/editor-state architecture. Do not extend this container into the new editor. |
| `src/components/LeftPalette.tsx` | SALVAGE PATTERN | Palette concept is useful, but future left side is Layers/Map/Library rather than old template/marking palette. | Replace UI; retain discoverability/compact-control lessons only. |
| `src/components/RightInspector.tsx` | REPLACE | Large component is tightly coupled to `StraightRoadParameters`, eastbound/westbound controls, Phase numeric limits and U-turn special cases. | Rebuild as contextual semantic inspector architecture. Reuse generic numeric-field ergonomics only if convenient. |
| `src/components/StraightRoadPreview.tsx` | KEEP TEMPORARILY / REPLACE | Useful historical/diagnostic SVG evidence, but straight-road SVG is not the generalized editor renderer or source of truth. | Keep legacy tests/build until R1 proof exists. Do not generalize this file into the new road/junction renderer. |
| `src/components/TopBar.tsx` | SALVAGE PATTERN | New/File/Undo/Export-style top controls remain useful, but scenario/view modes change substantially. | Rebuild/reshape during R2; reuse small UI pieces only if they fit. |
| `src/components/ValidationPanel.tsx` | SALVAGE PATTERN | Non-modal issue list is directionally correct and small. | Preserve issue-list interaction concept; future issues require target IDs, focus/zoom, source/provenance and override behavior. |
| `src/domain/straightRoad.ts` | REPLACE | Core schema is fixed straight-road, uniform-width and compass-specific. U-turn pocket is a nested special case. `pxPerMeter` drawing settings live too close to domain assumptions. | Do not evolve into generalized model. Build new alignment/component/lifecycle types beside it in R1, then retire. |
| `src/domain/projectDocument.ts` | REPLACE schema / SALVAGE utilities | Mixes canonical road, overlay objects, view options, selection and deleted-generated UI bookkeeping. Sanitization/serialization and stable-ID/object-management patterns are useful. | Build new canonical Project/Scenario/Editor separation. Reuse/adapt defensive parsing/serialization utilities only after schema is defined. |
| `src/geometry/straightRoadGeometry.ts` | KEEP TEMPORARILY / REPLACE | Contains working deterministic Phase geometry and is valuable regression/reference evidence, but geometry assumptions are fundamentally straight/east-west and feature-specific. | Keep while R1 develops new kernel. Do not wrap this as the generalized alignment kernel. Retire when equivalent/new fixtures pass. |
| `src/validation/validateStraightRoad.ts` | REPLACE rules / SALVAGE framework idea | Rules are coupled to Phase numeric safeguards and east/west/U-turn-specific prerequisites. Rule IDs and non-blocking issues are useful. | Create generalized geometry feasibility + standards/profile validation layers. Preserve/adapt rule-id/source concept, not numeric limits. |
| `src/export/projectExport.ts` | REUSE / ADAPT | `downloadTextFile` and standalone SVG serialization are small, isolated utilities. | Likely retain for SVG/export support. Remove DOM-selection assumptions if production renderer/export changes. |
| `src/test/straightRoadGeometry.test.ts` | KEEP TEMPORARILY | Large regression suite documents Phase 2E behavior. Not authoritative for new geometry semantics. | Keep green while possible during R1; later archive/delete only after new canonical fixture coverage supersedes its useful behavior. |
| `src/test/straightRoadValidation.test.ts` | KEEP TEMPORARILY | Useful evidence of prototype validation behavior, but many numeric assumptions are not standards. | Do not port numeric limits blindly. Retire after new feasibility/profile rule tests replace it. |
| `src/test/projectDocument.test.tsx` | SALVAGE PATTERN | Save/load sanitization and object operations are useful test categories. | Recreate equivalent tests against new schema/command state rather than preserving old type structure. |
| `src/test/App.test.tsx` | KEEP TEMPORARILY / REPLACE | Protects legacy UI workflow. New UX architecture differs substantially. | Maintain until production shell replacement; replace with golden-workflow/E2E tests. |
| `src/styles/*` | SALVAGE VISUAL TOKENS selectively | Existing clean technical styling may contain usable spacing/colors, but production UI structure is changing. | Reuse only after visual audit; do not preserve layout CSS as a constraint. |

## Domain decisions derived from the audit

### 1. Do not mutate `StraightRoadParameters` into a universal road type

A compatibility-driven evolution would accumulate optional fields for:
- curves;
- station sections;
- arbitrary directions;
- junctions;
- scenarios;
- component lifecycles.

That would preserve the file name while effectively creating a new model inside a prototype type. Build a clean generalized model instead.

### 2. Do not preserve `eastbound` / `westbound`

The new model should express:
- road/reference direction;
- forward/backward or side-relative lane orientation;
- travel direction consistent with LHT/RHT semantics;
- arbitrary alignment bearing.

Compass labels belong to contextual/presentation metadata when useful.

### 3. Do not preserve the U-turn pocket as the model for future auxiliary lanes

The current pocket implementation proves taper/storage concepts but should be converted conceptually into:
- lane/component start/end lifecycle;
- piecewise width profile;
- movement semantics;
- attachment to junction/access/median feature.

### 4. Do not preserve screen coordinates in semantic asset placement

Current canvas marking objects use simple `x/y` positions.

Future road-attached assets should prefer:
- road + station + lateral offset;
- lane + station;
- edge/path + station/offset;
- junction/corner/approach reference;
with world/local x/y available as explicit free-placement mode.

### 5. Keep export utilities decoupled

SVG remains useful for reports even if the interactive renderer changes. Export should consume derived/vector scene data rather than scraping the production editor DOM where possible.

## Test migration strategy

Do not delete legacy tests at the start of the rewrite.

Use this sequence:
1. run/record legacy baseline;
2. build new R1 tests beside old tests;
3. establish canonical fixture coverage;
4. classify old tests as:
   - still valid product invariant;
   - legacy behavior only;
   - duplicate of new test;
   - incorrect/obsolete assumption;
5. delete/archive obsolete tests only in the explicit production-cutover task.

No test should survive merely to force new architecture to imitate old behavior.

## Recommended code-structure direction for R1

Keep the new spike isolated enough that old code does not leak assumptions into it.

One possible TypeScript-side structure if the first proof remains in TS:

```text
src/
  kernel-next/
    alignment/
    road/
    junction/
    topology/
    mesh/
    fixtures/
```

If a Rust micro-spike is justified:

```text
crates/
  road-kernel/
    src/
    tests/
```

Names are illustrative, not mandatory. The requirement is architectural isolation during the proof.

## Production cutover recommendation

If R1 passes:
- prefer a deliberate R2 editor-core replacement;
- retain useful small utilities/patterns;
- remove straight-road-specific production code once equivalent golden workflows and migration decisions are complete;
- do not carry a long-lived `legacy vs new` dual architecture beyond the minimum transition window.

The product is early enough that a clean cut is lower risk than maintaining two generations indefinitely.