---
name: ux-gate
description: Use to review Road Concept Builder workflow/UI changes against golden engineering workflows, mode clarity, 2D/3D synchronization, precision, recoverability, and professional usability before UX milestones are accepted.
---

# UX Gate

## Purpose

Qualify whether a UI change helps a traffic engineer complete a real concept-design workflow rather than merely looking polished.

## Review priorities

### 1. Golden workflow completion

Test the affected workflow end to end, not only isolated components.

Primary golden workflow:
- map/reference;
- road alignment;
- cross section;
- project access;
- right-turn pocket;
- median opening;
- markings;
- synchronized 3D;
- alternative;
- export.

Use shorter subsets when the current stage does not implement the full workflow.

### 2. Mode clarity

Verify:
- active tool/mode is visible;
- navigation does not accidentally edit objects;
- `Esc`/cancel behavior is predictable;
- selection vs drag vs pan/orbit is unambiguous;
- destructive actions cannot happen from an unclear transient mode.

### 3. Direct manipulation + exact input

For editable engineering geometry:
- fast drag/grip interaction is available where useful;
- exact numeric property editing exists where precision matters;
- both paths edit the same semantic property;
- live preview does not silently commit invalid state.

### 4. 2D/3D synchronization

When both views exist:
- one selection highlights the same semantic object;
- engineering property edits update both derived views;
- no duplicate 2D-only vs 3D-only engineering truth emerges;
- viewport/camera state remains presentation/editor state only.

### 5. Progressive disclosure

Common tasks should not expose expert parameters unnecessarily.

Check:
- common properties visible first;
- advanced station/topology/material details are discoverable;
- critical status/errors are never hidden behind Advanced.

### 6. Map/reference usability

Check:
- reference layers can be locked;
- imagery opacity/dim controls preserve design legibility;
- scale/georeference status is visible when relevant;
- working offline/blank remains possible;
- map navigation does not conflict with design selection.

### 7. Layer/scenario clarity

Check:
- Existing vs Alternative is always understandable;
- visibility and lock state are visible;
- the user cannot accidentally edit the wrong scenario without feedback;
- compare mode does not mutate either scenario.

### 8. Validation UX

Check:
- issues are non-modal unless operation is impossible;
- issue text explains the problem and affected object;
- click/focus/select behavior leads to the relevant geometry;
- advisory standards can be overridden intentionally;
- unverified standards values are not styled as authoritative errors.

### 9. Recoverability

Check:
- undo/redo treats one conceptual operation as one transaction;
- cancellation restores pre-edit state;
- autosave/crash recovery implications are considered;
- AI-applied changes use the same undo semantics as manual commands.

### 10. Professional density

Prefer compact technical controls and a large viewport.

Reject:
- dashboard-card sprawl;
- excessive decorative whitespace;
- CAD-ribbon overload;
- icon-only mystery controls for primary actions;
- modal dialogs for routine property editing.

## Evidence

Use as applicable:
- functional/E2E tests;
- screenshots/visual regression;
- keyboard tests;
- accessibility checks;
- multiple window-size checks;
- manual golden-workflow walkthrough;
- user/domain UAT for major workflow milestones.

## Result

Return:
- `PASS`;
- `PASS WITH LIMITATIONS`;
- `FAIL`.

For failures, identify the broken workflow step and the smallest interaction change needed to correct it.