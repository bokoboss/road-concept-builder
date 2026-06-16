# Codex Starter Workflow

## Purpose

Use this workflow to prevent Codex from over-building the app or jumping into intersections, CAD behavior, or full pavement marking libraries too early.

## Step 1 - Read and Summarize

Run this first:

```text
/status
Read AGENTS.md and these docs:
- docs/PRD.md
- docs/UI_UX_GUIDELINES.md
- docs/PAVEMENT_MARKING_SYSTEM.md
- docs/PRODUCT_BOUNDARY_AND_SCOPE.md
- docs/GEOMETRY_SCALE_POLICY.md
- docs/MVP_ROADMAP.md
- docs/TECHNICAL_DESIGN.md

Summarize the product intent, UX principles, negative scope, and recommended first implementation task. Do not write code yet.
```

## Step 2 - Plan Phase 0 Only

```text
/plan
Plan Phase 0 only: Static App Shell + Static SVG Preview.

Scope:
- React + TypeScript + Vite scaffold.
- Clean 3-panel layout: left template/marking palette, center SVG canvas, right inspector/validation panel.
- Top bar with project title, validate, export placeholder.
- Static SVG road segment preview with sample lane arrows, stop line, transverse warning bars, lane lines, median, and shoulders.
- Clean engineering-oriented UI style.
- No real geometry engine yet.
- No intersections, U-turn logic, roundabouts, database, login, AI prompt-to-diagram, CAD drag-and-drop, or backend.

Return a concise implementation plan and file list before coding.
```

## Step 3 - Implement Phase 0

```text
/goal
Implement Phase 0 exactly as planned.

Priorities:
- Make the UI feel right first.
- Keep code simple.
- Use SVG for the static diagram.
- Use clean styling.
- Add minimal tests only if scaffold supports them easily.
- Update README/AGENTS with actual run/test/build commands.

Do not implement real road geometry, intersections, U-turns, roundabouts, database, login, cloud sync, AI prompt-to-diagram, or CAD-style editing.
```

## Step 4 - Review Phase 0

```text
/review
Review Phase 0 against:
- docs/UI_UX_GUIDELINES.md
- docs/PAVEMENT_MARKING_SYSTEM.md
- docs/PRODUCT_BOUNDARY_AND_SCOPE.md
- docs/MVP_ROADMAP.md

Check for:
- over-engineering;
- scope creep;
- poor UX clarity;
- cluttered UI;
- missing marking palette concept;
- missing inspector/validation structure;
- broken run/build/test commands.
```

## Step 5 - Plan Phase 1 Only

After Phase 0 is reviewed and accepted:

```text
/plan
Plan Phase 1 only: Straight Road Segment Generator.

Scope:
- RoadSegment, Lane, Median, Shoulder domain model.
- Meter-based geometry with pxPerMeter conversion.
- Inputs for forward lanes, opposing lanes, lane width, shoulder width, median type, median width.
- SVG rendering for lane lines, edge lines, median, and lane arrows.
- Basic MarkingObject for lane direction arrows.
- SVG export.
- Vitest tests for road width, lane centerlines, median position, and arrow placement.

Do not implement U-turns, intersections, slip lanes, roundabouts, save/load, database, or CAD editing yet.
```
