---
name: thai-road-diagram
description: Use this skill for Thailand-oriented road/street/intersection concept modelling, markings, standards provenance, traffic-side semantics, validation, or road-layout UX in Road Concept Builder.
---

# Thai Road Concept Design Skill

## Purpose

Keep Thailand-oriented engineering concept work aligned with the rebaselined product rather than the legacy straight-road SVG prototype.

Road Concept Builder is a map-first, engineering-aware street/intersection concept designer. It is not a construction drawing package or a Civil 3D/OpenRoads replacement.

## Required context

Before changing road geometry, markings, junction behavior, validation, assets, or related UX, read:

- `docs/PRODUCT_BASELINE_V0_1.md`
- `docs/UX_ARCHITECTURE_V0_1.md`
- `docs/ASSET_SYSTEM_V0_1.md`
- `docs/TECHNICAL_REBASELINE_V0_1.md`
- `docs/REBASELINE_AUDIT_2026-08-25.md`
- relevant legacy documents only for prototype behavior/migration context.

## Core rules

- Default jurisdiction context: Thailand.
- Default traffic side: left-hand traffic.
- Keep architecture capable of LHT/RHT rather than encoding compass-specific eastbound/westbound rules.
- Domain dimensions use meters.
- A road is semantic/reference-alignment based; do not make SVG/mesh the source of truth.
- Longitudinal changes should use station-based component/lane behavior rather than arbitrary overlay polygons.
- Junction geometry and topology are separate; a visual crossing is only a candidate connection.
- 2D and 3D must derive from the same engineering model.
- Common road graphics should be generated procedurally or through semantic assemblies where practical.
- Do not require the user to manually draw SVG assets or model GLB assets.
- Validation is advisory unless geometry is impossible or internally inconsistent.

## Standards/provenance

Never present an unverified value as an official Thai requirement.

Engineering-sensitive data should carry source/provenance information such as:
- authority/agency;
- document/manual;
- edition/version/effective date where known;
- section/table/figure reference where appropriate;
- applicability notes;
- confidence/status.

Existing source-status concepts may be used during migration:
- `THAI_AUTHORITY`
- `AGENCY_MANUAL`
- `INTERNATIONAL_BEST_PRACTICE`
- `PROJECT_ASSUMPTION`
- `CUSTOM_CONCEPT`
- `TODO_VERIFY`

Prefer a structured versioned standards-reference model as the product evolves.

## Marking rules

Standard road markings should normally be procedural semantic objects, not raster artwork.

For a marking define, where applicable:
1. semantic category/subtype;
2. target/reference (road, lane, approach, junction, area, station);
3. physical dimensions/pattern parameters;
4. orientation behavior;
5. source/profile provenance;
6. 2D and 3D rendering behavior;
7. validation/compatibility rules.

Manual world-x/y placement may exist as an override but should not be the only attachment model.

## Thailand asset direction

Core engineering assets should be generated or assembled from project-controlled definitions where feasible:
- lines/markings;
- arrows/stencils;
- signs/sign faces;
- signals;
- delineators/bollards;
- barriers/guardrails;
- lighting.

Use third-party 3D/context assets only after license/provenance review.

## UX rules

Preferred design interactions:
- trace/draw alignment on map/reference;
- select/reuse a cross-section configuration;
- modify semantic components;
- add taper/turn pocket/median/access as generated engineering features;
- confirm/refine candidate junctions;
- inspect synchronized 2D/3D;
- use exact dimensions in the inspector;
- allow AI natural-language actions only through previewable typed semantic commands.

## Done criteria

A Thailand-oriented engineering change is not done until:
- traffic-side behavior is correct and not accidentally compass-specific;
- engineering semantics are preserved independently of rendering;
- unverified standards claims are clearly tagged/avoided;
- relevant geometry/validation tests exist;
- 2D/3D implications are considered where applicable;
- provenance/licensing is recorded for new external assets or standards material;
- user-facing behavior is documented when it changes.