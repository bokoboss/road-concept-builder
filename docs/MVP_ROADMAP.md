# MVP Roadmap

## Roadmap Principle

Build small, reviewable increments.

Do not implement all road objects at once.
Do not start with a CAD-like editor.
Do not prioritize architecture purity over a working UI.

## Phase 0 - Static App Shell and UX Prototype

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

## Phase 1 - Straight Road Segment Generator

### Goal

Create the first real parametric road diagram.

Phase 1 is limited to the straight-road parametric preview.

### Scope

- two-way and one-way straight road segment preview;
- eastbound lane count;
- westbound lane count;
- lane width;
- shoulder width;
- median type: none / painted / raised;
- median width;
- lane lines;
- edge lines;
- direction arrows;
- generated through-arrow placement;
- non-blocking parameter validation;
- geometry unit tests.

### Marking Scope

- through arrow;
- lane line;
- edge line;
- centerline or direction separator;

### Exit Criteria

- changing parameters updates the preview immediately;
- geometry tests pass;
- the app can create basic one-way, 2-lane, 4-lane, and 6-lane road previews;
- invalid values produce warnings and safely bounded preview geometry.

The Phase 1 straight-road SVG preview uses a module-specific 500 m rendering extent cap to keep SVG coordinates finite. This is not a Thai standard, road-design limit, or future intersection limit.

SVG export remains disabled and is deferred beyond the current Phase 1 implementation.

## Phase 2 - U-turn and Median Opening

### Goal

Support common Thai road concept cases involving median openings and U-turns.

### Scope

- one median opening on the existing straight-road segment;
- opening center position and width in meters;
- eastbound-to-westbound or westbound-to-eastbound direction;
- optional feature-specific generated U-turn arrow;
- split median surface and edge lines around the opening;
- non-blocking validation for operation mode, median type, width, and position.

### Exit Criteria

- user can add one U-turn opening to a two-way road with a painted or raised median;
- U-turn direction respects Thailand left-hand traffic;
- invalid U-turn configurations keep rendering the base straight road and show warnings;
- no U-turn pocket, taper, storage lane, or warning-bar system is introduced.

## Phase 2B - U-turn Pocket and Approach Treatments

### Goal

Add one basic U-turn-specific pocket lane tied to the existing Phase 2 median opening.

### Scope

- U-turn pocket lane;
- storage length;
- taper length;
- optional pocket U-turn arrow;
- pocket-arrow completeness validation;
- non-blocking validation for U-turn opening prerequisites, median prerequisites, storage length, taper length, and upstream fit.

### Exit Criteria

- user can enable one U-turn pocket only when a Phase 2 median opening exists;
- eastbound-to-westbound pockets use the upper eastbound median-side approach and extend upstream to the left of the opening;
- westbound-to-eastbound pockets use the lower westbound median-side approach and extend upstream to the right of the opening;
- invalid pocket configurations keep rendering the Phase 2 base road/opening and omit misleading pocket geometry;
- no warning-bar system, general auxiliary-lane framework, intersections, slip lanes, or signalized U-turns are introduced.

## Phase 2C - Annotation and Pavement Marking Layer Foundation

### Goal

Make generated straight-road diagrams easier to reuse in reports and presentations by allowing drawing text to be hidden and by treating generated arrows as pavement marking overlays.

### Scope

- drawing view options for labels, lane labels, feature labels, and pavement markings;
- generated through arrows represented as pavement marking objects;
- generated U-turn and pocket U-turn arrows represented as pavement marking objects;
- inspector-based visibility, X/Y nudge, and scale controls for generated arrow markings;
- no freehand drawing, drag-and-drop CAD editing, full marking library, save/load, or real export.

### Exit Criteria

- users can hide drawing labels without affecting road geometry or validation;
- users can hide all pavement markings for a clean base-road screenshot;
- users can reposition generated arrows through simple inspector controls;
- existing Phase 1, Phase 2A, and Phase 2B geometry and validation behavior remains passing;
- U-turn arrows are treated as pavement marking overlays, while exact Thai-standard symbol libraries remain future work.

## Phase 3 - Basic Intersection

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

## Phase 4 - Pocket Lanes and Auxiliary Lanes

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

## Phase 5 - Slip Lane and Channelization

### Goal

Support free-left and channelized turn movements.

### Scope

- free-left slip lane;
- yield/free-flow/signalized control mode;
- channelizing island;
- give-way line;
- crosswalk placement options;
- merge/direct-exit options.

## Phase 6 - Roundabout and Access Management

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
