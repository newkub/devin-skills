---
name: follow-config-config-gitignore
description: Manage .gitignore patterns per ecosystem — deps, build, env, OS, IDE files
argument-hint: "[path]"
related:
  - follow-config
  - update-gitignore
  - follow-gitignore
  - check-secrets
---

## Goal

Inspect and manage `.gitignore` so it fully covers the ecosystem — dependencies, build output, env files, OS/IDE files — tracking nothing it shouldn't and ignoring nothing beyond need

## Scope

- Apply to `.gitignore` at root and per-workspace/subdirectory where present
- Covers: ecosystem patterns (Node, Rust, Python, Go), build outputs, env/secrets, OS files, IDE files
- Full pattern detail lives in `/follow-gitignore` and `/update-gitignore`

## Execute

### 1. Detect Ecosystems

> Goal: Know what to ignore for the stack

1. Check manifests: `package.json`/`bun.lock` → Node, `Cargo.toml` → Rust, `pyproject.toml` → Python, `go.mod` → Go
2. Check tools that generate artifacts: `dist/`, `.next/`, `.turbo/`, `.moon/`, `target/`, `__pycache__/`, `.venv/`
3. Check IDEs/OS in use: `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db`

### 2. Audit Current .gitignore

> Goal: Find gaps and over-ignoring

1. Read the current `.gitignore` — compare against the patterns the ecosystem needs
2. Find tracked files that should be ignored: `git ls-files` vs the patterns — e.g. `.env`, `node_modules`, build output already committed
3. Find over-broad ignore patterns — e.g. ignoring all `*.json` caused committable config to be dropped
4. Run `/check-secrets secrets-leak` — files containing secrets must be ignored or moved out

### 3. Fix Patterns

> Goal: .gitignore complete and precise

1. Add missing patterns per ecosystem — use each stack's standard patterns, see `/follow-gitignore`
2. Fix tracked-but-should-ignore: `git rm -r --cached <path>` then add the pattern — notify the user first since it changes the index
3. Narrow over-broad patterns — use path prefixes instead of global globs where possible
4. Group patterns with comment headers (# Dependencies, # Build, # Env, # OS, # IDE)

### 4. Verify

> Goal: Confirm ignoring behaves correctly

1. `git check-ignore -v <file>` tests key files both to ignore and not to ignore
2. `git status` — no artifacts/env files left untracked that should be ignored
3. Confirm config files that must be committed are still tracked

## Rules

- Use the ecosystem's standard patterns — never guess a pattern; when unsure check official docs/gitignore templates
- `.env*` must be ignored except `.env.example` — tracked secrets must be rotated, not just untracked
- Never ignore source or config files the project needs
- `git rm --cached` is an index change — notify the user before doing it on many files
- Ignore only generated/local files — never ignore to hide a problem

## Expected Outcome

- `.gitignore` covers deps, build, env, OS, IDE per the ecosystem
- No generated/secret files are tracked
- No over-ignoring that drops config
