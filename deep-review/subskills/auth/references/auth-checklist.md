# Auth Review Checklist

## Authentication

- [ ] Passwords hashed ด้วย argon2id/bcrypt/scrypt (ไม่ใช่ MD5/SHA1)
- [ ] Password minimum length, complexity, breach-check
- [ ] Salt/pepper per user ไม่ใช่ global
- [ ] MFA/2FA เปิดใช้ได้สำหรับ role สำคัญ
- [ ] WebAuthn/passkey ceremony ถูกต้อง (challenge, origin, rpID)
- [ ] OAuth/OIDC state/nonce/PKCE ตรวจสอบ
- [ ] Magic link / reset token มี expiry และ one-time use
- [ ] Account lockout / rate-limit หลัง brute force
- [ ] Account verification email ไม่ leak ว่า email มีอยู่หรือไม่
- [ ] Error messages ไม่บอกว่า username หรือ password ผิดแบบเฉพาะเจาะจง

## Session & Token

- [ ] JWT ใช้ HS256/RS256 ไม่ใช้ none/HS256 กับ public key
- [ ] JWT secret/key ยาวพอ (>= 256 bits) และ rotate ได้
- [ ] JWT มี exp, iss, aud, sub
- [ ] Refresh token มี rotation และ binding
- [ ] Cookies มี HttpOnly + Secure + SameSite=Strict/Lax
- [ ] Session ID สุ่มด้วย CSPRNG
- [ ] Token ไม่อยู่ใน URL หรือ logs

## Authorization

- [ ] RBAC/ABAC มีการตรวจทุก protected route
- [ ] Resource access ตรวจ ownership/tenant
- [ ] No admin bypass หรือ debug flags
- [ ] IDOR ป้องกัน (UUID หรือ row-level check)
- [ ] CORS origin allowlist ไม่ใช่ `*`
- [ ] CSRF token หรือ SameSite cookie บน state-changing

## Secrets

- [ ] JWT secret, API keys, OAuth client secret ไม่อยู่ใน repo
- [ ] .env / secret manager ใช้งานถูกต้อง
- [ ] Default credentials ถูกลบ/เปลี่ยน

## Audit

- [ ] Auth events (sign in, sign out, password change, role change) ถูก log
- [ ] Logs ไม่เก็บ password/token
- [ ] Failed login attempts ถูกตรวจจับ

---
## Extended Full-Dimension Checklist

## 1. Authentication

- [ ] password policy: length, breach-check (haveibeenpwned), hashing (argon2/bcrypt)
- [ ] MFA: TOTP/WebAuthn, backup codes, enrollment flow
- [ ] brute force: rate limit, lockout, CAPTCHA ที่ถูกจุด
- [ ] magic links/OTP: expiry, single-use, no enumeration
- [ ] OAuth/OIDC: state, nonce, PKCE, redirect_uri validation

## 2. Session And Tokens

- [ ] session fixation protection, rotation after login
- [ ] token storage: httpOnly+Secure+SameSite cookies, ไม่ใช่ localStorage
- [ ] JWT: algorithm allowlist, expiry, audience/issuer checks
- [ ] refresh token rotation + reuse detection
- [ ] logout invalidates server-side; remember-me bounded

## 3. Authorization

- [ ] RBAC/ABAC enforced server-side ทุก request
- [ ] object-level authz (BOLA/IDOR), tenant isolation
- [ ] privilege escalation paths, admin actions audited
- [ ] deny-by-default, least privilege service accounts

## 4. Recovery And Lifecycle

- [ ] password reset: single-use tokens, expiry, no user enumeration
- [ ] account recovery ไม่ bypass MFA
- [ ] email/phone change verification, session invalidation on change
- [ ] deactivation/deletion flow, data retention

## 5. Secrets And Audit

- [ ] secrets ใน env/vault ไม่ hardcode, rotation policy
- [ ] auth events logged: login, fail, reset, privilege change
- [ ] anomaly detection: impossible travel, new device notify
- [ ] SSO/SCIM provisioning ถ้า enterprise

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)

