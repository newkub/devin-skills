---
name: check-secrets-env-vars
description: Audit env vars across .env, .env.example, and code usage for missing or extra keys
argument-hint: "[path]"
related:
  - follow-secret-manager
  - check-secrets
  - open-web-for-config-secret
  - search
  - report

---

## Goal

Audit the project's environment variables for consistency across `.env`, `.env.example`, `.env.*` variants, and code usage — find keys that are missing, extra, or hardcoded

## Scope

- Use when auditing a project's env vars before deploy or onboarding a new person
- Covers `.env`, `.env.local`, `.env.example`, `.env.production`, `.env.development`, `wrangler.toml`, `docker-compose.yml`, CI env references
- Checks code usage such as `process.env.*`, `Bun.env.*`, `import.meta.env.*`, `os.environ`, `std::env::var`
- Read-only: no file edits, never expose secret values

## Execute

### 1. Collect Env Files

> Goal: Collect all env files and keys

1. Use `find_file_by_name` to find `.env*` and env-related configs in the project
2. Read keys (not values) from each file
3. Group them: `.env.example` (canonical), `.env*` (local), CI/deploy configs
4. If there is no `.env.example` → use `.env` as the baseline and flag it in the report

### 2. Scan Code Usage

> Goal: Find env vars actually used by the code

1. Use `grep` to find patterns: `process.env.<NAME>`, `Bun.env.<NAME>`, `import.meta.env.<NAME>`, `os.environ`, `std::env::var`
2. Collect unique env var names with file:line
3. Separate vars with default fallbacks from required vars

### 3. Compare Sets

> Goal: Compare keys between files and code

1. Missing in `.env`: keys the code uses but `.env` lacks
2. Missing in `.env.example`: keys present in `.env` but absent from the example (newcomers will break)
3. Unused: keys in `.env` that the code never uses
4. Drift: keys present in some env variants but missing in others
5. Placeholder/localhost detection — a key exists but is unusable in practice:
   - `placeholder` — value matches patterns like `your-*`, `xxx`, `changeme`, sample `sk_test_...` values, `REPLACE_ME`
   - `localhost` — value points at `localhost`/`127.0.0.1` for a key expected to be a remote service (check whether the service actually runs, e.g. `DATABASE_URL` → `localhost:5432` with no Postgres)
   - Never echo values — report only the status, same as the `open-web-for-config-secret` skill (`set`/`placeholder`/`localhost`/`missing`)

### 4. Check Secret Safety

> Goal: Verify no secrets leaked

1. Run `/check-secrets secrets-leak` to scan `.env*` committed into the repo
2. Ensure `.env.example` has no real values — placeholders only, e.g. `KEY=your-key-here`
3. Ensure `.gitignore` covers `.env*` (except `.env.example`)
4. If leaked secrets are found → recommend `/follow-secret-manager` and `/open-web-for-config-secret`

### 5. Report

> Goal: Summarize results so they can be fixed immediately

1. Produce `/report` with columns: `No.`, `Key`, `Status`, `Found In`, `Action`
   - For `missing`/`placeholder`/`localhost` keys → the Action points to `/open-web-for-config-secret` (the inventory table has the console URL + entry fields)
2. Status: `missing-env`, `missing-example`, `placeholder`, `localhost`, `unused`, `drift`, `leaked`
3. Summarize counts and rank `leaked`/`missing-env`/`placeholder`/`localhost` first
4. Split Required (block boot) vs Feature-Gated per the inventory format of `/open-web-for-config-secret`
5. Recommend a next action per finding

## Rules

### 1. No Secret Exposure

- Never show secret values in output — show only key names
- Never copy values from `.env` into `.env.example`
- If a real secret is found in the repo → report it immediately and do not log the value

### 2. Read-Only

- Inspect and report only — never modify env files
- Never add keys automatically — propose a diff for the user to choose

### 3. Coverage

- Check every `.env*` variant and framework-specific patterns (`NEXT_PUBLIC_`, `VITE_`, `NUXT_`)
- Check env references in CI (`env:` blocks) and deployment configs

- Use /follow-secret-manager if needed
- Use /check-secrets secrets-leak if needed
- Use /search-files-patterns if needed

## Expected Outcome

- Full visibility into which env vars are missing, extra, or drifting between files and code
- `.env.example` is complete and free of real secrets
- A prioritized report with an action per finding
