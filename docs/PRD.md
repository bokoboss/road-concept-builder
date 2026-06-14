# Product Requirements Document (PRD)

## Product Name

Road Concept Builder

## Product Vision

Create a lightweight, clean, practical 2D plan-view road concept diagram builder for traffic engineers who need to produce presentation-ready road layout graphics quickly.

The product should support Thai left-hand-traffic conditions and common traffic engineering scenarios such as road segments, U-turn openings, intersections, pocket lanes, free-left slip lanes, roundabouts, access layouts, and pavement markings.

## Problem Statement

Traffic engineers often need to explain roadway improvements using diagrams, but existing tools have limitations:

- CAD tools are powerful but too slow for quick concept communication;
- generic drawing tools lack traffic engineering logic;
- simulation tools can be awkward for report graphics;
- web tools like Streetmix are useful for sections but do not cover plan-view traffic layouts and Thai-style pavement marking needs.

Road Concept Builder should fill this gap.

## Target Users

Primary users:

- traffic engineers;
- transport planners;
- TIA consultants;
- road safety analysts;
- engineers preparing presentations for public agencies or developers.

Secondary users:

- project managers;
- highway/urban designers who need early-stage concept visuals;
- non-technical stakeholders reviewing alternatives.

## Core Product Positioning

This product is:

- template-first;
- parameter-driven;
- live-preview;
- SVG-based;
- Thai-oriented;
- concept/schematic focused;
- report and presentation oriented.

This product is not:

- a CAD replacement;
- a construction drawing tool;
- a road design compliance engine;
- a traffic simulator;
- a swept-path analysis tool;
- a signal timing tool;
- an AI image generator.

## Core Workflow

```text
Choose situation/template → configure geometry → add pavement markings → validate → export
```

## Major Feature Areas

### 1. Road Segment Builder

Must eventually support:

- one-way/two-way roads;
- forward lane count;
- opposing lane count;
- shoulders;
- curb/edge conditions;
- median types;
- lane markings;
- arrows;
- lane additions and drops;
- U-turn openings.

### 2. U-turn / Median Opening Builder

Must eventually support:

- median opening only;
- U-turn pocket lane;
- storage length;
- taper length;
- U-turn arrow;
- warning bars or guide markings;
- validation if no median exists.

### 3. Intersection Builder

Must eventually support:

- T-intersection;
- four-leg intersection;
- skewed intersection later;
- inbound/outbound lanes by approach;
- lane movements;
- stop line;
- give-way line;
- crosswalk;
- signal/no signal;
- left/right pocket lanes;
- free-left slip lane;
- channelizing islands.

### 4. Pavement Marking System

Pavement marking is a core system.

Must support lane/approach/area-based smart placement for:

- lane direction arrows;
- U-turn arrows;
- stop lines;
- give-way lines;
- crosswalks;
- lane lines and edge lines;
- hatch/painted islands;
- transverse warning bars;
- simple text markings.

### 5. Validation System

Validation should be advisory and non-blocking unless geometry is impossible.

Examples:

- signalized approach without stop line;
- yield slip lane without give-way line;
- U-turn pocket without U-turn arrow;
- lane drop without taper;
- marking target no longer exists.

### 6. Export

MVP:

- SVG export.

Next:

- PNG export;
- transparent PNG;
- copy to clipboard;
- project JSON save/load.

## UX Requirements

The UI should be clean, calm, simple, and engineering-oriented.

The user should not need to manually draw every lane line or symbol.

Live preview is mandatory.

First-time user target:

> Create a basic 4-lane divided road diagram within 60 seconds.

## MVP Scope

### Phase 0 MVP

Static app shell and static SVG preview:

- top bar;
- left template/component/marking panel;
- center SVG canvas;
- right inspector;
- validation panel;
- static road sample with markings.

### Phase 1 MVP

Straight road segment generator:

- forward/opposing lane count;
- shoulder width;
- median type and width;
- lane/edge lines;
- direction arrows;
- basic marking placement;
- SVG export;
- geometry tests.

## MVP Exclusions

Do not implement in MVP:

- login;
- database;
- cloud sync;
- 3D;
- simulation;
- signal timing;
- swept path;
- DXF/DWG export;
- full drag-and-drop CAD editing;
- all Thai standard dimensions;
- full sign library;
- mobile-first UI.

## Standards Policy

Thai standards and international best practices should be documented and source-tagged.

Unverified defaults must not be presented as official standards.

Each standard-sensitive component should have source status such as:

- `THAI_AUTHORITY`;
- `AGENCY_MANUAL`;
- `INTERNATIONAL_BEST_PRACTICE`;
- `PROJECT_ASSUMPTION`;
- `TODO_VERIFY`.

## Success Criteria

The first useful release should allow a user to create and export a clean road segment concept diagram with lane counts, median, shoulders, lane markings, arrows, and basic validation.

The app should be useful even before intersections and roundabouts are implemented.
