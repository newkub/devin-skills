---
name: use-astgrep
description: ast-grep setup and usage for AST-based code search, lint, and refactoring — dispatcher to workflows
argument-hint: "[scan|rewrite|transform|migration|scope]"
related:
  - update-astgrep-rules
  - check-code-structure
  - replace
  - search-with-astgrep
  - use-astgrep-programmatic
  - migration-with-astgrep
  - deep-review-codebase
---

## Goal

Set up and use ast-grep for code search, lint, and refactoring with AST-based patterns that are more precise than regex — setup lives here, execution lives in the workflows

## Scope

Covers configuring `sgconfig.yml`, project structure, the scan script, and dispatching into the workflows — writing permanent rules lives in `/update-astgrep-rules`, ad-hoc search lives in `/search-with-astgrep`, programmatic/scripting lives in `/use-astgrep-programmatic`

## Execute

### 1. Install Or Use ast-grep

> Goal: install or invoke ast-grep correctly

1. If the project has `@ast-grep/cli` in `devDependencies`, use `bunx ast-grep` (the `ast-grep` or `sg` bin from the local install)
2. If there is no local install, use `bunx -p @ast-grep/cli ast-grep` — never run a bare `bunx ast-grep`, because it pulls the `ast-grep` package (a different, abandoned package)
3. For regular use, add `@ast-grep/cli` to `devDependencies` — latest `0.45.3 (verified 2026-09-12)`

### 2. Configure sgconfig.yml

> Goal: create `sgconfig.yml` with the required fields

1. Create the `sgconfig.yml` file at the root directory with `ruleDirs` pointing to `rules/{dependencies,architecture,glob}` per the canonical layout in `/update-astgrep-rules`
2. If the project has multiple workspaces, add each workspace's rule dir to `ruleDirs` (there is no `devPaths` field — the actual fields are: `ruleDirs`, `testConfigs`, `utilDirs`, `languageGlobs`, `customLanguages`, `languageInjections`)
3. If the project has custom file extensions, add `languageGlobs`
4. If you want test rules, add `testConfigs`
5. If you want reusable patterns, add `utilDirs`
6. Verify the config with `ast-grep scan --inspect summary`

### 3. Setup Project Structure

> Goal: create the directory structure for rules and tests

1. Create ast-grep rules in the `rules/` directory at the project root per the canonical layout in `/update-astgrep-rules` (leave `.devin/rules/*.md` alone — those are natural-language guidance rules owned by `/update-devin-project-rules`, a separate concern)
2. If there is a `testConfigs`, create the `rule-tests/` directory at the project root
3. If there is a `utilDirs`, create the `utils/` directory at the project root
4. You can use `ast-grep new` to scaffold a new project (or `bunx -p @ast-grep/cli ast-grep new` if not yet installed)

### 4. Add Scan Script

> Goal: add a scan script to `package.json`

1. Add a script to `package.json`:

```json
{
  "scripts": {
    "scan": "ast-grep scan"
  }
}
```

2. Use `ast-grep scan` or `sg scan` once `@ast-grep/cli` is installed as a devDependency — if not yet installed, use `bunx -p @ast-grep/cli ast-grep scan`

### 5. Choose Workflow

> Goal: route to the workflow that matches the task

| Task | Workflow |
|------|----------|
| scan the project with rules, filter/format findings, CI | `/use-astgrep scan` |
| batch rewrite many files with a pattern (`-p`/`-r`, dry-run → confirm → apply) | `/use-astgrep rewrite` |
| rule-YAML transforms (`transform`/`rewriters`/constraints) | `/use-astgrep transform` |
| whole-codebase migration in staged batches | `/use-astgrep migration` |
| ad-hoc search only (no rewrite) | `/search-with-astgrep` |
| batch/programmatic via Bun scripts, napi | `/use-astgrep-programmatic` |
| write/promote permanent rules in `rules/` | `/update-astgrep-rules` |

1. If the argument matches a workflow → read `workflows/<name>/SKILL.md` and follow the flow there
2. Always test a pattern on 1-2 sample files before running it across the whole project

## Rules

### 1. CLI Reference

- `ast-grep new` to scaffold a new project, `ast-grep new rule` to create a new rule
- `ast-grep scan` to scan the whole project with rules (detailed options → `workflows/scan/SKILL.md`)
- `ast-grep run --pattern 'PATTERN'` for ad-hoc search (`run` is the default subcommand)
- `ast-grep run -p 'PATTERN' -r 'REWRITE'` for rewriting (detailed options → `workflows/rewrite/SKILL.md`)
- `ast-grep test` to test rules, `ast-grep outline` to view structure, `ast-grep lsp` for the language server, `ast-grep completions <shell>` for completions
- There is no `ast-grep rewrite` subcommand — rewriting is done via `run -r`/`scan` with `--interactive` or `-U`

### 2. Separation From Devin Rules

- `rules/` stores `.yml` ast-grep rules at the project root (`rules/{dependencies,architecture,glob}`)
- `.devin/rules/*.md` are natural-language agent-guidance rules (architecture, dependencies, business) owned by `/update-devin-project-rules` — leave them, never delete them here
- ast-grep `rules/*.yml` + `sgconfig.yml` provide machine enforcement; the two coexist as separate concerns
- Rule files use `kebab-case` filenames
- Non-rule files in `rules/` are ignored

### 3. Integration With Biome

- Use `ast-grep` for structural patterns that `Biome` cannot express — it complements rather than replaces
- Use `Biome` for standard lint and format

### 4. Rule Writing

- Writing permanent rules lives in `/update-astgrep-rules`, not this workflow

### 5. Pattern Discipline

- Use AST-based patterns for structural matching before regex
- Verify syntax with `ast-grep run --pattern 'PATTERN' --debug`
- Test a pattern on sample files before running it across the whole project
- Let ast-grep auto-detect the language, or specify `--lang` if the extension is non-standard
- Every rewrite must be dry-run + preview + confirmed before applying — the workflows already enforce this, never skip it

- Use /check-code-structure if needed
- Use `/deep-review-codebase` if needed

## Expected Outcome

- `sgconfig.yml` fully configured with all required fields
- Project structure created (`rules/`, `rule-tests/`, `utils/`)
- Scan script added to `package.json` and working
- Tasks routed into the correct workflow (`scan`/`rewrite`/`transform`/`migration`)
- Works alongside `Biome` without conflict
