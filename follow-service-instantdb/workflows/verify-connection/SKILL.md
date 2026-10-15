---
name: follow-service-instantdb-verify-connection
description: Confirm after setup/config that InstantDB really connects — `INSTANT_APP_ID` valid, client query responds, admin token usable when present
related:
  - follow-service-instantdb
---

## Goal

Confirm after setup/config that InstantDB really connects — `INSTANT_APP_ID` valid, client query responds, admin token usable when present

## Scope

- Used when `/follow-service-instantdb` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not push schema or transact for real

## Execute

### 1. Check App Credentials

> Goal: app id and tokens are complete

1. Check `INSTANT_APP_ID` has a value (do not print it)
2. If the admin SDK is used → check `INSTANT_APP_ADMIN_TOKEN` exists
3. If using the CLI → `instant-cli whoami` confirms login

### 2. Smoke Test Query

> Goal: the client reaches the backend

1. Init the client with the app id → run an empty query `db.useQuery({})` or `db.queryOnce`
2. Confirm the response is not an auth error — an invalid app id fails here
3. If a schema exists → check `instant.schema.ts` is synced with the backend (`instant-cli pull` dry check)

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `invalid-app-id` / `auth-failed` / `schema-drift`

## Rules

- Use read queries only — never transact
- Do not print the admin token
- Schema drift → report it so `workflows/config-instantdb/SKILL.md` handles it

## Expected Outcome

- Connection verdict with app-id evidence
