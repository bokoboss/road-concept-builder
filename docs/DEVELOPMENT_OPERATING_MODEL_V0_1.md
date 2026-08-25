# Development Operating Model v0.1

## Purpose

Define how ChatGPT, Codex, models, agents, skills, repository documents, tests, and human acceptance work together so the project can scale without prompt drift or architecture erosion.

## Core principle

Use the **cheapest model that can reliably finish a bounded task**, while investing heavily in research, specification, acceptance criteria, and review before implementation.

The repository is durable project memory. Chat conversations are working context, not the final source of truth.

## Responsibility split

### Human / domain owner

Responsible for:
- traffic-engineering/domain judgment;
- product preference where research cannot decide;
- acceptance of key workflows;
- approval of architecture-changing decisions;
- milestone/release acceptance.

The human should not be required to:
- draw SVG/vector assets;
- model GLB/3D assets;
- write code or tests;
- maintain build/CI infrastructure;
- manually produce technical documentation that AI can generate.

### ChatGPT

Use ChatGPT as product/architecture/research/review lead before Codex execution.

Primary work:
- competitor/standards/library research;
- repository/GitHub inspection;
- product and UX specification;
- domain modelling;
- technical architecture;
- asset-system design;
- risk analysis;
- task decomposition;
- acceptance criteria/test plans;
- Codex execution packets;
- GitHub issue/PR/document maintenance where available;
- independent review of Codex results;
- synthesis of genuinely unresolved decisions for the human.

### Codex

Use Codex for bounded repository execution:
- implement code;
- run local/build/test tooling;
- add/fix tests;
- controlled refactors;
- runtime/browser verification;
- asset/pipeline generation that needs repository execution;
- qualification evidence;
- defect remediation within task boundaries.

Do not send unresolved product invention to Codex when it can be resolved before execution.

## Model routing policy

Current OpenAI model-family guidance (verified 2026-08-25):
- GPT-5.6 Sol — frontier model for complex professional reasoning/coding;
- GPT-5.6 Terra — balances intelligence and cost;
- GPT-5.6 Luna — optimized for cost-sensitive/high-volume workloads;
- all three support reasoning effort through `max`.

Reference:
- https://developers.openai.com/api/docs/models
- https://developers.openai.com/api/docs/models/gpt-5.6-sol
- https://developers.openai.com/api/docs/models/gpt-5.6-terra
- https://developers.openai.com/api/docs/models/gpt-5.6-luna

### ChatGPT planning/review

Prefer Sol high/xhigh/max for:
- product/technical architecture;
- geometry-kernel decisions;
- critical numerical reasoning;
- synthesis with large architectural blast radius;
- final independent review of high-risk work.

Terra is appropriate for ordinary research synthesis and lower-risk review when frontier reasoning is unnecessary.

### Codex implementation

Default candidate for a well-bounded execution packet: **Luna**.

Use Luna when:
- scope is explicit;
- authoritative files are known;
- acceptance criteria are machine-verifiable;
- required tests are specified;
- rollback/retry is safe;
- architecture decisions have already been made.

Before escalating to Terra/Sol, consider increasing Luna reasoning effort when the task remains bounded.

Escalate to Terra when:
- repository understanding is repeatedly incomplete;
- the implementation spans several coupled modules;
- lower-cost attempts cannot maintain correctness.

Escalate to Sol when:
- difficult geometry/numerical reasoning dominates;
- implementation is tightly coupled to architecture decisions;
- debugging remains unresolved after cheaper bounded attempts;
- critical independent review requires frontier judgment.

Do not use Sol by default merely because it is strongest.

## Execution packet

Every substantial Codex task should receive:

```text
Mission
Authoritative sources
Verified repository baseline
Goal
Non-goals
Architectural constraints
Required behavior
Acceptance criteria
Required tests
Required review/qualification
Forbidden shortcuts
Deliverables
Stop/escalation conditions
```

Codex must inspect actual repository state before implementation. It may refine the technical plan, but may not silently redefine product intent.

## Work lifecycle

```text
Research
  -> Specify
  -> Plan
  -> Scrutinize
  -> Implement
  -> Mechanical verification
  -> Independent review
  -> Human/domain UAT where required
  -> Merge
  -> Qualification record
```

