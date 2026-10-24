---
name: use-astgrep-rewrite
description: Batch-refactor many files with ast-grep AST patterns — dry-run + confirm before overwriting
argument-hint: "<pattern> <replacement> [path|glob]"
related:
  - use-astgrep
  - search-with-astgrep
  - use-astgrep-programmatic
  - migrate
  - run-check
  - ask-me
  - report
---

## Goal

Safely change code across many files with ast-grep AST patterns — preview matches + diff first, confirm, then `--rewrite`, verify after apply — for "change X to Y everywhere" cases: faster than manual edits and safer than raw `sg -r`

## Scope

- One-shot pattern apply: rename API/deprecated call, syntax transform (`var`→`const`, callback→async), pattern removal (`console.log`), import reorganize — per language (ts/js, rust, python, go)
- Search only → `/search-with-astgrep`; rule-YAML transforms (`transform`/`rewriters`) → `/use-astgrep transform`; whole-codebase migrations → `/use-astgrep migration`; script/CI integration → `/use-astgrep-programmatic`
- A ready pattern library lives in `references/patterns.md` — use it as a starting point instead of writing from scratch

## Execute

### 1. Define Pattern

> Goal: get a pattern + replacement that matches only what you intend

1. Identify the refactor intent from the argument — e.g. `console.log` removal, API rename, syntax upgrade
2. Check `references/patterns.md` first — there may be a ready-made or close pattern to adapt
3. Write the pattern (metavar `$VAR`, `$$$` for variadic) — or a rule YAML if you need constraints (kind, regex, inside/has) or a complex rewrite (`transform`/`rewriters` → `/use-astgrep transform`)
4. Define scope: path or glob (`--stdin` / `--globs`) — start narrow before going wide

### 2. Dry-Run Matches

> Goal: see exactly what will change before any overwrite — mandatory

1. Run `ast-grep run -p '<pattern>' <path>` (no `-r`) — list all matches
2. Show a table of `No.`, `File`, `Line`, `Match` — count the total
3. Check for false positives: matches that shouldn't change (comments, strings, intentional tests) — tune the pattern or exclude scope
4. If matches = 0 → report and stop (the pattern may be wrong or there is genuinely no target)

### 3. Preview Diff

> Goal: the user sees the real before/after before apply

1. Run `ast-grep run -p '<pattern>' -r '<replacement>' <path>` (without `-U`) — sg enters interactive mode and shows a diff per match itself
2. With a rule file: `ast-grep scan --rule <file>` = list findings (dry run), `sg scan --rule <file> --fix` = interactive diff one change at a time
3. Inspect the first 3-5 diffs — if the rewrite is correct press `a` to accept all via sg; if broken, cancel and tune the pattern
4. If the repo has uncommitted changes → warn the user that reverting will be hard — recommend commit/stash first

### 4. Confirm And Apply

> Goal: overwrite only after the user has seen the diff and approved

1. Choose mode: `interactive` (sg confirms each change — suits high false-positive risk) or `bulk` (`-U` applies all — once the user has confirmed and the sample diffs are correct)
2. Bulk: `ast-grep run -p '<pattern>' -r '<replacement>' -U <path>` or `sg scan --rule <file> --fix-all` if using a rule file
3. Never apply without confirmation — dry-run is always the default (scripted paths included: `commitEdits`/`Bun.write` must preview the diff too)

### 5. Verify

> Goal: confirm the fix is correct, breaks nothing, and leaves nothing behind

1. Re-scan: `ast-grep run -p '<pattern>' <path>` → must show 0 matches (except intentional leftovers)
2. Do `/run-check` — lint/typecheck must pass, no syntax breakage from the rewrite
3. If it fails → fix broken files with `git checkout`/`git restore`, then tune the pattern (max 3 rounds)
4. Do `/report` with a summary: `No.`, `File`, `Changes`, `Status` + matches→applied→verified counts

## Rules

### 1. Dry-Run And Confirm

- Never run `-r`/`-U`/`--fix`/`--fix-all` before showing matches + diff and getting user confirmation — always dry-run first, no exceptions
- Start with a narrow scope (one subdir or glob) before expanding to the whole repo — fail fast reduces rework

### 2. Pattern Precision

- AST matching ignores semantics — a `console.log` pattern may match an intentional `logger.console.log`; always inspect matches
- The replacement must match the metavar structure — `$VAR` in the replacement must be captured from the pattern, not invented

### 3. Reversible

- The git working tree should be clean before applying — `sg` rewrites have no built-in undo
- If dirty → warn and offer commit/stash first; never apply silently

- Use /search-with-astgrep when needed (pattern syntax/search)
- Use /migrate when needed (staged migration plan, data, cutover)
- Use /use-astgrep-programmatic when needed (multi-file scan via napi, transforms YAML can't do)
- Use /ask-me when needed

## Expected Outcome

- Matches + diff preview always shown before overwrite — apply only after user confirmation
- No pattern matches remain after verification (`run-check` passes)
- Clear report: files changed, lines rewritten, intentional leftovers
