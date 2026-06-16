---
name: thai-road-diagram
description: Use this skill when working on Thai-oriented road concept diagram components, pavement marking placement, validation rules, or road layout UX in Road Concept Builder.
---

# Thai Road Diagram Skill

## Purpose

Use this skill to keep road concept diagram tasks aligned with the product direction.

The app is a lightweight 2D plan-view road concept diagram builder for traffic engineering reports and presentations. It is not a CAD replacement or construction drawing tool.

## Required Context

Before changing road geometry, markings, validation, or UI interactions, read:

- `docs/PRD.md`
- `docs/UI_UX_GUIDELINES.md`
- `docs/PAVEMENT_MARKING_SYSTEM.md`
- `docs/PRODUCT_BOUNDARY_AND_SCOPE.md`
- `docs/GEOMETRY_SCALE_POLICY.md`
- `docs/DATA_MODEL.md`
- `docs/VALIDATION_RULES.md`
- `docs/MVP_ROADMAP.md`

## Core Rules

- Default context is Thailand and left-hand traffic.
- Build concept diagrams, not construction drawings.
- Use meters in the domain model.
- Render with SVG first.
- Keep geometry separate from React UI.
- Use smart lane/approach/area placement for pavement markings.
- Do not implement freehand CAD drawing in the MVP.
- Do not claim Thai-standard compliance unless the source status is verified.
- Mark assumptions as `PROJECT_ASSUMPTION` or `TODO_VERIFY`.

## Pavement Marking Rules

When adding a marking:

1. define category and subtype;
2. define target type and target id;
3. define position/offset behavior;
4. use auto rotation where possible;
5. include source status;
6. add validation rules if the marking can be incomplete or inconsistent.

## UX Rules

The preferred user flow is:

```text
Select lane/approach/area -> Add Marking -> auto-place -> adjust in inspector
```

Do not make users manually draw standard lane markings or symbols.

## Over-Engineering Guardrails

Do not add these unless explicitly requested for a later phase:

- database;
- backend;
- login;
- 3D;
- simulation;
- DXF/DWG;
- full CAD layer management;
- complete standards enforcement;
- AI prompt-to-diagram.

## Done Criteria

A road/marking change is done only when:

- the diagram still renders cleanly;
- behavior matches the current phase;
- validation is updated where needed;
- tests are added for geometry or validation logic where practical;
- docs are updated when product behavior changes.
