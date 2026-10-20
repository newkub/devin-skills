# Use Case — Sign and Verify Session Tokens

> Issue a short-lived JWT with explicit alg/iss/aud/exp and reject anything `jwtVerify` does not accept. Source: https://github.com/panva/jose (accessed 2026-10-20)

## 1. Install and load the key

```bash
bun add jose
```

```ts
import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
```

Keep the secret in the secret manager; a JWT signed with a value committed to the repo is forgeable by anyone with the repo.

## 2. Sign with every required claim

```ts
export async function issueSession(userId: string) {
  return new SignJWT({ sub: userId, role: "member" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("https://app.example.com")
    .setAudience("app-api")
    .setExpirationTime("15m")
    .sign(secret)
}
```

`alg` is set explicitly on the protected header; `iss`, `aud`, and `exp` are what verification will later pin.

## 3. Verify, never decode

```ts
export async function readSession(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    issuer: "https://app.example.com",
    audience: "app-api",
    algorithms: ["HS256"],
    clockTolerance: "5s",
  })

  return payload
}
```

`jwtVerify` checks the signature and every claim passed in the options. `decodeJwt` alone accepts forged tokens.

## 4. Use an asymmetric pair when several services verify

```ts
import { generateKeyPair, exportJWK } from "jose"

const { publicKey, privateKey } = await generateKeyPair("EdDSA", { crv: "Ed25519" })

const publicJwk = await exportJWK(publicKey)
```

Only the issuer holds `privateKey`; verifiers import the public JWK. In jose v6 these are `CryptoKey` objects, not Node `KeyObject`.

## 5. Fail closed at the boundary

```ts
try {
  const session = await readSession(token)
  return session
} catch {
  return null
}
```

Treat every verification error (`JWTExpired`, `JWSSignatureVerificationFailed`, `JWTClaimValidationFailed`) as "not authenticated".

## Pitfalls

- Calling `decodeJwt` and trusting the payload → no signature check at all.
- Omitting `audience`/`issuer` in `jwtVerify` → a token minted for another service is accepted.
- Sharing one long-lived secret across environments → a staging key can sign production tokens.
- Using `alg: "none"` or accepting the header's alg → algorithm confusion; pass `algorithms` explicitly.

## Related

- `references/apis.md`
- `best-practices/jwt.md`
- `usecases/jwks-and-key-rotation.md`
