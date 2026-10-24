---
name: deep-review-codebase-everything
description: Review a whole codebase over every dimension, then fix findings with `then-fix`
argument-hint: "[path-or-target] [preset|label] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-thinking
  - deep-analyze
  - deep-validate
  - use-subagents
  - report-review
  - update-dot-agents-project
  - update-astgrep-rules
  - update-review-cli
  - follow-deep
  - suggest-next-action
  - review-issues
  - review-gaps
  - resolve-errors
  - ask-me
---

## Goal

Review any scope over every dimension that applies to it, at maximum coverage and minimum tokens, following seven principles in order — Think → Run once → Fan out → Report → Persist → Route → Fix. Steps 1–6 are report-only; the `then-fix` argument enables step 7, which makes this skill the canonical fixer as well

## Scope

Use when a scope (path, workspace, diff, whole repo, issue, plan) needs a review of every applicable dimension — the canonical reviewer and fixer the general `/deep-review` dispatcher forwards to by default. Every `improve`/`optimize`/`review` caller lands here, and `/follow-deep` routes a task here whenever it needs a deep review pass

- Dimensions are not a fixed catalog. `references/review.md` (`## Dimension Matrix`) seeds candidates per artifact (tiered) and carries each row's `Check` proof statement, while `/deep-thinking` plus the review CLI/linter output decide applicability — never a blind sweep. The deterministic-scan shape is the stated deviation from the `deep-*` template: evidence comes from the CLI slice, not per-dimension `/deep-research`
- The matrix is the row contract — `references/review.md` (`## Dimension Matrix`) defines every column. The ones this skill acts on: `Tier` (budget), `Applies to` (artifact match), `Impact` (ordering), `Cost` (run cap), `Fix mode`, `Evidence`, `Default severity`, `N/A condition` (the only legal skip), `Check` (the proof statement), `Authority`, `CLI domain` (slice + gap), `Enforcement`, `Gate`, `Aliases` (label resolution), `Tool/skill`, and `Fix owner`. Every later step reads the row instead of re-deciding
- The matrix is advisory data, not a pipeline. `Fix owner` words bind to the `improve`/`optimize` scope-map vocabulary and to `## Domain Map` in `references/review.md`, so routing never remaps ad hoc
- Domain knowledge is delegated: mechanical checks live in the review CLI and ast-grep `rules/`, agent guidance lives in `.agents/rules/`, and conventions live in `follow-*`/`review-dot-agents-global-and-fix`
- Preset doors — `references/presets.md` (`## Preset Map`) names this engine plus every `review-*` door, its tier, the matrix labels it seeds, and the fix route it owns. A door keeps the deep pipeline inside: a preset argument (e.g. `security`, `performance`, `data`, `ops`) seeds exactly those labels through this same pipeline; no preset argument means the standard tiered sweep. A preset never restates a check and never runs its own scan
- One dimension only, without a preset, → `/deep-review-codebase-everything <scope> <label>`. `references/review.md` `### Label resolution` resolves the label to its matrix rows and lands right back here with only those rows selected. `/review-issues` (provably wrong behavior) and `/review-gaps` (promised but not delivered) hold their own dimension work, and `/review` runs both plus the inconsistency pass
- Fix mode (`then-fix`) — confirm per finding first (default), follow the original suggestion (`/follow-your-suggestion`), or `fix all` as the user specifies. Per global rules, the confirm gate is skipped only in the `dont-ask-me`/`/ship` flow
- A change that spans several workspaces/modules/layers and needs one reviewer per part → `/ship` step 2 partitions the scope into disjoint parts and runs this skill per part via `part-reviewer` subagents; `/ship verify-only` runs the same step and stops before push/merge
- Metric-driven scope → `/optimize <scope>`; anything else → `/improve <scope>`; both are thin entries that land here

## Execute

Every run follows the seven principles in order; a run without `then-fix` stops after step 6.

### 1. Think

> Goal: decide which dimensions apply to this scope — never blind-sweep

