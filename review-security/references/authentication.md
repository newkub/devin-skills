# Authentication Validation Rules

## Login Flow

- ตรวจ credential validation: ต้อง validate ทั้ง email และ password ก่อน query
- ตรวจ password hashing: bcrypt (cost 12+), argon2id, scrypt — ห้าม MD5, SHA1, plain SHA256
- ตรวจ brute force protection: rate limit ต่อ IP และต่อ account, exponential backoff
- ตรวจ account lockout: lockout threshold, lockout duration, unlock mechanism
- ตรวจ timing attack prevention: constant-time comparison สำหรับ password และ token

## Registration

- ตรวจ email verification: ส่ง verification link, token expiry, single-use token
- ตรวจ password strength: min length 12+, complexity, breached password check (Have I Been Pwned)
- ตรวจ duplicate account prevention: unique email, unique username, case-insensitive check
- ตรวจ bot prevention: CAPTCHA, honeypot, rate limit

## Password Reset

- ตรวจ token generation: `crypto.randomBytes`, ขั้นต่ำ 256 bits — ห้าม `Math.random`
- ตรวจ token expiry: ขั้นต่ำ 1 ชม. สูงสุด 24 ชม.
- ตรวจ single-use token: invalidate หลังใช้, invalidate หลัง request ใหม่
- ตรวจ reset link security: HTTPS only, no token in URL log, no token in referrer

## MFA

- ตรวจ TOTP: RFC 6238, time step 30s, secret length 160 bits
- ตรวจ SMS: ใช้เฉพาะ fallback, ไม่เก็บ SMS code, rate limit
- ตรวจ hardware key: WebAuthn, FIDO2, challenge-response
- ตรวจ backup codes: single-use, hashed storage, 10+ codes
- ตรวจ MFA bypass prevention: ไม่มี path ที่ข้าม MFA, session แยก pre/post MFA

## Session Management

- ตรวจ session storage: httpOnly, Secure, SameSite cookie — ห้าม localStorage
- ตรวจ session expiry: idle timeout, absolute timeout, sliding expiration
- ตรวจ session fixation: regenerate session ID หลัง login, หลัง privilege change
- ตรวจ concurrent session limit: max session per user, oldest session eviction

## OAuth And OIDC

- ตรวจ state parameter: random, single-use, validated ที่ callback
- ตรวจ PKCE: S256 challenge, code verifier 43-128 chars
- ตรวจ redirect URI validation: exact match, no wildcard, no open redirect
- ตรวจ token exchange: HTTPS, no token in URL, validate ID token signature

## Severity Criteria

- Critical: plaintext password, weak hashing (MD5/SHA1), no email verification, MFA bypass, session fixation, OAuth state missing, token in URL
- High: weak password policy, no brute force protection, no lockout, short session expiry, no PKCE, no httpOnly cookie
- Medium: suboptimal hashing cost, suboptimal lockout, missing sliding expiration
- Low: minor naming, documentation gap
