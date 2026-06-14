# Project Readiness Checklist

Use this before starting Codex implementation.

## Repository Setup

- [ ] Create a new repository.
- [ ] Copy this starter package into the repository.
- [ ] Commit planning docs first.
- [ ] Confirm `AGENTS.md` is at repository root.
- [ ] Confirm `docs/` is committed.
- [ ] Confirm `.gitignore` excludes local references and generated exports.

## Product Decisions

- [ ] The app is for concept diagrams, not construction drawings.
- [ ] Default context is Thailand / left-hand traffic.
- [ ] Primary rendering is SVG.
- [ ] Primary exports are SVG first, PNG later.
- [ ] Project state should be JSON-serializable.
- [ ] Validation is advisory unless geometry is impossible.
- [ ] Pavement marking is a core system.
- [ ] Marking placement is lane/approach/area-based, not freehand CAD.

## MVP Discipline

- [ ] Start with Phase 0 UI shell and static SVG preview.
- [ ] Do not start with intersections.
- [ ] Do not start with roundabouts.
- [ ] Do not start with database/cloud/login.
- [ ] Do not start with AI prompt-to-diagram.
- [ ] Do not start with DXF/DWG export.
- [ ] Do not start with a full CAD editor.

## Visual Preparation

Optional but useful:

- [ ] Add target road diagram examples in `examples/target-diagrams/`.
- [ ] Add relevant market screenshots in `examples/screenshots-market-tools/`.
- [ ] Add report-use examples in `examples/report-use-cases/`.

## Standards Preparation

- [ ] Collect Thai official/manual PDFs locally under `references/` if available.
- [ ] Do not commit large or copyrighted PDFs unless appropriate.
- [ ] Update `docs/SOURCE_INDEX.md` with source names and status.
- [ ] Mark unverified assumptions as `TODO_VERIFY`.

## First Codex Session

- [ ] Ask Codex to read and summarize first.
- [ ] Ask Codex to plan Phase 0 only.
- [ ] Review the plan before implementation.
- [ ] Implement Phase 0 only.
- [ ] Run build/test.
- [ ] Review diff before merge.
