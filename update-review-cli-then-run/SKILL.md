---
name: update-review-cli-then-run
description: Create/update the tools/review-codebase CLI, then run review until metrics pass or 3 rounds complete
argument-hint: "[target-or-iteration]"
related:
  - run-review
  - deep-review-codebase
  - update-create-analyze-cli
  - check-should-update
  - scan-codebase
  - new-skills
  - resolve-errors
  - run-verify
  - follow-tasks
  - report
  - run-test
  - use-astgrep-programmatic
  - suggest-next-action
---

## Goal

Canonical engine: linter CLI (Rust, `D:\newkub\wpackages\rust-packages\packages\tools\linter`) — deterministic checks produce `review-report.json` with the original schema; this skill extends it by adding YAML rule packs (`rules/<lang|frameworks|deps>/`) or analyzer modules instead of editing the old TS CLI

Create or update the `tools/review-codebase` CLI to cover current features, then run review to measure metrics across all dimensions until it passes or 3 rounds complete — consolidates the `run-review` workflow (run → analyze → fix CLI → rerun → verify → suggest) into a single skill

## Scope

Use with a monorepo that has or is building a `tools/review-codebase` CLI at the project root covering 60+ categories across 5 domains — covers both the update path (Steps 1-6) and the run path (Steps 7-10); `/run-review` is an alias of this skill; all review criteria are inlined here — the only external file is the living-data `references/known-issues.md` (single source of truth for analyzer/CLI issues, shared with `/deep-review-codebase`)

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running

### 1. Prepare And Keep Up With Codebase

> Goal: Update rules, skills, and CLI to be current before running review

1. Run `/scan-codebase` in `tools/review-codebase/` if it exists
2. Run `/new-skills` to create skills missing from dependencies and features
3. Run `/update-create-analyze-cli` to update `tools/analyze` to cover current features
4. Run `/check-should-update` specifying target paths: `tools/review-codebase/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
5. If the result is `skip` → go to Step 7
6. If the result is `update` or `create` → proceed with the next steps
7. Read `AGENTS.md`, `rules/`, `tools/review-codebase/README.md` if present
8. If `tools/review-codebase` exists → do a pre-review per `## Pre-Review Criteria`, checking Clean Architecture, analyzers, CLI interface, package scripts, analyze integration, line count, and evidence
9. If pre-review score < 70 → do Steps 2-6 before Step 7

### 2. Scan Codebase Features

> Goal: Understand the features present in the codebase

1. Run `/scan-codebase` to see structure, tech stack, packages
2. Run `/deep-analyze` to see the main features
3. Read `AGENTS.md` and `docs/project/features.md` if present
4. Identify new features not yet covered by an analyzer

### 3. Update Project Rules

> Goal: Ensure skills/rules cover dependencies and features

1. Run `/new-skills` to create skills missing from dependencies
2. Check `AGENTS.md` and `rules/`, update per new features
3. If a skill or rule is missing → create or update it

### 4. Update Analyze CLI

> Goal: Add/update analyzers per new features

1. Run `/update-create-analyze-cli` to update `tools/analyze`
2. Check that categories cover all features
3. If categories are fewer than 60 or a new feature has no analyzer → add an analyzer

### 5. Create Or Update Workspace Package

> Goal: Have a ready-to-use `tools-review-codebase` workspace

1. Create `tools/review-codebase/` if it doesn't exist yet
2. Write `package.json` defining name and scripts `review-codebase`, `review-codebase:json`, `lint`, `typecheck`
3. Write `tsconfig.json`, `biome.jsonc`, `README.md`
4. Add `tools-review-codebase` to the root `package.json` workspaces if missing
5. Use `bun install` to update `bun.lock`

### 6. Setup Architecture And Integrate Analyzers

> Goal: Clean Architecture with analyzers from `tools-analyze` without duplicate logic

