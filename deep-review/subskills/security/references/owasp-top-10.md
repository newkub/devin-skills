# OWASP Top 10 (2021) Validation Rules

## A01 Broken Access Control

- ตรวจ missing access control: ทุก endpoint มี auth check
- ตรวจ insecure direct object reference: ownership check ก่อน access
- ตรวจ forced browsing: ไม่ access resource โดยตรงด้วย URL
- ตรวจ privilege escalation: horizontal และ vertical
- Detection: `ast-grep` หา route ที่ไม่มี middleware, `grep` หา `req.params.id` ที่ไม่มี ownership check

## A02 Cryptographic Failures

- ตรวจ weak encryption: DES, RC4, MD5, SHA1 — ห้ามใช้
- ตรวจ plaintext transmission: HTTP สำหรับ sensitive data — ห้าม
- ตรวจ weak hashing: MD5, SHA1 สำหรับ password — ห้าม
- ตรวจ hardcoded key: encryption key ใน source code — ห้าม
- Detection: `grep` หา `md5`, `sha1`, `des`, `rc4`, `crypto.createCipher`

## A03 Injection

- ตรวจ SQL injection: parameterized query, ORM, no string concatenation
- ตรวจ NoSQL injection: query sanitization, no `$where` with user input
- ตรวจ command injection: no `exec` with user input, use `spawn` with args array
- ตรวจ LDAP, XPath, template injection
- Detection: `ast-grep` หา raw query, `grep` หา `exec(`, `eval(`, `${` ใน SQL

## A04 Insecure Design

- ตรวจ missing threat modeling: no threat model for critical feature
- ตรวจ insecure defaults: default allow, default admin, default open
- ตรวจ missing rate limiting: ทุก sensitive endpoint มี rate limit
- ตรวจ missing input validation: ทุก input มี schema validation

## A05 Security Misconfiguration

- ตรวจ default credentials: default password, default API key
- ตรวจ verbose errors: stack trace ใน production response
- ตรวจ missing security headers: HSTS, X-Frame-Options, X-Content-Type-Options
- ตรวจ open S3 bucket, open database port, debug mode in production
- Detection: `grep` หา `debug: true`, `stack`, `trace` ใน error response

## A06 Vulnerable Components

- ตรวจ outdated dependencies: `npm audit`, `bun audit`, known CVE
- ตรวจ unused dependencies: ลบออก, ลด attack surface
- ตรวจ transitive dependencies: ตรวจ sub-dependency vulnerabilities
- Detection: `bun audit`, `npm audit`, `osv-scanner`

## A07 Authentication Failures

- ตรวจ weak credential recovery: predictable reset token
- ตรวจ credential stuffing: no rate limit on login
- ตรวจ MFA gaps: MFA bypass, weak MFA implementation
- ตรวจ session timeout: ไม่หมดอายุ, ไม่ regenerate หลัง login

## A08 Software Integrity Failures

- ตรวจ unsigned updates: no signature verification
- ตรวจ missing CI security: no secret scanning, no SAST
- ตรวจ dependency confusion: no registry allowlist, no lockfile validation
- Detection: ตรวจ CI config, `.github/workflows/`, `renovate.json`

## A09 Logging Failures

- ตรวจ missing audit logs: no log for critical action
- ตรวจ log injection: no sanitization สำหรับ user input ใน log
- ตรวจ sensitive data in logs: password, token, PII ใน log
- Detection: `grep` หา `console.log`, `logger.info` ที่มี `password`, `token`, `secret`

## A10 SSRF

- ตรวจ unvalidated URL: user input ใน URL fetch โดยไม่ validate
- ตรวจ internal network access: ไม่ block `127.0.0.1`, `169.254.169.254`, `10.x.x.x`
- ตรวจ metadata endpoint: AWS, GCP, Azure metadata endpoint access
- Detection: `grep` หา `fetch(`, `axios.get` ที่มี user input ใน URL

## Severity Criteria

- Critical: A01-A10 vulnerability on critical path, data leak, RCE, authentication bypass
- High: A01-A10 vulnerability on non-critical path, missing security headers, outdated dependency with CVE
- Medium: missing threat model, suboptimal config, missing audit log
- Low: documentation gap, minor config improvement
