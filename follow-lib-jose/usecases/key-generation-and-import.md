# Use Case — Key Generation and Import

> Create the signing key once, store it where secrets live, and load it as a `CryptoKey` at boot — the same code on Node, Bun, and Workers. Source: https://github.com/panva/jose (accessed 2026-10-20)

## 1. Generate a key pair as JWK

```ts
import { exportJWK, generateKeyPair } from "jose";

const { publicKey, privateKey } = await generateKeyPair("EdDSA", {
  extractable: true,
});

const privateJwk = await exportJWK(privateKey);
const publicJwk = await exportJWK(publicKey);

console.log(JSON.stringify({ privateJwk, publicJwk }, null, 2));
```

`generateKeyPair` returns `CryptoKey` objects, so `exportJWK` is the only way to persist them — a `CryptoKey` cannot be serialized directly. `extractable: true` is required for the export; a non-extractable key throws on `exportJWK`, which is the correct default when the key never leaves the process.

Run this once, in a script, and store the output. Generating a key at application startup produces a new key on every deploy and invalidates every token that is still valid.

## 2. Load it back from the secret manager

```ts
import { importJWK, type JWK } from "jose";

const jwk = JSON.parse(process.env.AUTH_PRIVATE_JWK!) as JWK;

export const privateKey = await importJWK(jwk, "EdDSA");
```

The algorithm argument must match the key type — `EdDSA` for Ed25519, `ES256` for P-256, `RS256` for RSA. A mismatch throws on import instead of producing tokens nothing can verify, which is the failure you want at boot rather than at the first login.

Keep the private JWK in the secret manager (`/follow-secret-manager`) and only the public JWK in the client-facing bundle.

## 3. Import an existing PEM instead of regenerating

```ts
import { importPKCS8, importSPKI } from "jose";

const privateKey = await importPKCS8(process.env.AUTH_PRIVATE_PEM!, "ES256");
const publicKey = await importSPKI(process.env.AUTH_PUBLIC_PEM!, "ES256");
```

Use this when the key already exists — an OpenSSL keypair, a certificate authority, an identity provider export. The import options type was renamed to `KeyImportOptions` in the current major; code that passes the old `PEMImportOptions` name fails to typecheck rather than silently misbehaving.

## 4. Derive a stable kid from the public key

```ts
import { calculateJwkThumbprint } from "jose";

export const kid = await calculateJwkThumbprint(publicJwk, "sha256");
```

The thumbprint is derived from key material, so it does not change when the key is re-imported and it changes automatically when the key rotates. Hand-written `kid` values such as `"key-1"` collide across environments and make a JWKS lookup ambiguous.

## 5. Use a symmetric secret for one trusted service

```ts
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SHARED_SECRET!);
const token = await new SignJWT({ sub: "42" })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("5m")
  .sign(secret);
```

`HS256` needs the same secret on both sides, so it cannot be published in a JWKS and cannot rotate without downtime on both sides. Use it between two services you own; use an asymmetric key the moment a third party verifies your tokens.

## 6. Verify

1. Round-trip in a test: sign with the imported private key, verify with the imported public key
2. Restart the process — the `kid` is identical, so the tokens issued before the restart still verify
3. `/run-test` on the runtime you deploy to — the same code runs on Node, Bun, and Workers with WebCrypto
4. `/run-verify` — the private JWK never appears in a client bundle or a log line
5. Delete `AUTH_PRIVATE_JWK` in a local run — startup fails loudly instead of signing with `undefined`

## Pitfalls

- Calling `generateKeyPair` at module scope in production, which rotates the key on every cold start.
- Exporting a non-extractable `CryptoKey` and reading the resulting error as a permissions problem.
- Passing an algorithm that does not match the key type, then debugging the verify failure instead of the import.
- Committing a generated JWK into the repo because it was "only for staging" and promoting the same env later.
- Using `HS256` for tokens that a browser or third party verifies, where the secret would have to be public.

## Related

- `references/apis.md`
- `best-practices/jwt.md`
- `usecases/sign-and-verify-jwt.md`
- `usecases/jwks-and-key-rotation.md`
- `usecases/access-and-refresh-token-pair.md`