1. Run `/deep-thinking` on the scope — what kind of artifact is this (CLI, web, API, docs, skills), which risks exist, which dimensions can yield findings. If the scope's shape is unclear → take structure/dependency evidence from `/deep-analyze` first
2. Resolve an explicit preset token through `references/presets.md` (`## Preset Map`) before seeding: its `Seeded labels` replace the artifact scan (the `always` tier still applies); `—` falls back to the always tier, and `all` means the normal sweep. Then seed candidates from `references/review.md` (`## Dimension Matrix`): all `always` tiers; `artifact-match` only when the scope holds that artifact; `on-demand` only when the user asked (a `[label]` argument narrows the run to that row plus the always tier). `/deep-thinking` may still drop a seeded row (record the reason) and may add a row the matrix lacks. Read each kept row's `Impact`, `Cost`, `Fix mode`, `Evidence`, `CLI domain`, `Gate`, and `N/A condition` now — they decide risk, budget, fix mechanics, slice source, cadence, and whether a skip is legal
3. Pick the mode: `[path-or-target]` limits the scope; `--diff` reviews only the files changed per `git diff` (one full scan per day/release, diff otherwise); `then-fix` enables step 7
4. Set a hard budget: workspaces ≤ 10 per run (enumerate a monorepo with `/list-workspaces`), subagent dispatches ≤ 30. Over budget → keep the `always` tier first, then `artifact-match` ranked by `Impact` (`security`/`data`/`money` before `perf`/`ops` before `dx`) and by `Cost` (`cheap` → `medium` → `high`); prefer rows whose `Gate` is `pr`/`release` and demote `nightly` rows first. Record `skipped (budget)` with reasons in the ledger
5. Create the progress ledger `<workspace>/reports/.deep-review-<time>.ledger.json` with one entry per announced dimension up front: `{dispatched: {dimension: {workspace, tier, evidence: cli|capture|manual, status}}, startedAt}`. Update it on every dispatch — it makes coverage verifiable and the run resumable. Resume by reusing the scope's existing `<workspace>/reports/.deep-review-*.ledger.json` and skipping entries already at `done`/`covered-capture`/`covered-manual`; never rerun completed work

### 2. Run once

> Goal: one deterministic full scan, sliced — never rerun the CLI per dimension

1. Manual pre-pass first: `git status`, spot-read the changed files, check report freshness. CLI/analyzer issues → record them in `update-review-cli/references/known-issues.md` before continuing
2. Prepare the analyzer in the reviewed project: the root `review/` CLI (`review/package.json`; or `/update-review-cli` to create it; the Rust `linter` CLI is a drop-in alternative). If neither is available → use whatever deterministic scan the project has (`/run-check`, linters) and say so in the report
3. Run ONE full scan → `<workspace>/reports/review-report.json`; store score/grade, dimension breakdown, and baseline delta. Note each dispatched row's `CLI domain` so later rounds rerun one slice (`--domain <quality|security|structure|config|deps>`) instead of rescanning. A row whose `CLI domain` is `—` has no slice and must use the `capture`/`manual` route
4. Validate the output schema before dispatch: keys, severity, evidence, and `fixSkill` present per finding; `falsePositiveRate`/`analyzerErrors` sane. Broken output goes to `/update-review-cli`, not around it
5. Use `/use-scripts` to slice the JSON into `<workspace>/reports/.deep-review-<time>/findings-<dimension>.json` — one dimension per file, deterministic, with no parsing in the parent context

### 3. Fan out

> Goal: one reviewer per dimension, max coverage, disjoint slices

1. Use `/use-subagents` — spawn one `domain-review` subagent per dispatched dimension (profile in `## Subagents`; its `Inputs`/`Output` are the contract, never restated here). The parent fills the remaining step 4 columns (`Risk`, `Priority`, `Status`, `analyzer-gap`) from `Severity`, the row's `Default severity` trigger, `Impact`, and `Authority`, and owns the analyzer-gap routing in item 6 below
2. Subagents read only their slice/row plus the files named in evidence — never rerun the CLI, never sweep the codebase
3. A dimension with ≤ 2 findings → the parent analyzes it itself. Independent dimensions → parallel batches ≤ 10 (`/follow-parallel`)
4. A dimension with no CLI slice (row `Evidence: capture|manual`) → dispatch it anyway: run the matrix `Tool/skill` first, then review that output as the slice, and mark it `covered-capture`/`covered-manual` in the ledger. A dimension may stay with the parent only under the ≤ 2-findings rule — never drop it silently
5. On timeout, crash, parse error, or a matrix tool unavailable on the platform → mark `failed` (`failed (tool-unavailable)`) in the ledger and carry the error into the report. Merge results and dedup by `file + rule + dimension`, keeping the highest severity with combined evidence
6. A row with `CLI domain: —` has no slice — that is a routing fact, not a gap: dispatch it by `capture`/`manual` (item 4). A durable analyzer gap is narrower: `Enforcement: cli-check` with no rule firing, or a rule that fires without landing in its `CLI domain` → hand off to `/update-review-cli`. An `Enforcement: none` row is measurement-only (`### 5` step 3) and is never handed off. A dimension with no reliable tool at all → note it as a matrix gap in the report

