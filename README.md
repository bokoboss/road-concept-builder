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

## First Implementation Target

Start with **Phase 0: Static App Shell + Static SVG Preview**.

Phase 0 should include:

- top bar;
- left panel with Templates and Pavement Markings sections;
- center SVG canvas;
- right inspector panel;
- validation panel area;
- a static road segment preview with sample lane arrows, stop line, transverse warning bars, and clean visual styling.

Only after Phase 0 looks and feels right should the project move to Phase 1 geometry.

## Suggested First Codex Command

```text
/status
Read AGENTS.md and docs/PRD.md, docs/UI_UX_GUIDELINES.md, docs/PAVEMENT_MARKING_SYSTEM.md, docs/PRODUCT_BOUNDARY_AND_SCOPE.md, docs/GEOMETRY_SCALE_POLICY.md, docs/MVP_ROADMAP.md. Summarize the product intent, UX principles, negative scope, and the recommended first implementation task. Do not write code yet.
```
