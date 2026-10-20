---
name: update-devin-project-references
description: gen website.md/api.md/cli.md as markdown tables from source via ast-grep + crw map — deterministic
argument-hint: "[website|api|cli]"
related:
  - follow-tool-crw
  - use-astgrep
  - check-types-definition
  - follow-deterministic
  - update-docs
  - deep-review-codebase
---

## Goal

Build a CLI (refs-cli) that, when run, generates reference files as markdown tables:

1. `website.md` — every route, every segment, from `crw map`
2. `api.md` — dependencies, exported symbols, endpoints from source and `.d.ts` via programmatic ast-grep
3. `cli.md` — commands and flags from commander/clap via ast-grep

Supports multiple languages (ts/tsx/rust, add more in `langs.ts`) and emits deterministic tables (sort + dedupe) — re-run and the diff stays clean

## Scope

- Works with any project via `--root <dir>` — not limited to this skills repo
- Writes files into `.devin/references/` (override with `--out`) — a generated artifact, never edit by hand
- api/cli run fully offline from source; website needs a live served site + `--url`
- Does not own content writing — hand off to `/update-docs` / `/follow-tool-vitepress` when using the refs to write docs

## Execute

### 1. Prerequisites

> Goal: check the tools refs-cli needs

1. Requires `bun`, `ast-grep`, and (website domain only) `crw`
2. Check with:

```bash
bun --version
ast-grep --version
crw --version   # website only; if missing → /follow-tool-crw (`curl -fsSL https://fastcrw.com/install | sh`)
```

### 2. Generate api + cli (offline)

> Goal: build the symbols/endpoints/commands/flags tables from source

```bash
bun <skill-dir>/scripts/refs-cli/index.ts api cli --root <project-dir> --dry-run
```

1. `--dry-run` prints the markdown to the chat first — review that the tables aren't empty/junk-free
2. Once satisfied, drop `--dry-run` to write the real files into `<root>/.devin/references/`
3. No domain specified → defaults to `api cli`

### 3. Generate website.md (crw)

> Goal: map the site's full route tree with `crw map`

```bash
bun <skill-dir>/scripts/refs-cli/index.ts website --url https://staging.example.com --root <project-dir>
```

1. The site must be reachable (dev server, preview, or production)
2. If `crw` isn't set up yet → run `crw setup` first (see `/follow-tool-crw`)
3. Resulting table: `URL | Path | Segments | Depth` for every URL the map finds

### 4. Extend Languages

> Goal: add a new language (e.g. go, python, kotlin)

1. Add an entry in `scripts/refs-cli/langs.ts` (`id`, `glob`, `sg` = ast-grep language)
2. Add a pattern table in `api.ts` (`*_SYMBOL_PATTERNS`) and `cli.ts` following the existing structure
3. Always probe a pattern against a small fixture first (`ast-grep run -p <pattern> -l <lang> --json <files>`) — see `/use-astgrep`
4. If a pattern doesn't match (different syntax, e.g. the return-type arrow in rust) → add a pattern variant; don't force one pattern to cover every case

### 5. Verify Output

> Goal: confirm the tables are correct and complete

1. Re-run the same command → the files must be identical (deterministic check)
2. Open `api.md`/`cli.md` and compare 1-2 rows against the real source (symbol name, file, line)
3. Check coverage: an empty section (`_No entries._`) → the project may genuinely have no route/CLI, or patterns are incomplete → add patterns per step 4
4. If a deeper type/API surface check is needed than the table → hand off to `/check-types-definition`

## Rules

### 1. Generated Files Are Artifacts

- Files in `.devin/references/` must never be hand-edited — fix the source and re-run
- Never commit stale generated refs — always re-run before ship (check with `/check-should-update`)
- Either add `.devin/references` to `.gitignore` or deliberately commit the whole folder — pick one approach per project

### 2. Deterministic Output

- Every table is already sorted + deduped in `render.table` — never add a row that depends on absolute time/path
- Use paths relative to `--root` in POSIX form only
- See the principle: `/follow-deterministic`

### 3. Pattern Discipline (ast-grep)

- Every pattern must be probed against a fixture before committing into `api.ts`/`cli.ts`
- A pattern that errors → `sgFind` skips it silently; if a table is oddly empty, suspect the pattern, not the project
- Endpoints must be filtered on two levels: method ∈ HTTP methods and path starting with `/` — guards against false positives from a Map/cache's `.get(key)`

### 4. Boundaries

- The website domain uses `crw map` only — interactive browsing → `/use-agent-browser`
- content/docs writing from refs → `/update-docs`, never write back over `.devin/references`
- review of refs-vs-code consistency → `/deep-review-codebase` domain `review-docs`

### 5. Output Format

- Every table has clear headers: `File` and `Line` (1-based) so you can click through to source
- Column details: see `references/output-format.md`
- Full CLI flags: see `references/cli.md`

## Expected Outcome

- `website.md`/`api.md`/`cli.md` are complete, deterministic markdown tables in `.devin/references/`
- Re-running gives the same result, clean diff
- Adding a new language only requires editing `langs.ts` + a pattern table in one place
- Ready to hand off to `/update-docs`, `/check-types-definition`, `/deep-review-codebase` for the next task
