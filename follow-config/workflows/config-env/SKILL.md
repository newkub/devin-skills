---
name: follow-config-config-env
description: Manage .env patterns — env files, validation, secrets handling per conventions
argument-hint: "[env-file-or-scope]"
related:
  - follow-config
  - check-secrets
  - follow-secret-manager
  - update-config
---

## Goal

Inspect and manage the project's env configuration per the right patterns — complete `.env` files, validation present, no secret leaks, aligned with framework conventions

## Scope

- Apply to all env config: `.env`, `.env.local`, `.env.example`, `.env.<mode>`, env loading in code
- Covers: file patterns, required vars, validation, secrets handling, gitignore coverage
- Does not cover updating actual env values — use `update-config/workflows/config-env/SKILL.md`

## Execute

### 1. Inventory Env Files

> Goal: Know which env files and vars exist

1. Find all `.env*` files in the repo — root and per-workspace
2. Run `/check-secrets env-vars` — vars used by code vs vars defined
3. Identify framework env conventions — e.g. `NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*` prefixes as detected

### 2. Check Patterns

> Goal: Env setup follows conventions

1. `.env.example` lists every required var — no real values, only placeholders/comments
2. `.env` and `.env.local` are gitignored — verify `.gitignore` coverage
3. Env validation at startup — schema validation (e.g. zod/arktype per stack) for required vars, type coercion, clear fail-fast messages
4. No hardcoded secrets in code — run `/check-secrets secrets-leak`

### 3. Fix Gaps

> Goal: Close the gaps found

1. Create/update `.env.example` to cover all vars the code actually uses
2. Add `.env*` patterns to `.gitignore` if missing — keep `.env.example` committed
3. Add env validation if absent — validate at startup, not at runtime access
4. Real secrets → run `/follow-secret-manager` — never commit

### 4. Verify

> Goal: Env setup works and is safe

1. Run dev/build with the existing env — passes validation
2. Test a missing var → clear error message, not an undefined crash
3. `git status` / `git check-ignore` confirm `.env` is not tracked

## Rules

- Never commit secrets or real values — `.env.example` uses placeholders only
- Validation must fail-fast at startup naming the missing var
- Framework prefix conventions must be correct — only public vars are exposed to the client
- Merge with existing env files — never drop unknown vars without asking the user
- If a committed secret is found → notify the user immediately; it must be rotated, not just deleted from a file

## Expected Outcome

- `.env.example` is complete and gitignore protects secrets
- Env validation fails fast with clear messages
- No secrets in code or git-tracked files
