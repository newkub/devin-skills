---
name: update-version-to-latest-update-versions
description: Fast path — update dependencies, runtime, tools, and CI versions across every workspace/package to latest in a single run: detect → dry-run → snapshot → update → install → diff ...
related:
  - update-version-to-latest
---

## Goal



Fast path — update dependencies, runtime, tools, and CI versions across every workspace/package to latest in a single run: detect → dry-run → snapshot → update → install → diff report → verify (no changelog analysis, no separate batch commits — if you need those, run Steps 1-8 instead)



## Scope



- Covers every ecosystem detected: `Bun/Node` (`package.json` → `bunx taze` + `bun install`), `Rust` (`Cargo.toml` → `cargo update` + `cargo upgrade` if cargo-edit is present), `Go` (`go.mod` → `go get -u ./...` + `go mod tidy`), `Python` (`uv.lock` → `uv lock --upgrade` / `requirements.txt` → `pip install -U`), `mise` (`mise upgrade --bump`), `GitHub Actions` (`uses:` tags via `gh api` latest release)

- `--level`: `patch` / `minor` / `latest` (default `latest` = bump major/minor/patch all to newest)

- Dockerfile `FROM img:tag` — detect and report only (a registry check needs an external tool)



## Execute



### 1. Detect Ecosystems



> Goal: Know which ecosystems the repo has to update



1. Scan the manifests in scope: `package.json`, `Cargo.toml`, `go.mod`, `uv.lock`/`requirements.txt`, `mise.toml`/`.tool-versions`, `.github/workflows/*.yml`, `Dockerfile` — report counts per ecosystem

2. If there's no ecosystem → report and finish

3. Check the required tools: `bun`/`bunx`, `cargo`, `go`, `uv`/`pip`, `mise`, `gh` — skip an ecosystem whose tool is missing and state the reason



### 2. Dry-Run And Confirm



> Goal: Report before writing — never change a manifest/lockfile without confirmation



1. Run a dry-run per ecosystem: `bunx taze`, `cargo update --dry-run`, `go list -u -m all`

2. Run `/report` showing ecosystems + a `dep old -> new` table — ask the user via `ask_user_question` (level `latest`/`minor`/`patch`)

3. Warn the user if the git working tree isn't clean (can't revert)



### 3. Snapshot Update And Install



> Goal: Update to latest per level across every ecosystem



1. Snapshot the original versions (manifests + lockfiles) to build a diff report

2. Run the updaters per ecosystem according to level: `bunx taze <level> -w -r` + `bun install`, `cargo update` (+ `cargo upgrade --incompatible` if cargo-edit is present and level is latest), `go get -u ./...` + `go mod tidy`, `uv lock --upgrade` or `pip install -U`, `mise upgrade --bump`, bump `uses:` tags via `gh api` latest release

3. Re-snapshot → a `No.`, `Package`, `Old`, `New`, `File` table



### 4. Verify And Report



> Goal: Confirm the project is still green



1. Verify automatically: `bun run verify`/`build`, `cargo check --workspace`, `go build ./...` per ecosystem found

2. If it fails → run `/resolve-errors` then recheck (max 3)

3. Run `/deep-test usage` per convention — usage examples must still work

4. Run `/report` to summarize: `No.`, `Package`, `Old`, `New`, `Type`, `Status`



## Rules



- Dry-run first — never write a manifest/lockfile without confirmation; the `latest` level bumps majors too, so if the risk is high let the user choose `minor`

- Gracefully skip an ecosystem whose tool is missing and always state the reason — no silent failures

- Never downgrade to fix a problem — if an update breaks things, use `/resolve-errors` rather than rolling back versions yourself without asking



## Expected Outcome



- An ecosystem detection report before starting

- All deps/tools/CI versions at latest per the chosen level + synced lockfiles

- An `old -> new` table per dep + verify results
