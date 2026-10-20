---
name: deep-review-codebase
description: Review any scope over every applicable dimension, then fix findings with `then-fix`
argument-hint: "[path-or-target] [dimension] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-thinking
  - deep-analyze
  - deep-validate
  - use-subagents
  - report-review
  - deep-review-ship
  - update-devin-project-rules
  - update-astgrep-rules
  - update-review-cli-then-run
  - follow-deep
  - suggest-next-action
  - review-issues
  - review-gaps
  - resolve-errors
  - ask-me
---

## Goal

Review any scope across every dimension that applies to it, with maximum coverage and minimum tokens, following seven principles — Think → Run once → Fan out → Report → Persist → Route → Fix. Steps 1–6 are report-only; the `then-fix` argument runs step 7 and makes this skill the canonical fixer as well

## Scope

Use when a review of a scope (path, workspace, diff, whole repo, issue, plan) is needed — the single canonical reviewer and fixer; every `improve`/`optimize`/`review` caller dispatches here, and `/follow-deep` routes a task here whenever it needs a deep review pass

- dimensions are not a fixed catalog — `references/dimension-matrix.md` seeds candidates per artifact (tiered), `/deep-thinking` + review CLI/linter output decide applicability (never a blind sweep); how to check each one: `references/dimension-checks.md`
- the matrix is the row contract: `Tier` (budget), `Applies to` (artifact match), `Evidence` (who works), `Default severity`, `N/A condition` (the only legal skip), `Authority` (the standard it answers to), `CLI domain` (analyzer slice + gap), `Enforcement` (how it becomes durable), `Gate` (CI cadence), `Aliases` (legacy `review-*` label resolution), `Tool/skill`, `Fix owner` — every later step reads the row instead of re-deciding, and `dimension-checks.md` holds only the "what must be proven" statement (same 1:1 row set)
- the matrix is advisory data, not a pipeline: `Fix owner` words bind to `improve`/`optimize` scope-map vocabulary and `references/domain-map.md` so routing never remaps ad hoc
- domain knowledge the old catalogs held is delegated: mechanical checks live in the review CLI + ast-grep `rules/`, agent guidance lives in `.devin/rules/`, conventions in `follow-*`/`review-devin-global-harness`
- one dimension only, without the full scan pipeline → `/review-issues` (provably wrong behavior) or `/review-gaps` (promised but not delivered); `/review` runs both plus the inconsistency pass
- fix mode (`then-fix`) — confirm per finding first (default), follow the original suggestion (`/follow-your-suggestion`), or `fix all` as the user specifies; per global rules a confirm gate is skipped only in `dont-ask-me`/`/ship` flow
- change spans several workspaces/modules/layers and needs one reviewer per part → `/deep-review-ship`, which runs this skill per part
- metric-driven scope → `/optimize <scope>`; anything else → `/improve <scope>`; both are thin entries that land here

## Execute

Every run follows the seven principles in order; a run without `then-fix` stops after step 6.

### 1. Think

> Goal: decide which dimensions apply to this scope — never blind-sweep

1. Run `/deep-thinking` on the scope — what kind of artifact is this (CLI, web, API, docs, skills), which risks exist, which dimensions can yield findings; if the scope's shape is unclear, take structure/dependency evidence from `/deep-analyze` first
2. Seed candidates from `references/dimension-matrix.md`: all `always` tiers; `artifact-match` only when the scope holds that artifact; `on-demand` only when the user asked (a `[dimension]` argument narrows the run to that row + the always tier); `/deep-thinking` may still drop a seeded row (record the reason) and may add a row the matrix lacks. Read each kept row's `Evidence`, `CLI domain`, `Gate`, and `N/A condition` now — they decide cost, slice source, cadence, and whether a skip is even legal
3. Pick the mode: `[path-or-target]` limits scope; `--diff` reviews only files changed per `git diff` (one full scan per day/release, diff otherwise); `then-fix` enables step 7
4. Set a hard budget: workspaces (enumerate a monorepo with `/list-workspaces`) ≤ 10 per run, subagent dispatches ≤ 30 — over budget → keep `always` tier first, then `artifact-match` by risk; prefer rows whose `Gate` is `pr`/`release` and demote `nightly` rows first; record `skipped (budget)` with reasons in the ledger
5. Create the progress ledger `reports/.deep-review-codebase-<time>.ledger.json` — seed one entry per announced dimension up front: `{dispatched: {dimension: {workspace, tier, evidence: cli|capture|manual, status}}, startedAt}`; update on every dispatch; it makes coverage verifiable and the run resumable — resume by reusing the scope's existing `reports/.deep-review-codebase-*.ledger.json` and skipping entries already at `done`/`covered-capture`/`covered-manual`, never by rerunning completed work

