---
name: check-secrets-hardcoded-values
description: Scan for hardcoded URLs, IPs, credentials, and magic strings that belong in config
argument-hint: "[path]"
related:
  - update-config
  - check-secrets
  - search
  - use-astgrep
  - report

---

## Goal

Find hardcoded values in source code that should move to config/env — URLs, IP addresses, ports, file paths, API-key patterns, and repeated magic strings

## Scope

- Scan source files in `src/`, `app/`, `lib/` (excluding `test/`, `mock/`, `fixtures/`, docs)
- Patterns: URLs (`https?://`), IPs, localhost/ports, absolute paths, credential-like strings, magic strings repeated in ≥3 places
- Read-only: reporting only — kept separate from `/check-secrets secrets-leak`, which handles real credentials

## Execute

### 1. Scan Patterns

> Goal: Find hardcoded values by category

1. Use `/search-files-patterns` or `/use-astgrep` to scan patterns:
   - URLs: `https?://` other than example/localhost mentions in comments
   - IPs: `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`
   - Localhost/ports: `localhost:\d+`, `127.0.0.1`, `0.0.0.0`
   - Absolute paths: `C:\\`, `/Users/`, `/home/`
2. Scan for string literals repeated across ≥3 files — candidates for a shared constant
3. Skip secret patterns → hand off to `/check-secrets secrets-leak`

### 2. Classify

> Goal: Categorize by where each value should move

1. `env-var` → values that differ per environment (API base URL, host) → belong in `.env`
2. `config` → constants that are the same across environments → config file
3. `constant` → repeated magic strings → shared constants file
4. `acceptable` → localhost in dev-only code, example URLs in types/comments → not counted

### 3. Report

> Goal: Summarize with fix locations

1. Use `/report` with columns: `No.`, `File:Line`, `Value`, `Category`, `Severity`, `Move To`
2. Severity: `critical` (prod URL/IP in code), `warning` (dev-only hardcoded), `info` (duplicate strings)
3. Recommend `/check-secrets env-vars` after values move to env

## Rules

### 1. Evidence-Based

- Every finding needs `file:line` and the actual value (mask anything secret-like)
- Do not flag test fixtures, example code, or documentation

### 2. No Secret Handling

- If a value is a real credential → hand off to `/check-secrets secrets-leak`; do not report the full value here

### 3. Read-Only

- Do not change code or create config — report with an `/update-config` recommendation

- Use /check-secrets secrets-leak for real credentials
- Use /check-secrets env-vars to audit env keys after refactoring
- Use /update-config when the config structure needs changes

## Expected Outcome

- A list of hardcoded values categorized by fix target
- A plan to move values into env/config/constants
