---
name: review-use-lib-effective
description: Review whether a scope uses its libraries effectively, with evidence and routes
argument-hint: "[scope]"
related:
  - use-lib-effective
  - deep-review
  - list-dependencies
  - follow-my-techstack
  - follow-tool-knip
  - update-version-to-latest
  - improve
  - report-review
  - use-subagents
  - suggest-next-action
  - deep-thinking
  - deep-analyze
  - deep-validate
---

## Goal

Review the `lib-usage` dimension of a scope — whether each installed library is current, wired the way its own docs prescribe, and actually earning its place — then return evidence-backed findings with severity. This is the assessor counterpart of `/use-lib-effective`: that skill says how to use a dependency well, this one proves where the code does not

## Scope

Use when a scope's dependency usage needs auditing: a library imported but barely exercised, a hand-rolled helper an installed package already provides, two packages doing one job, a required setup step missing, or code still written for an older major — and before a major upgrade

- Pairs with `/use-lib-effective` — the SSOT for how to use an installed dependency, when to prefer an internal package, and the `reuse > extend > extract > create` order. This skill cites that guidance and never restates it
- Boundaries against sibling rows: `dependencies` = declared, used, one version, no advisory; `runtime-eol` = runtime pins; `dependency-health` = abandoned or unpatched; `security` = advisories; `code-quality` = duplication and SRP; `bundle-size` = payload; `/follow-my-techstack` = choosing a library. `lib-usage` answers one question only: is an already-chosen library used effectively
- Fixes are out of scope — the owner route is `/improve deps`, with `/use-lib-effective` for the usage rewrite and `/update-version-to-latest` for major drift
- Not a whole-scope multi-dimension run (→ `/deep-review`), not wrong-behavior hunting (→ `/review-issues`), not promised-but-absent (→ `/review-gaps`)

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `lib-usage` | `artifact-match` | `capture` | `—` | `/improve deps` |

- The row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`) are the only eligibility rules applied here
- The seed is this row plus the `always` tier that `/deep-review` adds itself
- No CLI slice exists for this row — the capture route runs `/list-dependencies`, `/follow-tool-knip`, and the owner skill per library, then reviews that output

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand what the scope installs and how it actually imports it

1. `/deep-thinking` — which `lib-usage` risks this artifact can carry (reimplemented capability, deprecated API, one job with two libraries, missing plugin/config, old-major idioms, underused internal package), and whether the row's `N/A condition` applies
2. `/deep-analyze` — every manifest and lockfile in the scope, the import graph per workspace, and the config that wires libraries (Vite, Nitro, UnoCSS, ORM, test runner, runtime)
3. `/deep-validate` — the build/lint/test baseline; a red baseline is reported as a precondition, never attributed to library usage

### 2. Capture The Evidence

> Goal: one inventory, the owner skill per library, and a usage picture

1. `/list-dependencies` — the full manifest picture per workspace, including catalog and internal packages
2. `/follow-tool-knip` — declared-but-unimported dependencies; those belong to the `dependencies` row, not this one
3. Map each library in scope to its owner: the matching `follow-lib-*` / `follow-tool-*` / `follow-service-*` skill first, then `/follow-my-techstack` catalog entry, then the official docs via context7 or `/learn-from-web` — never judge an API from memory
4. Read the matching `best-practices/` and `usecases/` of the owner skill; that is the documented-usage baseline for this review
5. Run `/use-lib-effective` `### 1`–`### 4` for each need category — it defines what "effective" means before anything is measured
6. Capture version drift as input: `bun outdated` / `cargo outdated` / `go list -u -m all` plus the registry's latest release and deprecation notice

### 3. Review Every Usage Class

> Goal: check each library against what its own documentation promises

| No. | Usage class | Signal to prove |
|---|---|---|
| 1 | Right library | catalog default, or a recorded reason for the deviation; no second library doing the same job; no built-in that now covers it |
| 2 | Current and supported | supported major, no deprecated package, no peer-version skew that breaks the documented setup |
| 3 | Documented API | public API used as documented; no deprecated path, no fighting the framework's own primitives |
| 4 | Required setup | plugin, provider, transformer, config key, CSS layer, or registration step present and wired exactly once |
| 5 | Integration match | the code matches the installed major (renamed options, removed hooks, v3 idioms on a v4 runtime) |
| 6 | Dead weight | imported but never exercised, imported only in dead code, or redundant with another installed dependency |
| 7 | Underuse | hand-rolled code an installed library or an internal shared package already provides — the `/use-lib-effective` `### 5` reuse order |

1. Every class is checked per library, not per repository: the same package may be used well in one workspace and badly in another
2. `/use-subagents` when workspaces are independent — one reviewer per workspace, each reading only its manifest, imports, and owner skill
3. A class that cannot be evidenced is not reported; state the gap instead of guessing

### 4. Evidence And Severity

> Goal: a severity a reviewer can defend from the row, never from intuition

1. Every finding carries two pieces of evidence: the usage site (`file:line`) and the authority (the owner skill, catalog row, or official doc section that says otherwise)
2. Severity comes from the row's `Default severity` (`Medium`) and its stated trigger (`High` when a deprecated API or missing setup costs runtime/bundle or blocks an upgrade) — no other level is invented here
3. A misuse that breaks user data or security is a `security`/`correctness` finding and routes there instead; this dimension does not inflate its severity to keep it
4. A deliberate, recorded deviation (comment, ADR, catalog `(→ ...)` condition) is listed as a known decision, not a finding
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 5. Report

> Goal: one chat table the user can act on

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Add this dimension's columns: `Library`, `Installed`, `Expected Use`, `Usage Class`; `Owner skill` stays the route from the matrix row
3. Order by severity, then by blast radius; every row carries `file:line` and the authority it answers to
4. State which libraries were reviewed, which had no owner skill, and which classes were clean

### 6. Route And Close

> Goal: every finding has a fix owner before anything is edited

1. `/improve deps` — the program of work when several findings share a dependency theme
2. `/use-lib-effective` — the rewrite for hand-rolled or underused capability; its `### 5` order decides reuse versus extract versus create
3. `/update-version-to-latest` — when the fix is the major upgrade itself; re-run this review afterward to catch code left on the old API
4. `/follow-my-techstack` — when the library choice, not its use, is the finding; a migration decision goes through `/ask-me`
5. Never edit code here; close with `/suggest-next-action`

## Rules

- Evidence first — every finding cites `file:line` plus the authority that contradicts it; a claim without both is dropped
- One dimension — declared/unused/version/advisory findings belong to the dependency rows; this skill reports only effective use of a chosen library
- No duplicated catalog — the proof statement lives in the `lib-usage` row and the guidance in `/use-lib-effective`; this skill resolves them and reports
- Review only — never edit code, manifests, or config here; fixes run through the owner route after confirmation
- Skip only for the row's `N/A condition`, quoted as the reason
- `/use-subagents` when areas are independent — one subagent per workspace, no overlapping files
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- Every library in scope is checked against its own documented usage and the repo's owner skill, with `file:line` evidence per finding
- A scored, severity-ordered `/report-review` table names the usage class and the fix owner for each finding
- Clean libraries and recorded deviations are stated, and the fix set is handed to `/improve deps` / `/use-lib-effective` / `/update-version-to-latest`
- The run closes with `/suggest-next-action`, with no edits made during the review
