---
name: use-astgrep-scan
description: Scan a project with ast-grep rules — run, filter, format output, and consume findings
argument-hint: "[scope|--flags]"
related:
  - use-astgrep
  - search-with-astgrep
  - update-astgrep-rules
  - improve
  - check-code-structure
  - deep-review-codebase
  - report
---

## Goal

Run `ast-grep scan` against project rules and interpret the results correctly — filter, format, severity, and route findings on to fix/report

## Scope

- Covers `ast-grep scan` (rules-driven), `--inline-rules`, `ast-grep test`, output/severity options, and CI integration
- ad-hoc pattern search (`ast-grep run -p`) → `/search-with-astgrep`; rewrite findings → `/use-astgrep rewrite`; rule authoring → `/update-astgrep-rules`; programmatic batch scan → `/use-astgrep-programmatic`

## Execute

### 1. Verify Setup

> Goal: `ast-grep scan` runs in the project

1. Requires `sgconfig.yml` at root with `ruleDirs` pointing at `rules/` — if missing, run the `/use-astgrep` setup steps first
2. Invoke the CLI: `ast-grep`/`sg` if `@ast-grep/cli` is in devDependencies; otherwise `bunx -p @ast-grep/cli ast-grep` — never bare `bunx ast-grep` (a different, abandoned package)
3. Verify the config with `ast-grep scan --inspect summary`

### 2. Run Scan

> Goal: produce findings that are readable and actionable

1. `bun run scan` (if a script exists) or `ast-grep scan` — scan the whole project with all rules
2. Filter a single rule: `ast-grep scan --filter 'RULE_ID'` (regex on rule id)
3. Temporary rule without touching `rules/`: `ast-grep scan --inline-rules 'id: ...\nlanguage: TypeScript\nrule: {...}' [paths]`
4. Severity gate: `--min-severity warning|error` or override `--error/--warning/--info/--hint/--off [RULE_ID]`
5. Verbosity: `--report-style rich|medium|short` (default `rich`)

### 3. Format Output

> Goal: output matches the consumer

1. Human review: default rich output or `--json pretty` when structured fields are needed
2. Scripts/aggregation: `--json compact|stream` → feed into `/use-scripts` or `/use-astgrep-programmatic`
3. CI: `--format github` (annotations) or `--format sarif` (SARIF upload) — exit code counts error findings
4. Threads: `-j <num>` when scanning a large repo

### 4. Test Rules

> Goal: rules with `testConfigs` pass their tests

1. `ast-grep test` runs the test cases in `rule-tests/` (per `testConfigs` in sgconfig)
2. `ast-grep test --update-all` to refresh snapshots
3. `ast-grep test --interactive` to review diffs case by case

### 5. Consume Findings

> Goal: findings are routed to the right place

1. Report a `No. | Rule | File:Line | Severity | Message` table via `/report` when there are many findings
2. A few small one-off fixes → edit manually or `/edit-only`; one pattern across many files → `/use-astgrep rewrite`
3. High-noise findings / dead rules / coverage gaps → `/improve astgrep-rules`
4. New rules that should be permanent → `/update-astgrep-rules`

## Rules

- `ast-grep scan` requires `sgconfig.yml` (root or `--config <path>`) — the `run` subcommand does not read rules
- `--inline-rules` is for temporary checks only — reusable rules must be promoted into `rules/` via `/update-astgrep-rules`
- The default severity of rules in this repo is `warning` — do not escalate to `error` unless the project requires it
- CI: use `ast-grep/action@v1.5` in GitHub Actions or `scan --format github` in other CI
- Use `/search-with-astgrep` if needed (ad-hoc patterns)
- Use `/check-code-structure` if needed (structural metrics)
- Use `/deep-review-codebase` if needed

## Expected Outcome

- `ast-grep scan` runs successfully with findings filtered/formatted for the consumer
- Rules pass `ast-grep test` if `testConfigs` exist
- Findings are routed to fix/improve/report — no findings left undecided
