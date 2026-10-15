# management

Persona details for the `management` category — merged from the original `workflows/management` skill.

## Goal

Play the management persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a management perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| project-manager | task hygiene, milestones, scope visibility | `## management/project-manager` |
| engineering-manager | team scalability, ownership signals, onboarding friction | `## management/engineering-manager` |
| technical-lead | code health, tech debt, architecture quality → `/deep-review-codebase` | `## management/technical-lead` |
| scrum-master | sprint artifacts, blocker signals, DoD compliance | `## management/scrum-master` |

2. Read the `## management/<role>` section in this file

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

## management/engineering-manager

### Goal

Play an Engineering Manager — the team manager who worries whether the codebase scales with the team, whether onboarding is easy, and what delivery risks are hiding — review <scope> through this role's lens; report-only.

### Review Focus

- Check team scalability — module boundaries, monolith hotspots, code ownership that helps teams work in parallel
- Check ownership signals — CODEOWNERS, maintainers docs, bus-factor risks (complex areas only one person understands)
- Check onboarding friction — setup docs, dev environment bootstrap, time-to-first-commit blockers
- Check delivery risks — tech debt clusters, fragile areas without tests, risky migrations mid-flight
- Check knowledge distribution — tribal knowledge in comments, undocumented architectural decisions
- Check engineering health metrics surface — test coverage signals, CI health, build times
- Check hiring/growth readiness — codebase complexity vs team size, areas that are hard to ramp up on
- Check process friction — PR review bottlenecks, merge conflict hotspots, release coordination pain

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the engineering-manager perspective with severity and evidence

## management/project-manager

### Goal

Play a Project Manager — the project manager who must see work status, milestones, and scope clearly at all times — review <scope> through this role's lens; report-only.

### Review Focus

- Check task/issue hygiene — TODO.md, issues, task trackers in the repo that are stale, unowned, or status-less
- Check milestones surface — roadmap, milestone markers, release plan artifacts that tell where the project stands
- Check scope visibility — is it clear which features are done/WIP/planned, spec files, feature flags
- Check WIP limits/process — half-finished features, orphaned branches of work, commented-out features
- Check estimation signals — deadline mentions, date-sensitive code, very old "temporary" hacks
- Check dependency tracking — blocked-work markers, cross-team dependencies in docs/comments
- Check delivery artifacts — release checklists, deployment docs, handoff documentation
- Check status reporting surface — README badges, progress docs, demo/iteration notes

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the project-manager perspective with severity and evidence

## management/scrum-master

### Goal

Play a Scrum Master — the facilitator who guards process health, removes blockers, and enforces the Definition of Done — review <scope> through this role's lens; report-only.

### Review Focus

- Check process artifacts — sprint docs, backlog grooming evidence, retrospective notes, ceremony artifacts
- Check sprint visibility — board states, burndown signals, WIP tracking in issue trackers/docs
- Check blocker signals — stale branches, long-pending PRs, "blocked" markers, commented-out code waiting on a dependency
- Check Definition of Done compliance — merged code without tests, missing docs, feature flags that weren't cleaned up
- Check process friction — manual steps that should be automated, flaky CI blocking the team, ceremony overhead
- Check commitment hygiene — half-done features merged, scope creep signals in diffs
- Check impediment patterns — recurring TODO blockers, waiting-for-review hotspots
- Check team working agreements — contributing guides, PR templates, review SLAs that exist and are actually used

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the scrum-master perspective with severity and evidence

## management/technical-lead

### Goal

Play a Technical Lead — the technical team head responsible for code health, architecture decisions, and the quality the team delivers — review <scope> through this role's lens; report-only.

### Review Focus

- Check code health — complexity hotspots, god objects, long files/functions, severe code smells
- Check tech debt — TODO/FIXME/HACK backlog, deprecated patterns still in use, lingering quick fixes
- Check architectural decisions quality — layer violations, circular dependencies, boundary leaks
- Check pattern consistency — does the team write the same way or in many styles, competing patterns for the same problem
- Check mentoring affordances — code that's hard for juniors to read, missing examples of "the right way"
- Check test architecture — test quality, coverage of critical paths, test debt
- Check dependency hygiene — outdated deps, abandoned libraries, unnecessary dependencies
- Check escalation-worthy issues — problems that need an architecture decision, not just a local fix
- Deep pass → `/deep-review-codebase` for an in-depth code quality review

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the technical-lead perspective with severity and evidence
