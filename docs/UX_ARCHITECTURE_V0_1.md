# UX Architecture v0.1

## UX objective

Make a professional traffic-engineering editor that is faster and easier than CAD, but more precise and structured than a generic diagram tool.

The UI should be calm, compact, and viewport-first. Do not create a dashboard, giant form, or CAD ribbon.

## Workspace baseline

```text
+------------------------------------------------------------------------+
| Project | Scenario | Undo Redo | 2D / Split / 3D | Validate | Export   |
+-----------+---------------------------------------------+----------------+
|           |                                             |                |
| Layers    |                                             | Properties     |
| Map       |                Main Viewport                |                |
| Library   |                                             | Selection      |
|           |                                             | Geometry       |
|           |                                             | Cross Section  |
|           |                                             | Markings       |
|           |                                             | Validation     |
|           |                                             |----------------|
|           |                                             | AI Copilot     |
+-----------+---------------------------------------------+----------------+
| Select | Hand | Road | Junction | Marking | Measure | Snap              |
+------------------------------------------------------------------------+
| Existing | Alternative A | Alternative B | +                           |
+------------------------------------------------------------------------+
```

## Persistent areas

### Left panel

Only persistent top-level workspaces:
- Layers;
- Map / Reference;
- Library / Assets.

Do not use the left panel as a dumping ground for every command.

### Main viewport

The viewport is the product. It must maximize usable space and support:
- map/aerial/reference display;
- engineering geometry;
- selection highlights;
- guides/snapping;
- dimensions;
- validation markers;
- 2D / Split / 3D layouts.

### Right panel

Contextual inspector for the selected semantic object.

Examples:
- Road;
- Lane/component;
- Junction;
- Corner;
- Marking;
- Sign/signal/asset;
- Scenario;
- Validation issue.

Use progressive disclosure. Show common properties first and advanced station/topology properties on demand.

### Bottom/context toolbar

Primary tool families:
- Select;
- Hand/Pan;
- Road;
- Junction;
- Marking;
- Measure;
- Snap.

When an object is selected, show object-specific actions rather than adding permanent icons.

## Navigation vs editing

Navigation and editing must never be ambiguous.

Minimum modes:
- `V` Select;
- `H` Hand/Pan;
- mouse wheel zoom;
- 3D Orbit/Pan/Select clearly separated.

The current active tool must always be visibly indicated.

## Selection model

Selection is semantic and synchronized between views.

Example:
- select lane in plan;
- corresponding lane highlights in 3D and cross-section;
- inspector shows lane properties;
- breadcrumb shows `Alternative A > Road R03 > Lane L2`.

Selection state is editor/session state, not canonical engineering data.

## Direct manipulation + precise input

Every common geometry operation should support both:
- drag handles/grips for fast conceptual editing;
- exact numeric entry for engineering control.

Example corner editing:

```text
Corner NE
Radius         12.000 m
Mode           Circular
[drag handle in plan]
```

Example turn pocket:

```text
Right-turn pocket
Width          3.00 m
Taper          30 m
Storage        50 m
Advanced >
  start taper  0+120
  full width   0+150
  end          0+200
```

## Road workflow

1. Draw/trace reference alignment.
2. Select a road configuration preset or start from a minimal cross section.
3. Preset instantiates editable semantic components.
4. Modify cross section in a compact component editor.
5. Add station-based longitudinal changes.
6. Review 2D/3D/validation live.

### Cross-section editor

```text
 SW     BIKE      ->      ->      MED      <-      <-      SW
+----+--------+--------+--------+------+--------+--------+----+
|2.0 | 1.5    | 3.25   | 3.25   |2.0  | 3.25   | 3.25   |2.0 |
+----+--------+--------+--------+------+--------+--------+----+
                         + Add Component
```

Capabilities:
- select component;
- width/type/direction properties;
- add/remove/reorder;
- save as reusable configuration;
- Advanced exposes station-specific variation when applicable.

