# Lib Jose Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs (README) | https://github.com/panva/jose |
| JWT sign/verify | https://github.com/panva/jose/tree/main/docs/jwt |
| JWK / JWKS | https://github.com/panva/jose/tree/main/docs/jwk |
| Key management | https://github.com/panva/jose/tree/main/docs/key |
| JWE encryption | https://github.com/panva/jose/tree/main/docs/jwe |
| Runtime support | https://github.com/panva/jose#runtime |

## Key Concepts

- ทุกอย่างผ่าน WebCrypto — ไม่มี `node:crypto` dependency → ใช้บน edge/CF Workers ได้
- `jwtVerify` ควรระบุ `algorithms` allowlist เสมอ (กัน algorithm confusion)
- `createRemoteJWKSet` มี caching + cooldown ในตัวสำหรับ rotate keys
- v6: payload claims helpers `.setIssuer`, `.setSubject`, `.setAudience`, `.setJti`, `.setNotBefore`, `.setIssuedAt`
