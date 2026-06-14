# MVP Roadmap

## Roadmap Principle

Build small, reviewable increments.

Do not implement all road objects at once.
Do not start with a CAD-like editor.
Do not prioritize architecture purity over a working UI.

## Phase 0 — Static App Shell and UX Prototype

### Goal

Validate the product feel before deep geometry implementation.

### Scope

- React + TypeScript + Vite scaffold;
- top bar;
- left panel with Templates, Road Components, Pavement Markings;
- center SVG canvas;
- right inspector panel;
- validation panel area;
- static SVG sample road diagram;
- static pavement markings: lane arrows, stop line, transverse warning bars;
- clean styling;
- no real geometry engine required.

### Exit Criteria

- app runs locally;
- UI layout feels clean and usable;
- static SVG diagram is presentation-like;
- left panel and right inspector establish the intended workflow;
- no negative-scope features added.

## Phase 1 — Straight Road Segment Generator

### Goal

Create the first real parametric road diagram.

### Scope

- two-way road segment;
- forward lane count;
- opposing lane count;
- lane width;
- shoulder width;
- median type: none / painted / raised;
- median width;
- lane lines;
- edge lines;
- direction arrows;
- basic lane arrow placement;
- SVG export;
- geometry unit tests.

### Marking Scope

- through arrow;
- lane line;
- edge line;
- centerline or direction separator;
- optional simple transverse warning bars.

### Exit Criteria

- changing parameters updates the preview immediately;
- SVG export works;
- geometry tests pass;
- the app can create a basic 2-lane, 4-lane, and 6-lane road.

## Phase 2 — U-turn and Median Opening

### Goal

Support common Thai road concept cases involving median openings and U-turns.

### Scope

- median opening;
- U-turn pocket;
- storage length;
- taper length;
- U-turn arrow;
- optional warning bars;
- validation if median is missing;
- validation if U-turn pocket has no arrow.

### Exit Criteria

- user can add U-turn opening to a divided road;
- user can add U-turn pocket with schematic taper;
- validation warns about incomplete U-turn logic.

## Phase 3 — Basic Intersection

### Goal

Build approach-based intersection modeling.

### Scope

- T-intersection;
- four-leg intersection;
- inbound/outbound lanes by approach;
- lane movements;
- stop line;
- crosswalk;
- signal/no-signal flag;
- lane-use arrows;
- approach inspector.

### Exit Criteria

- each approach can have different inbound/outbound lane counts;
- lane arrows align with movements;
- signalized approaches can show stop lines;
- validation catches obvious missing controls.

## Phase 4 — Pocket Lanes and Auxiliary Lanes

### Goal

Support common intersection and access improvement concepts.

### Scope

- left-turn pocket;
- right-turn pocket;
- U-turn pocket refinement;
- storage length;
- taper length;
- lane-use arrows;
- deceleration lane placeholder;
- acceleration lane placeholder.

## Phase 5 — Slip Lane and Channelization

### Goal

Support free-left and channelized turn movements.

### Scope

- free-left slip lane;
- yield/free-flow/signalized control mode;
- channelizing island;
- give-way line;
- crosswalk placement options;
- merge/direct-exit options.

## Phase 6 — Roundabout and Access Management

### Goal

Support common concept layouts beyond standard intersections.

### Scope

- single-lane roundabout;
- central island;
- splitter islands;
- entry/exit lanes;
- yield lines;
- circulating arrows;
- driveway access;
- left-in/left-out;
- full access;
- gate queue storage placeholder.

## Future Phases

Only after the core product works:

- annotation and dimension tools;
- project JSON save/load;
- PNG export;
- presentation mode;
- standard check mode;
- custom libraries;
- AI prompt-to-parameter assistant;
- DXF export if there is a real need.
