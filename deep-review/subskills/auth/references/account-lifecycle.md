# Account Lifecycle Checklist — review-auth

## Registration And Verification

- [ ] email verification — required before full access, link expiry (24h typical)
- [ ] verification token — single-use, cryptographically random, not guessable
- [ ] disposable emails — policy for tempmail providers (block/allow flagged)
- [ ] enumeration resistance — signup response same for existing vs new email
- [ ] rate limiting — registration attempts throttled per IP/device
- [ ] CAPTCHA/bot protection — on public signup, not just login

## Password Recovery

- [ ] reset flow — email link, not security questions alone
- [ ] reset token — single-use, short expiry (15-60min), cryptographically random
- [ ] enumeration resistance — "if email exists, we sent a link" response always
- [ ] reset invalidates sessions — old sessions killed on password change
- [ ] reset notification — email sent on successful reset ("was this you?")
- [ ] brute force — reset endpoint rate limited, token guess impossible

## Magic Links And Passwordless

- [ ] link expiry — short (15min typical), single-use
- [ ] device binding — link works only on requesting device/session
- [ ] phishing resistance — no sensitive action from email link alone
- [ ] replay protection — token can't be reused, even if valid

## Lockout And Disable

- [ ] account lockout — after N failed attempts, temporary or permanent
- [ ] lockout duration — escalating delays (1min → 5min → 30min → admin review)
- [ ] unlock mechanism — admin unlock, self-service via email, timed auto-unlock
- [ ] disabled account — all sessions invalidated, API keys revoked
- [ ] compromised account — freeze path, force reset, notify user

## Account Deletion

- [ ] self-service delete — user can initiate, confirmation required
- [ ] grace period — 7-30 days before permanent delete (if business needs)
- [ ] data purge — PII removed/anonymized, not just soft-deleted
- [ ] dependent resources — owned content handled (transfer, delete, orphan)
- [ ] billing/cancellation — subscription cancelled on delete
- [ ] audit log — deletion logged, retention per policy

## Session And Device Management

- [ ] active sessions list — user sees all logged-in devices
- [ ] remote logout — kill specific session or "logout all"
- [ ] concurrent sessions — policy (unlimited, 3 devices, 1 session)
- [ ] session binding — device fingerprint, IP change detection
- [ ] new device notification — email/alert on login from new device
- [ ] suspicious activity — impossible travel, unusual location flagged

## Password Policy

- [ ] minimum length — 8+ chars, 12+ recommended
- [ ] complexity — not over-restrictive (allows passphrases)
- [ ] breach check — `haveibeenpwned` API or local breach list
- [ ] common passwords — dictionary block (password123, qwerty)
- [ ] rotation — not forced arbitrary expiry (NIST deprecated)
- [ ] reuse prevention — last N passwords can't be reused

## Profile And Identity Changes

- [ ] email change — verify new email before switching, notify old
- [ ] username change — availability check, history tracking
- [ ] phone change — SMS verify, not just update
- [ ] linked accounts — add/remove OAuth providers safely
- [ ] profile visibility — who sees what, privacy controls

## Admin And Support Operations

- [ ] admin impersonation — logged, time-limited, user notified
- [ ] support reset — verified identity before manual reset
- [ ] bulk operations — mass disable/delete has approval workflow
- [ ] audit trail — all admin actions logged, immutable

## Compliance

- [ ] data retention — how long account data kept, legal basis
- [ ] export — user can download their data (GDPR)
- [ ] consent — terms/privacy acceptance tracked, versioned
- [ ] age verification — COPPA/GDPR-K if applicable

## Detection

- grep auth endpoints — `signup`, `reset`, `verify`, `delete`, `logout`
- grep session store — session list, device tracking
- test reset flow — enumeration, token reuse, expiry
- test deletion — data actually removed, sessions killed

Severity: no verification/enumeration possible = High, reset token guessable = Critical, no session invalidation on password change = High, no deletion path = High
