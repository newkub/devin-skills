---
name: update-review-cli
description: Create/update the review CLI and its analyzers — the deterministic analyzer behind every review
argument-hint: "[target-or-iteration]"
related:
  - run-review
  - deep-review
  - report-review
  - update-create-analyze-cli
  - check-should-update
  - scan-codebase
  - new-skills
  - resolve-errors
  - run-verify
  - follow-tasks
  - run-test
  - use-astgrep-programmatic
  - update-project
  - suggest-next-action
---

## Goal

Canonical engine: the root `review/` CLI — Bun + TypeScript, Clean Architecture, deterministic checks that produce `<workspace>/reports/review-report.json` in the original schema. Projects that already ship the Rust `linter` (`D:\newkub\wpackages\rust-packages\packages\tools\linter`) keep it as a drop-in alternative; YAML rule packs (`rules/<lang|frameworks|deps>/`) extend either engine

Create or update that CLI at the project root — `review/` covering 60+ categories across 5 domains, plus the analyzers and rule packs it runs — so `/run-review` and every `/deep-review` dimension get evidence-backed findings instead of guesses. It is a CLI, not a library: `review/package.json` declares a `bin` entry, so the project runs `bun run review` / `bun run review:json` or the linked `review` binary

## Scope

Use when a review dimension has no analyzer, a rule fires wrong, or `/run-review` reports a metric trigger — this skill owns the update path only (`### 1`-`### 8`) and never runs the review pipeline itself

- `/run-review` runs this CLI end to end, analyzes the metrics, and reports; a metric trigger from that run comes back here as the next update round
- `/deep-review` slices the same `review-report.json` per dimension and consumes `references/known-issues.md` — never duplicate analyzer logic in a review skill
- `/update-project` calls this skill so every project updated through it gets a current review CLI
- all review criteria are inlined here — the only external file is the living-data `references/known-issues.md` (single source of truth for analyzer/CLI issues, shared with `/deep-review`)
- every scope-map dimension label resolvable through the `Aliases` column of `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`) must have a mapping in `reviewWorkflow`; a missing analyzer is recorded here, not invented in the review pass

## Execute

> Pre-Run: Always run `/deep-review` first — `update-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running

### 1. Prepare And Keep Up With Codebase

> Goal: Update rules, skills, and CLI to be current before the update work

1. Run `/scan-codebase` in `review/` if it exists
2. Run `/new-skills` to create skills missing from dependencies and features
3. Run `/update-create-analyze-cli` to update `tools/analyze` to cover current features
4. Run `/check-should-update` specifying target paths: `review/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
5. If the result is `skip` → go to Step 7
6. If the result is `update` or `create` → proceed with the next steps
7. Read `AGENTS.md`, `rules/`, `review/README.md` if present
8. If `review/package.json` exists → do a pre-review per `## Pre-Review Criteria`, checking Clean Architecture, analyzers, CLI interface, package scripts, analyze integration, line count, and evidence
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

### 5. Create Or Update The Root CLI Package

> Goal: Have a ready-to-use root `review/` CLI

1. Create `review/` at the project root if it doesn't exist yet — never under `tools/`
2. Write `review/package.json`: name `review-cli`, `"bin": { "review": "src/presentation/cli.ts" }`, scripts `review` (table), `review:json`, `lint`, `typecheck`
3. Write `tsconfig.json`, `biome.jsonc`, `README.md`; the CLI entry starts with `#!/usr/bin/env bun`
4. Add `review` to the root `package.json` workspaces if missing (package name `review-cli`) and root scripts `review` / `review:json` as `bun --filter review-cli review[:json]` — the CLI stays runnable as a bin after `bun link`
5. Use `bun install` to update `bun.lock`

### 6. Setup Architecture And Integrate Analyzers

> Goal: Clean Architecture with analyzers from `tools-analyze` without duplicate logic

