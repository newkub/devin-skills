# Review Checklist For tools/review-codebase

Review the `tools/review-codebase` CLI before calling `/deep-review` to confirm that Clean Architecture, analyzer structure, category coverage, CLI interface, and workspace integration are complete and correct

## Reference Mapping

| Reference File | Responsibility |
|----------------|----------------|
| `clean-architecture.md` | Clean Architecture validation rules — directories, entry points, kebab-case, Bun native APIs, dependency direction |
| `analyzers.md` | Analyzer structure and coverage — analyzer files, `CategoryResult`, `reviewWorkflow` map, shared utilities, 60+ categories, 5 domains |
| `cli-interface.md` | CLI interface and output format — `--help`/`-h`, exit codes, `--format` table/JSON, error messages |
| `analyze-integration.md` | Integration with `tools-analyze` — workspace imports, no duplicated logic, dependency check |
| `package-scripts.md` | Package scripts validation — `review-codebase`, `review-codebase:json` scripts, root `package.json` filter commands |
| `scoring.md` | Scoring formula — severity weights, grade thresholds, action on low score, report format |

## 1. Prepare Context

> Goal: Understand the `tools/review-codebase` structure

1. Run `/scan-codebase` in `tools/review-codebase/`
2. Verify that `tools/review-codebase/` exists; if not → flag as critical
3. Read the `package.json` of `tools/review-codebase`
4. Read `/run-review` to learn the 60+ categories and 5 domains

## 2. Check Clean Architecture

> Goal: Check the Clean Architecture structure

> See `clean-architecture.md` for architecture validation rules

1. Check directories: `src/domain/`, `src/application/`, `src/adapters/`, `src/presentation/`
2. Check entry points: `src/presentation/cli.ts` and `src/index.ts`
3. Check that file names use `kebab-case`
4. Check that Bun native APIs are used: `Bun.file`, `Bun.spawn`, `Bun.write`
5. Record findings with evidence

## 3. Check Analyzers

> Goal: Check analyzer structure and coverage

> See `analyzers.md` for analyzer structure and coverage rules

1. Check analyzer files in `src/domain/analyzers/`: `user-facing.ts`, `security.ts`, `backend-data.ts`, `infrastructure.ts`, `code-arch.ts`
2. Check that every analyzer returns `CategoryResult` with `status`, `score`, `findings`
3. Check that every analyzer has a `reviewWorkflow` map to `/deep-review` or references
4. Check that shared utilities from `src/adapters/` are used, with no duplicated code
5. Check category coverage: 60+ categories from `/run-review`, 5 domains
6. Record findings with evidence

## 4. Check CLI Interface

> Goal: Check CLI interface and output format

> See `cli-interface.md` for CLI interface and output format rules

1. Check that the `--help`/`-h` option shows usage, options, exit codes, examples
2. Check exit codes: 0 = success, 1 = invalid arguments
3. Check that output supports table and JSON via the `--format` flag
4. Check error messages for invalid arguments
5. Record findings with evidence

## 5. Check Analyze Integration

> Goal: Check integration with tools-analyze

> See `analyze-integration.md` for integration validation rules

1. Check that `tools/review-codebase` imports analyzers from `tools-analyze` via workspace
2. Check that there is no duplicated analyzer logic in `tools/review-codebase/src/health`
3. Check that `tools-analyze` is a dependency of `tools/review-codebase`
4. Record findings with evidence

## 6. Check Package Scripts

> Goal: Check scripts in package.json

> See `package-scripts.md` for package scripts validation rules

1. Check that `tools/review-codebase/package.json` has `review-codebase`, `review-codebase:json` scripts
2. Check that the root `package.json` has `review: bun --filter tools-review-codebase review-codebase`
3. Check that the root `package.json` has `review-codebase:json: bun --filter tools-review-codebase review-codebase:json`
4. Record findings with evidence

## 7. Check Line Count And Evidence

> Goal: Check line count and evidence quality

1. Check that every file is no more than 250 lines
2. Check that findings have evidence: file path, line number, code snippet
3. Record findings with evidence

## 8. Score And Report

> Goal: Summarize the review score and findings

> See `scoring.md` for the scoring formula and grade thresholds

1. Compute review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. Assign grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. Produce `/report table` with findings: Category, Severity, Finding, Evidence, Action
4. Run `/suggest-next-action` to recommend the next action

## Rules

### 1. Review Only

- Perform review only; do not modify CLI code during review
- If a fix is needed, call `/deep-review` after the review
- Every finding must have a file path and evidence

### 2. Severity Ratings

- `Critical`: no `tools/review-codebase`, a missing entry point, analyzers not working
- `High`: missing Clean Architecture, an analyzer not returning `CategoryResult`, no `--help`
- `Medium`: incomplete category coverage, missing scripts, duplicated code
- `Low`: file names not `kebab-case`, line count exceeded
- `Info`: a suggestion; does not affect operation

### 3. Scoring

- review score = weighted average of all findings
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → recommend calling `/deep-review` before proceeding

### 4. Formatting

- Never use `**` (bold markers) — use backticks for emphasis
- Use heading levels for structure
- Report as a table with `/report table`

## Expected Outcome

- A `tools/review-codebase` CLI review report with score and grade
- Findings reported with severity, evidence, and required action
- Confirm Clean Architecture, analyzer coverage, and CLI interface are complete
- Confirm integration with `tools-analyze` has no duplicated logic
- Recommend the next action via `/suggest-next-action`
