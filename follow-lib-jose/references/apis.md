# Lib Jose API & Dependencies

## Install

```sh
bun add jose
```

## Version

- Latest: `6.2.12` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/jose)
- [Repository](https://github.com/panva/jose)

## Dependencies

- Zero runtime dependencies — ใช้ WebCrypto API
- รองรับ Node.js, Bun, Deno, browsers, edge runtimes

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `new SignJWT(payload)` | สร้าง JWT | - | `.setProtectedHeader`, `.setExpirationTime`, `.sign(key)` |
| `jwtVerify(token, key)` | Verify JWT | - | `issuer`, `audience`, `algorithms` |
| `createRemoteJWKSet(url)` | JWKS fetcher | cached | `cacheMaxAge`, `cooldownDuration` |
| `generateKeyPair(alg)` | สร้าง key pair | - | `RS256`, `ES256`, `EdDSA`, `extractable` |
| `exportJWK(key)` / `importJWK(jwk, alg)` | JWK convert | - | - |
| `EncryptJWT` / `jwtDecrypt` | JWE | - | - |
| `SignRequest` / `unsecuredJWT` | Advanced | - | - |

## Source

- Official docs: https://github.com/panva/jose#readme
- Description: JWA, JWS, JWE, JWT, JWK, JWKS — universal crypto suite, zero deps.
