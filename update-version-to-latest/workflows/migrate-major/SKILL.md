---
name: update-version-to-latest-migrate-major
description: Safely upgrade a dependency/runtime across a major version — scan all breaking changes, use codemods, split the rollout into stages, and have a clear rollback path
related:
  - update-version-to-latest
---

## Goal



Safely upgrade a dependency/runtime across a major version — scan all breaking changes, use codemods, split the rollout into stages, and have a clear rollback path



## Scope



- Use when `/update-version-to-latest` finds major updates with high-risk breaking changes, or the user directly orders a major migration

- Covers: npm/bun packages, frameworks, runtime majors — one package at a time, or one related batch

- Don't use for patch/minor — do those through the normal `/update-version-to-latest` flow



## Execute



### 1. Scan Breaking Changes



> Goal: Know every breaking change before touching code



1. Read the package's CHANGELOG, migration guide, and release notes from official docs/repo — if there's no guide, use `/learn` (web)

2. Build a checklist: removed APIs, renamed APIs, behavior changes, new required config, peer dep requirements

3. `scan-codebase` to find every call site using a changed API — list all file:line occurrences

4. Assess risk — if it affects the public API or many workspaces → confirm via `/ask-me` before starting



### 2. Prepare Rollback



> Goal: Able to roll back at any time



1. Check that `git status` is clean — commit or stash pending work first

2. Record the current version and lockfile state — rollback = revert commit + reinstall

3. Write clear rollback steps before starting the migration



### 3. Apply Codemods Then Manual Fixes



> Goal: Transform code with tooling before manual edits



1. Run the official codemod if the package provides one — see the migration guide

2. If there's no codemod → use `/use-astgrep` or `/migration-with-astgrep` to write patterns that transform renamed/removed APIs

3. Manually fix the parts a codemod can't handle — behavior changes, config moves, type changes

4. Update the version in the manifest, then install — separate commit: `chore: migrate <pkg> to v<N>`



### 4. Staged Verify And Rollout



> Goal: Verify layer by layer, no big-bang



1. Per package/batch: typecheck → lint → unit tests → `/run-verify` → `/deep-test usage`

2. monorepo → verify one dependent workspace at a time, leaf packages before consumers

3. Run `/deep-review` to find any remaining deprecated usage

4. Runtime smoke test on the critical paths that use that package



### 5. Report



> Goal: Summarize results along with what's left



1. Run `/report-before-after` — version, breaking changes found, call sites fixed

2. List follow-ups still undone, e.g. deprecated APIs still in use



## Rules



- Never update several unrelated majors at once — only one related batch at a time

- You must have a breaking changes checklist and a rollback plan before writing

- Use codemods/ast-grep instead of manual edits when possible

- Never commit if verification doesn't pass — revert and report

- If breaking changes affect the project's own public API → `/ask-me` first



## Expected Outcome



- The major version is fully migrated, with verification passing at every stage

- All breaking changes are handled, with no deprecated usage left unnoticed

- A clear rollback path — a single revert commit gets you back
