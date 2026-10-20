# Use Case — Verify Tokens From a JWKS Endpoint and Rotate Keys

> Trust tokens issued elsewhere by reading the issuer's public keys, and rotate your own keys without breaking live sessions. Source: https://github.com/panva/jose (accessed 2026-10-20)

## 1. Verify against a remote JWKS

```ts
import { createRemoteJWKSet, jwtVerify } from "jose"

const JWKS = createRemoteJWKSet(new URL("https://issuer.example.com/.well-known/jwks.json"))

export async function verifyExternal(token: string) {
  const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
    issuer: "https://issuer.example.com",
    audience: "my-client-id",
  })

  return { payload, kid: protectedHeader.kid }
}
```

`createRemoteJWKSet` caches keys and fetches on an unknown `kid`; create it once per process, not per request.

## 2. Publish your own JWKS with kids

```ts
import { exportJWK, generateKeyPair } from "jose"

async function createKey(kid: string) {
  const { publicKey, privateKey } = await generateKeyPair("RS256")
  return {
    kid,
    privateKey,
    publicJwk: { ...(await exportJWK(publicKey)), kid, alg: "RS256", use: "sig" },
  }
}

const active = await createKey("2026-10")
```

Serve `{ keys: [active.publicJwk, previous.publicJwk] }` at `/.well-known/jwks.json`.

## 3. Sign with the active kid

```ts
const token = await new SignJWT({ sub })
  .setProtectedHeader({ alg: "RS256", kid: active.kid })
  .setIssuer("https://issuer.example.com")
  .setAudience("my-client-id")
  .setExpirationTime("1h")
  .sign(active.privateKey)
```

Verifiers select the key by `kid`, so a new key can be published before it starts signing.

## 4. Rotate without downtime

1. Publish the new public key alongside the old one.
2. Wait at least one token lifetime so caches refresh.
3. Switch signing to the new `kid`.
4. Keep the old public key for one more lifetime, then remove it.

## 5. Encrypt when the payload is sensitive

```ts
import { EncryptJWT, jwtDecrypt } from "jose"

const key = new TextEncoder().encode(process.env.JWE_SECRET) // 32, 48, or 64 bytes

const jwe = await new EncryptJWT({ sub })
  .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
  .setExpirationTime("5m")
  .encrypt(key)

const { payload } = await jwtDecrypt(jwe, key)
```

A JWS is signed but readable by anyone; use JWE when claims must stay confidential.

## Pitfalls

- Creating a `createRemoteJWKSet` per request → a fetch per call and no cache; hoist it.
- Removing the old key immediately after rotation → every token signed before the switch fails verification.
- Publishing private key material in the JWKS → the JWKS is public; export public keys only.
- Using a `dir` JWE key of the wrong length → encryption throws; derive exactly 32 bytes for `A256GCM`.

## Related

- `references/apis.md`
- `best-practices/jwt.md`
- `usecases/sign-and-verify-jwt.md`
