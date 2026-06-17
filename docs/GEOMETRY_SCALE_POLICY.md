# Geometry, Scale, and Unit Policy

## Purpose

This document defines how geometric accuracy should be treated in the app.

The goal is to avoid two failure modes:

1. visual-only drawings that look arbitrary;
2. over-engineered CAD-like geometry that prevents fast MVP delivery.

## Accuracy Level

Use **approximate engineering scale** as the default.

The app should support real engineering parameters such as:

- lane width;
- shoulder width;
- median width;
- pocket lane storage length;
- taper length;
- road segment length;
- crosswalk width;
- stop line offset;
- marking spacing.

However, these are used for concept diagrams and should not be treated as construction drawing output.

## Units

Use meters for all domain-level geometry.

Convert meters to SVG pixels using a single drawing scale setting:

```ts
pixels = meters * pxPerMeter
```

Current Phase 1 default:

```ts
pxPerMeter = 18
```

Phase 1 owns this value in a minimal drawing-settings object. The renderer may reduce the effective display scale to fit a wide road safely inside the SVG preview.
Invalid drawing settings use safe Phase 1 defaults. Lane-generation loops also apply an internal absolute cap of 16 lanes per direction, independent of caller-supplied drawing settings.

The Phase 1 straight-road SVG preview clamps its segment extent to 500 m and bounds preview scale so meter-to-pixel conversion remains finite. This is a module-specific preview/rendering safeguard only. It is not a Thai standard, a road-design limit, or a future intersection limit. Future intersection modules should use their own preview extent settings, such as `approachLengthMeters`.

## Coordinate System

Use a predictable internal coordinate system.

Recommended convention:

- X axis: road length or east-west direction;
- Y axis: road cross-section width or north-south direction;
- origin: local drawing origin, not geographic coordinate;
- no GIS coordinates in MVP.

## Traffic Side

Default traffic context is Thailand:

```ts
trafficSide = 'left'
```

Implications:

- vehicles travel on the left side of the carriageway;
- right-turn pockets are typically median-side pockets;
- U-turn pockets are typically median-side facilities;
- lane movement arrows must rotate according to lane direction;
- inbound and outbound lanes must be modeled explicitly at intersections.

## Geometry Scope by Phase

### Phase 0

Static SVG preview only. No real geometry engine required.

### Phase 1

Straight road segment geometry:

- lanes by direction;
- shoulders;
- median;
- lane lines;
- arrows;
- generated through-arrow placement.

### Phase 2

Median-opening-only U-turn geometry:

- median opening;
- opening center position measured from the segment's left/west edge;
- opening width in meters;
- full opening constrained to the straight-road preview segment;
- optional generated U-turn arrow from the correct median-side source lane.

Phase 2 invalid U-turn configurations render the base Phase 1 road without partial U-turn geometry. U-turn pockets, tapers, storage lanes, and warning bars are deferred to Phase 2B.

### Phase 2B

U-turn-specific pocket geometry:

- one optional pocket lane tied to the Phase 2 median opening;
- storage length and taper length in meters;
- pocket width uses the main road lane width as a Phase 2B simplification;
- eastbound-to-westbound pockets extend upstream to the left of the opening;
- westbound-to-eastbound pockets extend upstream to the right of the opening;
- the full storage+taper length must fit upstream of the opening inside the straight-road preview segment;
- invalid pocket configurations render the Phase 2A base road/opening without pocket geometry.

The Phase 2B pocket length ranges and fit behavior are preview safeguards and project assumptions, not Thai-standard design checks. Warning bars are deferred to a later marking or polish phase.

### Phase 3

Intersection geometry:

- approach-based layout;
- inbound/outbound lanes;
- stop line;
- crosswalk;
- pocket lane;
- slip lane placeholder.

## Do Not Do in MVP

Do not implement:

- geographic coordinates;
- alignment design;
- vertical profile;
- superelevation;
- corridor modeling;
- swept path;
- lane-level simulation;
- CAD-grade curve design;
- standard-enforced taper formulas unless verified.

## Validation Principle

When geometry is impossible, raise an error.
When geometry is merely questionable, raise a warning.
When geometry uses an assumption, show an info note.