### 4. Report

> Goal: one table per dimension + a verifiable coverage matrix

1. Run `/report-review` — summary first (score/grade, findings by severity and dimension, mode + scope, and `must-fix-before-production` = every Critical/High finding in a row whose `Gate` is `pr` or `release`), then one findings table per dimension with the columns `/report-review` `## Execute` step 4 defines. This skill adds the `analyzer-gap` Y/N flag from step 3 item 6 and orders each table by `Impact` then `Severity`; `Owner skill` is the report's `fixSkill` — never remap it
2. Include `Coverage` built from the ledger: rows = workspace, columns = dimension, cell = done/`covered-capture`/`covered-manual`/skipped(reason)/failed — coverage is proven, not claimed
3. Interrupted midway → report the partial coverage matrix immediately; a partial report beats no report
4. Only on explicit user request → `/create-report-to-dot-agents` with title `deep-review-codebase-everything`
5. Before finishing, verify with `/deep-validate`: every row has real evidence and every ledger dimension appears

### 5. Persist

> Goal: findings become durable — the same finding must not survive the next run

1. Findings whose matrix `Enforcement` is `devin-rule` (natural-language conventions/agent guidance) → `/update-dot-agents-project` (author `.agents/rules/*.md` for the workspace type)
2. Findings whose `Enforcement` is `ast-grep` (imports, patterns, API misuse, naming) → `/update-astgrep-rules` (AST rules + `sgconfig.yml`)
3. Findings whose `Enforcement` is `cli-check` → `/update-review-cli` adds the analyzer check, with a rule-id prefix that lands the row in its `CLI domain`; analyzer bugs → `update-review-cli/references/known-issues.md`. `Enforcement: test` → `/update-tests` asserts the invariant. `Enforcement: none` → state in the report that the row is measurement-only and cannot be made durable
4. After persisting, re-run the analyzer on the original violation only (`--diff` or the single file named in the evidence — never a full rescan, per `## Rules`) to confirm the finding now fails loudly or is gone. A rule that does not fire on the original violation is not durable
5. A finding the user accepts instead of fixing (`Fix mode: decision`) is persisted as a linked issue via `/create-github-issue`, carrying the matrix row, the `Authority` it defers to, and an expiry date. Accepted without an issue and expiry is not accepted — it is an unreported gap (`Accepted-Finding Rate`, `references/review.md` `## Fix Metrics`)

### 6. Route

> Goal: every finding has an owner before anything is edited

1. Map each finding to its fix route in `references/review.md` `## Domain Map`: metric domains → `/optimize <scope>`; architecture → `/follow-architecture`/`/refactor`; the rest → `### Fix boilerplate` in that file
2. Order the fix sequence Foundation → Dependencies → High impact → Critical path → High risk, with a rough effort (not a flat TODO). Rank the tiers by the row's `Impact`; inside each tier group by `Fix mode` — `codemod` batches first, then `test-first`, then `agent`, with `decision` last because it needs the user. Step 7 then works the confirmed set severity-first inside each tier
3. Cross-reference the set for a shared root cause so one fix closes every finding it explains (an already-covered finding is merged, not re-fixed); many fixes across unrelated modules → plan them with `/create-plan-in-dot-agents` first
4. Without `then-fix` → stop here: report the sequence and close with `/suggest-next-action` (`/deep-review-codebase-everything <scope> then-fix` is the next action)

### 7. Fix

> Goal: the confirmed findings are fixed in context and verified — only runs with `then-fix`

1. Confirm the fix list with the user via `/ask-me` — per finding by default, `/follow-your-suggestion` to follow the report as-is, or `fix all` when the user says so. `dont-ask-me` mode skips the gate and follows the report as-is (it means `/follow-your-suggestion`, never a severity subset). A `decision` finding is confirmed as accept-with-issue or fix — never silently dropped
2. Apply each finding by its row's `Fix mode`: `codemod` → run the owning ast-grep/CLI rule rewrite, then re-run the rule; `test-first` → write the failing test first, then fix until it passes; `agent` → judgment edit + verification; `decision` → get the user/owner call, then fix or record it as accepted (step 5.5). Work one file or a small batch at a time — minimal, surgical, atomic, reviewable diffs with consistent style; preserve behavior except the intended change; no scope creep beyond the finding
3. Dispatch by domain per `references/review.md` `## Domain Map`. Findings in disjoint modules → parallel `fix-worker` subagents via `/use-subagents`; a complex issue or an error mid-fix → `/resolve-errors`
4. Verify each fix immediately (test/build/run for that ecosystem), then run the regression pass: `/run-check`, `/run-test`, `/deep-validate`; before/after evidence via `/report-before-after`
5. Re-review the fixed scope with `--diff` (never a full rescan) — loop ≤ 3 rounds until the confirmed findings are gone. Anything still failing → mark `failed` with the reason in the ledger, never leave a broken state
6. Score the pass via `references/review.md` `## Fix Metrics` (fix score = verified fixes / attempted fixes) and close with `/suggest-next-action`

