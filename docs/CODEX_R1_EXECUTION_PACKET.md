# Codex Execution Packet — Stage R1 Geometry & Semantic Kernel Spike

## Recommended model strategy

Start implementation with **GPT-5.6 Luna, max reasoning** because the task is heavily pre-specified and acceptance-gated.

Escalate only when evidence justifies it:
- Terra high/xhigh/max if Luna repeatedly fails repository-wide consistency or coupled implementation work;
- Sol high/xhigh/max for unresolved numerical/geometry architecture, persistent defects after cheaper attempts, or critical independent review.

Do not use a stronger model merely to compensate for ignoring the specification.

## Mission

Implement and qualify Stage R1 as specified in `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`.

The purpose is to prove the generalized semantic/geometry architecture before production editor rewrite.

## Authoritative sources

Read in this order:
1. `AGENTS.md`
2. `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`
3. `docs/TECHNICAL_REBASELINE_V0_1.md`
4. `docs/PRODUCT_BASELINE_V0_1.md`
5. `docs/DEVELOPMENT_OPERATING_MODEL_V0_1.md`
6. `.agents/skills/scrutinize-change/SKILL.md`
7. `.agents/skills/geometry-gate/SKILL.md`
8. `.agents/skills/thai-road-diagram/SKILL.md`
9. `docs/REBASELINE_AUDIT_2026-08-25.md`

Legacy Phase 2E documents/code are migration/reference material only where they conflict with the sources above.

## Verified repository baseline

At rebaseline start:
- default branch: `main`;
- latest reviewed legacy prototype commit: `de13c5cae229f340054121bc9fa26cd56c914ef8`;
- stack: React 19 + TypeScript + Vite + Vitest;
- legacy geometry: one `straightRoadGeometry.ts` path with `StraightRoadParameters` and eastbound/westbound assumptions;
- legacy editor: SVG-centric Phase 2E prototype;
- legacy project document: JSON-serializable local state with marking objects;
- rebaseline explicitly permits replacement of old implementation where reuse is not worthwhile.

Before editing, verify current branch/commit, tree status, and whether the rebaseline PR has been merged. Do not assume the baseline above remains current.

## Goal

Produce a bounded, testable generalized road/junction semantic kernel proof that drives minimal synchronized 2D and 3D diagnostic views from the same canonical model.

## Non-goals

Do not build:
- polished production UI;
- online map/satellite integration;
- large asset library;
- production desktop packaging;
- terrain/vertical alignment;
- roundabout production module;
- traffic simulation;
- signal timing;
- full swept-path analysis;
- AI/LLM integration;
- cloud/accounts;
- production DXF/DWG export.

## Architecture constraints

Mandatory:
- semantic model is canonical;
- renderer objects are derived;
- 2D and 3D use the same derived/canonical geometry path;
- generalized alignment uses stationing;
- variable-width road components use station profiles;
- turn pocket uses the general lane lifecycle;
- visual crossing does not imply topology;
- junction/lane connectivity are explicit semantic data;
- domain units are meters;
- large georeferenced-style coordinates must have a local-render-origin path;
- no eastbound/westbound assumptions in generalized core;
- no hard-coded unverified Thai-standard claims.

## Phase 0 inside R1 — inspect and plan

Before code:

1. Inspect current implementation, package scripts, tests, TypeScript settings and repo structure.
2. Identify legacy code that can be safely reused without constraining architecture.
3. Run the `scrutinize-change` workflow against the initial implementation plan.
4. Write a short plan in the PR/task notes covering:
   - proposed folder/module boundaries;
   - TypeScript-only first proof vs Rust/WASM micro-spike approach;
   - dependency choices and licenses;
   - fixture/test strategy;
   - how minimal 2D and 3D diagnostics will consume one model.
5. Do not begin a large Rust migration before a small evidence-producing proof.

## Required implementation slices

Implement in the smallest coherent order that keeps tests green.

### Slice 1 — alignment/stationing
- line;
- circular arc;
- smooth cubic/Bezier conceptual primitive;
- chain;
- length/point/tangent/normal/curvature/projection/adaptive sampling;
- deterministic canonical tests.

### Slice 2 — semantic road/cross section
- ordered components;
- stable IDs;
- station lifecycle;
- piecewise-linear width profiles;
- constant/widen/narrow/zero-to-full/full-to-zero;
- lane/component invariants.

