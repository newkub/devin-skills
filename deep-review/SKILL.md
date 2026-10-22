---
name: deep-review
description: Route a review to the right deep-review door, defaulting to every dimension
argument-hint: "[scope] [preset] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review-codebase-everything
  - review-refactor
  - review-implement-to-production
  - review-update
  - review-design
  - review-tests
  - review-security
  - review-performance
  - review-data
  - review-ops
  - review-api
  - review-a11y
  - deep-thinking
  - report-review
---

## Goal

One door for every deep review — read the request, pick the matching preset, and run it end to end with the caller's scope and flags passed through unchanged

## Scope

Use when a scope needs reviewing and it is not yet clear which review preset fits — a path, workspace, diff, whole repo, issue, or plan. This skill only routes; the preset owns the pipeline and the fixes

- The twelve doors: `deep-review-codebase-everything` (every dimension, the default), `review-refactor` (structure), `review-implement-to-production` (what is claimed but not real), `review-update` (docs/config/references/rules drift), `review-design` (UX and design system), `review-tests` (test suite health), `review-security` (attack surface, auth, secrets), `review-performance` (measured bottlenecks and budgets), `review-data` (schema, migrations, integrity), `review-ops` (deps, CI, cloud, observability, delivery), `review-api` (contracts and integrations), `review-a11y` (accessibility)
- Eleven doors are named `review-*` but are deep inside — each runs the `deep-review-codebase-everything` pipeline and owns only its labels and fix route; the engine keeps the `deep-review-*` name because it is the shared pipeline and the default door
- The family is listed once in `deep-review-codebase-everything/references/presets.md` (`## Preset Map`) — tier, seeded labels, and the fix route each door owns. `review-api` and `review-a11y` are `on-demand`: they run only when the caller asks for that domain
- Every preset reuses the `deep-review-codebase-everything` scan pipeline — the dimension matrix, the single sliced scan, the ledger, and the report. A preset narrows the dimension set and owns its fix route; it never reimplements the pipeline
- The presets replace the older single-dimension entries: the gap inventory is no longer a separate skill (it lives in `review-implement-to-production`), and a review label that used to reach `/deep-review <label>` still resolves through the `deep-review-codebase-everything` matrix
- Not a reviewer itself — running the dimensions here would duplicate the preset and produce two reports. If the caller needs an actual review, forward it
- A named `review-*` assessor among the nine survivors (`/review-use-lib-effective`, `/review-issues`, `/review-gaps`, `/review-test`, …) is a dimension entry, not a preset — it runs its own pass, and this door never wraps it in a preset. The eleven `review-*` preset doors are the ones in the map
- A fix request on one finding → the owning single skill (`/refactor`, `/implement-to-production`, `/update-*`, `/update-tests`); this door is for a review pass that may find several

## Execute

### 1. Read The Request

> Goal: know the scope, the preset, and the flags before choosing anything

1. Take the scope from the argument — path, workspace, package, diff, whole repo, issue, plan. No scope → the current repository
2. Detect the flags and pass them through verbatim: `--diff`, `then-fix`, `fix all`, `follow-your-suggestion`
3. Detect an explicit preset token — an exact door name from the map (`deep-review-codebase-everything` or a `review-*` door) or one of the aliases in step 2
4. Run `/deep-thinking` on the request only when the preset is not explicit — it classifies what kind of artifact the scope is and therefore which preset answers it

### 2. Pick The Preset

> Goal: one preset per run, chosen by what the scope actually is

| Signal in the scope or request | Preset |
|---|---|
| No signal, whole repo, "review everything", several artifact kinds at once | `deep-review-codebase-everything` |
| Structure, SRP, long files, duplication, boundaries, architecture, "should this be refactored" | `review-refactor` |
| TODO/MOCK/stub, dead UI, empty routes, placeholder handlers, docs promising what code lacks | `review-implement-to-production` |
| Docs stale, config drift, broken references, rules/skills out of date, dead links | `review-update` |
| UX, UI, design system, layout, a11y, visual consistency, copy tone | `review-design` |
| Tests, coverage, flaky, assertions that assert nothing, missing cases | `review-tests` |
| Security, auth, secrets, injection, tenant isolation, privacy, supply chain | `review-security` |
| Slow p95, LCP/CLS/INP, bundle, cache, memory, LLM spend, capacity | `review-performance` |
| Schema, migrations, backfill, transactions, integrity, backup/restore | `review-data` |
| Dependencies, CI/CD, cloud/IaC, observability, delivery, runbook, cost | `review-ops` |
| API contract, webhooks, idempotency, pagination, deprecation | `review-api` |
| Accessibility, keyboard, contrast, motion, dark mode, form a11y | `review-a11y` |

