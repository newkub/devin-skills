# Diff Quality Checklist — review-diff

## Secrets And Credentials

- [ ] API keys/tokens — `sk-`, `api_key`, `token`, `secret`, `bearer` patterns
- [ ] passwords — `password`, `passwd`, `pwd` assignments
- [ ] private keys — `-----BEGIN.*PRIVATE KEY-----`
- [ ] `.env` contents — real values not placeholders
- [ ] connection strings — DB URLs with credentials embedded
- [ ] auth headers — `Authorization:` values hardcoded

## Debug Leftovers

- [ ] `console.log`/`console.debug`/`print`/`println!`/`fmt.Println`/`dbg!`
- [ ] `debugger` statements — JS breakpoints left in
- [ ] commented-out code — blocks of dead code (not explanatory comments)
- [ ] `TODO`/`FIXME`/`HACK` — new markers without tracking
- [ ] `XXX`/`TEMP`/`TEST` markers — temporary labels
- [ ] verbose logging — `log::debug!`/`tracing::debug!` in hot paths

## Accidental Files

- [ ] editor artifacts — `.swp`, `.swo`, `*~`, `.vscode/settings.json` personal
- [ ] OS files — `.DS_Store`, `Thumbs.db`, `desktop.ini`
- [ ] build outputs — `dist/`, `build/`, `target/`, `node_modules/` committed
- [ ] personal notes — `notes.md`, `scratch.txt`, `tmp/`
- [ ] backup files — `*.bak`, `*.orig`, `*.old`
- [ ] generated files — lock files (if not tracked), coverage reports, test snapshots

## Formatting Noise

- [ ] whitespace-only — trailing spaces, blank line changes
- [ ] line-ending flips — CRLF↔LF changes (`.gitattributes` handles)
- [ ] import reordering — unrelated sorting changes
- [ ] indentation — tabs↔spaces flips outside convention
- [ ] unrelated formatting — entire file reformatted for 2-line change

## Scope Creep

- [ ] unrelated refactors — changes outside task scope
- [ ] drive-by fixes — "while I'm here" changes not asked for
- [ ] dependency updates — version bumps not related to task
- [ ] config changes — settings touched without clear need
- [ ] dead code removal — cleanup outside task boundaries

## Structural Issues

- [ ] file moves — renames that break references
- [ ] permission changes — `chmod`/`mode` changes on files
- [ ] binary files — images/binaries added without review
- [ ] symlink changes — links created/modified
- [ ] submodule changes — pointer updates without intent

## Incomplete Changes

- [ ] partial renames — symbol renamed in some places not others
- [ ] commented tests — tests disabled/skipped without reason
- [ ] `@skip`/`@ignore`/`xit`/`describe.skip` — test bypasses
- [ ] `#[ignore]`/`#[cfg(never)]` — conditional compilation hiding code
- [ ] feature flags — new flags added but not fully implemented

## Verification

- [ ] diff compiles — changes don't break build
- [ ] diff tests — tests pass with changes
- [ ] diff lint — lint passes, no new warnings
- [ ] diff secrets scan — `gitleaks`/`trufflehog` clean

## Detection

- `git diff --name-only` — file list, check for unexpected files
- `git diff` — scan for secrets, debug statements, TODOs
- `git status --porcelain` — untracked files review
- grep patterns — `sk-`, `-----BEGIN`, `console.log`, `debugger`, `TODO`, `FIXME`

Severity: committed secrets = Critical, debug breakpoints = High, accidental files = Medium, formatting noise = Low