### Research

Resolve external/current facts, standards, competitor patterns, dependency capabilities, licensing, and engineering assumptions before implementation.

### Specify

Define desired behavior, non-goals, invariants, and acceptance evidence.

### Plan

Map the requirement onto the real repository and identify files/modules/tests before editing.

### Scrutinize

Challenge the plan before coding:
- Does this change need to exist?
- Is there a smaller architecture-consistent solution?
- Is the proposed source of truth correct?
- Are we adding a special case where a general primitive is needed?
- Are claims supported by the actual execution path?
- What could make the implementation visually correct but semantically wrong?

### Implement

One primary writer per worktree/task. Avoid simultaneous uncontrolled edits to the same architectural surface.

### Mechanical verification

Use deterministic tooling rather than agent confidence:
- format/lint/typecheck;
- unit tests;
- property/fuzz tests where required;
- integration/E2E;
- build/package;
- visual/browser verification where applicable;
- benchmarks where applicable.

### Independent review

Prefer fresh context for critical review. Review intent -> execution path -> tests -> acceptance criteria, not just the diff.

## Rewrite policy

The Phase 2E implementation is not protected for its own sake.

Rules:
- preserve Git history and a recoverable baseline;
- reuse code only when reuse demonstrably reduces risk/cost without constraining the new architecture;
- if the old data model, renderer, state design, or shell conflicts with the rebaselined architecture, replacement is allowed;
- do not spend significant engineering effort building compatibility shims for prototype-only behavior unless there is real user/project data worth preserving;
- prefer a clean migration boundary over accumulating adapters around obsolete abstractions.

## Agent topology

Do not simulate an entire organization with permanent agents.

Use one outcome-owning orchestrator/writer plus bounded specialists when independent workstreams justify them.

Recommended specialists:

### Geometry reviewer
Read-heavy review of:
- alignment/stationing;
- variable-width profiles;
- topology;
- polygon validity;
- triangulation;
- determinism;
- invariants/property/fuzz coverage.

### UX reviewer
Read-heavy review of:
- golden workflows;
- mode clarity;
- selection/navigation;
- 2D/3D synchronization;
- progressive disclosure;
- keyboard/accessibility;
- visual regressions.

### Test/fuzz reviewer
Challenge coverage and produce adversarial/canonical cases.

### License/asset reviewer
Review dependency/asset provenance, redistribution, attribution, and package notices.

### Researcher
Parallel read-only exploration of docs/repositories/standards where useful.

Use subagents when the work divides cleanly; do not create a swarm for tightly coupled writing tasks.

## Skills

Project skills should encode reusable review/production workflows rather than product decisions duplicated in prose.

Recommended project skills:
- `thai-road-diagram` — Thailand/LHT semantics and provenance;
- `scrutinize-change` — challenge architecture/plan before implementation;
- `geometry-gate` — geometry qualification checklist;
- `ux-gate` — workflow/interaction/visual verification;
- `license-gate` — dependency/asset provenance;
- `postmortem` — root cause and guardrail update after escaped failures;
- `release-qualification` — clean-environment release evidence.

Skills must be original project content unless external license permits reuse.

## Git/worktree strategy

- `main` remains the trusted integrated branch.
- Substantial work happens in short-lived branches/worktrees.
- One primary writer per worktree.
- Architecture/rebaseline work should be reviewed in PRs.
- Major milestones should not be self-merged solely because the implementing agent reports success.
- The legacy Phase 2E state remains recoverable through Git history even if the future editor is rewritten.

## Definition of done

A substantial task is done only when:
- behavior matches the bounded specification;
- relevant mechanical checks pass;
- acceptance evidence exists;
- no forbidden shortcut changed the source of truth;
- documentation is updated where behavior/architecture changed;
- unresolved limitations are explicit;
- independent review is completed when the task is high risk.

## Human review gates

Human/domain acceptance is required for:
- product-scope changes;
- major UX workflow changes;
- geometry-kernel architecture choice;
- major standards interpretation;
- milestone qualification;
- release candidate acceptance.

The objective is not to make the human perform implementation work; it is to reserve human judgment for decisions AI should not silently make.