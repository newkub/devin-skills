---
name: update-astgrep-rules
description: Reset and regenerate ast-grep rules as `rules/{dependencies,architecture,glob}/` + `sgconfig.yml`
argument-hint: "[rule-or-pattern | --reset]"
related:
  - use-astgrep
  - use-astgrep-programmatic
  - new-skills
  - scan-codebase
  - run-scan
  - use-subagents
  - update-devin-project-rules
  - report
  - suggest-next-action
---

## Goal

Create/update the project's ast-grep rules following the canonical 3-folder layout — `rules/dependencies/` (one rule per dependency), `rules/architecture/` (rules for the architecture chosen in `AGENTS.md`), `rules/glob/` (rules bound to file patterns) — plus an `sgconfig.yml` pointing at all 3 dirs

## Scope

- Use when you want AST-based lint rules that enforce project-specific conventions
- Canonical layout: `rules/dependencies/<dep>.yml`, `rules/architecture/<arch>.yml`, `rules/glob/<pattern>.yml`
- `--reset` = delete all existing rules, then re-analyze and rewrite them (canonical refresh)
- Excludes `.devin/rules/*.md` — natural-language agent-guidance rules owned by `/update-devin-project-rules`; the two coexist and this skill never touches `.devin/rules/`
- Excludes generating skills from a manifest — use `/new-skills` instead

## Execute

### 1. Reset And Analyze

> Goal: Start from a clean state and understand the real project

1. `--reset` → delete the whole existing `rules/` folder at the project root first (never `.devin/rules/` — that holds markdown guidance rules owned by `/update-devin-project-rules`)
2. Run `/scan-codebase` — collect the manifest (`package.json`/`Cargo.toml`/etc.), `AGENTS.md` (the chosen architecture), the directory layout, and the file extensions in use
3. Create the canonical structure:
   ```text
   rules/
   ├─ dependencies/     # <dep>.yml — one file per dependency that needs usage/ban enforcement
   ├─ architecture/     # <arch>.yml — layer boundaries, import direction, banned patterns
   └─ glob/             # <pattern>.yml — rules bound to file globs (*.test.ts, routes/*, server/*)
   ```
4. Create/fix `sgconfig.yml`:
   ```yaml
   ruleDirs:
     - rules/dependencies
     - rules/architecture
     - rules/glob
   ```

### 2. Write Dependencies Rules

> Goal: One rule per dependency that needs enforcement

1. Read the dependencies from the manifest — pick only deps with a clear convention (e.g. must use `drizzle` instead of raw SQL, `moment` banned in favour of `dayjs`, effect-atom patterns)
2. Per dep, write `rules/dependencies/<dep>.yml`: enforce the import source, ban deprecated APIs, require config — YAML: `id`, `language`, `rule.pattern`/`rule.any`, `message`, `severity`, `fix` (optional)
3. Use meta-variables `$VAR`, `$$$ARGS`; add `constraints`/`utils` when the rule is complex
4. Never write a rule for a dep that is not really there — every rule must name a package present in the manifest

### 3. Write Architecture Rules

> Goal: Enforce the architecture chosen in `AGENTS.md`

1. Read `AGENTS.md` → identify the architecture (clean / layered / modular / framework-specific)
2. Write `rules/architecture/<name>.yml` for boundaries that AST/regex can enforce, e.g.:
   - layer import direction (`domain/` must not import `infra/`)
   - no deep imports across a module barrel
   - banned patterns inside a specific layer (IO calls in `domain/`)
3. Rules AST cannot enforce (e.g. naming conventions with no clear pattern) → write them in the `AGENTS.md` rules section instead; never guess YAML

### 4. Write Glob Rules

> Goal: Rules bound to file patterns

1. Identify the file patterns that need a dedicated rule: `*.test.*`, `*.stories.*`, `routes/*`, `server/*`, `*.config.*`, migration files
2. Write `rules/glob/<pattern>.yml` — an ast-grep rule plus a `files:` glob filter, e.g. `files: ["**/*.test.ts"]` (`expect` without an assertion, `console.log` in server code, env access outside config)
3. Choose globs from the project's real layout — never write a rule for a pattern the project does not have

### 5. Test And Wire

> Goal: Make sure the rules actually work

1. Test a rule with `ast-grep scan --rule rules/<dir>/<name>.yml <path>` before committing
2. For many rules / JSON findings needed per rule → run `/use-astgrep-programmatic` and write a batch script (`ast-grep scan --json` through `Bun.$` or `findInFiles` per rule set) — always dry run first
3. Run `ast-grep scan` over the whole project — collect findings, fix rules that match wrongly or too broadly
4. Add `"scan": "ast-grep scan"` to `package.json` plus a CI step when available
5. Run `/run-scan` to confirm there are not too many false positives

### 6. Report

> Goal: Summarize the results

1. `/report` table: `No.`, `Dir`, `Rule`, `Pattern`, `Severity`, `Status`
2. List the rules added/changed/deleted (`.devin/rules/` is untouched by this skill — for those see `/update-devin-project-rules`)
3. Run `/suggest-next-action`

## Rules

- Always test a rule before committing — a rule that matches wrongly breaks the scan
- Use `severity: warning` for new rules before promoting them to `error`
- Never edit `sgconfig.yml` without checking the existing `ruleDirs` — merge with the canonical layout
- Several projects at once (e.g. every project on a drive) → use `/use-subagents` to spawn one agent per project — the agent must not touch `AGENTS.md`/manifest beyond the rules
- `--reset` = delete-then-rewrite only — never bring old rules back by merging unless the re-analysis justifies it

- Use `/use-astgrep` for rule syntax (pattern, constraints, transform/rewriters)
- Use `/use-astgrep-programmatic` when testing rules in batch or needing mergeable/parseable JSON findings
- Use `/use-subagents` when handling several projects
- Use `/scan-codebase`, `/run-scan`, `/report`, `/suggest-next-action` per the steps

## Expected Outcome

- `rules/{dependencies,architecture,glob}/` + `sgconfig.yml` reflect the real project
- Rules pass testing with `ast-grep scan`; `.devin/rules/` left intact (it is separate markdown guidance)
- A complete report for every project handled
