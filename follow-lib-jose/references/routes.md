# Lib Jose Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs (README) | https://github.com/panva/jose |
| JWT sign/verify | https://github.com/panva/jose/blob/main/docs/jwt/README.md |
| JWK / JWKS | https://github.com/panva/jose/blob/main/docs/jwk/README.md |
| Key management | https://github.com/panva/jose/blob/main/docs/key/README.md |
| JWE encryption | https://github.com/panva/jose/blob/main/docs/jwe/README.md |
| Runtime support | https://github.com/panva/jose#runtime |

## Key Concepts

- ทุกอย่างผ่าน WebCrypto — ไม่มี `node:crypto` dependency → ใช้บน edge/CF Workers ได้
- `jwtVerify` ควรระบุ `algorithms` allowlist เสมอ (กัน algorithm confusion)
- `createRemoteJWKSet` มี caching + cooldown ในตัวสำหรับ rotate keys
- v6: payload claims helpers `.setIssuer`, `.setSubject`, `.setAudience`, `.setJti`, `.setNotBefore`, `.setIssuedAt`
