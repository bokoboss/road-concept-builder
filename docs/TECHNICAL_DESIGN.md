# Technical Design

## Technical Goal

Build a lightweight web app that produces clean SVG road concept diagrams using parametric geometry and smart pavement marking placement.

Do not build a CAD system.

## Recommended Stack

- React
- TypeScript
- Vite
- SVG rendering
- Vitest
- CSS Modules or Tailwind CSS

## High-Level Architecture

```text
src/
├─ app/                 # app shell, routes if needed
├─ ui/                  # reusable UI components
├─ domain/              # TypeScript domain model
├─ geometry/            # meter-based geometry calculations
├─ renderers/           # SVG rendering components/functions
├─ markings/            # pavement marking definitions and placement
├─ validation/          # validation rules
├─ presets/             # road/intersection presets
├─ export/              # SVG/PNG/project export
└─ tests/               # unit tests
```

## Separation of Concerns

### UI

React components should display state and handle interaction.
They should not contain core geometry calculations.

### Domain Model

Domain objects should be JSON-serializable and independent of React.

### Geometry Engine

Geometry functions should take domain objects and output geometric primitives in meters or normalized coordinates.

### SVG Renderer

Renderer converts geometry primitives and marking objects into SVG elements.

### Pavement Marking System

Marking placement should target lanes, approaches, road segments, or areas.

### Validation Engine

Validation rules should inspect domain objects and output issues.

### Export

SVG export should serialize the current rendered diagram.
PNG export can come later.

## Geometry Data Flow

```text
Project JSON
→ domain model
→ geometry calculations
→ marking placement
→ validation
→ SVG render
→ export
```

## Phase 0 Implementation

Implement a static app shell first.

Do not build real domain geometry yet.

Phase 0 should establish:

- layout;
- visual style;
- canvas proportions;
- panel structure;
- static SVG rendering quality;
- static marking palette concept;
- static inspector and validation panel.

## Phase 1 Implementation

Add first real domain model and geometry:

- DrawingSettings;
- RoadSegment;
- Lane;
- Median;
- Shoulder;
- simple MarkingObject for lane arrows;
- road segment renderer;
- SVG export;
- Vitest geometry tests.

## Testing Strategy

Test geometry and validation before UI behavior.

Initial tests:

- road width calculation;
- lane centerline positions;
- median positioning;
- shoulder positioning;
- arrow target positions;
- validation issue generation.

## Over-Engineering Guardrails

Do not introduce:

- global state frameworks unless needed;
- database;
- backend;
- plugin architecture;
- full scene graph;
- complete CAD object system;
- complex snapping;
- GIS coordinates;
- canvas rendering unless SVG proves insufficient.

## Future Technical Options

Only consider later if needed:

- Zustand or Redux for complex state;
- SVG-to-PNG export library;
- localStorage project persistence;
- project JSON import/export;
- constrained drag handles;
- DXF export.
