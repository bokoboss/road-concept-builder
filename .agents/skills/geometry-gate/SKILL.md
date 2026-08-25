---
name: geometry-gate
description: Use to qualify generalized road, lane, junction, polygon, mesh, or topology changes in Road Concept Builder before a geometry milestone is accepted.
---

# Geometry Gate

## Purpose

Require machine-verifiable evidence for geometry changes. A screenshot that looks correct is not sufficient.

## Inputs

Review:
- authoritative stage/spec;
- changed geometry/domain modules;
- canonical fixtures;
- unit/property/fuzz tests;
- benchmark/qualification output;
- 2D and 3D derived representations where applicable.

## Required checks

### Alignment
- finite coordinates;
- positive primitive lengths;
- monotonic stationing;
- stable evaluation at primitive boundaries;
- declared continuity is satisfied;
- projection to station/lateral offset behaves deterministically.

### Lane/component lifecycle
- width never negative;
- zero-width start/end is handled intentionally;
- start <= end station;
- no orphan components;
- deterministic lateral ordering;
- taper/add/drop behavior matches semantic lifecycle;
- local edit regenerates all dependent geometry and not unrelated geometry.

### Junction geometry
- approach references valid;
- cut stations valid;
- per-corner settings independent;
- generated boundary valid;
- no unintended self-intersection;
- unequal/skewed approaches covered;
- nearly parallel/near-degenerate stress cases covered.

### Topology
- geometric crossing is not automatically a connection;
- every lane connection references valid lanes;
- ignored/grade-separated candidates remain disconnected;
- movement direction is consistent with traffic-side semantics.

### Polygon/mesh
- no NaN/Infinity;
- no invalid holes after cleanup;
- no degenerate triangles beyond documented tolerance;
- consistent winding/normals;
- triangulated area agrees with source area within documented tolerance;
- 2D and 3D derive from the same canonical geometry/model.

### Coordinates
- domain units are meters;
- large source/georeferenced coordinates are converted to stable local-render coordinates;
- renderer transforms do not leak back into engineering values.

## Required evidence layers

Prefer all of:
1. unit tests;
2. golden/canonical fixture tests;
3. invariant tests;
4. deterministic repeated-run tests;
5. property/random tests for risky numeric domains;
6. fuzz tests for polygon/junction operations where feasible;
7. benchmark/regression data.

If any layer is absent, require an explicit reason and substitute evidence.

## Adversarial cases

At minimum consider:
- very short segment;
- zero-width lane endpoint;
- almost parallel roads;
- almost tangent intersection;
- very acute/obtuse skew;
- duplicated/near-duplicated control points;
- large coordinate magnitude;
- tiny taper/storage values;
- abrupt width transitions;
- divided-to-undivided transition;
- junction with unequal approach widths.

## Result

Return:
- `PASS` — required evidence supports acceptance;
- `PASS WITH LIMITATIONS` — accepted only with explicit bounded limitations;
- `FAIL` — one or more acceptance invariants/evidence requirements are not met.

For every failure, identify the smallest reproducible fixture/input and the violated invariant.

Do not waive a geometry failure because the rendered image appears acceptable.