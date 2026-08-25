# Repository Rebaseline Audit — 2026-08-25

## Purpose

This audit records what the current Phase 2E prototype proves, what should be preserved, and what must not constrain the next product architecture.

The repository is **not empty**. It contains a functioning React/TypeScript/Vite prototype through Phase 2E with straight-road parametric geometry, a U-turn/median-opening feature, marking-object editing, JSON save/load, SVG export, validation, and tests. The rebaseline therefore treats the current implementation as a prototype/migration asset rather than discarding it blindly.

## Current baseline

Latest reviewed main commit: `de13c5cae229f340054121bc9fa26cd56c914ef8` — `Implement Phase 2E practical editor workflow`.

Current technical shape:
- React 19 + TypeScript + Vite;
- SVG as the preview/export renderer;
- TypeScript domain and geometry modules;
- browser-local `ProjectDocument` state;
- JSON project download/load;
- Vitest-based tests;
- no map/geospatial layer;
- no generalized alignment model;
- no 3D renderer;
- no desktop shell;
- no AI command layer.

## What the prototype already proves

### Keep / reuse conceptually

1. **Separation of concerns**
   - UI, domain, geometry, validation, and export already live in separate modules.
   - Preserve this architectural discipline.

2. **Meters as domain units**
   - Domain values are not authored directly in screen pixels.
   - Preserve metric-native authoring.

3. **Non-blocking validation philosophy**
   - Warnings guide rather than interrupt except for impossible geometry.
   - Preserve this product behavior.

4. **Standards provenance/status**
   - Existing source-status values (`THAI_AUTHORITY`, `AGENCY_MANUAL`, `INTERNATIONAL_BEST_PRACTICE`, `PROJECT_ASSUMPTION`, `CUSTOM_CONCEPT`, `TODO_VERIFY`) are useful and should evolve into a versioned source/provenance model.

5. **Object management patterns**
   - Selection, lock, visibility, z-order, duplicate/delete, and an object list are useful editor primitives.
   - Preserve the interaction concepts, but do not preserve the current marking-only object schema as the future universal model.

6. **Serializable project state**
   - Project data should remain serializable and independent from React/DOM objects.
   - Preserve this as a hard rule.

7. **Export mindset**
   - SVG output and local project save/load remain valuable outputs even after the renderer changes.

8. **Small testable geometry functions**
   - Geometry work should remain deterministic and independently testable.

## What is prototype-specific and should not constrain the new model

### Replace / generalize

1. **`StraightRoadParameters`**
   - Current state assumes a single horizontal road and eastbound/westbound directions.
   - Replace with reference alignment + stationing + semantic road components/lane sections.

2. **Fixed cross section**
   - Current lane width/median/shoulder model is effectively uniform along the whole segment except custom U-turn logic.
   - Replace with station-based component/lane width profiles so taper, widening, lane add/drop, turn pockets, bus bays, and transitions use one general mechanism.

3. **U-turn-specific pocket special case**
   - The current nested pocket model was appropriate for the prototype but should not become a permanent special-case geometry family.
   - Migrate toward a generic auxiliary/turn-lane lifecycle model.

4. **`pxPerMeter` as a prominent drawing setting**
   - Screen scale belongs to view/rendering state, not engineering/project truth.
   - The future project model should use engineering/local coordinates and derive view transforms separately.

5. **Canvas-object world position stored as simple x/y overlay**
   - Road-attached signs, markings, lights, and furniture should normally support semantic attachment (road/lane/edge + station/lateral offset) rather than only free world x/y placement.

6. **SVG as the primary editor architecture**
   - SVG remains a valuable export format and may remain useful for some overlays, but the future editor must not make SVG nodes the authoritative design objects.

7. **Project document mixing selection state with persisted engineering state**
   - `selectedObjectId` is UI/session state and should not be treated as permanent engineering content.
   - Future schema should distinguish canonical project model, scenario/model state, presentation state, and ephemeral editor state.

8. **Phase-specific numeric safeguards**
   - Existing bounds are safe prototype limits, not standards.
   - Preserve the idea of defensive bounds but move them out of standards semantics.

## Product assumptions that are now obsolete

The current authoritative docs explicitly describe the product as:
- 2D only;
- template-first;
- SVG-first;
- not map-first;
- not 3D;
- not AI-assisted;
- not a full direct-manipulation road editor.

Those statements are superseded by the new rebaseline direction. They should not guide new feature implementation after the rebaseline is accepted.

## New product direction

Road Concept Builder becomes a **map-first, standalone, engineering-aware street and intersection concept designer** with:
- 2D plan authoring;
- synchronized live 3D;
- semantic/station-based road geometry;
- first-class junction topology;
- scenarios/alternatives;
- procedural and semantic assets;
- Thailand/LHT-first standards profiles;
- AI-assisted natural-language actions translated to deterministic previewable commands.

It remains a concept-design tool, not a Civil 3D/OpenRoads replacement.

## Migration stance

Do not rewrite everything immediately.

Recommended sequence:
1. freeze old roadmap feature expansion;
2. keep the Phase 2E prototype buildable and readable;
3. create the new semantic/geometry spike beside the old implementation;
4. prove generalized alignment/lane/junction data and dual 2D/3D rendering;
5. decide at the spike gate whether to migrate the current shell incrementally or replace the editor shell while reusing export/state/validation patterns;
6. provide an explicit migration path for any project data worth preserving.

## Immediate technical risks

1. Junction geometry and topology robustness.
2. Generalized variable-width lane generation.
3. Precision/coordinate handling for map-scale projects.
4. Keeping one semantic source for 2D and 3D.
5. Renderer/editor performance as object counts grow.
6. Licensing/provenance for basemaps and third-party 3D assets.
7. Preventing AI from mutating low-level scene state directly.

## Rebaseline decision

**Do not implement the old next phase until the rebaseline PR is accepted.**

The next executable engineering task after rebaseline should be a bounded geometry/semantic spike, not a new road feature in the existing straight-road engine.