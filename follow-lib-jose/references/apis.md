| key | value |
|---|---|
| version | 6.2.12 |
| package registry | https://www.npmjs.com/package/jose |
| repository | https://github.com/panva/jose |
| docs | https://github.com/panva/jose#readme |

| api | description | default | options |
|---|---|---|---|
| `new SignJWT(payload)` | สร้าง JWT | - | `.setProtectedHeader`, `.setExpirationTime`, `.sign(key)` |
| `jwtVerify(token, key)` | Verify JWT | - | `issuer`, `audience`, `algorithms` |
| `createRemoteJWKSet(url)` | JWKS fetcher | cached | `cacheMaxAge`, `cooldownDuration` |
| `generateKeyPair(alg)` | สร้าง key pair | - | `RS256`, `ES256`, `EdDSA`, `extractable` |
| `exportJWK(key)` / `importJWK(jwk, alg)` | JWK convert | - | - |
| `EncryptJWT` / `jwtDecrypt` | JWE | - | - |
| `SignRequest` / `unsecuredJWT` | Advanced | - | - |
