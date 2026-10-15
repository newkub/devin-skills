---
name: update-version-to-latest
description: Update dependencies, runtime, tools, CI in every workspace to latest, with verification
argument-hint: "[scope|verify]"
related:
  - resolve-errors
  - report
  - run-verify
  - ask-me
  - run-release
  - keepup-source-code
---

## Goal

Update dependencies, runtime, tools, CI versions, and versioned config in every workspace/package to the latest, then verify that build, test, typecheck, lint, and usage examples still pass

## Scope

- Update every versioned surface found in the repo: dependencies, devDependencies, peerDependencies, catalog versions, mise tools, GitHub Actions versions, Docker base images, packageManager field, runtime config
- Use the right tool per ecosystem: `bun`/`bunx taze` for Node/Bun, `cargo update` for Rust, `go get -u ./...` for Go, `pip install -U` or `uv` for Python
- Supports monorepos: Moon, Turbo, pnpm workspace, Cargo workspace
- One-shot run: dry-run → update → install → build → test → `/deep-test usage` → report
- Fast path: the `update-versions` section in Merged Details — a one-shot flow that updates every ecosystem (detect → dry-run → snapshot → update → install → diff report → verify) with no changelog analysis or separate batch commits; use the full Steps 1-8 flow when you need changelog analysis, a major migration, or separate batch commits

## Execute

Run `/update-version-to-latest [scope]` once; the system carries out this sequence automatically.

### 1. Detect Versioned Surfaces

> Goal: Know what needs updating