## Junction workflow

When geometry crosses/joins, create a **candidate**, not an implicit topology mutation:

```text
Candidate Junction Detected
R-01 x R-02
[Create Junction] [Grade Separated] [Ignore]
```

After creation:
- approaches;
- per-corner radius/geometry;
- lane connections;
- movements;
- islands;
- medians/openings;
- crosswalks;
- stop/yield lines.

Automation generates a starting solution; every critical generated choice is reviewable and overridable.

## Map/reference workflow

Map is a first-class workspace.

Controls:
- provider/source;
- map/satellite/imported image;
- opacity;
- dim/desaturate background;
- labels visibility;
- scale calibration for imported images;
- georeference/CRS settings when applicable;
- lock reference layer.

The user must be able to work on a blank/local canvas without network access.

## Layers

Minimum behavior:
- visibility;
- lock;
- reorder;
- grouping;
- scenario ownership;
- nested semantic collections later.

Suggested default structure:

```text
Reference
  Satellite
  Existing Site Plan
Existing
  Roads
  Buildings
Alternative A
  Roads
  Markings
  Assets
Annotation
```

## Scenarios

Scenarios are visible in the main workspace, not hidden in project settings.

Minimum:
- Existing;
- duplicate/create Alternative;
- rename;
- overlay;
- side-by-side later;
- before/after slider later;
- change summary/diff architecture hook.

## 3D UX

3D is not a Blender-like modelling environment.

Initial controls:
- Orbit;
- Pan;
- Zoom;
- Fit Selection;
- Top;
- Perspective;
- Eye Level later.

Modes:
- Engineering — clear surfaces/markings/selection, minimal decoration;
- Presentation — materials, assets, buildings, shadows, environment.

The user should normally edit engineering geometry in plan and see 3D update immediately.

## Validation UX

No warning-modal workflow.

Use an Issues panel and on-canvas markers:

```text
3 Issues
- Lane R1-L3 width reaches 0 unexpectedly
- Junction J2 has a disconnected movement
- Median polygon is invalid
```

Selecting an issue:
- selects the target object;
- zooms/focuses the location;
- explains rule/source;
- allows override when the rule is advisory.

## AI Copilot UX

Natural language is an alternate authoring path, not a bypass around the model.

Example:

> Add a 3.0 m right-turn pocket with 30 m taper and 50 m storage before Hotel Access A.

AI output must become a typed command proposal:

```text
AddTurnPocketCommand
road       R01
movement   RIGHT
width      3.00 m
taper      30 m
storage    50 m
anchor     Access-A
```

Then:
- preview;
- validation;
- change summary;
- Apply / Cancel;
- undo as one transaction.

AI should also support read-only tasks such as:
- explain selection;
- identify missing markings;
- generate an alternative proposal;
- summarize differences between scenarios.

## Keyboard and recoverability

Required principles:
- reliable undo/redo for every committed edit;
- visible history later;
- `Esc` cancels the active transient operation;
- delete selected object where semantically legal;
- duplicate where semantically legal;
- lock reference/background layers;
- autosave/crash-recovery architecture.

## Visual style

Direction: **modern professional engineering editor**.

- compact controls;
- neutral/dark-neutral chrome;
- high-clarity viewport;
- restrained accent color;
- semantic warning/error colors only where meaningful;
- strong hierarchy;
- no colorful dashboard cards;
- no large empty decorative areas;
- tooltips and text labels for discoverability;
- hide/collapse panels for presentation.

## Anti-patterns

Do not:
- rebuild an AutoCAD ribbon;
- expose every parameter at once;
- require manual drawing of common lanes/markings;
- make cross section the only source of road truth;
- couple map navigation and object movement;
- create junction topology silently;
- create separate 2D and 3D engineering models;
- let AI edit raw scene JSON or mesh state;
- rely on the user to make SVG/GLB assets manually.