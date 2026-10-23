---
name: follow-tool-gitleaks
description: Set up and use gitleaks to scan secrets in git history, staged changes, and working tree
argument-hint: "[scope]"
related:
  - check-secrets
  - follow-tool-mise
---

## Goal

Use `gitleaks` to prevent secrets (API keys, tokens, private keys) from entering git — scan staged/history + wire into hooks and CI

## Scope

- Install/use the `gitleaks` CLI, config `.gitleaks.toml`, baseline report
- Wire into git hooks (`pre-commit`/`pre-push`) and CI jobs
- Not for storing/loading secrets (use `/check-secrets` to inspect env + `fnox`/vault for secret management)

- Latest: `gitleaks@v8` line (Gitleaks by Zachary Rice, OSS) — upstream is feature-complete, security patches only
- Docs: https://github.com/gitleaks/gitleaks
- References: [cli](references/cli.md) | [apis](references/apis.md) | best-practices/
- References: [gitleaks — Best Practices](best-practices/gitleaks.md)

## Execute

### 1. Install

> Goal: have the gitleaks binary ready to use

1. `mise use -g gitleaks` (recommended — per `/follow-tool-mise`) or `winget install Gitleaks.Gitleaks` / `scoop install gitleaks`
2. Verify with `gitleaks version`
3. In a monorepo, use the same build across every workspace — pin the version in `mise.toml` or toolchain config

### 2. Scan

> Goal: scan current state and history

1. Working tree: `gitleaks dir . -v`
2. Staged (before commit): wire the pre-commit hook — `repo: https://github.com/gitleaks/gitleaks` + `id: gitleaks` in `.pre-commit-config.yaml`, or the example `pre-commit.py` in `.git/hooks`
3. Full history: `gitleaks git . --redact -r gitleaks-report.json`
4. If old findings are already rotated → create a baseline: `gitleaks git . -b .gitleaks-baseline.json` then keep scanning with `-b .gitleaks-baseline.json`

### 3. Configure `.gitleaks.toml`

> Goal: rules match the project

1. Start from the default config and add `[[allowlists]]` (v8.25+; older `[allowlist]`) for test fixtures, docs examples, placeholder tokens (`paths`, `regexes`, `commits`)
2. Add `[[rules]]` only when the project has its own secret format the default rules don't cover
3. Commit `.gitleaks.toml` at the repo root

### 4. Wire Hooks And CI

> Goal: block secrets before they reach the remote

1. Git hooks: the gitleaks pre-commit hook (`repo: gitleaks/gitleaks` + `id: gitleaks`) or the example `pre-commit.py` (this monorepo does it via `.moon/workspace.yml` `vcs.hooks`); `detect`/`protect` are deprecated since v8.19 — use `git`/`dir`/`stdin`
2. CI: add a `gitleaks git . --redact` step or `gitleaks/gitleaks-action@v2`
3. If there are findings → rotate the secret first, then add it to the baseline

### Use Cases

| Scenario | Use case |
|----------|----------|
| Block a secret at the commit | `usecases/pre-commit-secret-guard.md` |
| Scan history once and keep an honest baseline | `usecases/history-scan-and-baseline.md` |

## Rules

- Never commit secrets just "to make the scan pass" — always rotate first
- Always use `--redact` in CI/hooks output so secrets don't surface in logs
- Use a baseline only for pre-existing findings that have been rotated — never use it to suppress new problems
- Keep the allowlist as narrow as possible (specific path + regex)

## Expected Outcome

- `gitleaks` installed and scanning clean, or with a clear baseline
- `.gitleaks.toml` committed and hooks/CI enforcing it
