---
name: update-version-to-latest-verify-upgrade
description: Confirm after `/update-version-to-latest` that versions were actually bumped, the lockfile is consistent, and the project still works — call standalone when you need to re-verif...
related:
  - update-version-to-latest
---

## Goal



Confirm after `/update-version-to-latest` that versions were actually bumped, the lockfile is consistent, and the project still works — call standalone when you need to re-verify or suspect the upgrade was incomplete



## Scope



- Use when the parent dispatches to `verify`/`verify-upgrade`, or call it after an update completes

- Covers: manifest versions, lockfile consistency, build/test/typecheck, usage examples

- Read-only: inspection only — no re-update



## Execute



### 1. Verify Versions Actually Bumped



> Goal: Manifests actually show the new versions



1. `git diff` the manifests — versions changed as reported

2. Run `bunx taze` dry-run again → there should be no updates left (or only the ones intentionally deferred)

3. Flag packages claimed updated but whose manifest still shows the old version



### 2. Verify Lockfile Consistency



> Goal: Lockfile matches the manifests with no drift



1. `bun install --frozen-lockfile` (dry check) or `cargo metadata`/`go mod verify` per ecosystem

2. Flag lockfiles that resolve versions not matching the manifest ranges

3. Check for no duplicate/conflicting resolutions



### 3. Verify Project Green



> Goal: The upgrade didn't break anything



1. Run `/run-verify` — build, typecheck, lint, test

2. Run `/deep-test usage` — usage examples still work

3. If it fails → report the suspicious packages (latest diff) as rollback candidates — don't roll back yourself



### 4. Report



> Goal: Summarize the upgrade health



1. Use `/report` with columns: `No.`, `Check`, `Result`, `Evidence`, `Notes`

2. Verdict: `clean-upgrade` / `partial` / `broken`, with the packages that are rollback candidates



## Rules



- claimed-but-not-bumped = an inconsistency that must always be reported

- Add runtime verification (dev server, actual run) on top of typecheck for a major upgrade

- Don't re-update or downgrade in this workflow



## Expected Outcome



- Confirms versions/lockfile/project are consistent after the upgrade

- A list of rollback candidates if verification fails