## Subagents

> Independent work that can be spawned in parallel — profiles live in this section, no separate files needed

### domain-review — review only one matrix dimension of the scope and return findings with severity + evidence (use when dimensions are independent and can run in parallel; read-only)

- `Inputs`: `dimension` (the `references/review.md` `## Dimension Matrix` row — name, `Check`, `Default severity`, `Impact`, `Authority`), `scope` (workspace/path under review), `slice` (that dimension's findings JSON, or `none` for a `capture`/`manual` row), `tools` (optional — the row's `Tool/skill` when there is no slice)
- `Tools`: `read`, `grep`, `find_file_by_name` (slice + evidence files), `exec` (the row's `Tool/skill`, or its `capture` route, when the row has no CLI slice) — read-only commands only
- `Execute`:
  1. Read the row and its slice, then the files the evidence names — never rerun the analyzer, never sweep the codebase
  2. Confirm or reject each sliced finding against the row's `Check` statement — a finding the code does not prove is rejected with the reason
  3. `Evidence: capture|manual` row → run the row's `Tool/skill` first, then review its output as the slice
  4. Assign severity from the row's `Default severity` plus its upgrade/downgrade trigger only — never from intuition
  5. `Enforcement: cli-check` and no rule fires on a confirmed violation → flag it as an analyzer gap; `Enforcement: none` → mark the finding measurement-only
- `Output`: `| No. | Finding | Action | Evidence | Severity | Owner skill |` + a dimension summary (findings by severity, confirmed/rejected counts, analyzer-gap Y/N); `failed (reason)` on timeout, parse error, or tool unavailable
- `Constraints`: report-only — never edit code, rules, or config; one dimension per subagent, read only its own row/slice plus evidence-named files; never invent a finding outside the row's `Check`; a dimension it cannot finish is returned `skipped` with the reason, never dropped silently

### fix-worker — apply the fixes the user approved within a single module/domain, then verify and return changed files + results (use when findings span several modules that can be fixed in parallel without collision)

- `Inputs`: `findings` (the approved findings for this module/domain — finding id, severity, `file:line`, recommendation), `scope` (the single module/domain it owns, e.g. `src/auth/`, `domain=security`, `package=ui`), `fix-guides` (optional — the matching `references/review.md` `## Domain Map` route or a domain workflow `SKILL.md`), `verify-commands` (optional — e.g. `bun run typecheck`, `bun run test`)
- `Tools`: `read`, `grep`, `find_file_by_name` (read fix guides and the source to be fixed), `edit`/`write` (apply only the approved fixes), `exec` (run lint, typecheck, tests after each fix)
- `Execute`:
  1. Read the fix route for the matching domain (per `references/review.md` `## Domain Map`); if none exists, fix directly per the finding's recommendation
  2. Rank findings by severity — `critical` first, then fix one at a time
  3. Each fix must preserve the original behavior — minimal diff, no refactoring beyond the finding
  4. Verify immediately after each fix with `verify-commands` or the checks the scope supports
  5. If a fix breaks a check → revert that fix and mark it `failed` with the reason, then continue
- `Output`: table `| No. | Finding | Status | Changed Files | Verify Result |` — `status`: `fixed`/`failed`/`skipped` (out of scope or missing approval); close with a summary of total fixed/failed/skipped, all changed files, and aggregate verify (`pass`/`fail`); if aggregate verify fails → list the reverted fixes and residual risk
- `Constraints`: fix only the findings in the `findings` list within the assigned `scope` — never touch another module's findings; never apply unapproved fixes — if unclear, mark `skipped` with a reason; every fix must pass its own verify — on failure revert immediately, never leave a broken state; never touch files outside `scope` unless a finding requires it (e.g. a shared import) — must be noted in the output; never commit — the worker returns changed files and the parent's caller (`/deep-review-codebase-everything` itself, or `/ship`) owns committing

## Rules

- Report-only unless `then-fix` is given — steps 1–6 never edit code, business logic, or config; with `then-fix`, step 7 fixes only confirmed findings
- Never edit without the step 7 confirm gate (except `dont-ask-me`/`/ship`, where the report is followed as-is); incremental fixes — one file or a small batch, verified before the next
- Evidence first — every finding cites `file:line` or report evidence, and every fix has a reason from the review; spot-check ≥ 1 item per dimension against real files; no severity from intuition
- One scan per run — subagents share slices; re-review after fixes uses `--diff`, never a full rescan
- Use `/use-subagents` when dimensions are independent — one reviewer per dimension, dispatched in parallel; a dimension with ≤ 2 findings stays with the parent and is never silently dropped
- Budget and ledger are hard contracts — over budget marks `skipped (budget)`; a dropped dimension in the ledger is a reporting bug; every dimension announced in `Think` step 2 must appear in the ledger
- Severity cites the matrix `Default severity` plus the upgrade/downgrade trigger in the same cell (`references/review.md` `### Matrix Notes`); moving off the default without the trigger is not evidence; `Risk`/`Priority` follow the row's `Impact` (higher impact never ranks below lower impact at the same severity)
- Fix mode is a contract — `codemod` findings are fixed by the owning rule and re-run, `test-first` findings ship the failing test in the same change, `agent` findings get a judgment edit + verify, `decision` findings need a user/owner call before any edit (accept = issue + expiry, never a silent drop); `scripts/verify-matrix.ts` proves a `codemod` row always has a mechanical `Enforcement`
- Matrix invariants are a contract — `references/review.md` `## Dimension Matrix` holds exactly one row per dimension; a duplicate name or a cell outside its vocabulary is a reporting bug to fix before the run continues
- The preset map is ownership — `references/presets.md` (`## Preset Map`) is the only list of preset doors (this engine plus the `review-*` doors); a preset seeds its labels through this pipeline, never its own scan or check. A preset needs at least two matrix rows and a fix route it owns — a single-row rename stays a `<label>` call
- `bun scripts/verify-matrix.ts` proves the invariants before any run (`Evidence`/`Enforcement` vs `CLI domain`, `Impact`/`Cost`/`Fix mode` vocabularies, `Cost: high` never on a `pr` gate, non-empty `Check`/`Default severity`/`N/A condition`/`Authority`, alias collisions, `Fix owner` reachability, label resolution, preset skill/door/label/route integrity)
- The matrix is candidate data only — it never replaces `/deep-thinking`, never freezes into a mandatory catalog, and stale pins are fixed via `/deep-research` then `references/review.md`
- Fix routing follows the `references/review.md` `## Domain Map` lookup order: domain row → the matrix `Fix owner` → `/ask-me` only when none matches (report it as a matrix gap); a `review-<label>` label resolves through the matrix `Aliases` column, never by fuzzy name (`scripts/verify-matrix.ts` proves every scope-map label resolves to a row)
- Never judge a dimension absent because "there probably isn't a problem" — skip only for the row's `N/A condition`, with that condition quoted as the ledger reason
- Loop limit — ≤ 3 rounds of CLI repair via `/update-review-cli`; per-dimension subagents retry once; `score < 70` after 3 rounds → stop and report
- Write ledger/slice files only under the reviewed workspace's `reports/`

## Expected Outcome

- One full scan sliced per applicable dimension, reviewed at max coverage under budget — proven by the `Coverage` matrix built from the ledger
- Chat report via `/report-review`: per-dimension tables + summary + prioritized fix sequence, no files unless asked
- Findings persisted per the matrix `Enforcement` (`.agents/rules/*.md`, ast-grep rules, analyzer checks, or a test) with analyzer gaps reported, so they cannot silently recur — measurement-only rows are named as such
- Findings the user accepted instead of fixed carry a linked issue + expiry, so an accepted risk stays visible instead of becoming an unreported gap
- With `then-fix`: confirmed findings fixed per `references/review.md` `## Domain Map`, each verified, re-reviewed with `--diff` until clean or `blocked` with reasons — and a fix score
- Without `then-fix`: nothing edited; every finding handed to its owner skill in the suggested sequence
- Interrupted runs resume from the ledger without rerunning completed work
- Preset runs are the same pipeline with a narrower seed — every `review-*` door names its labels and fix route in `references/presets.md`, and the full sweep stays the default
