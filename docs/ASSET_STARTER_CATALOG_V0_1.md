# Asset Starter Catalog v0.1

## Purpose

Define the minimum coherent asset set needed for early useful engineering and presentation workflows, together with the preferred production method for each asset.

The normal user should not need to create these assets manually.

## Production methods

- `PROC` — procedural generation from parameters;
- `ASSEMBLY` — semantic configurable assembly;
- `VECTOR` — project-controlled 2D vector resource/symbol;
- `GLB` — normalized reusable 3D model;
- `DIST` — procedural distribution rule;
- `MASSING` — simple generated 3D massing.

An asset may combine methods, e.g. `VECTOR + GLB`.

## Priority levels

- `P0` — needed to prove core engineering workflows;
- `P1` — needed for first practical alpha/presentation usefulness;
- `P2` — expand after core workflows stabilize.

---

# A. Pavement / lane markings

| ID family | Asset | Method | Priority | Notes |
|---|---|---:|---:|---|
| marking.line.solid | Solid lane/edge line | PROC | P0 | color/width/profile driven |
| marking.line.dashed | Dashed lane line | PROC | P0 | dash/gap/width/profile driven |
| marking.line.double | Double line | PROC | P1 | spacing/line type configurable |
| marking.stop_line | Stop line | PROC | P0 | attach to approach/station |
| marking.yield_line | Give-way/yield line | PROC | P1 | profile-driven pattern |
| marking.crosswalk.zebra | Zebra crosswalk | PROC | P0 | width/stripe/gap/orientation |
| marking.arrow.through | Through arrow | VECTOR/PROC | P0 | scalable vector + semantic placement |
| marking.arrow.left | Left-turn arrow | VECTOR/PROC | P0 | traffic-side/orientation aware |
| marking.arrow.right | Right-turn arrow | VECTOR/PROC | P0 | traffic-side/orientation aware |
| marking.arrow.through_left | Combined through-left | VECTOR/PROC | P1 | derive from approved vector definition |
| marking.arrow.through_right | Combined through-right | VECTOR/PROC | P1 | derive from approved vector definition |
| marking.arrow.uturn | U-turn arrow | VECTOR/PROC | P0 | Thailand/LHT orientation profiles later |
| marking.hatch.chevron | Chevron/hatch area | PROC | P0 | path/polygon generated |
| marking.gore | Gore/channelization | PROC | P1 | semantic area/path |
| marking.parking.stall | Parking stall lines | PROC | P1 | array/angle/size configurable |
| marking.bike.symbol | Bicycle stencil | VECTOR | P1 | jurisdiction/profile variants later |
| marking.motorcycle.box | Motorcycle box | PROC + VECTOR | P1 | Thailand-context candidate |
| marking.bus | Bus lane/stop stencil | VECTOR | P2 | profile variants later |
| marking.text | Road text stencil | VECTOR/PROC | P2 | font/legal/profile research needed |
| marking.warning_bars | Transverse warning bars | PROC | P2 | standards research before official profile |

## Marking implementation rule

Do not ship these as raster PNGs when vector/procedural generation is practical.

A marking definition should store dimensions/pattern/attachment/provenance separately from its renderer output.

---

# B. Road components

These are semantic geometry, not conventional library assets.

| Component | Method | Priority | Notes |
|---|---:|---:|---|
| Traffic lane | PROC | P0 | station width/lifecycle |
| Median — painted | PROC | P0 | marking/surface semantics |
| Median — raised | PROC | P0 | 2D + 3D curb/surface |
| Shoulder | PROC | P0 | side/component type |
| Sidewalk | PROC | P1 | height/material presentation |
| Verge | PROC | P1 | grass/landscape later |
| Bike lane | PROC | P1 | marking/surface semantic |
| Parking lane | PROC | P1 | optional stalls |
| Channelizing island | PROC | P1 | junction/road feature |
| Curb | PROC | P1 | edge profile/height |
| Concrete barrier | PROC/ASSEMBLY | P1 | line/path placement |
| Guardrail | ASSEMBLY + DIST | P2 | source standard/model research |

