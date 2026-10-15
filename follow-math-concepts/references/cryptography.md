# Cryptography

## Goal

Understand cryptography: hashing, symmetric/asymmetric encryption, primes, modular arithmetic, key exchange, and their use in security, auth, and secret management

## Scope

- Use for security decisions, secret handling, API auth
- Covers hash functions, HMAC, symmetric (AES), asymmetric (RSA/ECC)
- Introduces the number theory behind public-key crypto

## Execute

### 1. Hashing

> Goal: use hash functions correctly

1. Use cryptographic hashes: SHA-256, SHA-3, BLAKE3
2. Never use MD5/SHA-1 for security
3. Use password hashing: bcrypt, Argon2, scrypt
4. Use a salt for password hashes
5. Use HMAC for integrity + authentication

### 2. Symmetric Encryption

> Goal: understand shared-key encryption

1. Use AES-GCM or ChaCha20-Poly1305
2. Never reuse a nonce/IV
3. Manage keys with a KMS/secret manager
4. Always use authenticated encryption

### 3. Asymmetric Encryption

> Goal: understand public-key encryption

1. Use RSA or ECC (ED25519, ECDSA)
2. Know that the public key encrypts/verifies and the private key decrypts/signs
3. Use TLS/SSL for transport
4. Use key exchange (Diffie-Hellman, ECDH)

### 4. Number Theory

> Goal: understand the math behind public-key crypto

1. Use large primes for RSA
2. Use modular exponentiation for RSA
3. Use elliptic curve groups for ECC
4. Rely on the discrete logarithm problem for security

### 5. Map To Code

> Goal: apply it in software

1. Store secrets with `/follow-secret-manager` or `/open-web-for-config-secret` — never hardcode
2. Use TLS for every network call
3. Sign JWTs with HMAC or RSA
4. Use hashing for API keys / tokens

## Rules

### 1. Don't Roll Your Own Crypto

- Use audited libraries/standards
- Never invent custom ciphers/hashes
- Verify the algorithm and key size

### 2. Key Management

- Never commit keys
- Rotate keys periodically
- Use least privilege

### 3. Code Mapping

- `crypto.subtle` in the browser
- `node:crypto` in Node/Bun
- `libsodium` for high-level crypto

- Use /follow-math-concepts if needed
- Use /follow-secret-manager if needed
- Use /open-github secrets if needed

## Expected Outcome

- Able to pick the right hash/encryption
- Able to explain public-key crypto via number theory
- Able to manage secrets safely
- Able to use crypto libraries properly
