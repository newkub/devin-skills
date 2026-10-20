---
name: follow-service-resend
description: Use Resend to send transactional emails — send, templates, domains, webhooks
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test

---

## Goal

Use Resend to send transactional emails — send, templates, domains, webhooks

## Scope

- Setup: SDK install, `RESEND_API_KEY`, test send → `workflows/setup-resend/SKILL.md`
- Config: domain verification, `EMAIL_FROM`, templates, webhooks → `workflows/config-resend/SKILL.md`
- Verify: API key valid, domain verified → `workflows/verify-connection/SKILL.md`
- Package metadata (version, licence, docs) → `references/package-manifest.md`

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

| Topic  | Workflow |
|--------|----------|
| Setup  | `workflows/setup-resend/SKILL.md` — SDK install, `RESEND_API_KEY`, test send |
| Config | `workflows/config-resend/SKILL.md` — domain verification, `EMAIL_FROM`, templates, webhooks |
| Verify | `workflows/verify-connection/SKILL.md` — API key valid, domain verified |

Read `workflows/<name>/SKILL.md` per topic and follow the flow there — do not execute from this table directly

### 1. Setup And Usage

> Goal: Use it correctly per the official docs

Latest: `resend@6.30.0` (verified 2026-09-26) — install with `bun add resend`

1. Create `new Resend(apiKey)` — apiKey from env `RESEND_API_KEY`
2. Send with `resend.emails.send({from,to,subject,html/react})` — verify the domain before production
3. Use React email components or HTML templates — preview in the dashboard
4. Set webhooks for delivery/bounce events if tracking is needed

### 2. Verify

> Goal: Confirm correct usage

1. Do `/run-verify` for lint, typecheck
2. Do `/run-test` if relevant tests exist
3. Check the latest official docs before using an uncertain API (service resend)

## Rules

- The from address must use a verified domain — never @resend.dev in production
- Retry with idempotency — never send duplicate emails
- Separate transactional vs marketing (Resend Broadcasts)
- Store secrets in env; never commit them

## Expected Outcome

- Library used correctly per best practices (service resend)
- No known security/performance pitfalls (service resend)
- Lint, typecheck, tests pass
