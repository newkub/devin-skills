---
name: search-with-astgrep
description: Search code with ast-grep AST patterns — pick ad-hoc CLI or programmatic as appropriate
argument-hint: "[pattern-or-target]"
related:
  - use-astgrep
  - use-astgrep-programmatic
  - update-astgrep-rules
  - replace
  - migrate
  - scan-codebase
  - check-code-structure
---

## Goal

Search symbols, call sites, and patterns in code with AST-based matching that is more precise than regex — pick the right interface: ad-hoc CLI for a one-off search, programmatic for batch/aggregate

## Scope

- Covers ad-hoc structural search (`ast-grep run -p`), temporary rules (`--inline-rules`), pattern syntax, and interface selection
- Excludes project setup (`/use-astgrep`), permanent rule authoring (`/update-astgrep-rules`), rewrite/migration (`/replace`, `/migrate`)

(restored from its merge into `use-astgrep` — split back out as a standalone workflow dedicated to search)

## Execute

### 1. Choose Interface

> Goal: pick the ast-grep interface that fits the job

1. One-off search / verify a pattern / view context around a match → CLI `ast-grep run` (this workflow's default)
2. Need to aggregate across many files, post-process, or feed scripts/CLI → `/use-astgrep-programmatic`
3. A pattern will be run repeatedly → promote it to a rule with `/update-astgrep-rules`
4. Need a rewrite after finding matches → `/replace` or `/migrate`
5. Need to see structure before searching → `ast-grep outline <path>` or `/check-code-structure`

### 2. Prepare Search

> Goal: make the pattern and scope specific

1. Run `/use-astgrep` if setup has never been done — confirm the CLI is invocable (`bunx ast-grep` if it is a devDependency, otherwise `bunx -p @ast-grep/cli ast-grep`)
2. Specify the language: let it auto-detect from the extension or pass `--lang ts|tsx|js|jsx|rust|py|...`
3. Write the pattern with metavariables: `$VAR` matches a single node, `$$$` matches 0+ nodes
4. Test the syntax with `ast-grep run --pattern 'PATTERN' --debug` if unsure

### 3. Run Search

> Goal: search and iterate the pattern until you get the desired result

1. `ast-grep run --pattern 'PATTERN' [paths]` — `ast-grep -p 'PATTERN'` is equivalent (`run` is the default subcommand)
2. Test on 1-2 sample files first, then expand to a directory/project
3. Too many matches → add context to the pattern (`inside`, `has`, `kind` via `--inline-rules`) or restrict paths
4. Fewer matches than expected → relax constraints one at a time to find where the pattern is too narrow
5. Use `--json pretty` when you need file/line/structured output for downstream processing
6. Use `-C <n>` (context lines) or `-A/-B` to view code around a match

### 4. Use Inline Rules For Complex Patterns

> Goal: search with structural constraints a single pattern string cannot express

1. Use `ast-grep scan --inline-rules 'YAML' [paths]` for temporary rules:

```yaml
id: find-await-in-loop
language: TypeScript
severity: info
rule:
  pattern: await $EXPR
  inside:
    kind: for_statement
```

2. Key fields: `rule.pattern`, `rule.kind`, `rule.inside`, `rule.has`, `rule.follows`, `rule.precedes`, `constraints` on metavariables (`regex`, `kind`, `not`)
3. If an inline rule grows long or must be reused → move it to `rules/` via `/update-astgrep-rules`

### 5. Common Recipes

> Goal: ready-made patterns for frequent searches

| Looking for | Pattern |
|-----------|---------|
| function definition | `function $NAME($$$) { $$$ }` |
| call site of fn | `$FN($$$)` then filter with `inside`/`kind` |
| import from module | `import $$$ from "MODULE"` or inline rule `kind: import_statement` + `has: { pattern: "MODULE" }` |
| JSX component usage | `<$COMP $$$ />` (lang tsx) |
| console calls | `console.$METHOD($$$)` |
| class method | inline rule `kind: method_definition` + `inside: { kind: class_body }` |
| async function | `async function $NAME($$$) { $$$ }` |

### 6. Consume Results

> Goal: put the results to the right use

1. Read code → open the file at the file:line from the output
2. Count/aggregate → `--json` then process with `/use-scripts` or `/use-astgrep-programmatic`
3. A single point / a few points to fix → edit by hand
4. Many mechanical fixes → `/replace` (rewrite rules) or `/migrate`
5. If this search is a hygiene check worth running regularly → `/update-astgrep-rules` or a `check-*` skill

## Rules

### 1. AST Over Regex

- Prefer AST patterns over text search when looking for structural code (definitions, calls, imports, JSX) — they match across whitespace/comments that regex misses
- Use regex/`Grep` only for genuinely textual targets (strings, comments, config values), not structure

### 2. Pattern Discipline

- Always test a pattern on sample files before running it across the whole project
- 0 matches → check `--lang` and pattern syntax before concluding nothing exists
- Too many matches → add `inside`/`has`/`kind` constraints, do not post-filter with regex
- Specify `--lang` when the extension is non-standard or input comes via stdin

### 3. Interface Selection

- One-off work / iterating a pattern → CLI shell
- Batch work, aggregation, multi-pass, integration with tools → `/use-astgrep-programmatic`
- Never wrap the CLI in a complex multi-pass shell loop — move to a programmatic script instead

### 4. Formatting

- Never use `**` (bold markers) — use backticks for emphasis
- Report matches as a table with `/report` when there are many
- Use /check-code-structure if needed
- Use `/scan-codebase` if needed

## Expected Outcome

- The desired code found with a correct, specific AST pattern
- The right interface (CLI/programmatic) chosen for the job size
- Repeatedly used patterns properly promoted to rules or analyzers