1. Find all manifests: `package.json`, `bun.lock` (legacy: `bun.lockb`), `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `Cargo.toml`, `Cargo.lock`, `go.mod`, `go.sum`, `mise.toml`, `.tool-versions`, `pyproject.toml`, `uv.lock`, `.github/workflows/*.yml`
2. Record dependencies, devDependencies, peerDependencies, catalog versions, `packageManager`, `engines`, action versions, mise tool versions
3. Identify the ecosystems in use

### 2. Dry-Run Analysis

> Goal: See what would be updated first

1. Run `bunx taze` (no `-w` = dry-run) or `bun outdated` for Node/Bun — use `-r` for a recursive scan in a monorepo
2. Run `cargo update --dry-run` for Rust
3. Run `go list -u -m all` for Go
4. Consolidate major/minor/patch updates and build a table of `No.`, `Package`, `Current`, `Latest`, `Type`, `Risk`
5. If there are major updates → skim the changelogs, then use `/ask-me` before writing if the risk is high

### 3. Update Dependencies

> Goal: Update every dependency to latest

1. Update patch → `bunx taze patch -w -r` or `bun update`
2. Update minor → `bunx taze minor -w -r`
3. Update major → `bunx taze major -w -r` (batch by batch, checking breaking changes)
4. If there are catalog versions in the root `package.json` → update the catalog first, then install
5. `cargo update` for a Rust workspace
6. `go get -u ./...` then `go mod tidy` for Go
7. Update the `packageManager` field if present

### 4. Update Runtime / Tools / CI

> Goal: Update runtime, dev tools, GitHub Actions, and versioned config

1. Update `mise.toml` / `.tool-versions` tools to the latest stable
2. Update GitHub Actions versions in `.github/workflows/*.yml` — `bunx taze` can also check actions (use the `--github-actions` flag), or check the latest release tag from the GitHub API
3. Update Docker base images (`FROM ...:`) if there's a `Dockerfile`
4. Update `engines` in `package.json` if needed
5. If there's a `biome.jsonc`, `.node-version`, or `.nvmrc` pinning a version → sync them to match

### 5. Install And Sync

> Goal: Keep the lockfile consistent

1. `bun install` for Bun/Node
2. `cargo fetch` or `cargo generate-lockfile` for Rust
3. `go mod tidy` for Go
4. Check that `bun.lock`/`pnpm-lock.yaml` has no conflicts

### 6. Verify

> Goal: Confirm the project still works

1. Run `/run-verify` or equivalent: build, typecheck, lint, test
2. For Rust: `cargo check --workspace`, `cargo test --workspace`
3. For Go: `go build ./...`, `go test ./...`
4. If there's Moon: `moon run :build :typecheck :lint :test`
5. If it fails → `/resolve-errors` then recheck

### 7. Test Usage

> Goal: Confirm usage examples still work

1. Run `/deep-test usage [scope]` to test the examples in `README.md`, `USAGE.md`, and `package.json` scripts
2. Record the examples that broke or need adjusting

### 8. Commit And Report

> Goal: Save the changes with a summary

1. Split commits by type: `chore: update patch dependencies`, `chore: update minor dependencies`, `chore: update major dependencies`, `chore: update runtime/CI versions` (if the user consents to push)
2. Use `/report` to summarize: `No.`, `Package`, `Old`, `New`, `Type`, `Status`
3. Report breaking changes or follow-up actions

### Workflows

> Goal: Dispatch specialized work to a more detailed workflow

| Topic | Section (Merged Details) |
|-------|----------|
| Major version upgrade — breaking changes scan, codemods, staged rollout, rollback | `migrate-major` |
| `verify`, `verify-upgrade` — confirm versions bumped, lockfile consistent, project green | `verify-upgrade` |
| Fast path — one-shot update across every ecosystem, no changelog analysis | `update-versions` |

1. If the argument is `verify` → follow the flow in the `verify-upgrade` section — no re-update
2. If the argument is `fast` → follow the flow in the `update-versions` section
3. If nothing is specified → run Steps 1-8 as usual, with Steps 6-7 reading the `verify-upgrade` section to execute

## Rules

### 1. One-Shot Flow

- The user calls `/update-version-to-latest [scope]` once; the system must loop through the steps to completion on its own
- If any step fails → stop, state the cause, and suggest the next action
- Don't require the user to re-run sub-commands

### 2. Update Order

- patch → minor → major
- runtime/tools → dependencies
- Update the catalog before install in a monorepo
- Don't update every major at once; if there are breaking changes, batch them and test one batch at a time

### 3. Safety

- Always dry-run before writing
- Check `minimumReleaseAge` if there's a security policy
- Never downgrade to fix a problem
- If a major update has high breaking-change risk → `/ask-me`
- Never commit if verification doesn't pass

### 4. Ecosystem Tools

- Bun: `bunx taze <mode> -w -r`, `bun update`, `bun install`
- Rust: `cargo update`, `cargo check --workspace`
- Go: `go get -u ./...`, `go mod tidy`
- Python: `pip install -U` or `uv pip compile`
- GitHub Actions: check the latest release tag from the GitHub API

### 5. Usage Verification

- Always run `/deep-test usage` after each update completes
- If a usage example breaks → fix it or update the docs before committing
- Use /run-release if needed

## Merged Details

### migrate-major

##### Goal



Safely upgrade a dependency/runtime across a major version — scan all breaking changes, use codemods, split the rollout into stages, and have a clear rollback path



##### Scope



- Use when `/update-version-to-latest` finds major updates with high-risk breaking changes, or the user directly orders a major migration

- Covers: npm/bun packages, frameworks, runtime majors — one package at a time, or one related batch

- Don't use for patch/minor — do those through the normal `/update-version-to-latest` flow



##### Execute



###### 1. Scan Breaking Changes



> Goal: Know every breaking change before touching code



1. Read the package's CHANGELOG, migration guide, and release notes from official docs/repo — if there's no guide, use `/learn` (web)

2. Build a checklist: removed APIs, renamed APIs, behavior changes, new required config, peer dep requirements

3. `scan-codebase` to find every call site using a changed API — list all file:line occurrences

4. Assess risk — if it affects the public API or many workspaces → confirm via `/ask-me` before starting



###### 2. Prepare Rollback



> Goal: Able to roll back at any time



1. Check that `git status` is clean — commit or stash pending work first

2. Record the current version and lockfile state — rollback = revert commit + reinstall

3. Write clear rollback steps before starting the migration



###### 3. Apply Codemods Then Manual Fixes



> Goal: Transform code with tooling before manual edits



1. Run the official codemod if the package provides one — see the migration guide

2. If there's no codemod → use `/use-astgrep` or `/migration-with-astgrep` to write patterns that transform renamed/removed APIs

3. Manually fix the parts a codemod can't handle — behavior changes, config moves, type changes

4. Update the version in the manifest, then install — separate commit: `chore: migrate <pkg> to v<N>`



###### 4. Staged Verify And Rollout



> Goal: Verify layer by layer, no big-bang



1. Per package/batch: typecheck → lint → unit tests → `/run-verify` → `/deep-test usage`

2. monorepo → verify one dependent workspace at a time, leaf packages before consumers

3. Run `/deep-review` to find any remaining deprecated usage

4. Runtime smoke test on the critical paths that use that package



###### 5. Report



> Goal: Summarize results along with what's left



1. Run `/report-before-after` — version, breaking changes found, call sites fixed

2. List follow-ups still undone, e.g. deprecated APIs still in use



##### Rules



- Never update several unrelated majors at once — only one related batch at a time

- You must have a breaking changes checklist and a rollback plan before writing

- Use codemods/ast-grep instead of manual edits when possible

- Never commit if verification doesn't pass — revert and report

- If breaking changes affect the project's own public API → `/ask-me` first



##### Expected Outcome



- The major version is fully migrated, with verification passing at every stage

- All breaking changes are handled, with no deprecated usage left unnoticed

- A clear rollback path — a single revert commit gets you back

### verify-upgrade

##### Goal



Confirm after `/update-version-to-latest` that versions were actually bumped, the lockfile is consistent, and the project still works — call standalone when you need to re-verify or suspect the upgrade was incomplete



##### Scope



- Use when the parent dispatches to `verify`/`verify-upgrade`, or call it after an update completes

- Covers: manifest versions, lockfile consistency, build/test/typecheck, usage examples

- Read-only: inspection only — no re-update



##### Execute



###### 1. Verify Versions Actually Bumped



> Goal: Manifests actually show the new versions



1. `git diff` the manifests — versions changed as reported

2. Run `bunx taze` dry-run again → there should be no updates left (or only the ones intentionally deferred)

3. Flag packages claimed updated but whose manifest still shows the old version



###### 2. Verify Lockfile Consistency



> Goal: Lockfile matches the manifests with no drift



1. `bun install --frozen-lockfile` (dry check) or `cargo metadata`/`go mod verify` per ecosystem

2. Flag lockfiles that resolve versions not matching the manifest ranges

3. Check for no duplicate/conflicting resolutions



###### 3. Verify Project Green



> Goal: The upgrade didn't break anything



1. Run `/run-verify` — build, typecheck, lint, test

2. Run `/deep-test usage` — usage examples still work

3. If it fails → report the suspicious packages (latest diff) as rollback candidates — don't roll back yourself



###### 4. Report



> Goal: Summarize the upgrade health



1. Use `/report` with columns: `No.`, `Check`, `Result`, `Evidence`, `Notes`

2. Verdict: `clean-upgrade` / `partial` / `broken`, with the packages that are rollback candidates



##### Rules



- claimed-but-not-bumped = an inconsistency that must always be reported

- Add runtime verification (dev server, actual run) on top of typecheck for a major upgrade

- Don't re-update or downgrade in this workflow



##### Expected Outcome



- Confirms versions/lockfile/project are consistent after the upgrade

- A list of rollback candidates if verification fails

### update-versions

##### Goal



Fast path — update dependencies, runtime, tools, and CI versions across every workspace/package to latest in a single run: detect → dry-run → snapshot → update → install → diff report → verify (no changelog analysis, no separate batch commits — if you need those, run Steps 1-8 instead)



##### Scope



- Covers every ecosystem detected: `Bun/Node` (`package.json` → `bunx taze` + `bun install`), `Rust` (`Cargo.toml` → `cargo update` + `cargo upgrade` if cargo-edit is present), `Go` (`go.mod` → `go get -u ./...` + `go mod tidy`), `Python` (`uv.lock` → `uv lock --upgrade` / `requirements.txt` → `pip install -U`), `mise` (`mise upgrade --bump`), `GitHub Actions` (`uses:` tags via `gh api` latest release)

- `--level`: `patch` / `minor` / `latest` (default `latest` = bump major/minor/patch all to newest)

- Dockerfile `FROM img:tag` — detect and report only (a registry check needs an external tool)



##### Execute



###### 1. Detect Ecosystems



> Goal: Know which ecosystems the repo has to update



1. Scan the manifests in scope: `package.json`, `Cargo.toml`, `go.mod`, `uv.lock`/`requirements.txt`, `mise.toml`/`.tool-versions`, `.github/workflows/*.yml`, `Dockerfile` — report counts per ecosystem

2. If there's no ecosystem → report and finish

3. Check the required tools: `bun`/`bunx`, `cargo`, `go`, `uv`/`pip`, `mise`, `gh` — skip an ecosystem whose tool is missing and state the reason



###### 2. Dry-Run And Confirm



> Goal: Report before writing — never change a manifest/lockfile without confirmation



1. Run a dry-run per ecosystem: `bunx taze`, `cargo update --dry-run`, `go list -u -m all`

2. Run `/report` showing ecosystems + a `dep old -> new` table — ask the user via `ask_user_question` (level `latest`/`minor`/`patch`)

3. Warn the user if the git working tree isn't clean (can't revert)



###### 3. Snapshot Update And Install



> Goal: Update to latest per level across every ecosystem



1. Snapshot the original versions (manifests + lockfiles) to build a diff report

2. Run the updaters per ecosystem according to level: `bunx taze <level> -w -r` + `bun install`, `cargo update` (+ `cargo upgrade --incompatible` if cargo-edit is present and level is latest), `go get -u ./...` + `go mod tidy`, `uv lock --upgrade` or `pip install -U`, `mise upgrade --bump`, bump `uses:` tags via `gh api` latest release

3. Re-snapshot → a `No.`, `Package`, `Old`, `New`, `File` table



###### 4. Verify And Report



> Goal: Confirm the project is still green



1. Verify automatically: `bun run verify`/`build`, `cargo check --workspace`, `go build ./...` per ecosystem found

2. If it fails → run `/resolve-errors` then recheck (max 3)

3. Run `/deep-test usage` per convention — usage examples must still work

4. Run `/report` to summarize: `No.`, `Package`, `Old`, `New`, `Type`, `Status`



##### Rules



- Dry-run first — never write a manifest/lockfile without confirmation; the `latest` level bumps majors too, so if the risk is high let the user choose `minor`

- Gracefully skip an ecosystem whose tool is missing and always state the reason — no silent failures

- Never downgrade to fix a problem — if an update breaks things, use `/resolve-errors` rather than rolling back versions yourself without asking



##### Expected Outcome



- An ecosystem detection report before starting

- All deps/tools/CI versions at latest per the chosen level + synced lockfiles

- An `old -> new` table per dep + verify results

## Expected Outcome

- All dependencies, runtime, tools, and CI versions updated to the latest stable
- Lock files updated with no conflicts
- Build, typecheck, test, and lint pass
- `/deep-test usage` passes
- Reports the versions changed, breaking changes, and next actions
