---
name: follow-service-workos-verify-connection
description: Confirm after setup/config that WorkOS really connects — `WORKOS_API_KEY`/`WORKOS_CLIENT_ID` valid, API responds
related:
  - follow-service-workos
---

## Goal

Confirm after setup/config that WorkOS really connects — `WORKOS_API_KEY`/`WORKOS_CLIENT_ID` valid, API responds

## Scope

- Used when `/follow-service-workos` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change organizations/connections

## Execute

### 1. Check Credentials

> Goal: key and client id complete

1. Check `WORKOS_API_KEY` (`sk_...` test / live format) and `WORKOS_CLIENT_ID` (`client_...`) exist — do not print values
2. flag test keys in production config (or vice versa)
3. If webhooks are used → `WORKOS_WEBHOOK_SECRET` exists

### 2. Smoke Test API Call

> Goal: the WorkOS API responds

1. Call `workos.organizations.listOrganizations({limit: 1})` or an equivalent minimal call
2. 200 = key valid; 401 = invalid key
3. If using AuthKit → check the redirect URI config matches the app

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `env-mismatch` / `webhook-missing`

## Rules

- Use list calls only — never create/update/delete
- Do not print key values — show only prefix/environment
- Auth failure → recommend `/follow-secret-manager` — do not fix it yourself

## Expected Outcome

- Verdict with environment (test/live) evidence
