# review-security — Full Dimension Checklist

## 1. Authentication And Session

- [ ] credential handling, MFA, session fixation/expiry (เชื่อม `/review-auth`)
- [ ] token storage, CSRF protection, secure cookies

## 2. Authorization

- [ ] authz enforced server-side, BOLA/IDOR, privilege escalation
- [ ] default-deny, tenant isolation

## 3. OWASP Top 10

- [ ] injection (SQL/NoSQL/OS/LDAP), XSS (reflected/stored/DOM)
- [ ] broken access control, security misconfiguration
- [ ] SSRF, insecure deserialization, XXE
- [ ] vulnerable components (`/run-audit`), logging gaps

## 4. Secrets

- [ ] no hardcoded secrets, .env handling, key rotation
- [ ] secrets in logs/errors/history, client-side exposure

## 5. Injection And Input

- [ ] validation at boundaries, output encoding, parameterized queries
- [ ] command injection, template injection (SSTI)

## 6. API And Transport

- [ ] TLS config, HSTS, CSP, security headers
- [ ] rate limiting, mass assignment, CORS scope
- [ ] webhook signatures, GraphQL depth limits

## 7. Crypto And Files

- [ ] algorithms current (no MD5/SHA1/ECB), key management
- [ ] file upload: type/size validation, storage isolation
- [ ] path traversal, symlink attacks

## 8. Supply Chain And Privacy

- [ ] dependency provenance, lockfiles, SCA
- [ ] PII handling, data minimization (เชื่อม `/review-compliance`)

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
