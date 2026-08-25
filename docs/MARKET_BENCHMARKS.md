# Market & Product Benchmarks — Rebaseline Research

## Purpose

Capture product/UX/technical patterns worth learning from existing street, road, map and 3D editing tools.

This is **research, not permission to copy code/assets/UI**. Reuse of external code/assets requires explicit license review.

The target product is not a clone of any single benchmark. It combines selected strengths around a semantic traffic-engineering model.

## Target gap

Road Concept Builder should sit between:
- lightweight communication tools such as Streetmix/Streetcraft/3DStreet; and
- heavy professional road/CAD/simulation tools such as Civil 3D, OpenRoads, InfraWorks, RoadRunner and specialist Transoft products.

Target position:

> **Map-first professional street/intersection concept design: easier than CAD, more engineering-aware than generic graphics, with one semantic model for 2D and 3D.**

---

## 1. Streetcraft Studio

Sources:
- https://www.streetcraft.studio/

### Useful strengths
- fast plan-view road/intersection concept graphics;
- trace/compose over real imagery;
- large road preset/toolkit approach;
- before/after communication;
- presentation-first visual clarity;
- demonstrates demand for plan-view alternatives to heavy CAD.

### Limitations relevant to this project
- workflow is fundamentally graphic/static rather than a generalized semantic road-network kernel;
- Illustrator dependency conflicts with the requirement that the user should not need manual illustration tools;
- preset/graphic workflows can make longitudinal engineering behavior and topology difficult to generalize;
- not the desired route for live shared 2D/3D engineering semantics.

### Borrow
- map/reference-first mental model;
- rapid concept assembly;
- strong plan-view communication;
- before/after mindset;
- useful road/intersection component vocabulary.

### Avoid
- Illustrator/manual drawing dependency;
- static graphic preset as source of truth;
- fixed drawing-scale assumptions leaking into engineering semantics.

---

## 2. Streetmix

Sources:
- https://streetmix.net/
- https://github.com/streetmix/streetmix

### Useful strengths
- exceptionally fast street cross-section creation;
- simple drag-and-drop component mental model;
- accessible to non-CAD users;
- immediate visual feedback;
- strong communication value.

### Known gap

Streetmix is primarily cross-section-oriented. Public user discussions repeatedly identify the desire for similarly easy **plan-view/intersection/longitudinal-change** authoring.

### Borrow
- component-based road configuration;
- drag/reorder components;
- friendly defaults;
- immediate preview;
- presets/configurations as starting points.

### Avoid
- making cross section the entire road source of truth;
- treating longitudinal lane transitions/intersections as out-of-model graphics.

---

## 3. Remix Streets

Sources:
- https://ridewithvia.com/solutions/remix/streets
- Via/Remix Streets product articles on advanced editing and visual storytelling.

### Useful strengths
- plan-view street redesign;
- segment/network context;
- tapers/transitions;
- street corners/intersection refinement;
- crosswalk/stop-bar/lane extensions;
- satellite/context measurement;
- designed for stakeholder discussion.

### Borrow
- plan/network editing as a core authoring mode;
- longitudinal transition workflow;
- direct manipulation of corners/road extents;
- visual clarity for meetings and alternatives.

### Avoid early
- cloud/collaboration/account platform complexity;
- network-planning breadth before core geometry is robust.

---

## 4. 3DStreet

Sources:
- https://www.3dstreet.com/
- https://www.3dstreet.com/docs/category/key-features/
- https://www.3dstreet.com/blog/

### Useful strengths
- immediate 3D street visualization;
- geospatial/location workflow;
- reusable model library;
- map/background controls;
- saved/presentation-oriented views;
- natural-language Console/command interaction;
- componentized managed-street direction;
- current product research has led to clearer panel hierarchy.

### Important UX lessons from public product updates

Recent 3DStreet redesign notes describe problems that are directly relevant to this project:
- feature hierarchy became unclear as features were bolted on;
- geospatial functionality was too deeply buried despite heavy use;
- navigation and object editing could conflict;
- layer ordering/grouping becomes important as scenes grow;
- users request saved cameras, multi-select/grouping, and more explicit scene organization.

