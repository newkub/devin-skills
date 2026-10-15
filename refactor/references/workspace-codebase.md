# Refactor — Workspace And Codebase Scope

Detail for `/refactor` `### 3. Workspace And Codebase Refactor` — order one workspace, every workspace in a monorepo, or a whole codebase with baseline → incremental batches → verify; split/merge/relocate workspace members and recommend members from the monorepo

> Pre-Run: never start without a recorded baseline (file count, metrics, test/lint/typecheck status) and a plan from `/create-plan-in-dot-devin` — bulk work without a baseline cannot be proven safe

## 1. One Workspace (Every File)

> Goal: refactor all source files of one workspace, foundation first

1. Run `/deep-analyze` → list source files (respect `.gitignore`, skip generated/lock/binary/snapshots) → order foundation first (config, types, utilities) → dependents last
2. Baseline with `/check-long-files` + `/check-code-structure` (`sg outline`) + `/deep-review`; record file count, metrics, test status for the after-comparison
3. Refactor one file at a time per `/refactor` `### 2. File And SRP Refactor` — independent files → spawn `file-worker` in parallel via `/use-subagents` (parent rewires consumers + checkpoints); >250 lines → split → `/update-references` immediately; bug found → commit the fix separately first (Two Hats)
4. `/git-commit` checkpoint per batch; verify with `/run-verify` + `/check-code-structure` vs baseline — rework a failing file max 3 rounds → stop + report
5. Mechanical batches (rename/pattern/transform) → `/use-astgrep rewrite` (dry-run + confirm); read in parallel, edit sequentially so scopes never overlap

## 2. Every Workspace In A Monorepo

> Goal: no workspace skipped, dependency order respected

1. Run `/check-monorepo` + `/deep-analyze` → read the root manifest (`package.json` workspaces / `Cargo.toml` members / `moon.yml` / `pnpm-workspace.yaml`)
2. Order by dependency graph: foundation → dependents → applications (never create a circular dep); work one workspace at a time: boundaries → `## 3`, all files → `## 1`, architecture → `/refactor` `### 4`, shared extraction → `/refactor` `### 7`
3. Independent workspaces → `/use-subagents` in parallel; shared refs → sequential
4. After each workspace → `/update-references` + `/run-check` + `/git-commit`
5. Finish with the monorepo-wide verify (`moon run` / `turbo run` / `pnpm --recursive` / `bun run --filter`) + `/deep-test all`; every workspace covered or explicitly reported as skipped

## 3. Split, Merge, Relocate Members

> Goal: change member boundaries only when it improves stability (merged from `/refactor-workspace`)

1. Analyze each member manifest + `/deep-analyze` (coupling/cohesion, reasons to change, cognitive complexity) + `/scan-codebase` ∥ `/check-code-structure` (consumers, exports) + `/deep-review` + `/follow-tool-madge`
2. Refactor only when: several reasons to change, hard to test, coupling high, not reusable, unneeded deps, duplication across members; do not refactor when: SRP is clear, cohesion is high, files change/deploy together
3. If the proposed change destroys stability or adds fragmentation → don't do it, report the reason instead
4. Execute the plan: boundaries by domain/reason to change/cohesion, order foundation → dependents, no circular deps, drop unneeded deps
5. `/update-references` + `/run-check` + `/git-commit` per member, then `/report-before-after` (member graph before vs after)

## 4. Recommend Workspace Members

> Goal: adopt an existing member instead of writing new code

1. Read manifests (`package.json`/`Cargo.toml`/`bun.lock`/`pnpm-workspace.yaml`) → survey structure (`packages/*`, `crates/*`, `apps/*`) → group UI / Utilities / Frameworks / Libraries / Tools / Integrations
2. Assess compatibility (language/platform/deps), benefit (less duplication, performance, DX), status (version stability, maintenance, docs, adoption)
3. Report priority: High (adopt now — solves a real problem/removes duplication), Medium (consider — DX/trade-offs), Low (not needed/over-engineering) with integration steps (install, config, breaking changes, usage example, deps to add)
4. Never recommend a member more complex than the need or unmaintained; names like `lib`/`shared` are per-project convention, not a rule

## 5. Whole Codebase

> Goal: prioritize the whole-codebase pass before touching anything

1. Baseline: `/scan-codebase` + `/follow-agents-md` + `/deep-review` (files, symbols, dependencies, test/lint/typecheck) → `/deep-analyze` (architecture, quality, dependencies, security) → `/check-code-structure` (cohesion, coupling) + `/check-long-files`
2. Merge findings into one prioritized list by severity × impact; `/deep-impact` each important target — consumers, call sites, public API, blast radius, risk, rollback plan
3. `/create-plan-in-dot-devin` (high impact + low effort first) → pick a strategy per target: in-place, extract, relocate (`/relocation`), rename, split
4. Big replacement that cannot go big-bang → strangler fig / branch by abstraction: add abstraction layer → route callers group by group → run old/new in parallel → cutover → delete the old path
5. Batch by scope with verify + commit checkpoints after each phase → `/update-references` (relative + global) then grep for leftover old refs → `/run-verify` + `/deep-test all` + `/deep-validate` + `/check-code-structure` vs baseline → `/report-before-after`
6. Structure/layout changed → `/update-agents-md`; broken references → `/resolve-errors`; any procedure failing >3 rounds → stop + report

## Rules

### 1. Ordering

- Foundation → dependents → applications; leaf-first inside a workspace; never create a circular dependency while moving files

### 2. One Batch At A Time

- One batch = one scope that can be verified and reverted alone; every batch ends green with a checkpoint commit

### 3. Coverage

- No file or workspace skipped silently; anything not done is reported with the reason

## Expected Outcome

- Every file/member in scope meets the `/refactor` `## Rules` standards (SRP, ≤250 lines, alias imports, consistent naming/patterns)
- Baseline vs after metrics show fewer long files, no new cycles, no broken references
- `/run-verify` + `/deep-test all` green across the monorepo; `/report-before-after` recorded
