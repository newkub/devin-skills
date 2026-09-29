# Coverage Checklist — review-data-validation

## Boundary Coverage

- [ ] every input source — HTTP body, query params, path params, headers, cookies, files
- [ ] every endpoint — no route skips validation (check all handlers)
- [ ] third-party inputs — webhooks, callbacks, external API responses validated
- [ ] env/config — startup validates env vars (type, required, format)
- [ ] internal boundaries — service-to-service, queue messages, event payloads

## Server Vs Client

- [ ] server validates — never trusts client validation alone
- [ ] client validates UX — server validates security
- [ ] schema shared — same schema client+server or documented divergence
- [ ] client bypasses — server still catches invalid (test with curl/postman)

## Field Types

- [ ] strings — length min/max, format (email, URL, slug, pattern), encoding
- [ ] numbers — int vs float, min/max, precision, sign, finite (no NaN/Infinity)
- [ ] booleans — strict true/false, not truthy coercion ("false" string)
- [ ] enums — whitelist values, case sensitivity, no arbitrary strings
- [ ] dates — format (ISO 8601), timezone, range (not future DOB, past expiry)
- [ ] UUIDs — valid v4, not just non-empty string
- [ ] emails — RFC 5322 or practical subset, disposable email policy
- [ ] URLs — scheme allowlist (http/https), no `javascript:`/`data:`/`file:`

## Complex Types

- [ ] arrays — min/max length, item type, unique constraint where needed
- [ ] objects — required vs optional fields, unknown field policy (strict/strip)
- [ ] nested objects — depth limit, recursion guard
- [ ] unions/discriminated — tagged unions validate discriminator first
- [ ] maps/records — key type validation, value validation
- [ ] optional/nullable — `optional()` vs `nullable()` vs `nullish()` distinct

## File Uploads

- [ ] file type — magic bytes checked, not just extension/MIME header
- [ ] file size — per-file limit, total request limit
- [ ] file count — max files per request
- [ ] filename — sanitized (no `../`, null bytes, control chars)
- [ ] content scan — virus/malware scan if user uploads
- [ ] image processing — dimension limits, decompression bomb protection

## Business Rules

- [ ] cross-field — `startDate < endDate`, `min ≤ max`, totals match line items
- [ ] conditional required — field X required if field Y = Z
- [ ] state transitions — valid status changes only (draft → published, not → deleted)
- [ ] uniqueness — username/email/identifier not taken (DB check)
- [ ] ownership — user can only reference their own resources
- [ ] quota/limits — max items per user, rate limits per action

## Output Validation

- [ ] response schema — defined shape, not just "return whatever"
- [ ] field whitelist — only intended fields serialized
- [ ] internal fields — `password_hash`, `internal_id`, `tenant_secret` stripped
- [ ] null handling — null vs missing vs default consistent
- [ ] sensitive data — PII masked/partial in responses where needed

## Edge Cases

- [ ] empty input — `""`, `{}`, `[]`, `null`, `undefined` handled
- [ ] boundary values — max int, min int, empty string, max length
- [ ] unicode — emoji, RTL, combining chars, null bytes
- [ ] malformed — truncated JSON, wrong types, extra fields
- [ ] injection — SQL, NoSQL, command, template, LDAP, XPath
- [ ] prototype pollution — `__proto__`, `constructor`, `prototype` keys

## Error Handling

- [ ] error format — consistent `{ error: { field, message } }` structure
- [ ] field errors — per-field, not just "invalid input"
- [ ] no internal leak — validation errors don't expose schema internals
- [ ] error codes — machine-readable codes for client handling
- [ ] localization — error messages i18n-ready

## Detection

- grep handlers — routes without validation middleware/schema
- grep `req.body`, `req.query`, `req.params` direct usage without validation
- grep `JSON.parse` on untrusted input without schema check
- fuzz — send malformed payloads, check 400 vs 500 vs crash

Severity: unvalidated user input to DB/shell = Critical, missing server validation = High, internal field leak = High, weak business rules = Medium
