# AGENTS.md

This file gives repository-level guidance to Codex and other coding agents.

## Project Intent

Road Concept Builder is a Thai-oriented 2D plan-view road concept diagram builder for traffic engineering reports and presentations.

The product must prioritize:

- working software over speculative architecture;
- clean UI and simple UX over feature breadth;
- SVG-based presentation-ready output;
- parametric geometry over freehand drawing;
- smart lane/approach/area-based pavement marking placement;
- small, reviewable implementation increments.

## Product Boundaries

Build concept/schematic diagrams, not construction drawings.

Do not implement these in the MVP:

- login, authentication, user accounts;
- database or cloud sync;
- multi-user collaboration;
- AI prompt-to-diagram;
- 3D rendering;
- traffic simulation;
- traffic volume analysis;
- signal timing calculation;
- swept-path analysis;
- CAD/DXF/DWG export;
- full drag-and-drop CAD editor;
- complete Thai-standard dimension enforcement;
- mobile-first UI.

## UX Direction

The app is a **template-first, parameter-driven, live-preview visual authoring tool**.

Do not build a long form-only interface.
Do not start with a blank CAD canvas.
Do not require the user to manually draw each lane line or marking.

Use this core workflow:

```text
Choose situation/template → configure parameters → add pavement markings → validate → export
```

The UI should use a clean 3-panel layout:

```text
Left: templates/components/markings | Center: SVG canvas | Right: inspector/validation
```

The diagram should be clean enough for reports and presentations.

## Pavement Marking Direction

Pavement marking is a core system, not a decorative late-stage feature.

Markings should be placed primarily by targeting:

- a lane;
- an approach;
- a road segment;
- an area or island;
- a node such as U-turn opening or intersection.

Use smart placement first. Freehand drawing is out of scope for the MVP.

Marking objects must carry source status where relevant:

- `THAI_AUTHORITY`
- `AGENCY_MANUAL`
- `INTERNATIONAL_BEST_PRACTICE`
- `PROJECT_ASSUMPTION`
- `CUSTOM_CONCEPT`
- `TODO_VERIFY`

Do not present unverified defaults as official Thai standards.

## Geometry and Scale Policy

Use engineering-informed schematic geometry.

- Use meters as domain units.
- Convert to SVG pixels through a single scale setting.
- Support approximate scaled diagrams.
- Do not claim construction-drawing accuracy.
- Keep geometry logic separate from React UI.

## Default Context

- Default traffic side: left-hand traffic.
- Default country context: Thailand.
- Right-turn pockets are generally median-side pockets in left-hand traffic.
- U-turn pockets typically relate to median openings.

## Engineering Rules

Use TypeScript.

Keep these concerns separated:

- UI components;
- domain model;
- geometry calculations;
- SVG rendering;
- pavement marking placement;
- validation rules;
- export logic.

Avoid over-engineering. Add abstractions only when they directly support the current or next phase.

## Expected Stack

Recommended initial stack:

- React + TypeScript + Vite
- SVG renderer
- Vitest
- CSS Modules or Tailwind CSS

After scaffolding, update this section with actual commands:

```text
Install: npm install
Run: npm run dev
Test: npm test
Type check: npm run typecheck
Build: npm run build
```

## Definition of Done

Before considering a task done:

- the app runs locally;
- type check passes;
- tests pass when tests exist;
- SVG preview renders correctly;
- UI remains clean and uncluttered;
- no negative-scope feature was added;
- relevant docs are updated when behavior changes;
- implementation remains limited to the agreed phase.

## First Task Discipline

The first implementation task should be **Phase 0: Static App Shell + Static SVG Preview**.

Do not implement road geometry, U-turns, intersections, roundabouts, database, AI prompt handling, or drag-and-drop before the Phase 0 UI shell is reviewed.