1. Create `src/adapters/file-utils.ts` (`walk`, `readText`, `getRel`), `src/adapters/git-grep.ts` (`gitGrep`, `gitGrepCount`), `src/domain/models.ts` (`CategoryFinding`, `CategoryResult`, `ReviewReport`), `src/application/review.ts` (import `runAllAnalyzers` from `tools-analyze`), `src/presentation/cli.ts` (entry point), `src/index.ts` (export `runReview`/`createReviewPorts`)
2. Convert each analyzer's `CategoryResult` into a `ReviewReport` with score, grade, domain breakdown
3. Define the `reviewWorkflow` map to review dimensions — must cover every scope-map dimension label resolvable through the `Aliases` column of `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`) (except `review-github-pr`, which is PR-scoped)
4. Any metric or review domain still without an analyzer → record it as an analyzer gap (name + review skill + missing metric) in `references/known-issues.md` and report it
5. If an analyzer isn't fully implemented, add a `// TODO` comment with details
6. If an AST-based analyzer is needed (structural patterns regex/git-grep can't do, e.g. function metrics, SRP counts, custom lint rules) → run `/use-astgrep-programmatic` to integrate `@ast-grep/napi` or `ast-grep scan --json` into `tools/analyze`/`review` — findings must have file:line + rule id per `## Rules → 4. Evidence-Based`

### 7. Validate The Updated CLI

> Goal: Verify that the CLI runs before handing it to the run path

1. Check that `review/package.json` and `review/src/presentation/cli.ts` exist — missing → return to Steps 5-6
2. Run `bun --filter review-cli lint`
3. Run `bun --filter review-cli typecheck`
4. Run `bun run review --help`
5. Run `bun run review`
6. Run `bun run review:json` then inspect `<workspace>/reports/review-report.json`
7. If it fails → run `/resolve-errors` then retry (max 3)

### 8. Verify And Hand Off

> Goal: Prove the update is sound, then hand the CLI to the run path

1. Run `/run-verify` to verify build, lint, typecheck
2. If verify fails → run `/resolve-errors` then return to Step 7
3. Run `/follow-tasks` to record the remaining analyzer gaps as tracked items
4. Hand off: `/run-review` runs the scan and reports; `/deep-review` slices the same report per dimension
5. Run `/suggest-next-action`

## CLI Output

`review` table output must show every detail per category — never a lone score or one line per category

- Findings table (per category): `No.` (always first, 1..n) | `Domain` | `Category` | `Score` | `Grade` | `C`/`H`/`M`/`L` finding counts by severity | `Status` = `new`/`existing`/`regression`/`fixed` vs the previous `reports/review-report.json` | `Top Finding` | `Evidence` = `file:line` of the top finding — every row must have it, never a row without | `Fix Skill` = from the `reviewWorkflow` map (`/deep-review` dimension `<label>`; `/deep-review then-fix` when a fix must be applied) | `Delta` = score diff vs the previous report when a baseline exists — sort Critical first, then lowest score first
- Domain summary table (at the end): `No.`, `Domain`, `Score`, `Grade`, `Categories`, `Findings`, `Errors`, `FP%`, `Trend` (up/down/flat vs the previous run); footer row: overall score + grade, `categories N/60`, total analyzer errors, duration
- non-TTY/CI → auto plain table, or use `--json`; narrow screen → drop `Top Finding` first, never `Evidence`/`Fix Skill`
- Exit code: `exit 1` when any Metric Trigger fires (`categories < 60`, `score < 70`/`grade D/F`, `domain < 50`, `analyzerErrors > 0`, `falsePositiveRate > 20%`) — CI gate + pass/fail auto-detect in `/run-review`
- Filter flags: `--domain <name>` and `--severity <min>` to rerun only the failing parts in rounds 2-3 of `/run-review` — no full scan every round

## Pre-Review Criteria

> Step 1.8 pre-review of `review/` before the update — review-only (no CLI edits during the pre-review; fixes go through this skill after); every finding needs evidence: file path + line number + code snippet

| Dimension | Checks | Severity flags |
|-----------|--------|----------------|
| Clean Architecture | 4 layers: `src/domain/` (logic, analyzers, types), `src/application/` (use cases, orchestration), `src/adapters/` (shared utilities, external integrations), `src/presentation/` (CLI entry, user-facing output); entry points `src/presentation/cli.ts` + `src/index.ts` (barrel export for workspace imports); `kebab-case` file names (`user-facing.ts` not `UserFacing.ts`/`user_facing.ts`); Bun native APIs (`Bun.file`, `Bun.spawn`, `Bun.write`) instead of Node `fs.readFile`/`child_process`/`fs.writeFile`; dependency direction `presentation → application → domain`, `adapters → domain` — `domain` imports no other layer | missing entry point = Critical; missing layer / wrong dependency direction = High; Node APIs instead of Bun = Medium; not kebab-case = Low |
| Analyzers | 5 files in `src/domain/analyzers/`: `user-facing.ts` (UX, a11y, UI), `security.ts` (vulnerabilities, auth, input validation), `backend-data.ts` (data layer, API, database), `infrastructure.ts` (deployment, CI/CD, config), `code-arch.ts` (code quality, architecture, patterns); each returns `CategoryResult` (`status` pass/fail/warn, `score` 0-100, `findings[]`); every analyzer has a `reviewWorkflow` map (category → `/deep-review`/references + action on finding); shared utilities from `src/adapters/` — no duplicated helper code between analyzers; coverage: 60+ categories (full list via `/run-review`) across the 5 domains | missing analyzer file / domain / `CategoryResult` contract = High; missing `reviewWorkflow`, duplicated utilities, incomplete category coverage = Medium |
| CLI Interface | binary `review` (bin entry, `#!/usr/bin/env bun`); `--help`/`-h` shows usage, all flags with descriptions, exit codes, examples; exit codes: `0` success/review completed, `1` invalid arguments or error; `--json` (alias `--format table|JSON`) for programmatic consumption; `--output <path>` optional; invalid-argument errors name the bad flag, suggest correct usage, exit 1 | missing `--help` / wrong exit codes = High; missing format option, unclear errors = Medium |
| Analyze Integration | `tools-analyze` in `review/package.json` `dependencies` with the `workspace:*` protocol; analyzers imported from `tools-analyze` (barrel export or direct path), never copied code; no duplicated analyzer logic in `src/domain/analyzers/`, `src/adapters/`, `src/health/`; imports resolve cleanly via `bun run`/typecheck — no broken modules | no workspace import / broken imports = High; duplicated logic = Medium |
| Package Scripts | `review/package.json` has `review` (table, e.g. `bun run src/presentation/cli.ts`) + `review:json` (e.g. `bun run src/presentation/cli.ts --json`); root `package.json` has the same names as `bun --filter review-cli review[:json]`; names consistent across both, filter uses the correct workspace name, no script points to a wrong path; both scripts actually execute — verify exit code and output format | script doesn't run = High; missing script = Medium; naming inconsistency = Low |
| Line Count | every file ≤250 lines; findings carry evidence (file path, line, snippet) | line count exceeded = Low |
| Scoring | review score = weighted average of all findings using the weights/grades of `/report-review` step 3 (SSOT — a local variant is a finding; 0 = every finding Critical, 100 = no findings); report overall + per-domain score and a health indicator (score + grade + severity distribution) via `/report-review` (Category, Severity, Finding, Evidence, Action); before/after: record the before score → update per findings → re-run `bun run review` → compare the delta; score < 70 → recommend `/deep-review` + `/suggest-next-action` before proceeding | pre-review score < 70 → Steps 2-6 before Step 7 |
| Round Metrics | record after each update round to compare before/after and decide CLI improvements: Review Coverage Ratio (scanned/total files), False Positive Rate, Evidence Strength Score, Actionability Score, Category Coverage (executed/total), Sub-Review Completion, Analyzer Pass Rate, Critical Path Coverage, Deduplication Rate, Before/After Trend | — |

## Rules

### 1. CLI-Driven

- Use the root `review/` CLI as the primary source of findings
- Don't manually read references one dimension at a time
- If metrics indicate a CLI update → do Steps 4-7 before continuing

### 2. Metric Triggers

- `categories < 60` → add analyzers
- `score < 70` or `grade D/F` → improve analyzers
- `domain score < 50` → improve that domain
- `analyzerErrors > 0` → fix analyzer errors
- `falsePositiveRate > 20%` → tune rules

### 3. No Duplicate Logic

- Don't duplicate analyzer logic between `tools/analyze` and `review/`
- Use `runAllAnalyzers` from `tools/analyze` in `review/`

### 4. Evidence-Based

- Every finding must have evidence (file path, line number, code snippet)
- Don't guess; use tools for verification
- Order issues by severity: Critical → High → Medium → Low

### 4b. Review Coverage

- The `reviewWorkflow` map must cover every scope-map dimension label resolvable through the `Aliases` column of `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`) (except `review-github-pr`)
- Every metric that `deep-review`/`/run-review` marks as `in update-review-cli = N` → add an analyzer or record the gap with a reason in `references/known-issues.md`
- `/deep-review` dispatches one dimension at a time (per-artifact, tiered — labels resolved through the matrix `Aliases` column to their rows) — the CLI must output findings that map back to those dimensions

### 5. Report Location

- The report must be written only into the reviewed workspace, e.g. `<workspace>/reports/review-report.json`
- Never create or write to a root-level `reports/` directory
- If reviewing multiple workspaces → each workspace has its own report

### 6. Update Independence

- Do only the CLI and analyzer update; never modify business logic
- Keep the update path separate from the run path — running, analyzing, and reporting belong to `/run-review`
- Use `/run-review` for the full quality gate and `/deep-review` to review a scope across dimensions

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

- The root `review/` CLI (or linter rule pack) exists, validates, and runs at the project root
- Findings cover 60+ categories with evidence and severity
- `reviewWorkflow` covers every scope-map dimension label resolvable through the `Aliases` column of `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`) — analyzer gaps are recorded in `references/known-issues.md`
- Analyzer and rule changes are handed to `/run-review` for the before/after measurement
- No analyzer errors; every change cites the rule id or analyzer file it lands in

## Known Issues

Known Issues (issue + evidence + status for all entries) are in [references/known-issues.md](references/known-issues.md) — single source of truth
