# Codex Prompts

Use these prompts to keep Codex focused.

## Read Context First

```text
/status
Read AGENTS.md and all key docs. Summarize the product scope, UX direction, marking system, negative scope, and current roadmap. Do not write code yet.
```

## Phase 0 Plan

```text
/plan
Plan Phase 0 only: Static App Shell + Static SVG Preview.
Use React + TypeScript + Vite. Build a clean 3-panel interface and a static SVG sample road diagram with pavement marking examples. No real geometry engine yet. No backend. No CAD editor.
```

## Phase 0 Goal

```text
/goal
Implement Phase 0. Prioritize clean UI, clear layout, static SVG preview, marking palette concept, inspector concept, and validation panel. Keep it simple and working.
```

## Phase 1 Plan

```text
/plan
Plan Phase 1 only: Straight Road Segment Generator. Include parametric lane counts, median, shoulders, lane lines, direction arrows, live SVG update, SVG export, and geometry tests. Do not implement intersections or U-turns yet.
```

## Guardrail Prompt

Use this whenever Codex starts adding too much:

```text
Stop and reduce scope. The MVP must prioritize working UI, simple SVG output, and straight road segment geometry. Remove database, backend, login, AI prompt-to-diagram, 3D, DXF/DWG, full drag-and-drop CAD editing, and unrelated abstractions.
```

## Marking System Prompt

```text
When adding pavement markings, use lane/approach/area smart placement. Do not implement freehand SVG drawing. A marking must have category, subtype, targetType, targetId, rotationMode, styleProfile, and sourceStatus.
```

## Review Prompt

```text
/review
Review the implementation for product fit, UX clarity, over-engineering, TypeScript correctness, SVG quality, and scope control. Confirm it still follows AGENTS.md and MVP_ROADMAP.md.
```
