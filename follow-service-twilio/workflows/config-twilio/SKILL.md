---
name: follow-service-twilio-config-twilio
description: Set/edit Twilio config — phone numbers, Messaging/Verify services, webhooks — merging safely
related:
  - follow-service-twilio
  - follow-secret-manager
  - deep-review-codebase
  - run-verify
  - run-test
---

## Goal

Set/edit Twilio configuration — phone numbers, Messaging Service, Verify Service, and webhook callbacks — merging with the existing config

## Scope

- Covers env keys, messaging/verify service SIDs, and webhook endpoints
- If the SDK is not installed or credentials are missing → do `workflows/setup-twilio/SKILL.md` first
- Does not include buying real numbers — the user does that in the Twilio Console

## Execute

### 1. Read Current Config

> Goal: Know the current config before editing

1. Read the existing env keys: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_MESSAGING_SERVICE_SID`, `TWILIO_VERIFY_SERVICE_SID`
2. Read the code that creates the client and the current webhook handlers
3. Do `/deep-review-codebase` with the `config` dimension if env drift vs code must be known

### 2. Configure Phone Numbers And Services

> Goal: Identify sender identities correctly

1. Set `TWILIO_PHONE_NUMBER` (E.164 format) or `TWILIO_MESSAGING_SERVICE_SID` for SMS
2. Set `TWILIO_VERIFY_SERVICE_SID` for OTP via the Verify API
3. Store all SIDs via `/follow-secret-manager` — merge with the existing env, never overwrite

### 3. Configure Webhooks

> Goal: Receive callbacks securely

1. Set the status callback / inbound webhook URL in the Twilio Console (phone number or messaging service settings)
2. Create a webhook receiver route such as `/api/webhooks/twilio`
3. Verify the signature with `twilio.validateRequest` against `TWILIO_AUTH_TOKEN` on every request
4. Respond `200` immediately and process async — Twilio retries on timeout

### 4. Verify

> Goal: config works for real

1. Send a test SMS or test OTP and watch the status callback hit the webhook
2. Do `/run-verify` and `/run-test` if relevant tests exist
3. If broken → revert the key just changed, then report the diff

## Rules

- Edit only the necessary keys — never overwrite the whole env/config set
- Always verify webhook signatures — never trust a request unchecked
- Do not log message bodies containing PII/OTP
- Watch regional compliance (sender IDs, opt-out) — see official docs if unsure

## Expected Outcome

- phone number/service SIDs correct and stored in the secret manager
- webhook route verifies signatures and receives callbacks
- test message/OTP sends successfully
