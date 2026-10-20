---
name: follow-service-twilio-verify-connection
description: Verify Twilio connects — credentials valid, numbers and webhooks ready (read-only)
related:
  - follow-service-twilio
  - report
---

## Goal

Confirm after setup/config that Twilio really connects — Account SID/Auth Token valid, messaging service/numbers ready

## Scope

- Used when `/follow-service-twilio` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not send SMS/calls

## Execute

### 1. Check Credentials

> Goal: SID and token all present

1. Check `TWILIO_ACCOUNT_SID` (`AC...` format) and `TWILIO_AUTH_TOKEN` exist (do not print values)
2. If a messaging service is used → `TWILIO_MESSAGING_SERVICE_SID` (`MG...`) exists

### 2. Smoke Test API Call

> Goal: account fetch responds

1. `twilio api:core:v2010:accounts:fetch` or `client.api.accounts(sid).fetch()`
2. 200 = credentials valid; 401 = invalid token, 404 = wrong SID
3. Record the account status (`active`/`suspended`)

### 3. Check Numbers And Webhooks

> Goal: sending capability ready

1. `client.incomingPhoneNumbers.list({limit: 5})` — numbers available to send from
2. Check the configured webhook URLs match the app endpoints
3. flag: no number, number without SMS capability

### 4. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `no-numbers` / `webhook-mismatch`

## Rules

- Use fetch/list calls only — never send a message/call
- Do not print the auth token
- suspended account = flag immediately

## Expected Outcome

- Verdict with account status + numbers evidence
