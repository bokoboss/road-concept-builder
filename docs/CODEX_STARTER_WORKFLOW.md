# Codex Starter Workflow — Rebaseline

## Purpose

Use this workflow when starting a new Codex session on Road Concept Builder.

Do not use the legacy Phase 0/Phase 1 straight-road workflow. The next executable coding stage is R1 only after the rebaseline PR is accepted.

## Step 1 — Verify repository state

```text
/status
Verify repository path, current branch, HEAD SHA, worktree cleanliness, and current open task/PR context.
Do not modify files yet.
```

Confirm the rebaseline has been merged before starting R1. If not, work only on the designated rebaseline branch/task.

## Step 2 — Read authoritative context

```text
Read in order:
- AGENTS.md
- docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md
- docs/CODEX_R1_EXECUTION_PACKET.md
- docs/TECHNICAL_REBASELINE_V0_1.md
- docs/PRODUCT_BASELINE_V0_1.md
- docs/DEVELOPMENT_OPERATING_MODEL_V0_1.md
- .agents/skills/scrutinize-change/SKILL.md
- .agents/skills/geometry-gate/SKILL.md
- .agents/skills/thai-road-diagram/SKILL.md
- docs/REBASELINE_AUDIT_2026-08-25.md

Summarize:
1. product source of truth;
2. R1 goal/non-goals;
3. hard architecture constraints;
4. acceptance evidence;
5. legacy code that appears reusable vs constraining.
Do not write code yet.
```

## Step 3 — Inspect the actual implementation

Inspect:
- package scripts and toolchain;
- existing TypeScript domain model;
- straight-road geometry;
- existing tests;
- editor/render/export separation;
- any changes since the documented baseline.

Run current baseline checks before changing architecture where practical.

Do not assume a legacy abstraction must be preserved merely because it exists.

## Step 4 — Scrutinize the R1 implementation plan

Use `.agents/skills/scrutinize-change/SKILL.md`.

The plan must answer:
- What is the new canonical semantic model?
- How is alignment/stationing represented?
- How are variable-width lane/component profiles represented?
- How is a turn pocket proven as a general lifecycle rather than a special case?
- How are candidate vs connected junctions separated?
- How will both 2D and 3D consume one canonical/derived geometry path?
- What small proof will compare TypeScript vs Rust/WASM before committing to a rewrite?
- What test fixtures/invariants make the result falsifiable?

Return the scrutinize recommendation before implementation.

## Step 5 — Implement R1 incrementally

Follow the slices in `docs/CODEX_R1_EXECUTION_PACKET.md`:
1. alignment/stationing;
2. semantic road/cross section;
3. generic auxiliary lane/turn pocket;
4. candidate junction/topology;
5. junction surface/per-corner geometry;
6. lane connectivity;
7. shared 2D/3D diagnostics;
8. robustness/qualification.

Keep each slice small and testable.

Do not broaden scope into production maps, UI polish, asset libraries, AI integration, terrain, simulation, or CAD export.

## Step 6 — Mechanical verification

Run the relevant checks required by R1 and record concrete command output/results.

At minimum preserve applicable existing checks and add:
- new unit tests;
- canonical fixtures;
- invariants;
- deterministic repeated-run tests;
- property/random tests where feasible;
- fuzz for risky geometry where feasible;
- build/typecheck for diagnostic UI;
- benchmark measurements.

## Step 7 — Geometry gate

Use `.agents/skills/geometry-gate/SKILL.md`.

Do not call R1 complete unless the gate is `PASS` or an explicitly accepted `PASS WITH LIMITATIONS`.

A screenshot that looks correct is not qualification evidence.

## Step 8 — Qualification report

Create/update:
- `docs/R1_QUALIFICATION_REPORT.md`.

Include:
- HEAD SHA;
- implementation architecture;
- fixture matrix;
- test results;
- fuzz/property-test status;
- benchmark evidence;
- known limitations;
- TypeScript vs Rust/WASM recommendation;
- Phase 2E reuse/retire/delete recommendation;
- next-stage recommendation.

## Model guidance

R1 is heavily pre-specified. Start with GPT-5.6 Luna at high/max reasoning when available.

Escalate to Terra/Sol based on demonstrated failure/complexity, not task prestige. See `docs/DEVELOPMENT_OPERATING_MODEL_V0_1.md`.

## Stop conditions

Stop and report rather than silently changing product architecture if:
- one semantic source cannot drive both 2D and 3D;
- a required geometry invariant must be weakened;
- dependency licensing is incompatible;
- the spec requires an unresolved domain/product decision;
- the kernel-language recommendation cannot be supported by evidence.

Ordinary coding/test failures are not stop conditions; continue the bounded fix/verify loop.