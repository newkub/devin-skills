---
name: follow-lib-jose-setup-jose
description: ติดตั้ง jose และตั้งค่า sign/verify JWT พร้อม JWKS ให้พร้อมใช้งาน
argument-hint: "[alg-or-runtime]"
related:
  - follow-lib-jose
  - follow-secret-manager
  - learn
  - resolve-errors
---

## Goal

ติดตั้ง `jose` และตั้งค่า JWT sign/verify พร้อม key management หรือ JWKS ให้ทำงานได้จริงบน runtime ที่ใช้ — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี jose (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, `SignJWT`/`jwtVerify`, key generation, `createRemoteJWKSet`/`createLocalJWKSet`
- jose เป็น WebCrypto-based — ทำงานบน Node ≥20, Bun, Cloudflare Workers, edge runtimes โดยไม่ต้อง polyfill

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้ามี `jose` แล้ว → skip ไป verify; ถ้ามี `jsonwebtoken` บน edge runtime → flag ให้ย้ายมา jose
2. ระบุ runtime (Node/Bun/Workers) — v6 เป็น WebCrypto-only, keys คืน `CryptoKey` ไม่ใช่ `KeyObject`
3. ตรวจ keys/secrets ที่ต้องมี — ถ้าขาด → เก็บผ่าน `/follow-secret-manager` ห้าม hardcode

### 2. Install

> Goal: ติดตั้ง jose เป็น runtime dependency

1. รัน `bun add jose` (หรือ package manager ตาม lockfile)
2. ยืนยัน `jose` อยู่ใน `dependencies`

### 3. Sign And Verify JWT

> Goal: sign/verify flow ขั้นต่ำทำงาน

1. Keys: `generateKeyPair("RS256")`/`("EdDSA")` สำหรับ asymmetric หรือ secret (`Uint8Array`) สำหรับ `HS256` — เลือก alg ชัดเจนเสมอ
2. Sign: `new SignJWT(payload).setProtectedHeader({ alg }).setIssuedAt().setIssuer(iss).setAudience(aud).setExpirationTime("2h").sign(key)`
3. Verify: `await jwtVerify(token, key, { issuer, audience })` — คืน `{ payload, protectedHeader }`
4. ตั้ง `iss`, `aud`, `exp` เสมอ — verify ทุกครั้ง ห้าม `decode` อย่างเดียว
5. JWE (encrypted tokens): `EncryptJWT`/`jwtDecrypt` เมื่อ payload ต้อง confidentiality — ดู official docs

### 4. Setup JWKS

> Goal: key distribution ผ่าน JWKS เมื่อมีหลาย consumers

1. Remote verify: `createRemoteJWKSet(new URL(jwksUrl))` แล้วส่งให้ `jwtVerify` — jose cache keys ให้ (v6 ใช้ `fetch` ไม่มี `options.agent`)
2. Publish keys เอง: `exportJWK` public key แล้ว serve ที่ `/.well-known/jwks.json` หรือใช้ `createLocalJWKSet` สำหรับ local set
3. Key rotation: ตั้ง `kid` ใน protected header — verifier เลือก key จาก `kid` อัตโนมัติ
4. Private keys ไม่ออกจาก signer — publish เฉพาะ public JWK

### 5. Verify

> Goal: sign→verify round-trip ผ่านจริง

1. Smoke: sign token จริงแล้ว verify — payload ตรง, `exp` ถูก enforce (token หมดอายุต้อง reject)
2. ทดสอบ wrong key/wrong audience → ต้อง reject
3. รัน lint/typecheck — ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น
- ใช้ `jose` แทน `jsonwebtoken` บน edge runtimes (jsonwebtoken ต้อง node:crypto)
- Alg ชัดเจนเสมอ (`EdDSA`, `RS256`, `ES256`) — ห้าม `alg: none`; `secp256k1`/`RSA1_5` ถูกลบใน v6
- Keys เป็น `CryptoKey`/`JWK`/`Uint8Array` (v6) — secrets จาก env ผ่าน `/follow-secret-manager`
- ถ้า API ไม่แน่ใจ → ทำ `/learn-web` ดู official docs (github.com/panva/jose)
- ใช้ `/follow-lib-jose` สำหรับ overview และ best practices

## Expected Outcome

- `jose` ติดตั้ง, sign/verify round-trip ผ่านด้วย alg ที่เลือก
- JWKS พร้อมถ้าใช้ — rotation ผ่าน `kid`
- Claims (`iss`, `aud`, `exp`) ถูก enforce — ไม่มี decode-only verification
