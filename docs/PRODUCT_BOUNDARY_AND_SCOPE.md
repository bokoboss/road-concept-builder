# Product Boundary and Scope — Rebaseline

## One-sentence definition

Road Concept Builder is a standalone, map-first, engineering-aware street and intersection concept design environment that turns semantic roadway models into synchronized 2D and 3D communication outputs.

## Primary use cases

The product should help traffic engineers quickly create and compare concepts for:
- existing-road tracing/reference;
- project access layouts;
- lane additions and drops;
- right/left-turn pockets;
- median openings and U-turn treatments;
- T and four-leg intersections;
- skewed intersection improvements;
- road widening;
- channelizing islands/slip lanes later;
- bus bays;
- parking/bike/sidewalk/verge streetscape components;
- pavement markings and traffic-control devices;
- Existing / Alternative comparisons;
- report/presentation graphics and live 3D views.

## Intended output quality

Outputs should be suitable for:
- traffic impact assessment reports;
- engineering concept studies;
- public-agency/developer presentations;
- internal design discussions;
- alternative comparison workshops;
- PowerPoint/Word/PDF graphics;
- interactive 3D concept review.

Outputs are not automatically construction drawings or certification of detailed-design compliance.

## Product boundary

The product should be **more technically structured than a generic drawing/3D visualization app** and **substantially lighter than detailed civil-design software**.

### Core product capabilities

- real map/reference context;
- engineering-semantic roads/lanes/junctions;
- reference alignment and stationing;
- component cross sections;
- longitudinal transitions;
- first-class intersection topology;
- procedural/semantic road markings;
- semantic traffic-control assets;
- synchronized 2D/3D;
- alternatives/scenarios;
- advisory standards validation;
- presentation export;
- future natural-language semantic commands.

### Not the initial product

Do not turn the core product into:
- Civil 3D/OpenRoads-style detailed corridor design;
- construction documentation;
- terrain/grading/cut-fill package;
- drainage design software;
- BIM authoring environment;
- traffic microsimulation platform;
- signal timing optimization software;
- full vehicle swept-path replacement;
- multi-user cloud collaboration platform;
- general-purpose 2D/3D modelling software.

These domains may integrate later only when they support the core concept workflow without redefining the product.

## Accuracy policy

Use real engineering dimensions and deterministic semantic geometry, but distinguish **concept design accuracy** from detailed final design/compliance certification.

Requirements:
- meters are canonical domain units;
- dimensions remain inspectable/editable;
- geometry invariants are machine-tested;
- standards-sensitive defaults carry provenance/status;
- unverified assumptions are never presented as official requirements;
- validation is advisory unless geometry is impossible/internal state is invalid;
- user overrides remain possible where project context justifies them.

## 3D boundary

3D is a first-class synchronized view, not a separate modelling product.

Initial 3D responsibility:
- road/median/curb/sidewalk surfaces;
- markings;
- junction pavement;
- basic traffic-control/context assets;
- Engineering and Presentation views;
- saved/presentation camera views later.

Do not require Blender-like mesh editing from the normal user.

## AI boundary

AI may:
- translate natural-language intent into typed semantic commands;
- explain selected engineering objects;
- identify missing/inconsistent concept elements;
- propose an alternative scenario.

AI may not bypass:
- semantic project state;
- validation;
- preview/apply/cancel;
- undo/redo;
- topology rules;
- standards provenance.

AI must not directly mutate renderer meshes/SVG/project JSON as the product editing mechanism.

## Asset boundary

The user should not need to manually create production assets.

Prefer:
1. procedural engineering generation;
2. semantic assemblies;
3. project-generated vector/simple 3D assets;
4. licensed third-party context assets with provenance.

Asset realism should not block geometry/engineering usefulness.

## Deferred capabilities

Explicitly defer until core golden workflows are strong:
- detailed vertical alignment;
- terrain/cut-fill;
- drainage;
- roundabout production module until ordinary junction kernel is robust;
- full swept path;
- traffic simulation;
- traffic-volume/LOS analytics inside this product;
- signal timing;
- cloud collaboration;
- full BIM/CAD interchange;
- plugin marketplace;
- large photorealistic asset catalog.

## Product success criteria

The first meaningful production milestone succeeds when a traffic engineer can complete the Project Access Improvement golden workflow:

```text
map/reference
 -> road alignment/cross section
 -> access
 -> turn pocket
 -> median opening
 -> markings
 -> synchronized 3D
 -> alternative
 -> compare/export
```

faster and with less manual drafting than their prior workflow, while preserving engineering semantics, dimensions, editability, and provenance.