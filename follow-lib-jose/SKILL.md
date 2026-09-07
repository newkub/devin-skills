---
name: follow-lib-jose
description: ใช้ jose สำหรับ JWT/JWS/JWE/JWK — sign, verify, encrypt, key management บน edge runtimes
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ jose สำหรับ JWT/JWS/JWE/JWK — sign, verify, encrypt, key management บน edge runtimes

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ตรวจ runtime: jose รองรับ WebCrypto — ใช้ได้บน Cloudflare Workers, Node, Bun โดยไม่ต้อง polyfill
1. ใช้ `SignJWT`/`jwtVerify` สำหรับ JWS, `EncryptJWT`/`jwtDecrypt` สำหรับ JWE, `generateKeyPair`/`importJWK` สำหรับ keys
1. เก็บ keys เป็น JWK หรือ secret จาก env — ห้าม hardcode; ใช้ `createRemoteJWKSet` สำหรับ JWKS endpoints
1. ตั้ง `iss`, `aud`, `exp` เสมอ — ใช้ `setIssuedAt().setExpirationTime()` ใน chain

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- ใช้ `jose` แทน `jsonwebtoken` บน edge runtimes (jsonwebtoken ต้อง node:crypto)
- ตั้ง algorithm ชัดเจน (EdDSA, RS256, ES256) — ห้าม `alg: none`
- verify ทุกครั้งด้วย `jwtVerify` — ห้าม decode อย่างเดียว
- key rotation ผ่าน `kid` header

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน