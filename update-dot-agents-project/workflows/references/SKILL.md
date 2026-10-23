---
name: update-dot-agents-project-references
description: Generate website, api, and cli reference tables into .agents/references via refs-cli
related:
  - update-dot-agents-project
  - follow-tool-crw
  - use-astgrep
  - check-types-definition
  - follow-deterministic
---

## Goal

Generate reference files as markdown tables with `refs-cli` — `website.md` from `crw map`, `api.md` and `cli.md` from source and `.d.ts` via programmatic ast-grep

## Scope

- Writes into `<project>/.agents/references/` (override with `--out`); generated artifacts are never edited by hand
- Works with any project via `--root <dir>`
- `api` and `cli` run fully offline from source; `website` needs a reachable site plus `--url`
- Flags: [references/refs-cli.md](../../references/refs-cli.md); table columns: [references/refs-output-format.md](../../references/refs-output-format.md)
- Boundaries: content writing → `/update-docs`; deep type review → `/check-types-definition`

## Execute

### 1. Check Prerequisites

> Goal: confirm the tools refs-cli needs

1. Requires `bun`, `ast-grep`, and, for the website domain only, `crw`
2. Verify with `bun --version` and `ast-grep --version`
3. When `crw` is missing → run `/follow-tool-crw` to install it

### 2. Generate Api And Cli

> Goal: build the symbol, endpoint, command, and flag tables from source

1. Run `bun <skill-dir>/scripts/refs-cli/index.ts api cli --root <project-dir> --dry-run`
2. Review the printed tables for empty or junk rows
3. Drop `--dry-run` to write the files into `<root>/.agents/references/`
4. With no domain given, the tool defaults to `api cli`

### 3. Generate website.md

> Goal: map the site's route tree

1. Run `bun <skill-dir>/scripts/refs-cli/index.ts website --url <url> --root <project-dir>`
2. Confirm the site is reachable — dev server, preview, or production
3. Run `crw setup` first when `crw` is not configured
4. Expect one row per URL with `URL`, `Path`, `Segments`, and `Depth`

### 4. Extend Languages

> Goal: add a language without changing the engine

1. Add an entry in `scripts/refs-cli/langs.ts` with `id`, `glob`, and the ast-grep language
2. Add patterns in `api.ts` and `cli.ts` following the existing tables
3. Probe each pattern against a small fixture with `ast-grep run -p <pattern> -l <lang> --json <files>`
4. Add a pattern variant when the syntax differs instead of forcing one pattern

### 5. Verify Output

> Goal: confirm the tables are correct, complete, and stable

1. Re-run the same command and confirm the files are byte-identical
2. Compare one or two rows against the real source
3. An empty section means the project may genuinely lack the surface, or the patterns are incomplete — add patterns per step 4
4. Hand off to `/check-types-definition` when a deeper API check is needed

### 6. Report

> Goal: summarize the generated references

1. Run `/report` with No., File, Rows, Status
2. State whether the files were written or only previewed
3. Run `/suggest-next-action`

## Rules

- Files in `.agents/references/` are generated artifacts — fix the source and re-run, never edit them
- Re-run before ship; never commit stale tables
- Sort and dedupe every table, use POSIX paths relative to `--root`, and never include absolute time
- Every pattern must be probed against a fixture before it is committed
- The website domain uses `crw map` only; interactive browsing → `/use-agent-browser`
- Never use `**` bold; use backticks for commands and paths

## Expected Outcome

- `website.md`, `api.md`, and `cli.md` are complete, deterministic markdown tables in `.agents/references/`
- Re-running produces a clean diff
- Adding a language requires only `langs.ts` plus one pattern table in each domain
