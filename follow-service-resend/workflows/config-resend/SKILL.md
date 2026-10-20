---
name: follow-service-resend-config-resend
description: Set/edit Resend config — domains, from address, templates, webhooks — without clobbering
related:
  - follow-service-resend
  - follow-secret-manager
  - open-web-for-config-secret
  - check-secrets
  - run-verify
  - resolve-errors
---

## Goal

Set/edit Resend configuration — verified domains, from address, email templates, and webhooks — without clobbering existing settings

## Scope

- Verify the sending domain with DNS records (SPF/DKIM)
- Define from address and reply-to per environment
- Configure React/HTML templates and webhooks for delivery events
- Does not cover SDK install/API key → use `workflows/setup-resend/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: Know the current state before editing

1. Read the mail module, `.env*`, and templates that exist in the project
2. Do `/check-secrets env-vars` to identify missing vars such as `RESEND_API_KEY`, `EMAIL_FROM`
3. Check verified domains in the dashboard — use `/open-web-for-config-secret` (service resend)
4. If no SDK/API key yet → do `workflows/setup-resend/SKILL.md` instead

### 2. Verify Sending Domain

> Goal: Make the domain ready for production sending

1. Add the domain in the dashboard (Domains > Add domain)
2. Add the DNS records the dashboard specifies (SPF, DKIM, and MX for bounce if wanted) at the DNS provider
3. Wait for verification — check status in the dashboard until it shows verified
4. If DNS does not verify → recheck record names/values before telling the user

### 3. Configure From Address And Templates

> Goal: Define sender and template config consistently

1. Define `EMAIL_FROM` such as `Name <noreply@yourdomain.com>` in env — it must be a verified domain only
2. Keep from/reply-to in one project config; never scatter hardcodes through the code
3. Use React email components or HTML templates — preview/test before production
4. Merge only the necessary keys — never overwrite the existing config

### 4. Configure Webhooks

> Goal: Track delivery events securely (only if needed)

1. Add a webhook endpoint in the dashboard, selecting events such as `email.delivered`, `email.bounced`, `email.complained`
2. Store the webhook signing secret in `/follow-secret-manager`
3. Verify the signature every time per the official docs
4. Record the event id for idempotent handling — an email must never trigger twice

### 5. Verify

> Goal: Confirm email really sends from the verified domain

1. Send a test email from the real from address and check the inbox/headers (SPF/DKIM pass)
2. Do `/run-verify` — if it fails → revert the changed keys, do `/resolve-errors`, then report the diff

## Rules

- The from address must use a verified domain — never `@resend.dev` in production
- Separate transactional vs marketing (use Broadcasts for marketing)
- Secrets only through `/follow-secret-manager`; never commit
- Retry with idempotency — never send duplicate emails
- If unsure about a DNS field/API → check official docs or `/learn-from-web`

## Expected Outcome

- Domain verified with SPF/DKIM passing
- `EMAIL_FROM` clear and using a verified domain
- Templates really send and webhooks (if any) are secure
