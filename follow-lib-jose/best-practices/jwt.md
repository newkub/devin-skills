# jose — JWT Security และ Key Management

## Recommended Patterns

### Algorithm Selection

- prefer `EdDSA` (Ed25519) — key เล็ก, verify เร็ว, modern
- `ES256` เป็น default ที่ปลอดภัยเมื่อ EdDSA ใช้ไม่ได้ (compat กว้าง)
- `RS256` สำหรับ legacy/enterprise compatibility — signature ใหญ่กว่า, ช้ากว่า
- `HS256` เฉพาะ symmetric use case ที่ secret จัดการได้จริง — ห้ามใช้เมื่อ secret อาจรั่ว (sharing key)
- ห้าม `alg: none`, `secp256k1`, `RSA1_5` — ถูกลบ/ไม่รองรับใน v6 และมีปัญหาความปลอดภัย

### Verify เสมอ

- `jwtVerify(token, key, {issuer, audience, algorithms})` — ไม่ใช่ `decodeJwt` อย่างเดียว
- decode เป็นแค่ parse — ไม่ verify signature — ห้ามเชื่อ claims จาก decode
- ระบุ `issuer` + `audience` เสมอ — ป้องกัน token จาก service อื่น
- pin `algorithms` array — ป้องกัน algorithm confusion attacks (HS256 vs RS256)
- `clockTolerance` สำหรับ clock skew เล็กน้อย (default 0) — ตั้ง ~5-30s ถ้า distributed systems

### Claims

- ตั้ง `iss`, `aud`, `exp`, `iat` เสมอ — chain: `new SignJWT(payload).setProtectedHeader({alg}).setIssuedAt().setIssuer().setAudience().setExpirationTime()`
- `exp` สั้นสำหรับ access token (5-15 นาที) — refresh token ยาวกว่า
- ใส่ claims เฉพาะที่จำเป็น — JWT ไม่เข้ารหัส (JWS), ทุกคนอ่าน payload ได้
- sensitive data → `EncryptJWT`/`jwtDecrypt` (JWE) หรือ nested JWT

### Key Management

- keys เป็น `CryptoKey`/`JWK`/`Uint8Array` — v6 คืน `CryptoKey` จาก `generateKeyPair`/`importJWK`
- private `KeyObject` (Node crypto) ใช้ verify/encrypt ไม่ได้ใน v6 — เก็บเป็น JWK หรือ re-import
- `createRemoteJWKSet(url)` สำหรับ public key discovery — fetch + cache อัตโนมัติ
- rotation ผ่าน `kid` header — verifier เลือก key ตาม `kid` จาก JWKS
- secrets/keys จาก env — ห้าม hardcode (ดู `/follow-secret-manager`)

## Do / Don't

| Do | Don't |
|---|---|
| `jwtVerify` พร้อม `issuer`/`audience`/`algorithms` | `decodeJwt` แล้วเชื่อ claims |
| `EdDSA` หรือ `ES256` สำหรับ new systems | `HS256` เมื่อ secret อาจ share |
| `exp` สั้น + refresh token แยก | access token อายุยาวเป็นชั่วโมง |
| `createRemoteJWKSet` สำหรับ third-party JWT | fetch JWKS เองทุก request |
| rotate keys ผ่าน `kid` | hardcode single key ใน code |

## Common Pitfalls

- ใช้ `decodeJwt` แทน verify → forge token ได้
- ไม่ pin `algorithms` → alg confusion (RS256 pub key ถูกใช้เป็น HS256 secret)
- ไม่เช็ค `aud` → token ของ service A ใช้กับ service B ได้
- `exp` ยาวเกิน → revoked user ยังใช้ได้
- ใน v6 ส่ง `KeyObject` เข้า `jwtVerify` → type error — ใช้ `CryptoKey`/`JWK`/`Uint8Array`
- `createRemoteJWKSet` ไม่ handle cooldown → JWKS endpoint down ทำ verify fail ทั้งหมด (default cooldown ช่วย)

## Performance Notes

- Ed25519 verify เร็วกว่า RSA มาก — เหมาะกับ high-throughput verify
- `createRemoteJWKSet` cache JWKS — `cacheMaxAge`, `cooldownDuration` ปรับได้
- local verify (have key) เร็วกว่า remote JWKS fetch — cache remote set ที่ client
- token size: ES256 ~96 bytes signature, RS256 ~256 bytes — สำคัญถ้า cookie/header limit

## Ecosystem / Integration

- edge runtimes (Cloudflare Workers, Deno, browsers) → jose เท่านั้น (`jsonwebtoken` ต้อง `node:crypto`)
- v6 requires Node ≥20 — ตรวจ runtime ก่อน upgrade
- `createRemoteJWKSet` ใช้ `fetch` — ไม่มี `options.agent` (ใช้ dispatcher/fetch wrapper ถ้าต้อง proxy)
- สำหรับ OpenID Connect/OAuth2 flows — jose ครอบคลุม JWT layer ไม่ใช่ full OIDC client
