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
  - follow-up-to-date
---

## Goal

Update dependencies, runtime, tools, CI versions, and versioned config in every workspace/package to the latest, then verify that build, test, typecheck, lint, and usage examples still pass

## Scope

- Update every versioned surface found in the repo: dependencies, devDependencies, peerDependencies, catalog versions, mise tools, GitHub Actions versions, Docker base images, packageManager field, runtime config
- Use the right tool per ecosystem: `bun`/`bunx taze` for Node/Bun, `cargo update` for Rust, `go get -u ./...` for Go, `pip install -U` or `uv` for Python
- Supports monorepos: Moon, Turbo, pnpm workspace, Cargo workspace
- One-shot run: dry-run → update → install → build → test → `/deep-test usage` → report
- The executor for the dependencies/runtime/tools/CI domains per the dispatch table in `/follow-up-to-date`
- Fast path: workflow `workflows/update-versions/SKILL.md` — a one-shot flow that updates every ecosystem (detect → dry-run → snapshot → update → install → diff report → verify) with no changelog analysis or separate batch commits; use the full Steps 1-8 flow when you need changelog analysis, a major migration, or separate batch commits

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

| Topic | Workflow |
|-------|----------|
| Major version upgrade — breaking changes scan, codemods, staged rollout, rollback | `workflows/migrate-major/SKILL.md` |
| `verify`, `workflows/verify-upgrade/SKILL.md` — confirm versions bumped, lockfile consistent, project green | `workflows/verify-upgrade/SKILL.md` |
| Fast path — one-shot update across every ecosystem, no changelog analysis | `workflows/update-versions/SKILL.md` |

1. If the argument is `verify` → follow the flow in the `workflows/verify-upgrade/SKILL.md` section — no re-update
2. If the argument is `fast` → follow the flow in the `workflows/update-versions/SKILL.md` section
3. If nothing is specified → run Steps 1-8 as usual, with Steps 6-7 reading the `workflows/verify-upgrade/SKILL.md` section to execute

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


## Expected Outcome

- All dependencies, runtime, tools, and CI versions updated to the latest stable
- Lock files updated with no conflicts
- Build, typecheck, test, and lint pass
- `/deep-test usage` passes
- Reports the versions changed, breaking changes, and next actions
