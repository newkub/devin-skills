# Secrets Management Validation Rules

## Hardcoded Secrets

- ตรวจ API keys, tokens, passwords, certificates ใน source code
- ตรวจ secrets ใน config files, test files, example files
- ตรวจ secrets ใน commit history
- Detection: `grep` หา `api_key`, `secret`, `password`, `token` ที่มีค่าจริง
- ใช้ `trufflehog`, `git-secrets`, `gitleaks` สำหรับ secret scanning

## Secret Storage

- ตรวจ env vars: ใช้สำหรับ non-production, validate ตอน startup
- ตรวจ secret manager: `Infisical`, Doppler, AWS Secrets Manager, HashiCorp Vault
- ตรวจ encrypted at rest: database encryption, file encryption
- ตรวจ no plaintext secret file: `.env` ไม่ commit, `.env.local` ใน `.gitignore`

## Secret Rotation

- ตรวจ rotation policy: ระบุ rotation period, owner, procedure
- ตรวจ key versioning: key version, key ID, old key grace period
- ตรวจ old key revocation: revoke หลัง grace period, audit revocation
- ตรวจ emergency rotation: procedure สำหรับ breach scenario

## Secret Masking

- ตรวจ logs: ไม่ log secret, mask ใน debug output
- ตรวจ error messages: ไม่ expose secret ใน error, generic message
- ตรวจ API responses: ไม่ return secret ใน response, filter sensitive field
- ตรวจ debug output: ไม่ expose secret ใน debug mode, production-safe debug
- Detection: `grep` หา `password`, `token`, `secret` ใน `console.log`, `logger`

## Secret Transmission

- ตรวจ TLS: HTTPS สำหรับ secret transmission, TLS 1.2+
- ตรวจ mTLS: สำหรับ service-to-service secret exchange
- ตรวจ no plaintext: ไม่ส่ง secret ผ่าน HTTP, email, chat
- ตรวจ no secret in URL: query parameter, fragment — ห้าม

## Gitignore And Pre-Commit

- ตรวจ `.gitignore`: `.env`, `.env.local`, secret files
- ตรวจ `.env.example`: มี template, ไม่มีค่าจริง
- ตรวจ pre-commit hook: secret scanning ก่อน commit
- ตรวจ CI secret scan: scan ใน CI pipeline, block on detection
- Detection: ตรวจ `.gitignore`, `.husky/`, `lefthook.yml`, `.github/workflows/`

## Severity Criteria

- Critical: hardcoded production secret, secret in public repo, secret in logs, no encryption at rest, secret in URL
- High: missing rotation policy, secret in error message, missing pre-commit scan, weak TLS, no CI secret scan
- Medium: missing `.env.example`, suboptimal masking, missing rotation documentation
- Low: minor naming, documentation gap
