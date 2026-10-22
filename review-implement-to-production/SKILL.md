---
name: review-implement-to-production
description: Review what is claimed but not really implemented, then close it to production
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - implement-to-production
  - deep-test
  - report-review
  - use-subagents
  - use-astgrep
  - follow-tool-knip
  - update-todo-md
  - check-secrets
  - no-use-ignore
  - create-plan-in-dot-devin
  - suggest-next-action
  - ask-me
---

## Goal

Find everything the codebase claims to have but does not really have — or has code for but does not really work — as an evidence-backed work queue, then close that queue through `/implement-to-production`

## Scope

Use before implementation, before release, or whenever the question is "what is not done yet". This preset absorbs the former gap-inventory skill; its report is the implementation queue

- Entered through `/deep-review` with `implement`, `gaps`, or `not-implemented`, or called by name; no argument is rewritten
- Scan only contracts that actually exist: half-written code, renderable UI, declared routes/schemas/specs, and terms declared in docs. Net-new features nobody designed yet are not gaps (`/idea-features`)
- Boundaries: code quality and security → `/deep-review-codebase-everything`; dead code with no consumer → `/follow-tool-knip`; tests that assert nothing → `/review-tests`; the fix plan → `/create-plan-in-dot-devin`; the fix run → `/implement-to-production`
- Without `then-fix` the run is report-only: the queue is the deliverable and nothing is edited
- With `then-fix` the confirmed queue drives `/implement-to-production`, which implements every item; the preset does not implement items itself

## Execute

### 1. Think

> Goal: know what the scope promises and where the promises live

1. Run `/deep-thinking` on the scope — which artifacts are in play (app, package, library, CLI, docs, skills) and which promises each artifact type makes
2. Take `[scope]` from the argument; absent → the current repository including every workspace
3. Read the project `AGENTS.md` if present — a project that declares work "not yet due" must not be reported as a gap
4. Large scope or monorepo → plan the partition now and dispatch it through `/use-subagents`: the `gap-scanner` profile (`## Subagents`) runs per directory in parallel with disjoint roots and the parent merges

### 2. Establish The Contract

> Goal: know what "the real thing" must be, to measure what is absent

1. Collect the sources of "what is promised": manifests (`package.json`/`Cargo.toml` bin + exports), API routes/procedures, schema and migrations, CLI command lists, `README.md` / `FEATURES.md` / `USAGE.md` / `docs/`, `TODO.md`, and plans under `.devin/temp/plan/<workspace>/`
2. Read the declared surface, not an ideal feature list: a contract exists only where a manifest, route, schema, spec, or doc actually declares it
3. Note each contract's source as `file:line` — every later comparison cites both sides
4. Pick the mode: `--diff` limits the comparison to changed files plus the contracts they touch; a full run compares the whole scope

### 3. Scan Markers And Stubs

> Goal: find half-written code and functions with no logic yet

1. Find markers with `/use-astgrep` or `rg`: `TODO`, `FIXME`, `XXX`, `HACK`, `not implemented`, `unimplemented`, `todo!()`, `NotImplementedError`, `panic!("TODO")` — record `file:line` plus context
2. Find stub bodies: empty functions, `return null` / `return []` / `return true` not derived from real logic, hard-coded arrays or objects instead of queries, `setTimeout` simulated delay, in-memory stores standing in for a database
3. Find swallowed errors: empty `catch {}`, silent fallbacks, a `?? default` that hides a path lacking the real thing
4. Find suppressions that mask pending work (`@ts-expect-error`, `eslint-disable`, `biome-ignore`, `# noqa`) and report them as pending work; forward the hygiene fix to `/no-use-ignore`
5. A marker the project deems acceptable (a documented deliberate `TODO` with an owner and date) is recorded as such, not counted as a gap

### 4. Scan Dead UI And Unwired Wiring

> Goal: things the user can see or invoke but that have no real effect

