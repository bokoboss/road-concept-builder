# Codex Prompts — Rebaseline

Use these only as short session helpers. The authoritative execution packet is `docs/CODEX_R1_EXECUTION_PACKET.md`.

## Read Context First

```text
/status
Verify branch, HEAD, worktree status, and current issue/PR.
Read AGENTS.md and the authoritative rebaseline/R1 docs referenced there.
Summarize the current product source of truth, R1 mission, non-goals, architecture constraints, and acceptance evidence.
Do not write code yet.
```

## R1 Planning Prompt

```text
/plan
Plan Stage R1 only using docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md and docs/CODEX_R1_EXECUTION_PACKET.md.
Inspect the actual repository before planning.

Your plan must cover:
- generalized alignment/stationing;
- semantic cross-section components;
- station-based width/lifecycle;
- generic right-turn pocket;
- candidate vs connected junction topology;
- per-corner junction geometry;
- lane connectivity;
- one shared semantic/derived model feeding minimal 2D and 3D diagnostics;
- canonical fixtures/invariants/property/fuzz/benchmark evidence;
- a small evidence-producing TypeScript vs Rust/WASM comparison before any large migration.

Do not preserve Phase 2E abstractions merely for compatibility.
Do not broaden into production UI/maps/assets/AI/terrain/simulation/CAD export.
```

## Scrutinize Prompt

```text
Use .agents/skills/scrutinize-change/SKILL.md against the R1 plan.
Return PROCEED, SIMPLIFY, REDESIGN, or BLOCKED with the minimum corrected plan.
Do not code during this step.
```

## R1 Goal Prompt

```text
/goal
Implement the accepted R1 plan in small testable slices.
Treat semantic engineering data as canonical.
Keep 2D/3D rendering derived from the same model.
Use station-based lane/component lifecycle for turn pockets/tapers.
Keep geometry and topology separate.
Add tests/fixtures with each slice.
Preserve Git history, but rewrite legacy implementation where reuse would constrain the new architecture.
```

## Scope Guardrail Prompt

```text
Stop scope expansion and return to the R1 execution packet.
Do not add polished production UI, online maps, large asset libraries, terrain, vertical alignment, simulation, signal timing, swept path, AI integration, cloud/account features, or production CAD export.
If legacy compatibility is driving complexity, remove the compatibility requirement unless real user data demonstrably needs it.
```

## Geometry Review Prompt

```text
Use .agents/skills/geometry-gate/SKILL.md.
Review canonical fixtures, invariants, deterministic behavior, property/fuzz coverage, polygon/mesh validity, topology, coordinate handling, and shared 2D/3D derivation.
Do not accept screenshot quality as proof of geometry correctness.
```

## Critical Review Prompt

```text
/review
Review intent -> semantic source of truth -> execution path -> derived geometry -> 2D/3D outputs -> tests -> qualification criteria.
Specifically try to falsify:
- station monotonicity;
- non-negative width/lifecycle behavior;
- visual crossing vs topology separation;
- lane-connection validity;
- junction polygon/mesh robustness;
- local-origin precision behavior;
- 2D/3D single-source claim;
- accidental reuse of eastbound/westbound or SVG-first assumptions.
```

## Completion Prompt

```text
Before claiming R1 complete:
- run all relevant checks;
- run geometry-gate;
- create docs/R1_QUALIFICATION_REPORT.md;
- report exact branch/HEAD SHA;
- report fixture/test/property/fuzz/benchmark results;
- document known limitations;
- give an evidence-based TypeScript vs Rust/WASM recommendation;
- classify Phase 2E code as reuse / retire / delete for the next stage.
Do not claim success from code presence alone.
```
