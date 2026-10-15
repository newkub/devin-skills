---
name: follow-service-stripe-verify-connection
description: Confirm after setup/config that Stripe really connects — secret key valid, expected mode, webhook secret present
related:
  - follow-service-stripe
---

## Goal

Confirm after setup/config that Stripe really connects — secret key valid, expected mode, webhook secret present

## Scope

- Used when `/follow-service-stripe` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not create charges/customers

## Execute

### 1. Check Keys Present

> Goal: keys complete and mode consistent

1. Check `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` exist (do not print values)
2. Check key prefixes: `sk_test_`/`pk_test_` vs `sk_live_`/`pk_live_` — secret/publishable must be the same mode
3. Flag test keys in production config (or vice versa)

### 2. Smoke Test API Call

> Goal: the API responds with this key

1. `stripe balance retrieve` (CLI) or `stripe.balance.retrieve()` (SDK)
2. 200 = key valid; 401 = invalid/revoked
3. Record the mode the API confirms (test vs live)

### 3. Check Webhook Readiness

> Goal: the webhook endpoint is ready to receive events

1. Check `STRIPE_WEBHOOK_SECRET` format (`whsec_...`)
2. Local dev → `stripe listen` runs and forwards to the correct URL
3. Production → the dashboard webhook endpoint points at the production URL (HTTPS)

### 4. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `mode-mismatch` / `webhook-not-ready`

## Rules

- Use read calls only — never create a checkout/charge
- Do not print key values — show only prefix/mode
- Mode mismatch = always flag (test key in prod = critical)

## Expected Outcome

- Verdict with mode + account evidence
