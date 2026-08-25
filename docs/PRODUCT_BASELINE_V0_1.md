# Product Baseline v0.1

## Product thesis

Road Concept Builder is a **map-first street and intersection concept design environment** for traffic engineers and transport planners who need to create technically meaningful roadway concepts faster than CAD-heavy workflows and communicate them clearly in 2D and 3D.

The product should feel easier than Civil 3D/OpenRoads and more engineering-aware than generic drawing or visualization tools.

## Primary jobs to be done

1. Trace or create an existing road from a map, aerial image, or imported plan.
2. Define a semantic cross section without drawing every line manually.
3. Modify lane count, lane width, median, shoulder, verge, sidewalk, bike lane, and parking components.
4. Add longitudinal changes such as taper, widening, lane add/drop, and turn pockets.
5. Create/refine project accesses and intersections.
6. Create Existing and alternative concepts rapidly.
7. Review the same model as 2D plan, cross section, and live 3D.
8. Add engineering markings and presentation assets without manual illustration/modeling work.
9. Export presentation-ready plan and perspective views.
10. Receive advisory engineering/standards warnings without losing engineer control.

## Product boundary

### In scope

- standalone desktop target;
- map/satellite/imported-plan reference workflow;
- metric-native engineering model;
- Thailand and left-hand traffic as default context;
- LHT/RHT configurable architecture;
- semantic road/lane/intersection objects;
- 2D authoring + synchronized 3D;
- scenarios/alternatives;
- procedural road markings;
- semantic signs/signals/street furniture;
- reusable 2D/3D asset library;
- advisory standards profiles;
- natural-language assistant that generates validated semantic commands;
- report/presentation export.

### Explicitly not the initial product

- construction drawing package;
- detailed corridor/grading design;
- cut/fill/earthworks;
- drainage design;
- BIM authoring;
- full traffic simulation;
- signal timing optimization;
- full swept-path replacement for dedicated tools;
- terrain/vertical-alignment-heavy highway design;
- multi-user cloud collaboration.

These capabilities may be integrated later only if they support the core concept-design workflow without turning the product into a Civil 3D clone.

## Core product principles

1. **Map first** — a real location or imported plan is a first-class starting point.
2. **Plan authoring first** — 2D plan is the primary engineering editing environment.
3. **One model, many views** — 2D, cross section, and 3D derive from the same semantic source.
4. **Semantic before graphic** — a lane is a lane, a junction is a junction, a marking is a marking; SVG/mesh are derived views.
5. **Automation first, manual override second** — generate common engineering geometry automatically, but never lock the engineer out.
6. **Direct manipulation + exact numbers** — drag when convenient; type precise dimensions when needed.
7. **Preset as generator** — presets instantiate editable components and never remain opaque objects.
8. **Station-based longitudinal design** — taper, widening, lane add/drop, turn pocket and similar features are native model behaviors.
9. **Geometry is not topology** — visual crossing does not automatically equal network connection.
10. **Advisory standards** — rules explain and warn; users may override where project context requires it.
11. **AI does not edit meshes** — AI produces semantic commands that preview, validate, apply, and undo deterministically.
12. **No manual production dependency** — the normal workflow must not require the user to draw SVG assets, model GLB assets, write code, or use Illustrator/Blender.

## Core views

- **2D Plan** — primary authoring view.
- **Split 2D + 3D** — signature synchronized engineering/presentation view.
- **3D** — inspect/present; limited editing initially.
- **Cross Section** — contextual editor for selected road/section.
- **Compare** — Existing vs Alternative overlay/side-by-side/before-after.

## Golden workflows

### G1 — Project access improvement

Map/satellite → trace existing divided road → configure cross section → create project access → add right-turn pocket → add median opening → markings → live 3D → Alternative B → export.

This is the first recommended end-to-end acceptance project because it exercises alignment, cross section, longitudinal lane transition, access/junction logic, markings, alternatives and 3D without requiring a large network.

### G2 — Intersection improvement

Trace/create T or four-leg intersection → candidate junction → confirm → refine corners → lane connections → turn lanes → islands → crosswalk/stop lines → Existing/Proposed comparison.

### G3 — Road widening

Existing four-lane road → duplicate scenario → six-lane configuration → median/roadside transitions → footprint review → 3D comparison.

### G4 — U-turn / median treatment

Divided road → median opening → U-turn/turn storage → taper → markings → review geometry and presentation.

### G5 — Urban street concept

Road → parking/bike/sidewalk/verge → trees/lights/traffic controls → plan + section + 3D.

## Success test

The product succeeds when a traffic engineer can produce a real-world concept alternative faster than their current CAD/Illustrator/manual-diagram workflow while preserving dimensions, engineering semantics, provenance, and editability.

Visual quality matters, but a visually convincing drawing with no engineering model is not sufficient.