### 2. Run once

> Goal: one deterministic full scan, sliced — never rerun the CLI per dimension

1. Manual pre-pass first (`git status`, spot-read changed files, check report freshness); CLI/analyzer issues → record in `update-review-cli-then-run/references/known-issues.md` before continuing
2. Prepare the analyzer: `tools/review-codebase` (or `/update-review-cli-then-run` to create it; the Rust `linter` CLI is a drop-in alternative); if neither is available, use whatever deterministic scan the project has (`/run-check`, linters) and say so in the report
3. Run ONE full scan → `reports/review-report.json`; store score/grade/dimension breakdown/baseline delta; note each dispatched row's `CLI domain` so rounds 2+ can rerun one slice (`--domain <quality|security|structure|config|deps>`) instead of rescanning — a row whose `CLI domain` is `—` has no slice and must go the `capture`/`manual` route
4. Validate the output schema before dispatch (keys, severity, evidence, `fixSkill` present per finding; `falsePositiveRate`/`analyzerErrors` sane) — broken output goes to `/update-review-cli-then-run`, not around it
5. Use `/use-scripts` to slice the JSON into `reports/.deep-review-codebase-<time>/findings-<dimension>.json` — one dimension per file, deterministic, no parsing in the parent context

### 3. Fan out

> Goal: one reviewer per dimension, max coverage, disjoint slices

1. Use `/use-subagents` — spawn one domain-review subagent per dispatched dimension; inputs: `dimension`, `workspace-path`, slice file (or the `references/dimension-checks.md` row + matrix tools when there is no slice); output contract: rows with `No.`, `Finding`, `Action`, `Evidence` (file:line), `Severity`, `Owner skill` + dimension summary — the parent adds the remaining step 4 columns (`Risk`, `Priority`, `Status`, `in update-review-cli-then-run`) from `Severity` + the row's `Default severity` trigger and `Authority`, and step 3.6
2. Subagents read only their slice/row + files named in evidence — never rerun the CLI, never sweep the codebase
3. A dimension with ≤ 2 findings → the parent analyzes it itself; independent dimensions → parallel batches ≤ 10 (`/follow-parallel`)
4. A dimension with no CLI slice (row `Evidence: capture|manual`) → dispatch it anyway: run the matrix `Tool/skill` first, then review with that output as input — mark `covered-capture`/`covered-manual` in the ledger; a dimension may stay with the parent only under the ≤ 2-findings rule — never silently drop it
5. On timeout/crash/parse error or matrix tool unavailable on the platform → mark `failed` (`failed (tool-unavailable)`) in the ledger and carry the error into the report; merge results and dedup by `file + rule + dimension` (keep highest severity, combined evidence)
6. A row with `CLI domain: —` has no slice — that is a routing fact, not a gap: dispatch it by `capture`/`manual` (step 4). A *durable* analyzer gap is narrower — `Enforcement: cli-check` and no rule fires, or a rule fires without landing in its `CLI domain` → hand off to `/update-review-cli-then-run`; an `Enforcement: none` row is measurement-only (`### 5` step 3) and is never handed off; a dimension with no reliable tool at all → note it as a matrix gap in the report

### 4. Report

> Goal: one table per dimension + a verifiable coverage matrix

