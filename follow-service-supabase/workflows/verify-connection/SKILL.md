---
name: follow-service-supabase-verify-connection
description: Confirm after setup/config that Supabase really connects — URL/anon/service keys valid, project healthy, queries respond
related:
  - follow-service-supabase
---

## Goal

Confirm after setup/config that Supabase really connects — URL/anon/service keys valid, project healthy, queries respond

## Scope

- Used when `/follow-service-supabase` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change schema/RLS

## Execute

### 1. Check Credentials

> Goal: URL and keys complete with correct format

1. Check `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) + `SUPABASE_ANON_KEY` exist
2. If server-side is used → `SUPABASE_SERVICE_ROLE_KEY` exists — flag it if it leaks into the client bundle
3. Local dev → `supabase status` shows the local stack running

### 2. Smoke Test

> Goal: the API really responds

1. `curl <SUPABASE_URL>/auth/v1/health` → 200 = project up
2. Init the client → query `select 1` or read an existing table
3. Flag: 401 (invalid key), 404 (wrong URL/ref), unexpected RLS blocks

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `project-down` / `rls-blocked`

## Rules

- Use read calls only — never insert/update/delete
- Do not print the service role key — show only the key type found
- A service key in client-side code = a Critical finding

## Expected Outcome

- Verdict with project-ref + health evidence
