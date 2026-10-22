---
name: code-search
description: Search files by name, content, or AST with ripgrep and ast-grep, read-only
argument-hint: "[filename|content|ast|mixed]"
related:
  - use-astgrep
  - search-with-astgrep
  - follow-tool-ctx-rs
  - git-search
  - search-similar
  - check-code-structure
  - report
  - refactor
---

## Goal

Find files by pattern and code by text, regex, or AST across the working tree, then report exact `file:line` evidence without modifying anything

## Scope

- Covers filename globs, content and regex search with `rg`, and structural search with `ast-grep`
- Boundary: git history and agent blame → `/git-search`; indexed agent sessions → `/follow-tool-ctx-rs`; broad architecture reading → `/check-code-structure`
- Read-only — route changes to `/refactor` or `/fix`
- References: [ripgrep](references/ripgrep.md) · [ast-grep](references/ast-grep.md) · [patterns](templates/common-patterns.md)

## Execute

### 1. Define The Search

> Goal: know what you are looking for and where

1. Classify the target: `filename` (glob), `content` (text or regex), `ast` (code structure), or `mixed`
2. State the base directory and the exclude set: `node_modules`, `dist`, `build`, `coverage`, `.git`, `target`, vendor
3. Read `templates/common-patterns.md` for ready-made patterns
4. Pattern unclear → ask for one concrete example of the expected match

### 2. Search File Names

> Goal: find files by name or extension without reading content

1. `rg --files -g '<glob>'` — list matching files; add one `-g '!<exclude>'` per exclude
2. Limit scope with a path argument: `rg --files src -g '*.test.ts'`
3. Prefer `rg --files` over recursive directory listing — ignore-aware and fast
4. Record the relative path, and line count when size matters

### 3. Search Content

> Goal: find text or regex matches with exact positions

1. `rg -n '<pattern>' <path>` — line numbers, path prefixes, ignore-aware
2. Fixed string → `rg -F`; case-insensitive → `rg -i`; whole word → `rg -w`
3. Filter types → `rg -t ts -t tsx`; explicit globs → `rg -g '*.rs'`; include hidden → `rg --hidden`
4. Multi-line → `rg -U`; files only → `rg -l`; counts → `rg -c`
5. Machine-readable → `rg --json`; context → `rg -C 2`

### 4. Search Structure With AST

> Goal: match code shapes that regex cannot express safely

1. Read `references/ast-grep.md`; delegate deep AST work to `/use-astgrep` or `/search-with-astgrep`
2. One-off pattern → `sg run -p '<pattern>' --lang <lang> <path>`
3. Constraints (`inside`, `has`, `not`) → `sg scan --inline-rules '<yaml>' <path>`
4. Symbols first → `sg outline <path>`
5. Test the pattern on one or two files before running it across the repo

### 5. Narrow And Verify

> Goal: cut noise before reporting

1. Too many matches → add `inside`/`has`/`kind` constraints, restrict the path, or filter by type — do not post-filter with another regex
2. Zero matches → verify `--lang` or the glob, relax one constraint at a time, and check ignore rules (`--no-ignore` only when justified)
3. Open each key match before citing it; keep snippets to five lines or fewer

### 6. Report

> Goal: hand off evidence the next step can act on

1. Run `/report` with columns: No. · File · Line · Pattern · Snippet · Severity
2. State the tool and the exact pattern string used for each pattern family
3. More than 100 matches → summarize the top 20 plus the total count
4. Route follow-up: `/refactor`, `/fix`, `/search-similar`, or `/git-search`

## Rules

### 1. AST Over Regex

- Structural targets (definitions, calls, imports, JSX, class members) → AST patterns, not regex
- Textual targets (strings, comments, config values) → `rg`
- Zero matches → check `--lang` and glob syntax before concluding the code is absent

### 2. Scope And Safety

- Search is read-only; never edit or rewrite during a search
- Start narrow (file, directory, type), then expand
- Exclude build output and dependencies by default
- Never print secrets, tokens, or private data in results

### 3. Evidence

- Every match carries a path and a line number
- Record the exact pattern so the search is reproducible
- Do not claim an exhaustive inventory when ignores or limits were active
- Report boundaries: what was searched and what was excluded

### 4. Boundaries

- Commit search, pickaxe, `git grep`, and `git blame` → `/git-search`
- Agent session recall and `ctx blame` → `/follow-tool-ctx-rs`
- Cross-file architecture reading → `/check-code-structure`

## Expected Outcome

- Requested matches found with `file:line` and short snippets
- Irrelevant directories excluded and stated
- Correct tool chosen per target: glob, regex, or AST
- A report table with a concrete next action
