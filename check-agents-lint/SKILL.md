---
name: check-agents-lint
description: One read-only CLI that lints skill packages: structure, references, content, secrets, code
argument-hint: "[root] [--skill <name[,name]>] [--rules <list>] [--engine <list>] [--changed] [--json|--sarif] [--findings] [--fail-on <level>] [--baseline <file>]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
related:
  - check-skills-structure
  - update-agents-skills-global
  - update-references
  - check-secrets
  - deep-review
  - use-scripts
  - run-check
  - follow-tool-linter
---

## Goal

Run one read-only linter over every skill package in the skills repo and get file:line findings for 49 rules across six namespaces — `struct`, `meta`, `graph`, `content`, `sec`, `code` — with a fix owner attached to every finding, plus JSON and SARIF output for CI.

## Scope

Use to lint the whole repo, one skill, one namespace, or only the skills touched in git — the full rule table lives in [references/rules.md](references/rules.md) and engine behavior in [references/engines.md](references/engines.md).

- Boundary: structural inventory (counts of references, workflows, subagents, MCP, scripts) → `/check-skills-structure`; fixing findings → `/update-agents-skills-global`, `/update-references`, `/check-secrets`, `/deep-review`, `/use-scripts` depending on the fix owner shown on the finding
- The tool never writes, fixes, formats, moves, or deletes anything; it only reads the scanned tree

## Execute

### 1. Run The Full Scan

> Goal: lint every skill package with the default engines

```bash
cd "<skills-root>"   # the repo that contains check-agents-lint/
bun "check-agents-lint/scripts/check-agents-lint.ts"
```

The default scan root is the repo root two levels above `scripts/`, so no root argument is needed when the script is run from that repo; output is one line per finding plus a severity summary and an engine status line.

### 2. Scope The Scan

> Goal: lint only what changed or what is being worked on

```bash
bun "check-agents-lint/scripts/check-agents-lint.ts" --skill refactor,check-secrets
bun "check-agents-lint/scripts/check-agents-lint.ts" --changed
bun "check-agents-lint/scripts/check-agents-lint.ts" --rules struct/*,meta/*
bun "check-agents-lint/scripts/check-agents-lint.ts" D:/other/skills --skill demo-skill
```

`--skill` accepts a comma list, `--rules` accepts rule IDs, namespaces, or `namespace/*`, and `--changed` keeps only skills touched by `git diff` plus untracked files; outside a git repo it scans everything and says so on stderr.

### 3. Read Findings

> Goal: map every finding to its severity and owner

Each line is `severity rule file:line message → fix-owner`; `critical` means the package is broken or unsafe, `warning` means the convention contract is violated, and `info` means hygiene. The rule table, including what each rule proves, is in [references/rules.md](references/rules.md).

### 4. Pick Engines

> Goal: run only the engines that are installed and relevant

Default engines are `own`, `biome`, `ast-grep`, and `shellcheck`; `gitleaks` and `lychee` are opt-in. A missing default engine is reported as `missing` and does not fail the run; an explicitly requested missing engine exits 2. Engine scope, temp files, and network handling are documented in [references/engines.md](references/engines.md); external linter usage follows `/follow-tool-linter`.

### 5. Gate CI Or Triage

> Goal: turn findings into a pass/fail gate and suppress accepted debt

```bash
bun "check-agents-lint/scripts/check-agents-lint.ts" --fail-on warning --json > report.json
bun "check-agents-lint/scripts/check-agents-lint.ts" --sarif > agents-lint.sarif
bun "check-agents-lint/scripts/check-agents-lint.ts" --engine gitleaks,lychee --fail-on critical
bun "check-agents-lint/scripts/check-agents-lint.ts" --baseline report.json --fail-on warning
```

`--baseline` reads a previous JSON report and hides matching findings by rule, file, and message, ignoring line drift. Exit code 0 means clean, 1 means findings at or above `--fail-on`, and 2 means invalid usage, unreadable input, or a missing explicitly requested engine. Wire the gate into `/run-check`.

## Rules

- The linter is strictly read-only: no `--fix`, no writes, no deletions; temp files go under `AGENTS_LINT_TMP` or `D:\tmp` and are removed after each engine run.
- Secrets never reach the report: credential findings show a redacted shape, never the matched value.
- Output is deterministic for the same tree: engine order, rule order, file order, and message text are stable.
- Scope filtering happens before engines run; an unknown skill or rule fails with exit 2 instead of silently scanning nothing.
- Do not auto-apply fixes from this skill; route each finding to its fix owner, then rerun the scan.
- When the client path `%APPDATA%\devin\skills` is a broken junction, report it; do not repair it or mirror packages without confirmation.

## Expected Outcome

- One command produces a reproducible finding list for every skill package, with severities, file:line locations, and fix owners.
- CI gets JSON or SARIF plus exit codes, and accepted debt stays suppressed through a baseline file.
- Structural inventory stays with `/check-skills-structure`; this skill answers whether the repo conforms, not what it contains.
