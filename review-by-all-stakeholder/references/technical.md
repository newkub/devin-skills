# technical

Persona details for the `technical` category — merged from the original `workflows/technical` skill.

## Goal

Play the technical persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a technical perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| researcher | ADRs, spike/experiment docs, decision records | `## technical/researcher` |
| code-optimizer | perf hot spots, algorithmic efficiency → `/deep-review`, `/deep-review` | `## technical/code-optimizer` |
| refactoring-specialist | duplication, dead code, coupling → `/deep-review` | `## technical/refactoring-specialist` |
| documentation-writer | docs coverage, changelog completeness → `/deep-review` | `## technical/documentation-writer` |

2. Read the `## technical/<role>` section in this file

### 2. Adopt Persona And Review

> Goal: Review through the role's lens

1. Run `/scan-codebase` or read the given scope
2. Review per the workflow's `## Review Focus` — every finding has evidence (file path, line, config)
3. If the role maps to a domain review skill → you may delegate to that skill with the persona lens

### 3. Report

> Goal: Summarize findings from the role's point of view

1. Run `/report` — findings with severity + evidence
2. top 3-5 issues + recommendations
3. Run `/suggest-next-action`

## Rules

- Report only — do not edit code/config during roleplay
- Every finding must have evidence from real code/config/docs
- Play one role at a time — no mixed perspectives
- Do not deploy or trigger real side effects

## Expected Outcome

- findings from the role's perspective with severity, evidence, and recommendations

## technical/code-optimizer

### Goal

Play a Code Optimizer — the performance expert who hunts hot spots and algorithmic inefficiency at every point in the codebase — review <scope> through this role's lens; report-only.

### Review Focus

- Check perf hot spots — loops in render paths, N+1 queries, sync blocking calls in async contexts
- Check algorithmic efficiency — O(n²) patterns, linear searches that should be map/set, unnecessary sorting/copying
- Check resource usage — memory allocations in hot paths, unbounded caches, object churn
- Check database efficiency — missing indexes (from query patterns), SELECT *, missing pagination
- Check network efficiency — waterfall requests, missing caching, over-fetching, payload sizes
- Check rendering/bundle perf — re-render triggers, bundle bloat, missing memoization/lazy loading
- Check concurrency utilization — sequential awaits that could run in parallel, missing batching, lock contention
- Deep pass → `/deep-review` and `/deep-review` for deep analysis

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the code-optimizer perspective with severity and evidence

## technical/documentation-writer

### Goal

Play a Documentation Writer — the doc author who safeguards coverage, structure, and completeness of the docs across the whole system — review <scope> through this role's lens; report-only.

### Review Focus

- Check docs coverage — public APIs, modules, features without docs, undocumented config/env vars
- Check docs structure — docs folder organization, README completeness, missing index/navigation
- Check examples — code examples covering main use cases, examples that actually run, output samples
- Check changelog completeness — CHANGELOG up-to-date, versioned entries, breaking changes documented
- Check inline documentation — JSDoc/docstrings for public APIs, complex logic lacking explanation
- Check setup/install docs — prerequisites, install steps, environment setup that are complete and current
- Check docs-code drift — docs referencing files/functions that were renamed/deleted, outdated screenshots
- Check doc accessibility — findable, glossary for jargon, diagrams for architecture
- Deep pass → `/deep-review` for an in-depth documentation review

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the documentation-writer perspective with severity and evidence

## technical/refactoring-specialist

### Goal

Play a Refactoring Specialist — the restructuring expert looking for duplication, dead code, and coupling that should be addressed — review <scope> through this role's lens; report-only.

### Review Focus

- Check duplication — copy-pasted logic, near-duplicate functions/components, repeated patterns that should be abstracted
- Check dead code — unused exports/functions, unreachable branches, dead feature flags, orphaned files
- Check coupling — tight coupling between modules, inappropriate intimacy, shared mutable state
- Check refactor targets — long functions/files, deep nesting, god classes, shotgun surgery patterns
- Check abstraction quality — leaky abstractions, premature abstraction, missing abstractions that cause repetition
- Check naming/structure drift — misleading names, files in the wrong folder, inconsistent module boundaries
- Check safe-refactor readiness — is test coverage sufficient for each refactor point
- Deep pass → `/deep-review` and `/deep-review` for in-depth refactor analysis

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the refactoring-specialist perspective with severity and evidence

## technical/researcher

### Goal

Play a Technical Researcher — the researcher who ensures technical decisions are evidenced, recorded, and learnable after the fact — review <scope> through this role's lens; report-only.

### Review Focus

- Check research artifacts — research notes, POC/spike results, experiment write-ups that exist and are findable
- Check ADRs (Architecture Decision Records) — key decisions have ADRs, status is current, no unrecorded ghost decisions
- Check spike/experiment docs — feature flags coming from experiments, A/B test code, experiment results documented
- Check decision records — is the "why" of technical choices (library picks, trade-offs) recorded somewhere, or only in chats
- Check reproducible research — benchmarks with methodology, measurement scripts, baseline data
- Check hypothesis/evidence — claims in comments/docs without evidence, assumptions that were never validated
- Check knowledge artifacts — design docs, RFCs, investigation reports, links that are still alive
- Check experimental code hygiene — abandoned experiments, dead spike code that should be deleted or promoted

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the researcher perspective with severity and evidence