### Slice 3 — generic auxiliary lane/turn pocket
- right-turn pocket fixture;
- width 3.00 m;
- taper 30 m;
- storage 50 m;
- no U-turn-specific special-case dependency;
- derived road strips/boundaries update from semantic profile.

### Slice 4 — candidate junction/topology
- 90-degree T;
- skewed T;
- 90-degree four-leg;
- skewed four-leg;
- explicit candidate vs connected vs ignored/grade-separated state.

### Slice 5 — junction surface and per-corner geometry
- approach/cut-station extraction;
- per-corner radius/parameters;
- valid pavement boundary/surface;
- unequal-width stress case;
- polygon cleanup/triangulation evidence.

### Slice 6 — lane connectivity
- explicit from-lane/to-lane/movement;
- conceptual visualization path;
- validity tests;
- do not call this swept-path validation.

### Slice 7 — shared diagnostic renderers
- minimal 2D diagnostic;
- minimal 3D diagnostic;
- both derive from the same semantic/geometry model;
- selection/polish unnecessary.

### Slice 8 — robustness and qualification
- all canonical fixtures;
- deterministic repeated runs;
- invariants;
- property/random tests;
- fuzz where feasible;
- benchmark data;
- kernel-language recommendation;
- reuse/retire/delete legacy recommendation.

## Required canonical fixtures

Implement the fixture set listed in `docs/STAGE_R1_GEOMETRY_SEMANTIC_SPIKE.md`.

Do not reduce the set silently. If one fixture cannot be implemented within the chosen kernel approach, document the blocker and treat the gate as incomplete.

## Dependency policy

Before adding a dependency:
- confirm license;
- confirm active/current package/API;
- confirm browser/WASM/native implications as applicable;
- explain why standard library/current dependencies are insufficient;
- prefer focused geometry dependencies over large frameworks.

Candidate libraries in the technical rebaseline are research candidates, not mandatory dependencies.

## Test/verification requirements

At minimum run and report:
- existing legacy tests that remain applicable;
- new unit tests;
- canonical/golden fixture tests;
- invariant tests;
- deterministic repeated-run tests;
- property/random tests where feasible;
- fuzz for risky geometry operations where feasible;
- typecheck/build for any UI diagnostic path;
- benchmark measurements defined in R1.

Use `.agents/skills/geometry-gate/SKILL.md` before claiming R1 complete.

## Forbidden shortcuts

Do not:
- encode generalized directions as eastbound/westbound;
- create turn pocket geometry as a detached visual polygon;
- maintain separate canonical road geometry for 2D and 3D;
- make SVG or Three.js mesh data authoritative;
- connect roads solely because their lines cross;
- hide invalid geometry instead of surfacing/handling it;
- call arbitrary Bezier movement paths vehicle swept-path validation;
- add prototype safeguard values as Thai standards;
- build compatibility adapters just to preserve old abstractions;
- delete failing tests solely to make the gate green;
- broaden scope into production UI/maps/assets/AI.

## Deliverables

Required:
1. implementation;
2. tests/fixtures;
3. minimal 2D diagnostic;
4. minimal 3D diagnostic;
5. benchmark evidence;
6. `docs/R1_QUALIFICATION_REPORT.md`;
7. kernel-language recommendation;
8. legacy code reuse/retire/delete recommendation;
9. updated architecture docs if spike evidence changes a prior hypothesis.

## Stop/escalation conditions

Stop and report rather than inventing a silent product decision if:
- the canonical semantic model requirement cannot be satisfied without changing an authoritative rebaseline decision;
- a chosen dependency has incompatible licensing;
- a robust junction operation requires abandoning a stated acceptance invariant;
- 2D and 3D cannot consume one canonical derived geometry path under the proposed architecture;
- the kernel-language decision cannot be supported by evidence.

For implementation defects, continue the bounded fix/test loop instead of stopping at the first failure.

## Completion report format

Report:

```text
Branch / head SHA

Implemented slices

Architecture actually used

Canonical fixtures passed / failed

Unit / invariant / deterministic / property / fuzz results

Typecheck / build results

Benchmark results

Known limitations

Geometry-gate result

TypeScript vs Rust/WASM recommendation and evidence

Legacy Phase 2E: reuse / retire / delete recommendation

Files/docs changed

Next recommended stage
```

Do not claim success without concrete command/test evidence.