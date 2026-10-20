---
name: follow-service-twilio
description: Use Twilio to send SMS/OTP/verify — Messaging, Verify API, webhooks
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test

---

## Goal

Use Twilio to send SMS/OTP/verify — Messaging, Verify API, webhooks

## Scope

- Setup: SDK install, Account SID/Auth Token → `workflows/setup-twilio/SKILL.md`
- Config: phone numbers, messaging service, webhook config → `workflows/config-twilio/SKILL.md`
- Verify: account fetch responds, numbers ready → `workflows/verify-connection/SKILL.md`
- Package metadata (version, licence, docs) → `references/package-manifest.md`

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

| Topic  | Workflow |
|--------|----------|
| Setup  | `workflows/setup-twilio/SKILL.md` — SDK install, Account SID/Auth Token |
| Config | `workflows/config-twilio/SKILL.md` — phone numbers, messaging service, webhook config |
| Verify | `workflows/verify-connection/SKILL.md` — account fetch responds, numbers ready |

Read `workflows/<name>/SKILL.md` per topic and follow the flow there — do not execute from this table directly

### 1. Setup And Usage

> Goal: Use it correctly per the official docs

Latest: `twilio@6.1.1` (verified 2026-09-12) — install with `bun add twilio`

1. Create the client with accountSid/authToken from env — never expose on the client side
2. Use the Verify API (`verify.v2.services().verifications`) for OTP — no need to manage codes yourself
3. Use Messaging (`messages.create`) for regular SMS — set messagingServiceSid
4. Receive status callbacks via webhook — verify the signature with the Twilio signature

### 2. Verify

> Goal: Confirm correct usage

1. Do `/run-verify` for lint, typecheck
2. Do `/run-test` if relevant tests exist
3. Check the latest official docs before using an uncertain API (service twilio)

## Rules

- Prefer the Verify API over self-managed OTP when possible
- Always verify webhook signatures
- Watch regional compliance (sender IDs, opt-out)
- Do not log message bodies containing PII/OTP

## Expected Outcome

- Library used correctly per best practices (service twilio)
- No known security/performance pitfalls (service twilio)
- Lint, typecheck, tests pass
