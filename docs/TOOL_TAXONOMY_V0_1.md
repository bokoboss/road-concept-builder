# Editor Tool Taxonomy v0.1

## Purpose

Define the user-facing tool vocabulary before production UI implementation so the editor does not grow into a CAD-ribbon collection of unrelated commands.

## Design rule

Expose **tool families + contextual actions**, not one permanent icon for every engineering operation.

A tool should exist only when the interaction genuinely requires a distinct mode. If an operation can be a contextual action on a selected semantic object, prefer the contextual action.

## Persistent primary modes

These are candidates for always-visible primary controls.

### Select (`V`)

Purpose:
- select semantic objects;
- expose contextual properties/actions;
- direct manipulation through handles/grips.

Must not pan the map accidentally.

### Hand / Pan (`H`)

Purpose:
- navigate 2D/map without selecting/moving design objects.

This separation is mandatory to avoid navigation/editing ambiguity.

### Measure (`M` candidate)

Purpose:
- point-to-point distance;
- later station/lateral or angle measurement.

Measurements may be transient or saved annotations depending on user action.

## Tool families

### 1. Reference / Map

Not a CAD drawing tool family; this is workspace/reference management.

Actions:
- Set Location;
- Street Map / Satellite / Imported Image;
- Import Image/Plan;
- Calibrate Scale;
- Set/Inspect CRS;
- Opacity;
- Dim/Desaturate Background;
- Lock Reference;
- Fit Reference;
- optional north/orientation tools.

Later:
- GeoTIFF;
- OSM import;
- organization WMS/XYZ;
- building/context import.

### 2. Road / Alignment

Primary actions:
- Draw Road;
- Extend Road;
- Edit Alignment;
- Insert Control Point/Primitive;
- Delete Control Point/Primitive;
- Split Road;
- Join Roads where semantically legal;
- Reverse Reference Direction;
- Simplify/Clean Alignment later.

Alignment creation primitives:
- Straight;
- Circular Arc;
- Smooth Concept Curve;
- imported polyline later.

Avoid exposing primitive-level controls unless the user enters alignment edit mode.

### 3. Cross Section / Road Configuration

Contextual on selected road:
- Apply Configuration/Preset;
- Save Configuration;
- Add Component;
- Remove Component;
- Reorder Component;
- Edit Width;
- Edit Type;
- Edit Travel Direction;
- Edit Surface/presentation profile later.

Component vocabulary:
- traffic lane;
- median;
- shoulder;
- sidewalk;
- verge;
- bike lane;
- parking lane;
- transit lane;
- barrier/edge family.

### 4. Longitudinal Road Features

Prefer high-level semantic actions that generate station profiles.

Core:
- Add Lane;
- Drop Lane;
- Widen/Narrow;
- Turn Pocket;
- Taper/Transition;
- Median Width Transition;
- Median Opening;
- Bus Bay later;
- Parking Bay later.

Example `Add Turn Pocket` should ask for movement/width/taper/storage/anchor and generate the station lifecycle automatically.

Advanced editing exposes stations directly.

### 5. Junction

Actions on candidate/selected junction:
- Create/Confirm Junction;
- Ignore;
- Mark Grade Separated;
- Edit Approaches;
- Edit Corner;
- Set Corner Radius;
- Edit Lane Connections;
- Edit Movements;
- Add/Edit Island;
- Add/Edit Crossing;
- Add/Edit Stop/Yield Line;
- Add/Edit Median Opening.

Specialized later modules:
- Slip Lane;
- U-turn treatment;
- Roundabout.

Do not force roundabout behavior into generic-junction UI if it creates excessive complexity.

### 6. Access / Driveway

Project access deserves a high-level workflow even if its underlying topology uses road/junction primitives.

Actions:
- Add Access;
- Full Access / Left-in-left-out / In-only / Out-only concept presets;
- Set Width;
- Set Corner Geometry;
- Connect Movements;
- Add Median Opening;
- Add Turn Pocket;
- Add Channelization.

User-facing intent should remain simple while the kernel uses semantic road/junction objects underneath.

### 7. Pavement Marking

Categories:
- lane/edge line;
- center/separation line;
- stop line;
- yield line;
- crosswalk;
- directional arrow;
- U-turn arrow;
- hatch/chevron/gore;
- parking/bus/bike/motorcycle stencil;
- transverse bars later;
- custom text marking later.

