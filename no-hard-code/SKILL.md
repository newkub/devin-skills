---
name: no-hard-code
description: Move hardcoded values (secrets, URLs, magic strings) to env/config/constants
argument-hint: "[@files... | scope]"
related:
  - refactor
  - check-secrets
  - follow-secret-manager
  - update-config
  - deep-review-codebase
  - follow-single-of-source
  - use-astgrep
  - update-references
  - run-verify
  - report-before-after
---

## Goal

Remove hardcoded values from the code — move them to env vars, config files, or shared constants by type, so that values can be changed without editing code and secrets do not leak

## Scope

- If the user specifies `@files...` → clear only those files; if not specified → scan the given scope or the whole project
- secrets/credentials → route to `/check-secrets` + `/follow-secret-manager` (always rotate first)
- user-facing strings → route to `/deep-review-codebase` (extraction to locale files)
- config inconsistency across envs → route to `/deep-review-codebase`
- mechanical batch across many files → `/use-astgrep rewrite` (always dry-run + confirm before overwriting)

## Execute

### 1. Inventory Hardcoded Values

> Goal: know what is hardcoded and where, split by type

1. scan literals in the scope — string literals, magic numbers, URLs, paths, ports, timeouts, thresholds, feature flags
2. Group by type: `secrets` (keys, tokens, passwords), `urls` (endpoints, hosts, redirect URIs), `env-specific` (booleans, limits that differ per environment), `domain constants` (magic numbers/strings that are business rules), `i18n strings` (user-facing text)
3. Flag false positives out — literals in tests/fixtures, schema defaults, protocol constants (`HTTP/1.1`), type discriminators
4. Always do `/check-secrets` first — a hardcoded secret = an incident, not a refactor

### 2. Classify Destination

> Goal: each value goes to the right place by its nature

| Type | Destination |
|------|-------------|
| secrets | env vars + secret manager (`/follow-secret-manager`) — never commit the real value |
| urls/endpoints | env vars or config per environment |
| env-specific values | env vars with a safe default + `.env.example` placeholder |
| domain constants | `constants/` or a shared config module — one fact one source (`/follow-single-of-source`) |
| magic numbers that cannot explain themselves | a named constant with a name that states the intent |
| i18n strings | `/deep-review-codebase` extraction flow |

### 3. Extract

> Goal: the code reads values from a single source, no literals scattered around

1. Move the value to the destination per the table — use the project's existing config/env pattern before creating a new one
2. Replace the literal with a reference (env lookup, config import, constant) — for a mechanical batch → `/use-astgrep rewrite`
3. If the same value appears in several places → extract once then share — do not keep duplicates
4. Add validation/fail-fast at the boundary if a missing value fails silently (`/update-config`)

### 4. Update References And Docs

> Goal: all consumers use values from the new source

1. Do `/update-references` for every site that used the literal
2. Update `.env.example`, deployment docs, and README if a new env var is added
3. secrets → add to `.gitignore` checks and rotate per `/follow-secret-manager` if it was ever committed

### 5. Verify

> Goal: no hardcoding remains and behavior is unchanged

1. re-scan the scope — the original literals must be gone (leaving only the false positives that were flagged)
2. Do `/run-verify` — tests/typecheck/build pass, behavior is unchanged
3. The app really boots with the new env — a missing env fails fast, not a silent fallback to a wrong value
4. `/report-before-after` — count per type, files changed

## Rules

### 1. Preserve Behavior

- Refactor only — the values the app sees must be identical in every environment, do not change real values in the same pass
- Do not mix with a feature/fix in the same commit

### 2. Security First

- A secret that was ever committed = compromised → always rotate before extract
- Never move a secret to a file that is committed to the repo — `.env` must be in `.gitignore`

### 3. Don't Over-Extract

- Literals that are protocol/format constants or used once and are clear → no need to extract (`/dont-over-engineer`)
- Leave test fixtures/mocks alone unless they are a real secret

### 4. Single Source

- The same value must have a single definition — extraction must consolidate, not move duplication into config

- Use /refactor if necessary
- Use /check-secrets if necessary
- Use /update-config if necessary
- Use /run-verify if necessary

## Expected Outcome

- No secrets, URLs, env-specific values, magic strings/numbers embedded in the code
- Every value has a single source that can be changed without editing code
- `.env.example`/docs are fully updated — the app fails fast when config is missing
- Passes lint/typecheck/test/build — behavior unchanged