---

# C. Traffic signs

## Architecture

Use semantic sign assembly:

```text
SignFace
 + Support
 + Placement
```

Do not create a separate complete 3D model for every sign/support combination.

## P0/P1 starter sign-face categories

### Regulatory

- Stop;
- Give Way;
- No Entry;
- speed limit family;
- turn restrictions;
- U-turn permitted/prohibited candidates;
- keep left/right candidates.

### Warning

- intersection/junction warnings;
- curve/alignment warnings;
- pedestrian crossing;
- traffic signal ahead;
- road narrows/lane transition candidates.

### Guide

P1 should initially support generic/custom guide sign composition rather than reproducing a complete national destination-sign catalog.

## Production method

- sign face: `VECTOR` generated/maintained from verified Thailand profile definitions;
- pole/support: `ASSEMBLY` simple project-controlled 3D primitives/GLB components;
- sign placement: semantic road station/lateral/orientation data.

## Priority

- semantic sign assembly engine: P1;
- small Thailand starter face set: P1;
- broad DOH/DRR sign catalog: P2/R6 after source/licensing review.

---

# D. Traffic signals

| Asset | Method | Priority | Notes |
|---|---|---:|---|
| Vertical signal pole | ASSEMBLY | P1 | generic first |
| Mast-arm pole | ASSEMBLY | P1 | configurable arm length |
| 3-aspect vehicle head | ASSEMBLY/GLB | P1 | semantic orientation |
| Arrow signal head | ASSEMBLY | P2 | movement-specific |
| Pedestrian head | ASSEMBLY | P2 | profile later |
| Signal controller cabinet | GLB | P2 | presentation context only initially |

V1 semantic signal objects do not need timing simulation.

Avoid authoritative mounting dimensions until current Thai source is verified.

---

# E. Lighting / roadside devices

| Asset | Method | Priority | Notes |
|---|---|---:|---|
| Single-arm streetlight | ASSEMBLY | P1 | dimensions/profile metadata |
| Double-arm median light | ASSEMBLY | P1 | median attachment |
| LED luminaire variants | ASSEMBLY/GLB | P2 | DOH 2026 guidance context |
| Bollard | GLB + DIST | P1 | along edge/path |
| Delineator post | GLB + DIST | P1 | standards profile later |
| Flexible post | GLB + DIST | P2 | |
| Traffic cone | GLB + DIST | P1 | useful for concept/work-zone later |
| Pedestrian railing | PROC/ASSEMBLY | P2 | path based |
| Fence | PROC/ASSEMBLY | P2 | path based |
| Guardrail | ASSEMBLY + DIST | P2 | profile research required |
| Concrete barrier | PROC/GLB | P1 | line/path based |

---

# F. Public transport / roadside facilities

| Asset | Method | Priority |
|---|---|---:|
| Bus stop sign | ASSEMBLY | P1 |
| Simple bus shelter | GLB/ASSEMBLY | P1 |
| Bus bay marking | PROC | P1 |
| Taxi/drop-off marking candidate | PROC/VECTOR | P2 |
| Bench | GLB | P2 |
| Bicycle rack | GLB | P2 |
| Trash bin | GLB | P2 |

---

# G. Vehicles

## Vehicle starter set

