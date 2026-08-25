# Visual Design System v0.1

## Design character

Target visual character:

> **Modern professional engineering editor — calm, precise, premium, compact.**

The application should feel more refined and approachable than conventional CAD/GIS software without looking like a consumer dashboard or game editor.

The viewport and engineering content are the visual focus. UI chrome should support the work rather than compete with it.

## Visual principles

1. **Viewport first** — maximize useful map/design area.
2. **Compact density** — professional users should see enough information without oversized cards/padding.
3. **Hierarchy before decoration** — panel grouping and typography matter more than ornamental effects.
4. **Restrained accent** — one primary interactive accent plus semantic status colors.
5. **Neutral chrome** — UI frame/panels remain visually quiet.
6. **Engineering clarity** — selected/hovered/reference/proposed states must be distinguishable.
7. **Presentation mode can disappear** — panels/chrome should collapse for screenshots/client presentation.
8. **Light and dark readiness** — architecture should not hard-wire meaning to one background color, even if one theme ships first.

## Application chrome

Recommended direction:
- dark-neutral or graphite application frame;
- slightly lighter/darker panel surfaces for hierarchy;
- viewport may use map imagery, light engineering canvas, or 3D scene independently;
- subtle borders/dividers rather than heavy boxes;
- restrained elevation/shadow only for floating menus/popovers.

Avoid:
- glossy gradients;
- gaming neon;
- glassmorphism over engineering content;
- colorful dashboard cards;
- thick panel borders;
- large decorative empty states once a project is open.

## Information hierarchy

Suggested text hierarchy:

### Level 1 — Project/workspace state
Examples:
- project/scenario name;
- active mode;
- critical blocking issue.

### Level 2 — Panel title / selected semantic object
Examples:
- Road R-01;
- Junction J-03;
- Map;
- Library.

### Level 3 — Property group
Examples:
- Geometry;
- Cross Section;
- Movement;
- Appearance;
- Validation.

### Level 4 — Property label/value
Compact and aligned for rapid scanning.

Do not use multiple heading weights/sizes with minimal semantic difference.

## Typography

Requirements:
- highly legible UI sans-serif;
- excellent numerals;
- tabular numerals where useful for station/dimension fields;
- clear Thai + Latin support for future bilingual UI;
- monospace only for code/IDs/diagnostics where beneficial, not normal properties.

Avoid very light font weights for engineering values.

## Numeric fields

Dimensions are central to the product.

Recommended field behavior:

```text
Lane width       [ 3.250 ] m
Taper            [30.000 ] m
Station          [0+150.00]
```

Rules:
- units visible adjacent to value;
- preserve sensible precision;
- no unit text mixed into editable numeric string unless deliberate;
- invalid transient input is visually distinct but does not crash/regenerate nonsense;
- mouse-wheel value changes should be disabled by default unless explicitly focused/intentional to avoid accidental design changes;
- Enter/blur commit behavior must be consistent.

## Panels

### Left panel
Persistent categories:
- Layers;
- Map;
- Library.

Use compact tabs/segmented navigation or vertical rail with labels/tooltips.

### Right panel
Contextual properties + validation + AI.

Use collapsible property groups, but keep critical status visible.

### Bottom/context toolbar
Compact action strip for active authoring tools.

Do not make bottom toolbar a second ribbon.

## Tool icons

Use a coherent icon family for common generic actions:
- select;
- pan;
- zoom/fit;
- layers;
- lock;
- visibility;
- duplicate/delete;
- undo/redo.

Create custom vectors only for domain-specific concepts that generic icon libraries cannot communicate clearly:
- road alignment;
- turn pocket;
- median opening;
- junction;
- cross section;
- lane connection;
- road marking families.

Primary tools should use icon + label at least until user familiarity is high. Avoid unexplained icon grids.

## State styling

### Hover
Subtle preview; must not resemble committed selection.

