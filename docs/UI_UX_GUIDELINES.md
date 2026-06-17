# UI/UX Guidelines

## Product UX Direction

Road Concept Builder is a visual authoring tool, not a calculation form.

The user should feel that the app helps them create a clean engineering concept diagram quickly.

The product should feel like:

- Streetmix in terms of quick template-based road thinking;
- Canva in terms of clean composition and export readiness;
- VISSIM pavement marking placement in terms of selecting road objects and placing markings easily;
- a traffic engineering tool in terms of terminology and logic.

The product should not feel like:

- AutoCAD;
- a long Excel-like input form;
- a generic drawing app;
- a complex road design platform.

## Core Interaction Model

Use this interaction model:

```text
Choose template -> configure parameters -> add components/markings -> validate -> export
```

Avoid this model:

```text
Blank canvas -> draw every line manually -> manually align every symbol
```

## Layout

Use a clean 3-panel desktop layout:

```text
+--------------------------------------------------------------+
| Top Bar: Project / Undo / Redo / Validate / Export           |
+---------------+-------------------------------+--------------+
| Left Panel    | Center SVG Canvas             | Right Panel  |
| Templates     | Live Preview                  | Inspector    |
| Components    | Pan / Zoom / Fit              | Validation   |
| Markings      |                               | Properties   |
+---------------+-------------------------------+--------------+
```

### Top Bar

Keep it minimal:

- New;
- Undo / Redo;
- Validate;
- Export;
- View mode;
- app title / project title.

Do not add many menus in MVP.

### Left Panel

The left panel should contain:

- Templates;
- Road Components;
- Pavement Markings;
- Presets.

Use cards or compact list items with icons, not long dropdowns.

### Center Canvas

The canvas is the main work area.

It should support:

- SVG preview;
- fit-to-screen;
- zoom in/out;
- pan later;
- selected object highlight;
- simple grid optional;
- validation marker later.

Do not implement CAD-level snapping in MVP.

### Right Inspector

The right panel shows properties for the selected object.

Examples:

- Road Segment Inspector;
- Lane Inspector;
- Approach Inspector;
- Marking Inspector;
- Validation Panel.

Keep inputs grouped and progressive. Avoid exposing every property at once.

## Visual Style

Use a clean technical visual style:

- neutral UI background;
- white/very light panels;
- subtle borders;
- limited accent color;
- high-contrast road diagram;
- road surface in neutral grey;
- white/yellow lane markings;
- warning amber;
- error red used sparingly;
- selected element outline in accent color.

Avoid colorful dashboard styling.
The road diagram is the visual focus.

## First-Time User Target

A first-time user should be able to create a basic 4-lane divided road diagram within 60 seconds.

A user should not need to manually draw individual lane lines for standard road layouts.

## Pavement Marking UX

Pavement marking must be a first-class UX area.

Preferred workflow:

```text
Select lane/approach/area -> Add Marking -> system places it automatically -> adjust offset/repeat/scale if needed
```

The marking palette should be in the left panel.
The selected marking should be edited in the right inspector.

Phase 2C keeps marking adjustment deliberately simple: generated arrow markings can be selected in the inspector, hidden, nudged in X/Y meters, and scaled. This supports report cleanup without introducing drag-and-drop CAD editing or a full marking library.

Phase 2D adds object-based editing for pavement markings only: generated and manual marking objects can be selected on the SVG canvas, dragged when unlocked, hidden, locked, and edited in the inspector. Lanes, medians, U-turn openings, and pockets remain parameter-driven and are not draggable canvas objects.

## Validation UX

Validation must guide rather than interrupt.

Use a non-blocking validation panel, not modal popups.

Severity levels:

- Info: concept assumption or note;
- Warning: likely issue or incomplete marking;
- Error: impossible or internally contradictory geometry.

Only impossible geometry should block critical operations.

## View Modes

Long-term view modes:

1. Edit Mode;
2. Presentation Mode;
3. Standard Check Mode.

MVP can implement only Edit Mode and Export Preview.

Phase 2C adds drawing-level display toggles for clean screenshots. These toggles hide SVG drawing labels and/or pavement markings only; validation panel text and app diagnostics remain visible.

## Phase 0 UI Shell Requirement

Before geometry implementation, create a static app shell with:

- top bar;
- left templates/components/markings panel;
- center static SVG road preview;
- right inspector panel;
- sample static validation messages;
- clean spacing and typography.

This is required to validate the UX direction before deep logic work.

## UX Anti-Patterns

Avoid:

- a giant single-page form;
- CAD-like toolbar overload;
- blank canvas first workflow;
- requiring manual line drawing for standard layouts;
- over-detailed standard controls in MVP;
- modal warnings for every issue;
- hiding export behind complex settings;
- mobile-first layout before desktop workflow works.
