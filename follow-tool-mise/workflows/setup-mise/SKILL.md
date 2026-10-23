---
name: follow-tool-mise-setup-mise
description: Install the mise CLI and activate shell integration for first-time use
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - run-install
  - run-verify
---

## Goal

Install the mise CLI on the machine and activate shell integration so tools/env load automatically when entering a project directory — first-time setup

## Scope

For a machine/project without mise yet — install, shell activation, `mise doctor` verification. Writing `mise.toml` (tools/tasks/env) lives in `workflows/config-tools/SKILL.md`

## Execute

### 1. Check Current State

> Goal: check whether mise is already installed

1. Run `mise --version` — if it works → skip to step 3 (verify)
2. Check whether the project already has a `mise.toml` or `.tool-versions`

### 2. Install Mise

> Goal: install mise per OS

1. Pick the method for the environment:
   - Unix (macOS/Linux): `curl https://mise.run -o /tmp/mise-install.sh && sh /tmp/mise-install.sh`
   - Windows: `winget install jdx.mise` or `scoop install mise`
   - Cargo: `cargo install mise`
   - See official docs for other methods if unsure
2. Run `mise --version` to confirm the installation

### 3. Activate Shell Integration

> Goal: make mise load automatically in the shell

1. Add activation to the shell profile per the shell in use:
   - Bash: `eval "$(mise activate bash)"` in `~/.bashrc`
   - Zsh: `eval "$(mise activate zsh)"` in `~/.zshrc`
   - Fish: `mise activate fish | source` in fish config
   - PowerShell: `mise activate pwsh` output in `$PROFILE` (see official docs for the exact syntax)
2. Restart the shell or re-source the profile
3. Alternative: without activation → use `mise exec -- <command>` or the `mise x` shim mode

### 4. Verify

> Goal: confirm mise is ready to use

1. Run `mise doctor` — checks installation and activation health
2. `cd` into a project with a `mise.toml` and run `mise env` — env vars must load
3. If doctor reports problems → fix per its recommendations, then re-verify (max 3 rounds)

## Rules

### 1. Idempotent

- If `mise --version` works and `mise doctor` passes → verify only, never reinstall

### 2. Shell Activation

- Pick the activation method matching the user's real shell — never guess
- Commit only project config — the shell profile is user-level, don't edit it without need

### 3. Safety

- Always run `mise doctor` before fixing complex problems
- Don't delete mise cache/state without knowing the effect

- Use /follow-secret-manager if needed

## Expected Outcome

- mise installed and `mise --version` works
- Shell activation makes tools/env auto-load when entering a project
- `mise doctor` passes with no lingering issues
