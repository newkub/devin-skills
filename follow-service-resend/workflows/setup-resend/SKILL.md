---
name: follow-service-resend-setup-resend
description: Install the Resend SDK, store RESEND_API_KEY, and smoke-test a send server-side
related:
  - follow-service-resend
  - follow-secret-manager
  - open-web-for-config-secret
  - check-secrets
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

Install the Resend SDK, create an API key from the dashboard, and init the client so it can send transactional email — first-time setup only

## Scope

- Install the `resend` package and init `new Resend(apiKey)`
- Create and store `RESEND_API_KEY` securely
- Send a test email in sandbox mode
- Does not cover domain verification, from-address, webhooks → use `workflows/config-resend/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: Confirm the current state before installing (idempotent)

1. Read `package.json` to identify runtime and package manager
2. Check whether `resend` is already installed → if so, skip to verify
3. Do `/check-secrets env-vars` to see whether `RESEND_API_KEY` already exists
4. If there is no Resend account → stop and tell the user to create one from the dashboard

### 2. Install SDK

> Goal: Install the package per runtime

1. Node/Bun: `bun add resend` (or the detected package manager)
2. Other languages (Python, Go, etc.) → check official docs
3. Confirm the dependency is in `package.json`

### 3. Create And Store API Key

> Goal: Prepare the API key securely

1. Create an API key from the Resend Dashboard — use `/open-web-for-config-secret` (service resend)
2. Pick the minimum required permission (e.g. sending access only)
3. Store `RESEND_API_KEY` in `/follow-secret-manager`, then inject it into the environment — never commit

### 4. Init Client And Smoke Test

> Goal: Init the client and send a test email

1. Create the client with `new Resend(process.env.RESEND_API_KEY)` server-side only
2. Send a test email with `resend.emails.send({ from, to, subject, html })` — before domain verification use `onboarding@resend.dev` as the from
3. Check the response `id` confirms the send — if it errors → do `/resolve-errors` max 3 rounds
4. Do `/run-verify` for lint, typecheck

### 5. Verify

> Goal: the SDK is ready to use

1. Do `/run-verify` for lint, typecheck
2. If verify fails → do `/resolve-errors` max 3 rounds, then stop and report
3. Success → do `/suggest-next-action`

## Rules

- Never hardcode the API key or commit secrets — always use `/follow-secret-manager`
- The client must stay server-side only — never expose `RESEND_API_KEY` to the browser
- `onboarding@resend.dev` is for sandbox/testing only — production needs a verified domain
- If unsure about an API/method → check official docs or `/learn-from-web`

## Expected Outcome

- `resend` SDK installed and present in `package.json`
- `RESEND_API_KEY` secure and correctly injected
- Test email sent successfully and verify passes