1. Run `/report-review` — summary first (score/grade, findings by severity and dimension, mode + scope, `must-fix-before-production` = every Critical/High finding in a row whose `Gate` is `pr` or `release`), then one findings table PER dimension with the columns `/report-review` `## Execute` step 4 defines (this skill adds the `in update-review-cli-then-run` Y/N flag from step 3.6; `Owner skill` is the report's `fixSkill` — never remap yourself)
2. Include `Coverage` built from the ledger: rows = workspace, columns = dimension, cell = done/`covered-capture`/`covered-manual`/skipped(reason)/failed — coverage is proven, not claimed
3. Interrupted midway → report the partial coverage matrix immediately; a partial report beats no report
4. Only on explicit user request → `/create-report-in-dot-devin` with title `deep-review-codebase`
5. Verify before finishing with `/deep-validate`: every row has real evidence, every ledger dimension appears

### 5. Persist

> Goal: findings become durable — the same finding must not survive the next run

1. Findings whose matrix `Enforcement` is `devin-rule` (natural-language conventions/agent guidance) → `/update-devin-project-rules` (author `.devin/rules/*.md` for the workspace type)
2. Findings whose `Enforcement` is `ast-grep` (imports, patterns, API misuse, naming) → `/update-astgrep-rules` (AST rules + `sgconfig.yml`)
3. Findings whose `Enforcement` is `cli-check` → `/update-review-cli-then-run` adds the analyzer check (and a rule-id prefix that lands the row in its `CLI domain`); analyzer bugs → `update-review-cli-then-run/references/known-issues.md`. `Enforcement: test` → `/update-tests` asserts the invariant. `Enforcement: none` → state in the report that the row is measurement-only and cannot be made durable
4. After persisting, re-run the analyzer on the original violation only (`--diff` or the single file named in the evidence — never a full rescan, per `## Rules`) to confirm the finding now fails loudly or is gone — a rule that doesn't fire on the original violation is not durable

### 6. Route

> Goal: every finding has an owner before anything is edited

1. Map each finding to its fix route in `references/domain-map.md` (metric domains → `/optimize <scope>`; architecture → `/follow-architecture`/`/refactor`; the rest → the `## Fix boilerplate` of that file)
2. Order the fix sequence Foundation → Dependencies → High impact → Critical path → High risk with rough effort (not a flat TODO) — this sequences the plan; step 7 then works the confirmed set severity-first inside each tier; many fixes across unrelated modules → plan them with `/create-plan-in-dot-devin` first
3. Without `then-fix` → stop here: report the sequence and close with `/suggest-next-action` (`/deep-review-codebase <scope> then-fix` is the next action)

### 7. Fix

> Goal: the confirmed findings are fixed in context and verified — only runs with `then-fix`

1. Confirm the fix list with the user via `/ask-me` — per finding by default, `/follow-your-suggestion` to follow the report as-is, `fix all` when the user says so; `dont-ask-me` mode skips the gate and follows the report as-is (it means `/follow-your-suggestion`, never a severity subset)
2. Apply fixes one file or small batch at a time — minimal, surgical, atomic, reviewable diffs with consistent style; preserve behavior except the intended change; no scope creep beyond the finding
3. Dispatch by domain per `references/domain-map.md`; findings in disjoint modules → parallel `fix-worker` subagents via `/use-subagents`; a complex issue or an error mid-fix → `/resolve-errors`
4. Verify each fix immediately (test/build/run for that ecosystem), then a regression pass: `/run-check`, `/run-test`, `/deep-validate`; before/after evidence via `/report-before-after`
5. Re-review the fixed scope with `--diff` (never a full rescan) — loop ≤ 3 rounds until the confirmed findings are gone; anything still failing → mark `failed` with the reason in the ledger, never leave a broken state
6. Score the pass via `references/fix-metrics.md` (fix score = verified fixes / attempted fixes) and close with `/suggest-next-action`

## Subagents

> Goal: Independent work that can be spawned in parallel — profiles live in this section, no separate files needed

### fix-worker — apply the fixes the user approved within a single module/domain, then verify and return changed files + results (use when findings span several modules that can be fixed in parallel without collision)

- `Inputs`: `findings` (the approved findings for this module/domain — finding id, severity, `file:line`, recommendation), `scope` (the single module/domain it owns, e.g. `src/auth/`, `domain=security`, `package=ui`), `fix-guides` (optional — the matching `references/domain-map.md` route or a domain workflow `SKILL.md`), `verify-commands` (optional — e.g. `bun run typecheck`, `bun run test`)
- `Tools`: `read`, `grep`, `find_file_by_name` (read fix guides and the source to be fixed), `edit`/`write` (apply only the approved fixes), `exec` (run lint, typecheck, tests after each fix)
- `Execute`:
  1. Read the fix route for the matching domain (per `references/domain-map.md`) — if none exists, fix directly per the finding's recommendation
  2. Rank findings by severity — `critical` first, then fix one at a time
  3. Each fix must preserve the original behavior — minimal diff, no refactoring beyond the finding
  4. Verify immediately after each fix with `verify-commands` or checks the scope supports
  5. If a fix breaks a check → revert that fix and mark it `failed` with the reason, then continue
- `Output`: table `| No. | Finding | Status | Changed Files | Verify Result |` — `status`: `fixed`/`failed`/`skipped` (out of scope or missing approval); close with a summary of total fixed/failed/skipped, all changed files, and aggregate verify (`pass`/`fail`); if aggregate verify fails → list the reverted fixes and residual risk
- `Constraints`: fix only the findings in the `findings` list within the assigned `scope` — never touch another module's findings; never apply unapproved fixes — if unclear, mark `skipped` with a reason; every fix must pass its own verify — on failure revert immediately, never leave a broken state; never touch files outside `scope` unless a finding requires it (e.g. a shared import) — must be noted in the output; never commit — the worker returns changed files and the parent's caller (`/deep-review-codebase` itself, or `/deep-review-ship` → `/ship`) owns committing

## Rules

- Report-only unless `then-fix` is given — steps 1–6 never edit code, business logic, or config; with `then-fix`, step 7 fixes only confirmed findings
- Never edit without the step 7 confirm gate (except `dont-ask-me`/`/ship`, where the report is followed as-is); incremental fixes — one file or a small batch, verified before the next
- Evidence first — every finding cites `file:line` or report evidence, and every fix has a reason from the review; spot-check ≥ 1 item per dimension against real files; no severity from intuition
- One scan per run — subagents share slices; re-review after fixes uses `--diff`, never a full rescan
- Budget and ledger are hard contracts — over budget marks `skipped (budget)`; a dropped dimension in the ledger is a reporting bug; every dimension announced in `Think` step 2 must appear in the ledger
- Severity cites the matrix `Default severity` + the upgrade/downgrade trigger in the same cell (`dimension-checks.md` `## Notes`); moving off the default without the trigger is not evidence
- Row parity is a contract — `dimension-matrix.md` and `dimension-checks.md` hold the same dimension names, one row each, and `bun scripts/verify-matrix.ts` proves it (row parity/order, `Evidence`/`Enforcement` vs `CLI domain`, alias collisions, `Fix owner` reachability) before any run; a name in one file and not the other, or a matrix cell contradicting the checks statement, is a reporting bug to fix before the run continues
- The matrix is candidate data only — it never replaces `/deep-thinking`, never freezes into a mandatory catalog, and stale pins are fixed via `/deep-research` then that reference
- Fix routing follows the `references/domain-map.md` lookup order: domain row → `## Dimension-name aliases` → the matrix `Fix owner` → `/ask-me` only when none matches (report it as a matrix gap); a legacy `review-<label>` resolves through the matrix `Aliases` column, never by fuzzy name
- Never judge a dimension absent because "there probably isn't a problem" — skip only for the row's `N/A condition`, with that condition quoted as the ledger reason
- Loop limit — ≤ 3 rounds of CLI repair via `/update-review-cli-then-run`; per-dimension subagents retry once; `score < 70` after 3 rounds → stop and report
- Write ledger/slice files only under `reports/`

## Expected Outcome

- One full scan sliced per applicable dimension, reviewed at max coverage under budget — proven by the `## Coverage` matrix from the ledger
- Chat report via `/report-review`: per-dimension tables + summary + prioritized fix sequence, no files unless asked
- Findings persisted per the matrix `Enforcement` (`.devin/rules/*.md`, ast-grep rules, analyzer checks, or a test) with analyzer gaps reported, so they cannot silently recur — measurement-only rows are named as such
- With `then-fix`: confirmed findings fixed per `references/domain-map.md`, each verified, re-reviewed with `--diff` until clean or `blocked` with reasons — and a fix score
- Without `then-fix`: nothing edited; every finding handed to its owner skill in the suggested sequence
- Interrupted runs resume from the ledger without rerunning completed work
