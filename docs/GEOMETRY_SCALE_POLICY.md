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

Recommended default for early development:

```ts
pxPerMeter = 20
```

This can be adjusted later through drawing settings.

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
- basic marking placement.

### Phase 2

U-turn and lane transition geometry:

- median opening;
- U-turn pocket;
- taper;
- storage lane;
- warning bars.

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