| Semantic ID | Asset | Method | Priority | Approx. role |
|---|---|---:|---:|---|
| vehicle.sedan.generic | Sedan | VECTOR + GLB | P1 | scale/context |
| vehicle.suv.generic | SUV | VECTOR + GLB | P1 | |
| vehicle.pickup.generic | Pickup | VECTOR + GLB | P1 | Thailand context |
| vehicle.motorcycle.generic | Motorcycle | VECTOR + GLB | P1 | Thailand context |
| vehicle.van.generic | Van | VECTOR + GLB | P1 | |
| vehicle.bus.city | City bus | VECTOR + GLB | P1 | streets/transit |
| vehicle.bus.coach | Coach | VECTOR + GLB | P1 | hotel/tour context |
| vehicle.truck.rigid | Rigid truck | VECTOR + GLB | P1 | access/industrial context |
| vehicle.truck.articulated | Articulated truck | VECTOR + GLB | P2 | heavy-vehicle context |

## Requirements

Each vehicle should have:
- semantic category;
- physical length/width/height metadata;
- correctly scaled 2D top representation;
- correctly scaled 3D representation;
- consistent forward orientation;
- reasonable triangle/texture limits;
- source/license provenance.

These are presentation/reference objects initially, not swept-path vehicle envelopes.

---

# H. Landscape

| Asset | Method | Priority |
|---|---|---:|
| tree.small | VECTOR + GLB | P1 |
| tree.medium | VECTOR + GLB | P1 |
| tree.large | VECTOR + GLB | P1 |
| palm.generic | VECTOR + GLB | P2 |
| shrub.generic | VECTOR + GLB | P2 |
| planter | GLB | P2 |
| grass/verge material | PROC/material | P1 |
| tree row | DIST | P1 |
| shrub/landscape area | DIST | P2 |

Use a small coherent visual family rather than dozens of inconsistent tree packs.

---

# I. Buildings / context

| Asset | Method | Priority |
|---|---|---:|
| simple building footprint extrusion | MASSING | P1 |
| generic low-rise block | MASSING/GLB | P1 |
| generic mid-rise block | MASSING/GLB | P2 |
| user imported GLB building | GLB import | P2 |
| OSM footprint massing | MASSING | P2 |

R1/R2 do not require realistic architecture.

The purpose is scale/context and obstruction/urban-form communication.

---

# J. People

| Asset | Method | Priority |
|---|---|---:|
| pedestrian standing/walking static set | VECTOR + GLB | P2 |
| cyclist static | VECTOR + GLB | P2 |
| wheelchair/user diversity candidates | VECTOR + GLB | P2 |

Do not block product alpha on animated/photorealistic characters.

---

# K. Distribution presets

P1/P2 procedural placement presets:

```text
Tree Row
  reference: sidewalk/edge/path
  spacing
  offset
  jitter optional
```

```text
Street Lights
  reference: road/median/sidewalk edge
  spacing
  offset
  single/double/alternating
```

```text
Bollard Row
  reference path/edge
  spacing
  start/end setback
```

```text
Parking Vehicles
  reference parking stalls
  occupancy percentage
  vehicle mix
  deterministic random seed
```

Use deterministic seed when distribution matters for repeatable project rendering.

---

# L. Asset creation pipeline priority

## Phase A — R1/R2

Create only engineering placeholder/procedural visuals required to prove geometry and UI.

Do not build a large asset library.

## Phase B — R3 practical alpha

Required:
- core lane/stop/crosswalk/arrows/hatching;
- minimal sign/signal placeholders;
- several correctly scaled vehicles;
- trees;
- streetlights;
- barriers/bollards;
- simple buildings.

## Phase C — R5 presentation beta

Upgrade asset quality/cohesion and add broader library/distributions.

## Phase D — R6 Thailand profile

Replace generic engineering-sensitive graphics with verified Thailand profile assets and source-linked dimensions where legally/technically appropriate.

---

# Asset acceptance criteria

Every built-in reusable asset should answer:
1. What semantic object is this?
2. What are its physical dimensions or parameter source?
3. How does it appear in 2D?
4. How does it appear in 3D?
5. How is it attached/placed?
6. Is it engineering-sensitive or presentation-only?
7. What is its source/license/provenance?
8. Is the asset deterministic and correctly scaled?

Do not accept assets based only on thumbnail attractiveness.