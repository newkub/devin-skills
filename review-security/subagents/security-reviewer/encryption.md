# Encryption Validation Rules

## Encryption At Rest

- ตรวจ database encryption: TDE (Transparent Data Encryption), column encryption
- ตรวจ file storage encryption: encrypted disk, encrypted bucket
- ตรวจ backup encryption: encrypted backup, key separation
- ตรวจ log encryption: encrypted log storage, sensitive log encryption

## Encryption In Transit

- ตรวจ TLS version: TLS 1.2+, ไม่รองรับ TLS 1.0, 1.1
- ตรวจ cipher suite: strong cipher, forward secrecy, ไม่ใช้ weak cipher
- ตรวจ certificate validity: cert chain, cert expiry, cert revocation
- ตรวจ HSTS: `Strict-Transport-Security`, `max-age`, `includeSubDomains`, `preload`
- Detection: `grep` หา `Strict-Transport-Security`, `helmet`, TLS config

## Key Management

- ตรวจ key generation: `crypto.randomBytes`, ขั้นต่ำ 256 bits
- ตรวจ key storage: KMS, HSM, secret manager — ไม่ใช้ hardcoded key
- ตรวจ key rotation: rotation policy, key versioning, old key revocation
- ตรวจ key derivation: PBKDF2, scrypt, argon2 — ไม่ใช้ raw hash
- ตรวจ key separation: key ต่อ purpose, ไม่ใช้ key ร่วม

## Algorithm Choice

- ตรวจ AES-256-GCM: ใช้สำหรับ symmetric encryption
- ตรวจ ChaCha20-Poly1305: ทางเลือกสำหรับ AES
- ตรวจ RSA-2048+: ใช้สำหรับ asymmetric encryption
- ตรวจ ECDSA: P-256, P-384, P-521 — ไม่ใช้ P-512 ที่ deprecated
- ตรวจ avoid deprecated: DES, 3DES, RC4, MD5, SHA1, Blowfish
- Detection: `grep` หา `createCipher`, `createDecipher`, `md5`, `sha1`

## Password Hashing

- ตรวจ bcrypt: cost 12+ — ไม่ใช้ cost ต่ำกว่า 10
- ตรวจ argon2id: memory 19456 KB, iteration 2, parallelism 1
- ตรวจ scrypt: N 16384, r 8, p 1
- ตรวจ avoid: MD5, SHA1, SHA256 (raw), plain text
- Detection: `grep` หา `bcrypt`, `argon2`, `scrypt`, `md5`, `sha1`

## Random Number Generation

- ตรวจ `crypto.getRandomValues`: สำหรับ browser
- ตรวจ `crypto.randomBytes`: สำหรับ Node.js/Bun
- ตรวจ avoid `Math.random`: ห้ามใช้สำหรับ security purpose
- ตรวจ avoid `Date.now` as seed: ไม่ใช้ timestamp เป็น seed
- Detection: `grep` หา `Math.random` ใน security context

## Severity Criteria

- Critical: plaintext storage, weak algorithm (DES, RC4, MD5), hardcoded encryption key, `Math.random` for security, no TLS
- High: missing HSTS, weak TLS config, missing key rotation, weak password hashing cost, no key separation
- Medium: suboptimal cipher suite, missing key derivation, suboptimal cert management
- Low: documentation gap, minor naming