1. Aliases accepted as the `[preset]` token: `everything`, `codebase` → `deep-review-codebase-everything`; `refactor`, `structure` → `review-refactor`; `implement`, `gaps`, `not-implemented` → `review-implement-to-production`; `update`, `docs` → `review-update`; `design`, `uxui` → `review-design`; `tests`, `test` → `review-tests`; `security` → `review-security`; `perf`, `performance` → `review-performance`; `data`, `database` → `review-data`; `ops`, `platform`, `deps` → `review-ops`; `api` → `review-api`; `a11y`, `accessibility` → `review-a11y`
2. An explicit door name or alias always wins over the signal table
3. Two signals from different presets that both fit → `/ask-me` with the top two; `dont-ask-me` mode → run `deep-review-codebase-everything` and name the presets the run did not take
4. A bare label argument (`/deep-review <scope> <label>`) is not a preset — hand it to `deep-review-codebase-everything`, whose matrix resolves the label; an explicitly named assessor such as `/review-use-lib-effective` runs directly, and an explicitly named door runs that door
5. Never invent a preset outside `deep-review-codebase-everything/references/presets.md` — a preset needs at least two matrix rows and a fix route it owns, and the map row and its `SKILL.md` land together; a single-row rename stays a label call

### 3. Run The Preset

> Goal: exactly one pipeline runs, with the caller's arguments intact

1. Invoke the chosen skill with the original scope and flags — no rewriting, no narrowing the caller did not ask for
2. Do not pre-scan, pre-classify, or summarize the scope before the preset does: its step 1 is where the evidence pass starts
3. The preset runs its own report, persist, route, and fix steps — including the confirm gate in its fix step (`/ask-me` per finding, `/follow-your-suggestion`, or `fix all`, skipped only in `dont-ask-me`/`/ship`)
4. If the preset cannot run (missing dependency, tool unavailable) → say which one and why, then fall back to `deep-review-codebase-everything` with the same arguments rather than improvising a replacement
5. Never chain two presets in one run silently; the second would review what the first already changed — offer it as the next action instead

### 4. Report

> Goal: the caller knows which door ran and what it found

1. The preset's own report (built with `/report-review`) is the report — do not restate it in a second format
2. Add one line naming the preset that ran and why it was chosen (explicit, signal, or default)
3. Close with `/suggest-next-action`; when the preset stopped report-only, the next action is the same preset with `then-fix`, or a different preset for a dimension the run did not cover

## Rules

- Single door, no duplicated review — this skill decides and forwards, it never runs a dimension sweep itself
- Default is `deep-review-codebase-everything`; a request with no signal is not a reason to ask, it is a reason to take the default
- Explicit wins — a named door or alias is never overridden by the signal table
- Arguments pass through verbatim — scope, `--diff`, `then-fix`, and the fix mode belong to the preset, not to this skill
- One preset per run — no silent chaining, no double review of the same scope
- Ambiguity is one `/ask-me` between the top two presets, never a guess between three or more; `dont-ask-me` takes the default and records the skipped preset names
- Report-only unless the caller passed `then-fix` — the preset's fix gate applies unchanged
- Never add a preset that has no fix route or no row in `references/presets.md`; a review without a fix owner is a matrix row, not a door

## Expected Outcome

- Every `/deep-review` call runs exactly one preset with the caller's scope and flags, and the caller can see which door was chosen and why
- The default call behaves exactly like the full codebase review — callers written against the old `/deep-review` keep working
- The twelve doors share one pipeline, so a dimension fix lands in one place instead of twelve
- No orphaned references: gap-inventory callers now reach `review-implement-to-production`
