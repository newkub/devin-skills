---
name: report-not-implement
description: Report what is not yet implemented: markers/MOCK/stub, dead UI, route without substance, things docs promise
argument-hint: "[scope-or-path]"
related:
  - report
  - report-review
  - scan-codebase
  - use-astgrep
  - check-secrets
  - follow-tool-knip
  - implement-to-production
  - deep-test
  - use-subagents
  - update-todo-md
  - suggest-next-action
  - improve-usage-md
  - no-use-ignore
  - create-plan-in-dot-devin
---

## Goal

Detect and report everything the codebase "claims to have but does not really have" or "has code but it does not really work" as a chat table with `file:line` evidence, to serve as the work queue before implementing — report only, no code changes

## Scope

- Use before `/implement-to-production` (needs a complete work list), before release (verify reality matches the ads), or when the user asks "what is not done / not implemented yet"
- Argument is a path/glob/workspace → scan only that scope; unspecified → the whole codebase including monorepo workspaces
- Scan only contracts that actually exist: half-written code, renderable UI, declared routes/schemas/specs, terms declared in docs — not an ideal feature list (net-new work never designed yet → `/idea-features`)
- boundaries: code quality/security → `/deep-review-codebase`; dead code with no consumer → `/follow-tool-knip`; tests asserting nothing meaningful → `/deep-test test-correctness`; gap review with severity + confirm/fix (this report is its baseline) → `/review-gaps`; fix plan → `/create-plan-in-dot-devin`; doing the fix → `/implement-to-production`

## Execute

### 1. Establish The Contract

> Goal: Know what "the real thing" must be, to measure what is absent

1. Run `/scan-codebase` to see the stack, entry points, workspace members, generated/lock/vendor paths to skip, and project conventions
2. Collect sources of "what is promised": manifests (`package.json`/`Cargo.toml` bin+exports), API routes/procedures, schema+migrations, CLI command list, `README.md`/`FEATURES.md`/`USAGE.md`/docs, `TODO.md`, issues/plans in `.devin/temp/plan/<workspace>/`
3. Read the project `AGENTS.md` if present, to avoid reporting what the project deems not-yet-due
4. Large scope / multiple workspaces → spawn the `gap-scanner` profile (in `## Subagents`) in parallel by directory (read-only), then merge the tables

### 2. Scan Markers And Stubs

> Goal: Half-written code and functions without logic yet

1. Find markers with `/use-astgrep` or `rg`: `TODO`, `FIXME`, `XXX`, `HACK`, `not implemented`, `unimplemented`, `todo!()`, `NotImplementedError`, `panic!("TODO")` with `file:line` and context
2. Find stub bodies: empty functions, `return null`/`return []`/`return true` not derived from real logic, hard-coded arrays/objects instead of queries, `setTimeout` simulated delay, in-memory store instead of a DB
3. Find job-swallowing errors: empty `catch {}`, silent fallbacks, `?? default` that hides paths lacking the real thing
4. Find ignore/suppression that masks pending work (`@ts-expect-error`, `eslint-disable`, `biome-ignore`, `# noqa`) → report as pending work and forward to `/no-use-ignore`

### 3. Scan Dead UI And Unreachable Wiring

> Goal: Things the user can see or invoke but that have no real effect

1. dead UI: `onClick={() => {}}`, `href="#"`, permanently `disabled` without a condition, dialogs/modals/menus with no open logic, forms without a submit handler, `alert()`/`console.log` instead of an action, 'coming soon'/'ยังไม่พร้อม'/'暂未实现' messages
2. Actually render and verify — do not just read source → use `/deep-test website` or `/deep-test e2e` click-through of every route, then classify each element as `works`/`fake`/`missing`
3. unwired code: components/handlers/usecases that exist but nobody calls them (not registered on a route, not exported through a barrel, not mounted) → confirm with `/follow-tool-knip` before concluding
4. config/env that code reads but is absent from `.env.example`/manifest → treat as not implemented (cannot really run) — use `/check-secrets env-vars`

### 4. Compare Promised Versus Real

> Goal: Things docs/API spec declare but code lacks

1. Compare declared routes/procedures/commands (docs, OpenAPI, CLI help, manifest exports) with what exists, one by one — no handler, no flag, no command = `promised`
2. Compare schema/table/field with actually applied migrations — a declared field with no migration = `missing`
3. Compare `TODO.md` and plan-file items with the real status in code (`/update-todo-md` reads it) — marked `done` in docs but not real = `fake`
4. If whole-file docs promises must be compared against the real API/CLI → use `/improve-usage-md` as the checking source and merge its findings into the same table (do not duplicate the check)

### 5. Verify Each Candidate

> Goal: Do not report false positives