### Selected
Strong, high-contrast outline/highlight that works over map imagery and engineering canvas.

### Locked
Visible but muted/lock indicator; selection behavior may still allow inspection.

### Reference/background
Visually subordinate to editable proposed geometry.

### Existing vs proposed
Do not rely on color alone. Combine:
- line/opacity/style differences;
- layer/scenario labels;
- optional pattern/outline.

Exact color palette should be tested against real satellite/map contexts before freezing.

## Semantic status colors

Use status colors only for meaning:
- info;
- advisory/warning;
- error/blocking;
- success/valid where necessary.

Avoid filling entire large panels red/yellow.

Issues should identify target object and remain readable for color-vision-deficient users through icons/text as well as color.

## Map/background treatment

Map imagery can visually overpower proposed concepts.

Provide display controls:
- opacity;
- dim;
- desaturate;
- labels on/off;
- optional contrast adjustment.

Recommended one-click action:

```text
Dim Background
```

This should produce a presentation/engineering-friendly reference without editing the underlying image.

## 2D engineering visual language

Derived engineering geometry should distinguish:
- pavement surface;
- lane boundaries/markings;
- median/curb/sidewalk edges;
- selected object;
- construction/edit handles;
- topology/movement guides;
- validation markers;
- dimensions/annotations.

Editing guides/handles must not appear in export unless requested.

## 3D visual language

### Engineering mode
Priorities:
- geometry readability;
- lane/marking clarity;
- selection;
- movement/topology diagnostics;
- simple neutral materials;
- reduced decorative noise.

### Presentation mode
Adds:
- coherent PBR materials;
- trees/vehicles/context;
- simple buildings;
- shadows/environment;
- saved camera views;
- optional map/satellite ground context.

Do not require photorealism to qualify engineering behavior.

## Cross-section editor

Cross-section components should behave like compact draggable blocks with dimensions, not illustrated cards.

Example:

```text
 SW    BIKE     ->      ->     MED     <-      <-     SW
 2.0   1.5     3.25    3.25    2.0    3.25    3.25   2.0
```

Selection should expose exact properties while maintaining visual relationship between components.

## Empty/new project state

Do not start with a marketing dashboard.

Use a focused start choice:
- Map/Satellite;
- Import Image/Plan;
- Blank Canvas;
plus recent projects later.

Advanced CRS/project settings remain collapsed unless needed.

## Dialog policy

Prefer inline/contextual editing.

Use dialogs only for tasks that are truly modal/transactional:
- New Project;
- Import/georeference setup;
- export configuration;
- destructive project-level operations;
- standards-profile migration.

Do not use dialogs for routine lane width, radius, movement, or marking edits.

## Motion

Use short restrained transitions for:
- panel open/close;
- hover/selection feedback;
- 2D/3D split resize;
- preview/commit changes.

Engineering geometry itself should update immediately without decorative animation that obscures the final position.

Respect reduced-motion preferences where applicable.

## Accessibility baseline

Plan for:
- keyboard-reachable non-canvas controls;
- visible focus states;
- tooltips/labels;
- adequate text/background contrast;
- non-color-only status communication;
- semantic object tree/property access as an alternative to canvas-only selection where practical;
- target WCAG 2.2 AA for webview UI controls.

## Visual QA

Before freezing the production visual system, test against:
1. blank light canvas;
2. bright satellite image;
3. dark satellite image;
4. dense urban map;
5. 2D plan with many markings;
6. split 2D/3D;
7. validation issue state;
8. presentation mode with panels hidden;
9. 1366x768 laptop-size window;
10. larger desktop/high-DPI display.

Do not approve the palette based only on a clean mockup with no real map imagery.

## What is intentionally not frozen yet

- exact brand/accent color;
- final typeface;
- exact panel widths;
- light vs dark default theme;
- final icon family;
- exact 2D pavement/material colors.

Freeze these only after the R2 interactive workspace can be tested with real road/map content.