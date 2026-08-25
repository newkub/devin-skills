# API Security Validation Rules

## Rate Limiting

- ตรวจ per-IP rate limit: ทุก sensitive endpoint มี limit
- ตรวจ per-user rate limit: limit ตาม authenticated user
- ตรวจ per-endpoint rate limit: limit ตาม endpoint sensitivity
- ตรวจ sliding window: ใช้ sliding window หรือ fixed window
- ตรวจ exponential backoff: `Retry-After` header, 429 response
- ตรวจ auth endpoint: strict limit สำหรับ login, register, password reset
- Detection: `grep` หา `rateLimit`, `rateLimiter`, middleware usage

## Input Validation

- ตรวจ schema validation: Zod, Valibot, ArkType สำหรับทุก input
- ตรวจ type checking: validate type ก่อน process
- ตรวจ size limits: max body size, max field length, max array length
- ตรวจ field allowlist: ไม่ accept unknown field, strip extra field
- ตรวจ content type: validate `Content-Type` header
- Detection: `ast-grep` หา route handler ที่ไม่มี schema validation

## Output Sanitization

- ตรวจ sensitive field filtering: ไม่ return `password`, `token`, `secret` ใน response
- ตรวจ response shape consistency: consistent structure, no leaky field
- ตรวจ error response: no stack trace, no internal detail, generic message
- ตรวจ pagination: limit page size, max result count

## Error Handling

- ตรวจ no stack trace leak: ไม่ return stack trace ใน production
- ตรวจ generic error message: ไม่ expose internal detail
- ตรวจ error code mapping: map internal error ไปยัง public error code
- ตรวจ error logging: log full error ที่ server, return generic ที่ client
- Detection: `grep` หา `err.stack`, `error.message` ใน response

## API Authentication

- ตรวจ token validation: JWT signature, expiry, issuer, audience
- ตรวจ API key management: key rotation, key scope, key storage
- ตรวจ JWT verification: `verify` ไม่ใช่ `decode`, algorithm pinning
- ตรวจ token refresh: refresh token rotation, refresh token expiry

## API Versioning

- ตรวจ deprecated version: sunset header, deprecation notice
- ตรวจ breaking change: version bump, migration guide
- ตรวจ version support: supported version, EOL version

## CORS

- ตรวจ origin allowlist: ไม่ใช้ wildcard `*` สำหรับ credential request
- ตรวจ credential policy: `credentials: true` กับ allowlist origin เท่านั้น
- ตรวจ preflight handling: `OPTIONS` handler, `Access-Control-Allow-Methods`
- ตรวจ header allowlist: `Access-Control-Allow-Headers`, `Access-Control-Expose-Headers`
- Detection: `grep` หา `cors`, `Access-Control-Allow-Origin`

## CSP

- ตรวจ `default-src 'self'`: ค่าเริ่มต้น restrictive
- ตรวจ `script-src`: ไม่ allow `unsafe-inline`, `unsafe-eval`
- ตรวจ `style-src`: ใช้ nonce หรือ hash
- ตรวจ `img-src`: allowlist domain
- ตรวจ `connect-src`: allowlist API domain
- ตรวจ `frame-ancestors`: `none` หรือ allowlist — ป้องกัน clickjacking
- Detection: `grep` หา `Content-Security-Policy`, `helmet`

## Severity Criteria

- Critical: missing rate limiting on auth endpoint, no input validation, stack trace in response, wildcard CORS with credentials, no JWT verification
- High: missing CSP, inconsistent rate limiting, missing API versioning, weak CORS, missing output sanitization
- Medium: suboptimal rate limit, missing pagination limit, suboptimal error mapping
- Low: documentation gap, minor naming
