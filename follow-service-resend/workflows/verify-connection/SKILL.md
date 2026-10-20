---
name: follow-service-resend-verify-connection
description: Verify Resend connects — API key valid and sending domain verified (read-only)
related:
  - follow-service-resend
  - run-verify
  - report
---

## Goal

Confirm after setup/config that Resend really connects — `RESEND_API_KEY` valid, sending domain verified

## Scope

- Used when `/follow-service-resend` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not send real emails (the test send lives in the setup workflow)

## Execute

### 1. Check API Key

> Goal: `RESEND_API_KEY` exists and is valid

1. Check the env var has a value (do not print it)
2. Call `resend.domains.list()` — 200 = key valid, 401 = invalid

### 2. Check Domain Status

> Goal: the sending domain is verified and ready

1. Find the domain used in `EMAIL_FROM` from the domains list
2. Flag any domain whose status is not `verified` — DNS records still incomplete
3. If there is no domain at all → sending only works via `onboarding@resend.dev`

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `domain-unverified` / `no-domain`

## Rules

- Use list/read calls only — never `resend.emails.send`
- Do not print the API key
- Domain unverified → report the missing DNS records for the config workflow to handle

## Expected Outcome

- Connection verdict with domain status evidence