### Borrow
- live 3D as a first-class view;
- map/geospatial as top-level workflow;
- Layers / Gallery/Library / Properties-style information hierarchy;
- explicit Hand/navigation mode;
- saved camera/presentation view concept;
- natural-language commands with visible command history;
- 2D/3D asset normalization/metadata principles.

### Improve for our product
- AI command layer should emit typed deterministic engineering commands, not opaque scene mutations;
- semantic engineering model should be stronger than presentation scene objects;
- 2D plan authoring should be primary for precision;
- traffic-engineering dimensions/topology/standards provenance should be inspectable.

---

## 5. MathWorks RoadRunner

Sources:
- https://www.mathworks.com/products/roadrunner.html
- https://www.mathworks.com/help/roadrunner/

### Useful strengths
- road/lane/junction semantic editing;
- lane add/width/carve/marking tools;
- specialized custom-junction/corner/surface/maneuver concepts;
- robust asset taxonomy;
- point/path/polygon-style prop placement and procedural prop sets;
- 2D/3D road-network context.

### Asset taxonomy lesson

RoadRunner separates meaningful asset classes such as:
- materials/textures;
- props;
- prop assemblies;
- prop sets;
- signs;
- signals;
- lane/crosswalk/polygon/stencil markings;
- road styles.

This is superior to treating every visual object as one generic 3D model class.

### Borrow
- semantic road/lane/junction separation;
- dedicated junction sub-concerns;
- explicit lane connectivity/maneuver concept;
- asset type families;
- semantic/path/area placement;
- procedural set -> individual-object workflow concept.

### Avoid
- large number of modal editing tools exposed simultaneously;
- simulation/autonomous-driving scope;
- professional complexity that obscures common concept workflows.

---

## 6. Esri CityEngine Street Designer

Sources:
- https://doc.arcgis.com/en/cityengine/latest/help/
- CityEngine 2026 street-designer release notes.

### Useful strengths
- procedural street network model;
- reusable street configurations;
- direct lane-width manipulation + inspector values;
- street/lane hierarchy;
- node cleanup/merge/simplification;
- per-corner curb-radius improvements;
- 3D urban context.

### Borrow
- road configuration library;
- direct manipulation plus exact numeric inspector;
- per-corner geometry;
- imported-network cleanup tools;
- clear semantic hierarchy in scene tree.

### Avoid
- procedural city-generation scope unrelated to traffic concept design;
- rule-system complexity before core road workflows are proven.

---

## 7. Autodesk InfraWorks

Sources:
- https://help.autodesk.com/ (InfraWorks Roads and Highways / component roads documentation)

### Useful strengths
- component road assemblies;
- lane/curb/gutter/median/shoulder/sidewalk components;
- reusable road configurations;
- station-based local component insertion;
- transition in/out behavior for widening/tapers;
- map/terrain context and infrastructure presentation.

### Borrow
- longitudinal component transition as a first-class primitive;
- reusable semantic road assemblies;
- grips + exact station/dimension controls;
- contextual infrastructure visualization.

### Avoid
- terrain/grading/drainage/quantities/civil scope creep;
- turning concept tool into an infrastructure lifecycle platform.

---

## 8. Civil 3D / OpenRoads

### Useful strengths
- mature alignment/station/corridor concepts;
- precision and engineering interoperability;
- professional numeric editing;
- well-known road-design vocabulary.

### Borrow
- alignment/station semantics;
- engineering coordinate discipline;
- exact-value workflow;
- concept of derived geometry from a parametric model.

### Avoid
- ribbon/tool overload;
- detailed corridor/grading complexity;
- specialist setup burden for quick concepts;
- making users understand full CAD object hierarchies for simple traffic design.

---

## 9. Transoft road/sign/marking products

Sources:
- https://www.transoftsolutions.com/

Relevant families include TrafxPLAN/KeyLINES/GuideSIGN/TORUS-type specialized workflows.

