---
name: follow-service-twilio-setup-twilio
description: Install the Twilio SDK, store Account SID/Auth Token, and smoke-test the client server-side
related:
  - follow-service-twilio
  - follow-secret-manager
  - open-web-for-config-secret
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

Install the Twilio SDK and prepare credentials (Account SID, Auth Token) so the server can call the Twilio API — first-time setup, not ongoing config

## Scope

- Install the `twilio` package and create the client server-side
- Set `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` via the secret manager
- If already set up → verify only; phone numbers/webhooks config → `workflows/config-twilio/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: Confirm the project is ready and not yet set up

1. Check `package.json` for `twilio` already present — if present → skip to the verify step
2. Check env/secrets for `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
3. If credentials are missing → do `/open-web-for-config-secret` pointing the user to the Twilio Console

### 2. Install SDK

> Goal: Install the Twilio SDK server-side

1. Run `bun add twilio` (or the project's package manager)
2. Confirm the import works with `import twilio from 'twilio'`

### 3. Configure Credentials

> Goal: Store credentials securely

1. Create/find the Account SID and Auth Token in the Twilio Console
2. Store `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` via `/follow-secret-manager` — never commit or expose on the client side

### 4. Create Client

> Goal: client singleton ready to use

1. Create the client with `twilio(accountSid, authToken)` reading from env server-side only
2. Run a smoke check such as `client.messages.list({ limit: 1 })` to confirm the auth works

### 5. Verify

> Goal: the SDK actually works

1. Do `/run-verify` for lint, typecheck
2. If verify fails → do `/resolve-errors` max 3 rounds, then stop and report
3. Success → do `/suggest-next-action`

## Rules

- Never hardcode or commit the Account SID/Auth Token
- The client must live server-side only — never bundle it into a client
- Use official docs as the primary source; if unsure → see https://www.twilio.com/docs

## Expected Outcome

- `twilio` installed and the client works server-side
- credentials live in the secret manager, none in code
- smoke check passes — ready for `workflows/config-twilio/SKILL.md`