1. Create `src/adapters/file-utils.ts` (`walk`, `readText`, `getRel`), `src/adapters/git-grep.ts` (`gitGrep`, `gitGrepCount`), `src/domain/models.ts` (`CategoryFinding`, `CategoryResult`, `ReviewReport`), `src/application/review.ts` (import `runAllAnalyzers` from `tools-analyze`), `src/presentation/cli.ts` (entry point), `src/index.ts` (export `runReview`/`createReviewPorts`)
2. Convert each analyzer's `CategoryResult` into a `ReviewReport` with score, grade, domain breakdown
3. Define the `reviewWorkflow` map to review skills — must cover every `review-*` in `deep-review-codebase/SKILL.md` (54, except `review-github-pr` which is PR-scoped)
4. Any metric or review domain still without an analyzer → record it as an analyzer gap (name + review skill + missing metric) in `references/known-issues.md` and report it
5. If an analyzer isn't fully implemented, add a `// TODO` comment with details
6. If an AST-based analyzer is needed (structural patterns regex/git-grep can't do, e.g. function metrics, SRP counts, custom lint rules) → run `/use-astgrep-programmatic` to integrate `@ast-grep/napi` or `ast-grep scan --json` into `tools/analyze`/`tools/review-codebase` — findings must have file:line + rule id per ### 4. Evidence-Based

### 7. Validate CLI

> Goal: Verify that the CLI runs

1. Check that `tools/review-codebase/package.json` and `src/presentation/cli.ts` exist — missing → return to Steps 5-6
2. Run `bun --filter tools-review-codebase lint`
3. Run `bun --filter tools-review-codebase typecheck`
4. Run `bun --filter tools-review-codebase review-codebase --help`
5. Run `bun --filter tools-review-codebase review-codebase`
6. Run `bun --filter tools-review-codebase review-codebase:json` then inspect `<workspace>/reports/review-report.json`
7. If it fails → run `/resolve-errors` then retry (max 3)

### 8. Run Review And Analyze

> Goal: Run the review CLI and analyze results to decide updates per metrics

1. Run `bun --filter tools-review-codebase review-codebase` for table output
2. Run `bun --filter tools-review-codebase review-codebase:json` to write `reports/review-report.json` inside the reviewed workspace (e.g. `apps/website/reports/review-report.json`) — never write to the root `reports/`
3. stdout mode: `bun --filter tools-review-codebase review-codebase:json -- --out-file -`; custom path: `--out-file <path>`
4. Record score, grade, domain breakdown, category coverage, findings count, analyzerErrors, falsePositiveRate
5. Identify Critical/High findings → group per the `reviewWorkflow` map to the suitable `/review-*` (coverage complete per `deep-review-codebase/SKILL.md`)
6. Any metric/finding with no analyzer coverage → mark `in update-review-cli-then-run = N` as an analyzer gap
7. If the result matches any Metric Trigger → run `/update-create-analyze-cli`, then do Steps 4-7 and re-run Step 8 (max 3 rounds):
   - `categories` fewer than 60
   - overall `score` below 70 or `grade` is `D`/`F`
   - any domain `score` below 50
   - `analyzerErrors` > 0 → run `/resolve-errors` first
   - `falsePositiveRate` above 20%
   - many findings lack `evidence` or `severity` is unclear
   - `reviewWorkflow` doesn't map to existing review skills or doesn't cover `deep-review-codebase/SKILL.md` fully
   - there is an analyzer gap — a review domain/metric the CLI doesn't cover
8. If after 3 rounds it still doesn't pass → stop and report

### 9. Verify And Follow Tasks

> Goal: Confirm the project passes verify, then track the next action

1. Run `/run-verify` to verify build, lint, typecheck
2. Run `/follow-tasks` to get action items and track progress
3. If verify fails → run `/resolve-errors` then go back to Step 8 again

### 10. Report And Suggest Actions

> Goal: Summarize the review results and recommend next actions per findings

1. Show the table output from Step 8 (re-run only when a refresh is needed — a full scan is expensive)
2. Use `/report-review` to show a summary in chat (no files): domain scores, findings (Category, Finding, Severity, Location, Recommendation), recommended workflows
3. Recommend `/review-*` workflows for each finding per the `reviewWorkflow` field — dispatch catalog: `deep-review-codebase/SKILL.md`
4. Run `/suggest-next-action`

## CLI Output

`review-codebase` table output must show every detail per category — never a lone score or one line per category

- Findings table (per category): `No.` (always first, 1..n) | `Domain` | `Category` | `Score` | `Grade` | `C`/`H`/`M`/`L` finding counts by severity | `Status` = `new`/`existing`/`regression`/`fixed` vs the previous `reports/review-report.json` (feeds the 3 rounds of Step 8) | `Top Finding` | `Evidence` = `file:line` of the top finding — every row must have it, never a row without | `Fix Skill` = from the `reviewWorkflow` map (`/deep-review-codebase` domain `review-<domain>`; `/deep-review-codebase-then-fix` when a fix must be applied) | `Delta` = score diff vs the previous report when a baseline exists — sort Critical first, then lowest score first
- Domain summary table (at the end): `No.`, `Domain`, `Score`, `Grade`, `Categories`, `Findings`, `Errors`, `FP%`, `Trend` (up/down/flat vs the previous run); footer row: overall score + grade, `categories N/60`, total analyzer errors, duration
- non-TTY/CI → auto plain table, or use `--json`; narrow screen → drop `Top Finding` first, never `Evidence`/`Fix Skill`
- Exit code: `exit 1` when any Metric Trigger fires (`categories < 60`, `score < 70`/`grade D/F`, `domain < 50`, `analyzerErrors > 0`, `falsePositiveRate > 20%`) — CI gate + pass/fail auto-detect in Step 8
- Filter flags: `--domain <name>` and `--severity <min>` to rerun only the failing parts in rounds 2-3 of Step 8 — no full scan every round

## Pre-Review Criteria

> Step 1.8 pre-review of `tools/review-codebase` before `/deep-review-codebase` — review-only (no CLI edits during the review; fixes go through `/deep-review-codebase` after); every finding needs evidence: file path + line number + code snippet

| Dimension | Checks | Severity flags |
|-----------|--------|----------------|
| Clean Architecture | 4 layers: `src/domain/` (logic, analyzers, types), `src/application/` (use cases, orchestration), `src/adapters/` (shared utilities, external integrations), `src/presentation/` (CLI entry, user-facing output); entry points `src/presentation/cli.ts` + `src/index.ts` (barrel export for workspace imports); `kebab-case` file names (`user-facing.ts` not `UserFacing.ts`/`user_facing.ts`); Bun native APIs (`Bun.file`, `Bun.spawn`, `Bun.write`) instead of Node `fs.readFile`/`child_process`/`fs.writeFile`; dependency direction `presentation → application → domain`, `adapters → domain` — `domain` imports no other layer | missing entry point = Critical; missing layer / wrong dependency direction = High; Node APIs instead of Bun = Medium; not kebab-case = Low |
| Analyzers | 5 files in `src/domain/analyzers/`: `user-facing.ts` (UX, a11y, UI), `security.ts` (vulnerabilities, auth, input validation), `backend-data.ts` (data layer, API, database), `infrastructure.ts` (deployment, CI/CD, config), `code-arch.ts` (code quality, architecture, patterns); each returns `CategoryResult` (`status` pass/fail/warn, `score` 0-100, `findings[]`); every analyzer has a `reviewWorkflow` map (category → `/deep-review-codebase`/references + action on finding); shared utilities from `src/adapters/` — no duplicated helper code between analyzers; coverage: 60+ categories (full list via `/run-review`) across the 5 domains | missing analyzer file / domain / `CategoryResult` contract = High; missing `reviewWorkflow`, duplicated utilities, incomplete category coverage = Medium |
| CLI Interface | `--help`/`-h` shows usage, all flags with descriptions, exit codes, examples; exit codes: `0` success/review completed, `1` invalid arguments or error; `--format table|JSON` (table default, JSON for programmatic consumption); `--output <path>` optional; invalid-argument errors name the bad flag, suggest correct usage, exit 1 | missing `--help` / wrong exit codes = High; missing format option, unclear errors = Medium |
| Analyze Integration | `tools-analyze` in `tools/review-codebase/package.json` `dependencies` with the `workspace:*` protocol; analyzers imported from `tools-analyze` (barrel export or direct path), never copied code; no duplicated analyzer logic in `src/domain/analyzers/`, `src/adapters/`, `src/health/`; imports resolve cleanly via `bun run`/typecheck — no broken modules | no workspace import / broken imports = High; duplicated logic = Medium |
| Package Scripts | `tools/review-codebase/package.json` has `review-codebase` (table, e.g. `bun run src/index.ts`) + `review-codebase:json` (e.g. `bun run src/index.ts --format JSON`); root `package.json` has the same names as `bun --filter tools-review-codebase review-codebase[:json]`; names consistent across both, filter uses the correct workspace name, no script points to a wrong path; both scripts actually execute — verify exit code and output format | script doesn't run = High; missing script = Medium; naming inconsistency = Low |
| Line Count | every file ≤250 lines; findings carry evidence (file path, line, snippet) | line count exceeded = Low |
| Scoring | review score = weighted average of all findings (severity weights Critical 0, High 25, Medium 50, Low 75, Info 100; 0 = every finding Critical, 100 = no findings); grade A ≥90, B ≥80, C ≥70, D ≥60, F <60; report overall + per-domain score and a health indicator (score + grade + severity distribution) via `/report table` (Category, Severity, Finding, Evidence, Action); before/after: record the before score → improve per findings → re-run `bun run review-codebase` → compare the delta; score < 70 → recommend `/deep-review-codebase` + `/suggest-next-action` before proceeding | pre-review score < 70 → Steps 2-6 before Step 7 |
| Round Metrics | record after each review round to compare before/after and decide CLI improvements: Review Coverage Ratio (scanned/total files), False Positive Rate, Evidence Strength Score, Actionability Score, Category Coverage (executed/total), Sub-Review Completion, Analyzer Pass Rate, Critical Path Coverage, Deduplication Rate, Before/After Trend | — |

## Rules

### 1. CLI-Driven

- Use the `tools/review-codebase` CLI as the primary source of findings
- Don't manually read references one dimension at a time
- If metrics indicate a CLI update → do Steps 4-7 before continuing the review

### 2. Metric Triggers

- `categories < 60` → add analyzers
- `score < 70` or `grade D/F` → improve analyzers
- `domain score < 50` → improve that domain
- `analyzerErrors > 0` → fix analyzer errors
- `falsePositiveRate > 20%` → tune rules

### 3. No Duplicate Logic

- Don't duplicate analyzer logic between `tools/analyze` and `tools/review-codebase`
- Use `runAllAnalyzers` from `tools/analyze` in `tools/review-codebase`

### 4. Evidence-Based

- Every finding must have evidence (file path, line number, code snippet)
- Don't guess; use tools for verification
- Order issues by severity: Critical → High → Medium → Low

### 4b. Review Coverage

- The `reviewWorkflow` map must cover every `review-*` in `deep-review-codebase/SKILL.md` except `review-github-pr`
- Every metric that `deep-review-codebase`/this skill marks as `in update-review-cli-then-run = N` → add an analyzer or record the gap with a reason in `references/known-issues.md`
- deep-review-codebase dispatches `review-*` workspace by workspace per phase (entry → source → cross-cutting → meta) — the CLI must output findings that map back to those review skills

### 5. Report Location

- The report must be written only into the reviewed workspace, e.g. `<workspace>/reports/review-report.json`
- Never create or write to a root-level `reports/` directory
- If reviewing multiple workspaces → each workspace has its own report

### 6. Review Independence

- Do only the review/deep-review-codebase-then-fix CLI; never modify business logic
- Keep the review process separate from the fix process
- Use `/deep-review-codebase` or this skill (run path) for a comprehensive quality gate

### 7. Output Interpretation

- Review score: A (90+), B (80+), C (70+), D (60+), F (<60)
- Status: pass, warn, fail; severity order: Critical > High > Medium > Low
- Order action items by severity — Critical first always
- CLI error/package missing/crash → do Steps 4-7 of this skill; analyzer gives wrong results → run `/update-create-analyze-cli` first

### 8. Formatting

- Never use `**` (bold markers)
- Use heading levels for structure
- Report as tables via `/report-review` (chat, no files)
- Use `/deep-test` cli if needed, `/run-test` if needed

## Expected Outcome

- The `tools/review-codebase` CLI exists and runs at the project root
- Review works via `bun run review-codebase`
- Findings cover 60+ categories with evidence and severity
- `reviewWorkflow` covers every `review-*` in `deep-review-codebase/SKILL.md` — analyzer gaps are recorded in `references/known-issues.md`
- Before-after review score is shown via table output
- No analyzer errors
- Summary table with top findings + recommended `/review-*` workflows per issue

## Known Issues

Known Issues (issue + evidence + status for all entries) are in [references/known-issues.md](references/known-issues.md) — single source of truth