### Useful strengths
- professional pavement-marking/sign libraries;
- traffic-specific symbols;
- specialized roundabout workflows;
- engineering/reporting mindset;
- country/library/profile concepts.

### Borrow
- engineering marking library taxonomy;
- sign/marking components as first-class objects;
- country/profile library concept;
- specialized roundabout module rather than forcing generic junction UI to cover everything.

### Avoid early
- CAD-plugin dependency;
- detailed drafting controls before concept workflow is excellent;
- full quantity/reporting ecosystem before core product usefulness.

---

## 10. StreetPlan / complete-street guidance tools

Sources:
- StreetPlan product resources / Urban Innovators.

### Useful strengths
- street component authoring;
- red/yellow/green guidance;
- templates and best-practice feedback;
- approachable public-facing workflow.

### Borrow
- visible advisory design guidance;
- guidance that does not necessarily block authoring;
- profiles/templates tied to a design context.

### Improve

Our engineering product should show:
- rule/source;
- affected object;
- applicability;
- override possibility;
rather than only a color score.

---

## 11. QGIS / map editors

### Useful strengths
- robust map navigation/layers;
- CRS/georeference awareness;
- layer visibility/locking/ordering;
- snapping/reference workflows;
- desktop map-first mental model.

### Borrow
- map as core workspace;
- layers and visibility/lock discipline;
- coordinate-system separation;
- snapping/reference concepts.

### Avoid
- GIS feature-editing complexity where a road-semantic command is faster;
- exposing CRS details to every user action.

---

# Cross-product synthesis

## What should be core to Road Concept Builder

| Capability | Inspiration | Our interpretation |
|---|---|---|
| Map/reference-first | Streetcraft, 3DStreet, GIS | Real-world location/reference is first-class |
| Simple cross-section composition | Streetmix, CityEngine, InfraWorks | Preset/config -> editable semantic components |
| Plan-view transitions | Remix, InfraWorks | Station-based taper/widen/lane lifecycle |
| Direct + numeric editing | CityEngine, InfraWorks, CAD tools | Drag grips + exact properties |
| Semantic junction editing | RoadRunner | Candidate/connected topology + per-corner refinement |
| Live 3D | 3DStreet, RoadRunner, InfraWorks | One model -> synchronized 3D |
| Layers/library/properties hierarchy | 3DStreet, GIS | Avoid feature-bolt-on sidebar sprawl |
| Procedural/typed assets | RoadRunner | Road/marking/assembly/prop/distribution families |
| Standards guidance | StreetPlan, professional tools | Source-versioned advisory issues |
| Alternative comparison | Streetcraft, planning tools | Existing/Alt scenarios are core |
| Natural-language actions | 3DStreet | Typed command proposal -> preview -> apply/undo |

## Product differentiators

The product should differentiate through the combination of:
1. **plan-view ease**;
2. **traffic-engineering semantics**;
3. **station-based longitudinal geometry**;
4. **first-class intersection topology**;
5. **Thailand/LHT defaults and provenance-aware rules/assets**;
6. **one model for 2D and 3D**;
7. **AI-assisted authoring without surrendering deterministic engineering control**;
8. **no requirement for manual Illustrator/Blender asset production**.

## Highest-priority competitor mistakes to avoid

1. **Static graphic truth** — visually good but semantically weak.
2. **Cross-section-only truth** — cannot express plan/longitudinal behavior naturally.
3. **Feature bolt-on UI** — every new function gets another sidebar/button.
4. **Navigation/editing ambiguity** — accidental object movement while panning/orbiting.
5. **Modal-tool overload** — too many special tools/modes for common operations.
6. **Separate 2D/3D models** — synchronization debt.
7. **Presentation realism mistaken for engineering feasibility**.
8. **Standards values with no source/version context**.
9. **Asset libraries with unclear redistribution/license provenance**.
10. **Scope creep into detailed civil design before the concept workflow is excellent**.

## Research maintenance

Competitor products evolve. Before major UX/product changes, re-check current behavior/release notes rather than treating this document as permanently current.