Preferred workflow:

```text
select target road/lane/approach/area
 -> Add Marking
 -> procedural auto-placement
 -> adjust semantic parameters/offset
```

Manual free world placement is an override, not the primary path.

### 8. Traffic Control / Road Furniture

Library/context actions:
- Place Sign;
- Place Signal;
- Place Streetlight;
- Place Bollard/Delineator;
- Place Barrier/Guardrail;
- Place Bus Stop/Shelter;
- Place Cone/Temporary device later.

Placement methods:
- Point;
- Along Road/Lane/Edge;
- Along Path;
- Area distribution where appropriate.

### 9. Presentation Assets

Categories:
- Vehicles;
- People;
- Trees/Shrubs;
- Buildings;
- Street Furniture.

Placement should be simple and presentation-oriented without corrupting engineering geometry.

### 10. Layers / Organization

Actions:
- Show/Hide;
- Lock/Unlock;
- Rename;
- Reorder;
- Group;
- Move to layer/group where semantically appropriate;
- isolate selection later.

Scenario ownership and semantic object hierarchy should remain clearer than arbitrary graphic layering.

### 11. Scenario / Alternatives

Actions:
- New Alternative;
- Duplicate Scenario;
- Rename;
- Set Active;
- Overlay Compare;
- Side-by-side Compare later;
- Before/After Slider later;
- Change Summary later.

Comparison operations must be read-only relative to compared scenarios unless the user explicitly switches editing target.

### 12. Inspection / Validation

Actions:
- Measure;
- Inspect Properties;
- Show Dimensions;
- Validation/Issues;
- Explain Rule/Source;
- Focus Issue;
- Override Advisory Rule;
- Geometry Diagnostics in developer/advanced mode.

### 13. AI Copilot

User intents:
- Describe Change;
- Explain Selection;
- Create Alternative Proposal;
- Identify Missing Markings/Connections;
- Summarize Scenario Differences.

All mutating AI actions must become typed command proposals and use preview/apply/cancel/undo.

## Contextual toolbar examples

### Road selected

```text
Edit Alignment | Cross Section | Add Lane | Turn Pocket | Median | Split | More
```

### Lane/component selected

```text
Width | Direction | Movement | Transition | Remove | More
```

### Junction selected

```text
Corners | Connections | Island | Crosswalk | Stop/Yield | More
```

### Marking selected

```text
Type | Target | Offset | Pattern/Dimensions | Hide/Lock | Duplicate/Delete
```

### Asset selected

```text
Attachment | Offset | Rotate | Variant | Distribution | Hide/Lock | Delete
```

## Snapping architecture

Expected snap candidates:
- endpoint;
- midpoint;
- nearest;
- intersection;
- perpendicular;
- tangent;
- parallel/guide;
- grid;
- station;
- road/lane/edge reference.

Do not enable every snap by default.

Provide a compact Snap menu/profile with sensible defaults and visible active snap feedback.

## Keyboard baseline

Candidate baseline:
- `V` Select;
- `H` Hand/Pan;
- `Esc` cancel/exit transient mode;
- `Delete` delete selected where legal;
- `Ctrl+Z` / `Ctrl+Y` or platform equivalents;
- `Ctrl+D` duplicate where legal;
- `F` fit selection/view candidate;
- Space temporary pan may be evaluated later if it does not conflict with text inputs.

Exact shortcut map is an R2 UX decision and should be user-tested before freezing.

## Commands that should usually NOT become permanent tools

Avoid permanent toolbar buttons for:
- every individual sign type;
- every road-marking subtype;
- every corner;
- every taper variant;
- each vehicle/tree type;
- obscure diagnostic operations;
- standard-profile options.

Those belong in contextual panels/library/search/advanced menus.

## Tool-mode rules

1. Active mode is always visible.
2. `Esc` exits/cancels safely.
3. Navigation never silently mutates design geometry.
4. Committed engineering edits are command transactions.
5. Switching tools resolves/cancels transient previews explicitly.
6. Selection remains semantic across 2D and 3D.
7. Standard operations should be discoverable without memorized commands.
8. Expert keyboard use should accelerate—not define—the only workflow.