1. Every candidate needs evidence you read yourself: `file:line` + the confirming sentence/block + real run results where checkable (call the endpoint, run the command)
2. Assign one status per item:
   - `missing` no code for it at all
   - `fake` code exists but returns mock/hardcoded/no-op, so it may look passing without the real thing
   - `partial` works only on the happy path, missing error/empty/loading/edge states or validation
   - `unwired` complete code but unreachable from the user's entry point
   - `promised` referenced in docs/spec/plan but absent from code
3. Do not dedupe by guessing — different locations with the same root cause → merge into one item and list every site (one fact, one source → `/follow-single-of-source`)
4. Skip generated code, lockfiles, vendor, snapshots, and tests mocked by design (a mock in a test is not a gap); files in `.gitignore` that still count as real project source are included — cover every workspace, not just the root

### 6. Report And Hand Off

> Goal: A report usable immediately as a work queue

1. Show the summary at the top: item counts per status, per domain (`schema`/`data`/`api`/`ui`/`infra`/`test`/`docs`), and the percentage of the scope actually verified
2. Send details through `/report-review` as one chat table: `No.` | `Location` | `Domain` | `Item` | `Status` | `Evidence` | `Blocking` | `Effort` | `Verify`
3. Order by critical path first: `schema` → `data` → `api` → `ui` → `infra` → `docs`; items that others depend on → put their id in `Blocking`
4. State the source + date/commit scanned (`git rev-parse --short HEAD`) so the next round is comparable
5. handoff: to start working → `/implement-to-production` (must implement everything the report lists, not cherry-pick); want quality alongside → `/improve`; need a multi-step plan → `/create-plan-in-dot-devin`; finish with `/suggest-next-action`
6. Only if the user explicitly wants a report file → `/create-report-in-dot-devin`; by default create no files

## Rules

### 1. Read Only

- This skill must not change code, delete markers, or implement — it produces state knowledge only
- All fix work is forwarded to `/implement-to-production`/`/fix`/`/refactor` by type

### 2. Evidence Over Guess

- Every row must point to a real `file:line` or a real run result — never conclude from "probably not done yet"
- Torn between `fake` and `works` → run/click for real before deciding (`/deep-test website`, `/run-dev` + browser)
- Do not self-filter to report "only the bad-looking stuff"; report everything completely and assign priority instead
- One item, one status; if data is insufficient to classify → use `unknown` with what still needs checking

### 3. Coverage Of Scope

- Must cover the whole scope the user gave, not a sample; if verification is incomplete → state clearly how many routes/files were covered and which parts were not
- Every workspace in a monorepo must be included — run `/check-monorepo` then go member by member, or spawn in parallel
- Re-runnable: run the same commands on different commits to compare whether gaps closed or opened

### 4. Report Format

- Use `/report table` for the main table and a numbered summary below
- Backticks for paths/commands/symbols; no bold markers; answer in chat only (files only when the user asks)

## Subagents

> Goal: Independent scan work that can spawn in parallel — the inline profiles here need no separate files; spawn via `/use-subagents` passing the inputs the profile defines; read-only only; the parent merges and verifies all results

### gap-scanner — inventory TODO/MOCK/placeholder/hardcoded in the assigned scope (read-only)

- Inputs: `root` (directory to scan), `markers` optional (add to `TODO|FIXME|XXX|HACK|MOCK|FAKE|STUB|placeholder`), `plan-file` optional (plan/`TODO.md` path whose items must be compared), `contract` optional (list of routes/commands to verify have real handlers)
- Tools: `exec` — `rg`/ast-grep for markers + hardcoded values; `read`/`grep` — context around a marker; `find_file_by_name` — find `TODO.md`, `.env.example`, config files
- Execute: 1) scan all markers in `root` with `file:line`+context, including dead-UI (`onClick={() => {}}`, `href="#"`, permanent `disabled`, `alert(`, 'coming soon') → 2) classify each item by domain `schema`/`data`/`api`/`ui`/`infra`/`test`/`docs`/`unknown` → 3) check whether it is mock data / stub function / hardcoded value / missing implementation, then assign `Status` per the parent's `### 5` → 4) if `contract` given, compare the list against the real code → 5) if `plan-file` given, compare its items → 6) never edit files (inventory only)
- Output: table `No.` | `Location` | `Domain` | `Item` | `Status` | `Evidence` | `Blocking` | `Effort` | `Verify` with a summary of totals per domain, suggested order, and critical path candidates
- Constraints: model `sonnet`; tools limited to `read`/`grep`/`glob`/`find_file_by_name`/`exec`, deny `write`/`edit` — scan only; report every marker found without self-filtering (the parent prioritizes); stay within the given `root`; skip generated/lock/vendor

## Expected Outcome

- A complete list of what is not really implemented across the scope, with `file:line` evidence and status (`missing`/`fake`/`partial`/`unwired`/`promised`)
- Knowledge of what blocks what and the order to do it (critical path) — usable immediately as the work queue of `/implement-to-production`
- No false positives, because every item was verified by reading context or running for real
- One chat table in the report, no files created, no code modified
