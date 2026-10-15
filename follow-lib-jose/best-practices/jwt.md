# jose — JWT Security And Key Management

## Recommended Patterns

### Algorithm Selection

- prefer `EdDSA` (Ed25519) — small key, fast verify, modern
- `ES256` is the safe default when EdDSA isn't usable (wider compat)
- `RS256` for legacy/enterprise compatibility — larger signature, slower
- `HS256` only for symmetric use cases where the secret is genuinely managed — never when the secret might leak (shared key)
- never `alg: none`, `secp256k1`, `RSA1_5` — removed/unsupported in v6 and insecure

### Always Verify

- `jwtVerify(token, key, {issuer, audience, algorithms})` — not `decodeJwt` alone
- decode is just parse — no signature verification — never trust claims from decode
- always specify `issuer` + `audience` — prevents tokens from other services
- pin the `algorithms` array — prevents algorithm confusion attacks (HS256 vs RS256)
- `clockTolerance` for slight clock skew (default 0) — set ~5-30s for distributed systems

### Claims

- always set `iss`, `aud`, `exp`, `iat` — chain: `new SignJWT(payload).setProtectedHeader({alg}).setIssuedAt().setIssuer().setAudience().setExpirationTime()`
- short `exp` for access tokens (5-15 minutes) — refresh tokens longer
- include only necessary claims — JWTs aren't encrypted (JWS); everyone can read the payload
- sensitive data → `EncryptJWT`/`jwtDecrypt` (JWE) or a nested JWT

### Key Management

- keys are `CryptoKey`/`JWK`/`Uint8Array` — v6 returns `CryptoKey` from `generateKeyPair`/`importJWK`
- a private `KeyObject` (Node crypto) can't verify/encrypt in v6 — store as JWK or re-import
- `createRemoteJWKSet(url)` for public key discovery — fetch + cache automatically
- rotation via the `kid` header — the verifier picks the key by `kid` from the JWKS
- secrets/keys from env — never hardcode (see `/follow-secret-manager`)

## Do / Don't

| Do | Don't |
|---|---|
| `jwtVerify` with `issuer`/`audience`/`algorithms` | `decodeJwt` then trusting claims |
| `EdDSA` or `ES256` for new systems | `HS256` when the secret might be shared |
| short `exp` + a separate refresh token | hour-long access tokens |
| `createRemoteJWKSet` for third-party JWT | fetching JWKS by hand on every request |
| rotate keys via `kid` | hardcoding a single key in code |

## Common Pitfalls

- using `decodeJwt` instead of verify → forgeable tokens
- not pinning `algorithms` → alg confusion (an RS256 public key used as an HS256 secret)
- not checking `aud` → service A's token works on service B
- too-long `exp` → a revoked user keeps working
- passing a `KeyObject` into `jwtVerify` in v6 → type error — use `CryptoKey`/`JWK`/`Uint8Array`
- `createRemoteJWKSet` without cooldown handling → a down JWKS endpoint fails every verification (the default cooldown helps)

## Performance Notes

- Ed25519 verify is much faster than RSA — suits high-throughput verify
- `createRemoteJWKSet` caches JWKS — `cacheMaxAge`, `cooldownDuration` are tunable
- local verify (key already held) is faster than a remote JWKS fetch — cache the remote set on the client
- token size: ES256 ~96-byte signature, RS256 ~256 bytes — matters with cookie/header limits

## Ecosystem / Integration

- edge runtimes (Cloudflare Workers, Deno, browsers) → jose only (`jsonwebtoken` needs `node:crypto`)
- v6 requires Node ≥20 — check the runtime before upgrading
- `createRemoteJWKSet` uses `fetch` — no `options.agent` (use a dispatcher/fetch wrapper if a proxy is needed)
- for OpenID Connect/OAuth2 flows — jose covers the JWT layer, not a full OIDC client
