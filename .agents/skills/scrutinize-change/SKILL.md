---
name: scrutinize-change
description: Use before substantial architecture, geometry, data-model, UX-framework, dependency, or migration changes in Road Concept Builder to challenge whether the proposed change is necessary, correctly scoped, and consistent with the authoritative model.
---

# Scrutinize Change

## Purpose

Prevent plausible-looking implementation plans from adding unnecessary complexity, special cases, compatibility debt, or a second source of truth.

This is an original Road Concept Builder review workflow. It is not copied from any external skill.

## When to use

Use before:
- architecture changes;
- geometry-kernel work;
- junction/topology changes;
- project-schema changes;
- renderer changes;
- large refactors/rewrites;
- new major dependencies;
- migration/compatibility work;
- AI command integration;
- major UX framework changes.

## Review sequence

### 1. Restate the actual outcome

State the user/product outcome in one sentence without implementation terminology.

If the proposed work does not directly serve that outcome, challenge it.

### 2. Identify the source of truth

For every affected behavior, state what should be authoritative:
- semantic engineering model;
- topology;
- standards profile;
- presentation state;
- editor/session state.

Reject plans that make renderer nodes, SVG paths, meshes, screenshots, or AI-generated text the engineering source of truth.

### 3. Ask whether the change needs to exist

Check:
- Is the problem real in the current execution path?
- Is existing functionality already sufficient?
- Is this solving a future hypothetical instead of the current/next stage?
- Is a dependency being added for one operation that can be solved locally?

### 4. Look for accidental special cases

For geometry/product work ask:
- Is this feature really a general station-based lane/component transition?
- Is a new junction type actually a configuration of existing topology?
- Is a new asset class actually a semantic assembly/prop/distribution variant?
- Is a new validation path actually a profile rule?

Prefer a correct reusable primitive over one-off feature geometry, but do not invent abstraction without a second credible use case.

### 5. Challenge compatibility work

The Phase 2E prototype is not sacred.

Before adding adapters/shims ask:
- Is there real user data that must survive?
- Is the old behavior still desirable?
- Does preserving it distort the new model?
- Would a clean cutover with explicit migration be safer and smaller?

Preserve Git history, not obsolete architecture.

### 6. Trace the execution path

Review the real path from input -> command -> domain model -> derived geometry -> renderer -> validation/export.

Do not approve a plan based only on type names or a local diff.

### 7. Identify failure modes

At minimum consider:
- visually correct but semantically wrong;
- 2D/3D divergence;
- topology created from visual coincidence;
- negative/zero/degenerate geometry;
- stale derived geometry after edits;
- project persistence/schema break;
- standards values presented as authoritative without provenance;
- asset/license leakage;
- AI bypassing command/validation/undo.

### 8. Demand falsifiable acceptance criteria

Every substantial plan should state what machine-verifiable evidence would prove it works and what evidence would disprove it.

### 9. Recommend one of four outcomes

Return exactly one recommendation:
- `PROCEED` — plan is appropriately scoped;
- `SIMPLIFY` — smaller solution should be attempted first;
- `REDESIGN` — source-of-truth/architecture is wrong;
- `BLOCKED` — unresolved product/domain fact must be decided first.

Include the minimum changes required to move forward.

## Output format

```text
Outcome being protected:

Recommendation: PROCEED | SIMPLIFY | REDESIGN | BLOCKED

Why:

Source-of-truth check:

Unnecessary complexity / special cases:

Failure modes:

Required acceptance evidence:

Minimum corrected plan:
```

Do not implement code as part of this skill unless explicitly asked after the review.