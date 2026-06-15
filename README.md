# Road Concept Builder

Road Concept Builder is a lightweight 2D plan-view road layout diagram builder for traffic engineering reports, concept presentations, and early-stage road improvement communication.

The product is intended for Thai left-hand-traffic conditions and traffic engineering use cases such as road segments, U-turn openings, intersection approaches, pocket lanes, free-left slip lanes, roundabouts, access management, and pavement markings.

## Product Positioning

This is a **template-first, parameter-driven, live-preview visual authoring tool**.

It is not:

- a construction drawing package;
- a CAD replacement;
- a traffic simulation package;
- a signal timing calculator;
- a swept-path analysis tool;
- an AI image generator;
- a freehand drafting tool.

The first goal is to make clean, useful, editable concept diagrams that can be exported to reports and presentations.

## Core UX Principle

The user should be able to:

1. choose a real-world road situation;
2. adjust engineering parameters;
3. add pavement markings using lane/approach/area targeting;
4. see the SVG preview update immediately;
5. review non-blocking validation warnings;
6. export a clean SVG/PNG.

The product should feel closer to **Streetmix / Canva / VISSIM-style pavement marking placement for traffic diagrams** than to AutoCAD or Civil 3D.

## Important Documents

Read these before implementation:

- `AGENTS.md` — repository-level instructions for Codex and contributors.
- `docs/PRD.md` — product definition and scope.
- `docs/UI_UX_GUIDELINES.md` — UI/UX direction and interaction principles.
- `docs/PAVEMENT_MARKING_SYSTEM.md` — core marking placement, library, and data model.
- `docs/PRODUCT_BOUNDARY_AND_SCOPE.md` — what the app is and is not.
- `docs/GEOMETRY_SCALE_POLICY.md` — scale, units, and accuracy policy.
- `docs/DATA_MODEL.md` — domain objects and JSON-serializable project model.
- `docs/MVP_ROADMAP.md` — phased implementation plan.
- `docs/VALIDATION_RULES.md` — advisory validation philosophy and rule inventory.
- `docs/CODEX_STARTER_WORKFLOW.md` — recommended Codex workflow and prompts.

## Recommended Implementation Stack

Use the simplest stack that can produce working software quickly:

- React + TypeScript + Vite
- SVG rendering first
- Vitest for geometry and validation tests
- CSS Modules or Tailwind CSS for clean UI styling
- JSON-serializable project state

Do not add database, authentication, cloud sync, 3D, DXF/DWG export, AI prompt-to-diagram, or full CAD-style editing in the MVP.

## Current Implementation

Phase 1 implements a parametric straight road segment generator while preserving the Phase 0 three-panel shell.

Included:

- clean desktop three-panel app shell;
- live SVG preview generated from meter-based parameters;
- eastbound and westbound lane counts;
- two-way, eastbound-only, westbound-only, and no-lanes preview modes;
- lane width and outer-side shoulder width;
- no, painted, or raised median with configurable width;
- lane divider lines, edge lines, direction separation, lane labels, and optional through arrows;
- Thailand left-hand-traffic orientation: eastbound is upper and points right; westbound is lower and points left;
- small pure geometry and validation functions;
- non-blocking validation for lane counts, lane width, shoulder width, and median width;
- geometry, validation, and left-hand-traffic regression tests.

Phase 1 uses eastbound/westbound naming because the current diagram is east-west oriented. Future phases may generalize direction naming for other alignments.

For `medianType = none`, the renderer removes the physical median gap and draws a center direction-separation line. Shoulder width applies only to the outer side of each carriageway in Phase 1.

One-way previews render one centered carriageway, omit the unused direction label, and do not render a median or center direction-separation line. If both directions have zero lanes, the canvas shows a non-blocking placeholder.

Phase 1 input safeguards limit each direction to integer lane counts from 0 to 8, lane width to 2.5-5.0 m, outer shoulder width to 0-5.0 m, and median width to 0-20.0 m. These are practical preview safeguards, not formal Thai-standard limits. Invalid source values remain visible in the inspector, produce validation warnings, and are safely normalized for rendering.

Drawing settings are also sanitized before geometry or SVG rendering. Invalid scale and segment-length values use safe defaults, and an internal absolute cap of 16 lanes per direction prevents unsafe callers from creating unbounded lane-generation loops. The Phase 1 straight-road SVG preview clamps its rendered segment extent to 500 m and bounds preview scale to keep SVG coordinates finite. This is only a preview/rendering safeguard: it is not a Thai standard, a road-design limit, or a future intersection limit. Future intersection modules should use their own preview extent settings, such as `approachLengthMeters`. Median width is ignored by rendering and validation when `medianType = none`.

SVG export remains clearly disabled and is not implemented in this phase.

## Development Commands

Requirements:

- Node.js 20.19+ or 22.12+;
- npm.

```text
Install: npm install
Run: npm run dev
Test: npm test
Type check: npm run typecheck
Build: npm run build
```

The development server prints its local URL after `npm run dev`.

## Phase Boundary

The current implementation is limited to the Phase 1 straight road segment generator. It does not include U-turns, intersections, pocket lanes, slip lanes, roundabouts, real pavement-marking placement, drag-and-drop, persistence, authentication, AI prompt-to-diagram, or CAD export.
