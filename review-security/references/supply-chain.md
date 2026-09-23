# Supply Chain And Hardening Checklist — review-security

## Dependency Audit

- [ ] `/run-audit` — `npm audit`/`bun audit`/`cargo audit`/`pip-audit` no unpatched Critical/High
- [ ] known CVEs — check against OSV/GHSA/NVD for direct + transitive deps
- [ ] typosquatting — package names similar to legit ones (`lodash` vs `lodahs`)
- [ ] abandoned packages — no updates 2+ years, unmaintained, low usage
- [ ] dependency confusion — internal package names not registered publicly
- [ ] version pinning — exact versions or lockfile, not `latest`/`*`/`^` on critical deps
- [ ] new dep review — recent publish, low downloads, new maintainer = extra scrutiny

## Lockfile Integrity

- [ ] lockfile committed — `bun.lockb`/`package-lock.json`/`Cargo.lock`/`poetry.lock`
- [ ] integrity hashes — lockfile has sha512/checksums
- [ ] no manual edits — lockfile only modified by package manager
- [ ] lockfile diffs reviewed — dep changes in PRs get security review
- [ ] `npm ci`/`bun install --frozen` — CI installs from lockfile, not resolve new

## SBOM And Provenance

- [ ] SBOM generated — CycloneDX/SPDX manifest of all deps
- [ ] SBOM current — regenerated on dependency changes
- [ ] provenance — build attestations, signed commits where possible
- [ ] license compliance — deps' licenses compatible (GPL in proprietary = issue)
- [ ] vendor verification — third-party code verified, not blind-copied

## Build And CI Security

- [ ] build reproducible — same source → same binary
- [ ] CI secrets — not exposed in logs, scoped to job, rotated
- [ ] CI isolation — builds in sandboxed env, not shared runner with secrets
- [ ] artifact signing — binaries/packages signed before distribution
- [ ] pipeline review — CI config changes require approval
- [ ] dependency caching — cache poisoning prevention (hash-based keys)

## Runtime Hardening

- [ ] attack surface — only needed ports/services exposed
- [ ] default credentials — no default admin/password in shipped config
- [ ] debug endpoints — `/debug`, `/health`, `/metrics` not publicly accessible
- [ ] error details — stack traces, version info not leaked in responses
- [ ] security headers — `CSP`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- [ ] TLS — HTTPS only, HSTS preload, no mixed content
- [ ] environment — `NODE_ENV=production`, debug flags off

## Authz Matrix

- [ ] role × resource — matrix of who can do what documented
- [ ] every protected action — has authz check, not just authn
- [ ] default deny — new resources start closed, not open
- [ ] privilege boundaries — admin vs user vs service vs anonymous separated
- [ ] test coverage — authz matrix tested, not just implemented

## Secrets Rotation

- [ ] rotation policy — keys rotated regularly (90 days typical)
- [ ] last rotation tracked — age of each secret known
- [ ] breach response — procedure for rotating on suspected compromise
- [ ] no static secrets — prefer short-lived tokens/OIDC over long-lived keys
- [ ] secret inventory — all secrets cataloged, owner assigned

## Logging And Monitoring

- [ ] no secrets in logs — tokens, passwords, PII not logged
- [ ] audit trail — security events logged (auth, authz failures, admin actions)
- [ ] log injection — user input sanitized before logging (newlines, ANSI)
- [ ] alerting — suspicious patterns trigger alerts (brute force, privilege escalation)
- [ ] log retention — security logs kept per compliance, not auto-deleted

## Incident Response

- [ ] security contacts — who to notify on breach
- [ ] rollback plan — how to revoke compromised keys/certs
- [ ] disclosure policy — security.txt, vulnerability reporting process
- [ ] postmortem — process for security incident review

## Detection

- `npm audit`/`bun audit`/`cargo audit` — vulnerability scan
- `gitleaks`/`trufflehog` — secret scanning
- `syft`/`cyclonedx-cli` — SBOM generation
- `osv-scanner` — OSV database check
- grep `console.log`/`debug`/`println!` in prod paths
- `curl -I` — security headers on deployed response

Severity: known CVE unpatched = Critical, secret in repo/logs = Critical, missing lockfile = High, no SBOM = Medium, missing headers = Medium
