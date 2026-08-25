# UI/UX Guidelines — Rebaseline

## Authoritative detail

Use these documents together:
- `docs/UX_ARCHITECTURE_V0_1.md` — workspace and interaction architecture;
- `docs/VISUAL_DESIGN_SYSTEM_V0_1.md` — visual language;
- `docs/TOOL_TAXONOMY_V0_1.md` — tool families/contextual actions.

This file provides the short set of mandatory UX rules.

## Product UX objective

The application is a professional engineering concept editor, not a calculation form, generic illustration app, or CAD clone.

The user should be able to move from map/reference context to a precise road/intersection concept quickly while seeing the same semantic model in 2D and 3D.

## Mandatory UX rules

### 1. Plan view is the primary authoring surface

Use 2D plan for most engineering edits.

3D is synchronized for inspection/presentation and limited editing, not a separate modelling workflow.

### 2. Viewport first

Keep the design/map viewport dominant.

Persistent information hierarchy:
- left: Layers / Map / Library;
- center: main viewport;
- right: contextual Properties / Validation / AI;
- compact contextual tools;
- visible scenarios.

Do not build a dashboard-card layout.

### 3. Direct manipulation + exact values

Road, lane/component, corner and other geometric operations should support:
- drag/grip editing for speed;
- numeric property input for precision.

Both paths edit the same semantic parameter.

### 4. Separate navigation and editing

At minimum:
- Select;
- Hand/Pan;
- distinct 3D Orbit/Pan/Select behavior.

The active mode must always be visible.

Navigation must not accidentally move design objects.

### 5. Progressive disclosure

Common properties first; advanced station/topology details on demand.

Never hide critical validation/status inside an Advanced section.

### 6. Contextual actions over toolbar sprawl

When a Road is selected, show road actions.
When a Junction is selected, show junction actions.
When a Marking is selected, show marking actions.

Do not create a permanent icon for every feature/subtype.

### 7. Automation first, override second

Do not require the user to manually draw normal lanes, tapers, crosswalk stripes, arrows, signs or 3D assets.

Generate from semantic parameters and let the user refine/override.

### 8. Candidate junction confirmation

If roads cross/touch, show a candidate and require explicit connection/ignore/grade-separated decision.

Do not silently create network topology.

### 9. Synchronized selection

Selecting a semantic object in plan should identify/highlight the same object in 3D/cross-section and update the contextual inspector.

### 10. Scenarios are visible

Existing/Alternative state should remain obvious during editing.

Comparisons must not mutate the compared scenario.

### 11. Non-modal validation

Use an Issues panel and on-canvas markers.

Issue actions should select/focus the affected object and explain source/rule where applicable.

Only impossible/internal-invalid geometry should block operations by default.

### 12. Reliable undo/redo

One conceptual edit should normally be one transaction.

AI-generated changes use the same undo path.

`Esc` must cancel transient operations safely.

### 13. Map/reference readability

Provide:
- opacity;
- dim/desaturate;
- label visibility where available;
- reference lock;
- scale/georeference status.

Proposed engineering geometry must remain legible over satellite imagery.

### 14. AI is an alternate command interface

Natural-language intent must produce a visible semantic command proposal, preview and Apply/Cancel path.

Do not let AI write raw scene/project state directly.

## New project flow

Recommended:

```text
New Project
  Map / Satellite
  Import Image / Site Plan
  Blank Canvas
```

Defaults:
- metric;
- Thailand;
- left-hand traffic.

Advanced CRS/georeference settings remain collapsed until needed.

## Core road flow

```text
Draw/trace alignment
 -> choose/apply road configuration
 -> edit cross-section components
 -> add longitudinal features
 -> confirm/refine junction/access
 -> markings/assets
 -> validate
 -> compare alternative
 -> export/present
```

## Cross-section UX

Component blocks should be compact and reorderable.

The cross-section editor is contextual to the selected road/station and does not replace plan-view longitudinal geometry.

## 3D UX

Initial modes:
- Engineering;
- Presentation.

Initial controls:
- Orbit;
- Pan;
- Zoom;
- Fit Selection;
- Top/Perspective.

No Blender-style modelling requirement.

## Visual character

Target:
- modern;
- calm;
- premium;
- professional;
- compact;
- engineering-oriented.

Avoid:
- CAD-ribbon overload;
- consumer dashboard styling;
- game-like neon UI;
- giant forms;
- excessive dialogs;
- icon-only mystery tools.

## UX qualification

Use `.agents/skills/ux-gate/SKILL.md`.

Major product UX stages require real golden-workflow UAT in addition to screenshots/component tests.