1. Read for dead UI: `onClick={() => {}}`, `href="#"`, permanently `disabled` without a condition, dialogs/menus/tabs with no open logic, forms without a submit handler, `alert()`/`console.log` instead of an action, 'coming soon' / 'not ready yet' text
2. Verify in a real render, not only in source: `/deep-test website` (or the platform's equivalent) walks every route and classifies each element `works` / `fake` / `missing`
3. Confirm unwired code with `/follow-tool-knip` before concluding — a component, handler, or usecase nobody calls, not registered on a route, not exported through the barrel, or not mounted
4. Config or env the code reads but that is absent from `.env.example` / the manifest is a gap — the app cannot really run without it; cross-check with `/check-secrets env-vars`
5. Every candidate keeps the rendered evidence (route, element, expected effect vs actual) next to its `file:line`

### 5. Compare Promised Versus Real

> Goal: things docs or specs declare but the code lacks

1. Compare declared routes/procedures/commands (docs, OpenAPI, CLI help, manifest exports) with what exists, one by one — no handler, no flag, no command = `promised`
2. Compare schema/table/field with the migrations actually applied — a declared field with no migration = `missing`
3. Compare `TODO.md` and plan-file items with the real status in code (read it with `/update-todo-md`) — marked `done` in docs but not real = `fake`
4. When whole-file docs promises must be compared against the real API/CLI, use `/improve-usage-md` as the checking source and merge its findings into this queue instead of duplicating the check

### 6. Verify Each Candidate

> Goal: no false positives in the queue

1. Every candidate needs evidence read directly: `file:line` plus the confirming block, and a real run result where checkable
2. Assign one status per item: `missing` (no code at all), `fake` (code exists but returns mock/hardcoded/no-op), `partial` (happy path only, missing error/empty/loading/edge states), `unwired` (complete but unreachable from the entry point), `promised` (referenced in docs/spec/plan, absent in code)
3. Same root cause in several places → one item listing every site, not N items
4. Skip generated code, lockfiles, vendor, snapshots, and mocks that are deliberate test doubles; include every workspace in scope
5. Torn between `fake` and `works` → run or click it for real before deciding; insufficient data → `unknown` with what still needs checking

### 7. Report The Queue

> Goal: a queue usable immediately as the work list

1. Run `/report-review` with the summary first: item counts per status and per domain (`schema`/`data`/`api`/`ui`/`infra`/`test`/`docs`), plus the share of the scope actually verified
2. One table: `No. | Location | Domain | Item | Status | Evidence | Blocking | Effort | Verify`
3. Order by critical path: `schema` → `data` → `api` → `ui` → `infra` → `docs`; items others depend on put their id in `Blocking`
4. State the source and date/commit scanned (`git rev-parse --short HEAD`) so the next round is comparable; incomplete coverage is stated explicitly, never implied
5. Without `then-fix` → stop here and close with `/suggest-next-action`; the queue is the deliverable

### 8. Fix Through Implement To Production

> Goal: the confirmed queue is closed by the canonical implementer, not by this skill

1. Confirm the fix list with `/ask-me` — per item by default, `/follow-your-suggestion` for the report as-is, `/fix all` when the user says so; `dont-ask-me`/`/ship` follow the report as-is
2. Pass the queue to `/implement-to-production` as its entry queue, so it does not re-scan; a queue item with no design for its surface yet → design first (`/design-cli-prototype`, `/design-tui-prototype`, `/design-web-prototype`, `/design-html-prototype`), then implement
3. Every item is implemented or reported `blocked`/`deferred` with a reason — never a partial subset reported as done
4. Many fixes across unrelated modules → `/create-plan-in-dot-devin` first, then run the batches

### 9. Re-Scan And Close

> Goal: prove the gap is closed with the same instrument that opened it

1. Re-run the same scan on the same scope — the queue must show 0 `missing`/`fake`/`partial`/`unwired`/`promised`; a new marker, including one the fix introduced, is closed before the gate
2. Update `TODO.md` items that closed via `/update-todo-md`
3. Run the verify gate the implementer owns (`/ship verify-only` or `/run-verify`) — never gate around a red check
4. Report before → after counts per status and close with `/suggest-next-action`

## Subagents

> Independent scan work that can run in parallel — profiles live inline; the parent merges and verifies every result

### gap-scanner — inventory TODO/MOCK/placeholder/hardcoded values in the assigned scope (read-only)

- `Inputs`: `root` (directory to scan), `markers` (optional additions to the default marker set), `plan-file` (optional plan/`TODO.md` whose items must be compared), `contract` (optional list of routes/commands to verify have real handlers)
- `Tools`: `exec` (`rg`/ast-grep for markers and hardcoded values), `read`/`grep` (context around a marker), `find_file_by_name` (`TODO.md`, `.env.example`, config files)
- `Execute`: scan every marker in `root` with `file:line` and context, including dead UI (`onClick={() => {}}`, `href="#"`, permanent `disabled`, `alert(`, 'coming soon') → classify each by domain `schema`/`data`/`api`/`ui`/`infra`/`test`/`docs`/`unknown` → decide mock data / stub function / hardcoded value / missing implementation → assign the status rules of `### 6` → compare `contract` and `plan-file` when given → never edit
- `Output`: `No. | Location | Domain | Item | Status | Evidence | Blocking | Effort | Verify` plus totals per domain, suggested order, and critical-path candidates
- `Constraints`: read-only; report every marker without self-filtering (the parent prioritizes); stay inside `root`; skip generated/lock/vendor

## Rules

- Report-only unless `then-fix` is given; with `then-fix` only the confirmed queue is implemented, and this skill never implements an item itself
- Evidence over guess — every row cites a real `file:line` or a real run result; never conclude from "probably not done yet"
- One item, one status; same root cause merges into one item listing every site
- Coverage over sampling — every workspace in scope is scanned; incomplete verification is stated with what was not covered
- Deliberate test doubles and documented deferred work are not gaps; suppressing a marker is not the same as closing it
- The queue is the contract with `/implement-to-production` — pass it as-is, never let the implementer re-derive a different scope
- Re-runnable: the same scan on another commit compares whether gaps closed or opened
- Report in chat only; create files only when the user asks

## Expected Outcome

- A complete, evidence-backed queue of what is not really implemented, with status per item and the critical path named
- No false positives: every item was read in context or run for real, and deliberate test doubles are excluded
- With `then-fix`: the queue closed end to end by `/implement-to-production`, a re-scan showing zero gaps, and a before → after count
- Without `then-fix`: nothing edited and the queue ready to hand to the implementer
