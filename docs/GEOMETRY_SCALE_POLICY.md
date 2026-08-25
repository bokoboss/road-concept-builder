# Geometry, Coordinate, and Scale Policy — Rebaseline

## Purpose

Define how engineering dimensions, project coordinates, screen/view transforms, map/georeference context, and rendering precision are separated.

## Accuracy level

Road Concept Builder is a concept-design tool, but its semantic engineering dimensions are real values rather than arbitrary drawing scale.

Concept-level precision does **not** mean visual-only geometry.

The product should preserve inspectable dimensions such as:
- lane/component width;
- median/shoulder/sidewalk width;
- station;
- taper length;
- storage length;
- opening dimensions;
- corner radius/geometry;
- marking dimensions/spacing;
- asset physical dimensions/offsets.

Detailed construction-design checks remain outside the initial product boundary.

## Canonical units

Use **meters** for domain-level geometry.

Do not store canonical engineering dimensions in pixels.

Legacy Phase 2E `pxPerMeter` is a renderer/view concern and must not become project truth.

## Coordinate spaces

Distinguish these spaces explicitly.

### 1. Source/geographic coordinates

Optional real-world source coordinates such as projected CRS/geographic/map data.

These may have large numeric magnitudes.

### 2. Project engineering coordinates

Canonical local/project coordinates in meters.

A project may retain the transform/reference needed to relate these coordinates to the real-world source CRS.

### 3. Renderer-local coordinates

Coordinates translated near a local origin for stable GPU/visual rendering.

This transform must be reversible/traceable and must not alter engineering dimensions.

### 4. Screen/view coordinates

Pixels/viewport positions produced by pan/zoom/camera projection.

These are ephemeral editor/view state only.

## Required transform principle

```text
Source / CRS
    -> Project engineering meters
    -> Renderer-local meters
    -> Screen/view coordinates
```

The inverse path must be available where editing needs screen-to-world/project conversion.

## Imported image/reference plans

Un-georeferenced JPG/PNG/site-plan references should support scale calibration.

Minimum calibration concept:
- select reference point A;
- select reference point B;
- enter known distance in meters;
- calculate image-to-project transform.

Later support may include multiple control points/affine/georeference workflows when justified.

The imported image is reference context, not engineering geometry.

## Traffic-side semantics

Default:

```text
trafficSide = left
jurisdiction = Thailand
```

Do not infer travel direction from fixed screen orientation or east/west/north/south assumptions.

Traffic-side logic should operate relative to:
- reference alignment direction;
- carriageway/component side;
- lane travel direction;
- junction approach orientation.

## Alignment/stationing

Generalized roads use a reference alignment with station measured monotonically from alignment start.

Required conceptual functions:

```text
length()
pointAt(s)
tangentAt(s)
normalAt(s)
curvatureAt(s)
projectPoint(x,y) -> { station, lateralOffset }
```

Station remains an engineering-domain value in meters regardless of screen zoom or renderer resolution.

## Cross-section/lateral coordinate convention

Define lateral offset relative to the reference alignment tangent/normal and document sign convention in the kernel implementation.

Do not encode physical left/right solely through canvas Y direction; renderer orientation may differ.

The chosen sign convention must be deterministic and covered by LHT/RHT regression tests.

## View scale

Interactive 2D zoom is a view transform.

Export scale may use an explicit drawing/layout/export setting, but that setting must not change canonical geometry.

Example concept:

```text
project coordinates (m)
  -> viewport transform
  -> pixels
```

not:

```text
project truth = pixels / pxPerMeter
```

## 3D scale

3D geometry uses meter-consistent local coordinates.

A 12 m bus, 3.25 m lane, 0.15 m curb, and 25 m light spacing should remain physically coherent regardless of camera zoom.

## Precision strategy

Requirements:
- reject/handle NaN and Infinity;
- use adequate floating-point precision for engineering coordinates;
- use a renderer-local origin when source coordinates are large;
- avoid geometry logic dependent on arbitrary SVG/canvas pixel tolerances;
- define geometric tolerances in engineering units or derived numeric tolerances;
- document tolerances used for intersection/cleanup/triangulation operations.

## Geometry feasibility vs standards

Separate:

### Geometry/implementation safeguards
Examples:
- finite coordinate checks;
- non-negative widths;
- valid station intervals;
- max safe loop/object count;
- polygon validity;
- renderer bounds.

### Engineering standards/profile rules
Examples may include recommended/minimum widths or marking dimensions from an authoritative source.

A safeguard must never be presented as a Thai standard merely because it has a numeric limit.

Legacy Phase 2E numeric ranges are prototype safeguards/project assumptions unless independently verified through standards sources.

## Vertical/elevation policy

Initial production scope is primarily horizontal/plan concept design.

Architecture may reserve elevation/profile fields where harmless, but do not introduce a full vertical-alignment/corridor engine before a defined product use case.

R1 may use flat/local elevation for 3D proof.

## Geometry qualification

Use `.agents/skills/geometry-gate/SKILL.md`.

At minimum qualify:
- station monotonicity;
- finite transforms;
- width/lifecycle validity;
- large-coordinate local-origin behavior;
- polygon/mesh validity;
- deterministic output;
- 2D/3D single-source derivation.

A geometrically plausible screenshot is not sufficient evidence.