---
name: follow-math-cryptography
description: เข้าใจ hashing, primes, symmetric/asymmetric encryption และประยุกต์ใน security
argument-hint: "[topic]"
related:
  - follow-math-discrete-math
  - follow-service-infisical
  - follow-tool-open-github-secrets
  - follow-math-concepts
---

## Goal

เข้าใจ cryptography: hashing, symmetric/asymmetric encryption, primes, modular arithmetic, key exchange และประยุกต์ใช้ใน security, auth, secret management

## Scope

- ใช้สำหรับ security decisions, secret handling, API auth
- ครอบคลุบ hash functions, HMAC, symmetric (AES), asymmetric (RSA/ECC)
- แนะนำ number theory สำหรับ public-key crypto

## Execute

### 1. Hashing

> Goal: ใช้ hash functions ถูกต้อง

1. ใช้ cryptographic hash: SHA-256, SHA-3, BLAKE3
2. ห้ามใช้ MD5/SHA-1 สำหรับ security
3. ใช้ password hashing: bcrypt, Argon2, scrypt
4. ใช้ salt สำหรับ password hash
5. ใช้ HMAC เพื่อ integrity + authentication

### 2. Symmetric Encryption

> Goal: เข้าใจ shared-key encryption

1. ใช้ AES-GCM หรือ ChaCha20-Poly1305
2. อย่า reuse nonce/IV
3. จัดการ keys ด้วย KMS/secret manager
4. ใช้ authenticated encryption เสมอ

### 3. Asymmetric Encryption

> Goal: เข้าใจ public-key encryption

1. ใช้ RSA หรือ ECC (ED25519, ECDSA)
2. รู้ public key สำหรับ encrypt/verify, private key สำหรับ decrypt/sign
3. ใช้ TLS/SSL สำหรับ transport
4. ใช้ key exchange (Diffie-Hellman, ECDH)

### 4. Number Theory

> Goal: เข้าใจ math ด้านหลัง public-key

1. ใช้ large primes สำหรับ RSA
2. ใช้ modular exponentiation สำหรับ RSA
3. ใช้ elliptic curve groups สำหรับ ECC
4. ใช้ discrete logarithm problem สำหรับ security

### 5. Map To Code

> Goal: ประยุกต์ใน software

1. เก็บ secrets ด้วย secret manager ไม่ hardcode
2. ใช้ TLS สำหรับทุก network call
3. ใช้ JWT signature ด้วย HMAC หรือ RSA
4. ใช้ hashing สำหรับ API key / token

## Rules

### 1. Don't Roll Your Own Crypto

- ใช้ library/standard ทีตรวจสอบแล้ว
- ห้ามสร้าง custom cipher/hash
- ตรวจสอบ algorithm และ key size

### 2. Key Management

- ไม่ commit keys
- หมุน keys เป็นระยะ
- ใช้ least privilege

### 3. Code Mapping

- `crypto.subtle` ใน browser
- `node:crypto` ใน Node/Bun
- `libsodium` สำหรับ high-level crypto

## Expected Outcome

- สามารถเลือก hash/encryption ทีเหมาะสม
- สามารถอธิบาย public-key ด้วย number theory
- สามารถจัดการ secrets อย่างปลอดภัย
- สามารถใช้ crypto libraries ได้
