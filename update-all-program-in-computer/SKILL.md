---
name: update-all-program-in-computer
description: Update all programs installed on the machine through package managers
argument-hint: "[scope]"
related:
  - download-program
  - list-program-in-computer
  - report
  - suggest-next-action
  - run-program
---

## Goal

Update all programs, tools, and CLIs on the machine that are managed by package managers such as `mise`, `scoop`, `choco`, `winget`, `brew`, `cargo`, `npm`

## Scope

Use when you want to update every tool on the machine to its latest version without breaking project-specific dependencies

## Execute

### 1. Detect Package Managers And Global Configs

> Goal: Find which package managers exist and read the global configs

1. Use `/download-program` to detect the package managers available on the machine
2. Run `mise --version`
3. If `mise` is present → look for the global config at `~/.config/mise/config.toml` or `~/.mise.toml`
4. Read the `mise` global config to see the tools it manages
5. Run `scoop --version`
6. Run `choco --version`
7. Run `winget --version`
8. Run `brew --version`
9. Run `cargo --version`
10. Run `npm --version`
11. Record the available package managers

### 2. Update Each Manager

> Goal: Update the programs

1. `mise` → `mise up` or `mise upgrade` to update every tool in the global config
2. `scoop` → `scoop update` then `scoop update *`
3. `choco` → `choco upgrade all -y`
4. `winget` → `winget upgrade --all --include-unknown`
5. `brew` → `brew update` then `brew upgrade`
6. `cargo` → `cargo install-update -a` or `cargo install-update`
7. `npm -g` → `npm update -g`
8. Record the command output for each manager

### 3. Verify Versions

> Goal: Check that the updates succeeded

1. Run `mise ls` or `mise list` to check the versions of the tools in the global config
2. Run `mise outdated` to see the tools that are still behind
3. Run `scoop list` or `scoop status`
4. Run `choco list --local-only`
5. Run `winget list`
6. Run `brew list`
7. Run `cargo install --list`
8. Run `npm list -g --depth=0`
9. Compare the before/after versions

### 4. Report

> Goal: Summarize the results

1. Use `/report` with columns: Manager, Command, Status, Notes
2. State which managers succeeded and which reported errors
3. List the programs that were not updated and why
4. Run `/suggest-next-action`

### Subagents

> Goal: Parallelize the updates when there are many programs

- Use the `program-updater` profile (see `## Subagents` below) when several independent programs need updating — spawn one per program via `/use-subagents`, then merge the updated/skipped/failed results before reporting

## Rules

### 1. Safety

- Never update project-local dependencies
- Global packages only
- If a program could break the system → ask the user first

### 2. Package Manager Priority

- Try `mise` first when it is installed, because it is universal
- Then use the OS package manager
- Do not mix package managers for the same program

### 3. Non-Interactive

- Use the `-y`, `--yes` flags when needed
- If a command prompts interactively → use `--no-confirm` or accept the default
- If non-interactive execution is impossible → report it so the user runs it manually

- Use /list-program-in-computer if needed
- Use /download-program if needed
- Use /run-program if needed

## Subagents

> Goal: Independent work that spawned agents can run in parallel — the profiles live in this section, no separate files

### program-updater — check and update a single program through a package manager, then return updated/skipped/failed

- **Inputs**: `program` (the name of one program to update, e.g. `ripgrep`, `node`, `git`), `package-manager` (optional — the manager that must be used; when omitted, auto-detect in the order `mise` → OS package manager), `allow-major` (optional — whether a major version bump is allowed, defaulting to whatever is safe for the manager)
- **Tools**: `exec` only — version checks and upgrade commands: `mise use -g`, `scoop update`, `choco upgrade`, `winget upgrade`, `brew upgrade`, `cargo install-update`, `npm update -g` (never `write`/`edit`)
- **Execute**:
  1. Check that the program is installed and which manager handles it — check `mise ls`, `scoop list`, `winget list`, etc.
  2. If the program was not installed through a package manager → return `skipped` with the reason
  3. Record the version before the update (`<program> --version` or the manager's list output)
  4. Run the update with non-interactive flags (`-y`, `--yes`, `--no-confirm`) — if the command forces interaction → return `skipped` so the user runs it manually
  5. Check the version after the update and compare before/after
  6. Do a short smoke check that the program still runs (`--version` or `--help`)
- **Output**: one per-program field table `| Field | Value |` — Program, Manager, Before, After, Status (`updated`/`skipped`/`failed`/`already-latest`), Note (the reason when skipped/failed)
- **Constraints**: Global packages only — never touch project-local dependencies; use `exec` only, never `write`/`edit`; try `mise` first when the program is under mise — do not mix package managers for the same program; always use non-interactive flags — if that is impossible, return `skipped` rather than hanging on input; own a single program — never `update *` or `upgrade --all`; if the program risks breaking the system (OS-level tools) → return `skipped` so the parent asks the user

## Expected Outcome

- All programs are updated through the available package managers
- The status of each manager is reported
- The programs that could not be updated are listed
- The system still works normally after the updates
