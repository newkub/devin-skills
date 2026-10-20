---
name: use-astgrep-programmatic
description: Use ast-grep programmatically via scripts to automate analysis and integrate with the review CLI
argument-hint: "[scope]"
related:
  - use-astgrep
  - search-with-astgrep
  - update-astgrep-rules
  - update-review-cli
  - use-bun-native-api
  - follow-create-bun-cli
  - scan-codebase
  - use-scripts
  - run-program
---

## Goal

Use ast-grep programmatically via Bun scripts to automate code analysis and integrate with the review CLI (promoted back to a top-level skill from the `use-astgrep` workflow)

## Scope

Covers using ast-grep through napi bindings and the CLI inside Bun scripts, building programmatic analyzers, and integrating with the review CLI — excludes manual ast-grep CLI usage (see `/use-astgrep`) — excludes updating rules (see `/update-astgrep-rules`) or updating the review CLI (see `/update-review-cli`)

## Execute

### 0. Setup

> Goal: Install ast-grep for Bun scripts

1. Install `@ast-grep/cli` in the project (latest `0.45.3 (verified 2026-09-12)`):
   - `bun add -D @ast-grep/cli`
   - or globally: `mise use -g 'npm:@ast-grep/cli'`
2. Verify the CLI: `bunx ast-grep --version` (ad-hoc without installing: `bunx -p @ast-grep/cli ast-grep --version`)
3. If napi bindings are needed → `bun add -D @ast-grep/napi` (latest `0.45.3 (verified 2026-09-12)` — a native Node-API module must be really installed, never import it via esm.sh — see [references/package-manifest.md](references/package-manifest.md))
4. Create `sgconfig.yml` at the root if it doesn't exist yet
5. If installation fails → use `/deep-research setup ast-grep`

### 1. Prepare Context

> Goal: Read context and prepare the environment before writing scripts

1. Do `/use-astgrep`, `/use-bun-native-api`, `/follow-create-bun-cli` — read ast-grep patterns, Bun native APIs, and CLI best practices
2. Read the `tools/review-codebase/` directory to understand the existing analyzer structure
3. Read the `rules/` directory to see the existing ast-grep rules
4. Do `/scan-codebase` to understand the codebase structure you will analyze

### 2. Create Programmatic Script

> Goal: Create a Bun script that uses ast-grep programmatically for automated analysis

1. Do `/use-scripts` to create a script in `.devin/scripts/` or `$env:TEMP`
2. Choose the ast-grep interface:
   - napi bindings: `import { parse, parseAsync, Lang, findInFiles, kind, registerDynamicLanguage } from '@ast-grep/napi'` — in-process analysis; `parse(Lang.TypeScript, src).root().find('pattern')` / `root.findAll(...)` / `node.getMatch('A')` / `node.getMultipleMatches('$$$')` / `node.replace(text)` + `root.commitEdits([...])`; `findInFiles(Lang.TypeScript, { paths: ['src'], matcher: { rule: {...} } }, cb)` for multi-file scans — full API surface + perf tips at [references/napi-api.md](references/napi-api.md)
   - CLI wrapper: `Bun.$\`ast-grep scan --json pretty\`` — for batch scanning
   - languages outside the JS ecosystem → `bun add -D @ast-grep/lang-<name>` + `registerDynamicLanguage({ <name>: langPkg })` once per process with all languages at once (see `references/napi-api.md → Dynamic Languages`)
3. Write the script with Bun native APIs:
   - Use `Bun.Glob` for file discovery
   - Use `Bun.$` for CLI invocation
   - Use `Bun.file()` + `Bun.write()` for file I/O
4. The script must have a `dryRun` option for testing
5. The script must output JSON for review CLI consumption
6. Use CDN imports only for pure-JS deps such as `https://esm.sh/zod` — `@ast-grep/napi` is a native module and must only be added via `bun add -D`

### 3. Run Analysis

> Goal: Run the programmatic analysis and integrate the results with the review CLI

1. Run the script in dry-run mode first to inspect the output
2. If the dry run passes → run for real
3. If the review CLI doesn't include ast-grep findings → run the script separately and merge the results
4. Verify each finding has complete evidence: file path, line number, code snippet, rule id

### 4. Validate And Report

> Goal: Validate findings and report results

1. Do `/deep-validate` to validate issues from the ast-grep analysis
2. Order by severity: Critical → High → Medium → Low
3. If false positives are found → adjust the rules and re-run (max 3 → stop/report)
4. Do `/suggest-next-action`

## Rules

### 1. Script Standards

- Always use Bun native APIs: `Bun.Glob`, `Bun.$`, `Bun.file()`, `Bun.write()`
- `@ast-grep/napi` is a native Node-API module — always `bun add -D @ast-grep/napi` (esm.sh cannot serve a native binary); CDN imports are only usable for pure-JS deps
- The script must have a `dryRun` option
- The script must output JSON for machine consumption
- Keep scripts in `.devin/scripts/` (permanent) or `$env:TEMP` (throwaway)
- Rewrites where plain metavar replacement isn't enough (case conversion, per-subnode fixes) → use YAML `transform`/`rewriters` (see `use-astgrep/workflows/transform/` + `references/rewrite.md`); in napi use `node.replace(text)` + host-language string ops — `replace()` does not expand `$VAR`

### 2. Integration

- ast-grep findings must integrate with the review CLI output
- If the review CLI doesn't include ast-grep findings → run the script separately and merge
- Each finding must have: file path, line number, code snippet, rule id
- If a finding is a false positive → adjust the rule and re-run

### 3. Performance (napi)

- Prefer `parseAsync` over `parse` — parses in parallel on the libuv thread pool
- Prefer `findAll`/`find` over manual `children()` recursion — traversal via one FFI call per node is very slow
- Prefer `findInFiles` for many files — parse+match run in parallel on Rust threads; the Promise may resolve before all callbacks finish → guard with a file-count counter (pattern in `references/napi-api.md`)
- Call `registerDynamicLanguage` once per process, registering all languages in that single call — repeated calls are ignored (first call wins)

### 4. Scope Boundary

- Excludes updating rules — that lives in `/update-astgrep-rules`
- Excludes updating review CLI analyzers — that lives in `/update-review-cli`
- Focused solely on using ast-grep programmatically via scripts

### 4. Formatting

- Never use `**` (bold markers) — use backticks for emphasis (astgrep programmatic)
- Report as tables with `/report`
- Use /run-program when needed
- Use `/search-with-astgrep` when needed

## Expected Outcome

- A Bun script that uses ast-grep programmatically for automated analysis
- A review report with comprehensive and accurate ast-grep findings
- Findings are validated and reported as tables
- The next action is suggested via `/suggest-next-action`

