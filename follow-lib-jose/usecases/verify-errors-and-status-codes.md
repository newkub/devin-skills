# Use Case — Verify Errors and Status Codes

> Tell an expired token apart from a forged one, return the status a client can act on, and keep the reason out of the response body. Source: https://github.com/panva/jose (accessed 2026-10-20)

## 1. Catch by error class, not by message

```ts
import { errors, jwtVerify, type CryptoKey } from "jose";

export type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401; code: "token_expired" | "invalid_token" };

export async function authenticate(
  token: string,
  key: CryptoKey,
): Promise<AuthResult> {
  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: "https://auth.example.com",
      audience: "https://api.example.com",
      algorithms: ["EdDSA"],
    });
    return { ok: true, userId: payload.sub! };
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return { ok: false, status: 401, code: "token_expired" };
    }
    if (error instanceof errors.JOSEError) {
      return { ok: false, status: 401, code: "invalid_token" };
    }
    throw error;
  }
}
```

`JWTExpired` extends the claim-validation error, which extends `JOSEError`, so the order matters — check the specific class first or every case collapses into the generic one. Anything that is not a `JOSEError` is a bug in your code, not a bad token, and should propagate.

## 2. Map each failure to one status

| Condition | jose error | Status | Body code |
|---|---|---|---|
| `exp` in the past | `JWTExpired` | 401 | `token_expired` |
| wrong `iss`, `aud`, `nbf`, `maxTokenAge` | `JWTClaimValidationFailed` | 401 | `invalid_token` |
| altered payload or malformed token | `JWSSignatureVerificationFailed`, `JWTInvalid` | 401 | `invalid_token` |
| algorithm not in the allow list | `JOSEAlgNotAllowed` | 401 | `invalid_token` |
| `kid` missing from the JWKS | `JWKSNoMatchingKey` | 401 | `invalid_token` |
| valid token, missing scope or role | your own check | 403 | `insufficient_scope` |

Authentication failures are 401 and include a `WWW-Authenticate` header; authorization failures are 403. Returning 403 for an expired token tells the client not to refresh, and the session dies with a valid refresh token still in hand.

## 3. Return a header the client can act on

```ts
return new Response(JSON.stringify({ error: result.code }), {
  status: result.status,
  headers: {
    "content-type": "application/json",
    "www-authenticate": `Bearer error="${result.code}"`,
  },
});
```

`token_expired` is the one signal a client needs: refresh and retry once. Every other reason is `invalid_token` — the caller should discard the token and re-authenticate. Sending `signature_invalid` or `claim_aud_mismatch` only helps someone probing the endpoint.

## 4. Keep the detail in the logs

```ts
try {
  await jwtVerify(token, key, { issuer, audience });
} catch (error) {
  logger.warn(
    {
      code: (error as errors.JOSEError).code,
      claim: (error as errors.JWTClaimValidationFailed).claim,
    },
    "jwt rejected",
  );
}
```

`error.code` values such as `ERR_JWT_EXPIRED` or `ERR_JOSE_ALG_NOT_ALLOWED` are stable and safe to log. The token itself is a bearer credential: logging it, or the payload, turns every log sink into a session store.

## 5. Handle an unknown kid without a stampede

```ts
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL("https://auth.example.com/.well-known/jwks.json"));

const { payload } = await jwtVerify(token, jwks, { issuer, audience });
```

A key rotation produces tokens whose `kid` the cached set does not know yet, which surfaces as `JWKSNoMatchingKey`. `createRemoteJWKSet` refetches on an unknown `kid`, but its cooldown limits how often that happens — so a burst of old tokens cannot turn into a burst of requests to the identity provider.

## 6. Verify

1. `/run-test` — one test per row of the table, asserting status and body code
2. Expired token — 401 `token_expired` with a `WWW-Authenticate` header
3. Tampered payload — 401 `invalid_token`, and the response body does not name the failing claim
4. Log output contains `error.code` and never the raw token
5. A valid token with a missing scope returns 403, not 401

## Pitfalls

- Matching on `error.message` text, which changes between releases and between runtimes.
- Checking `JOSEError` first, so an expired token is reported as invalid and the client never refreshes.
- Returning 403 for an authentication failure, which tells the client to give up instead of refreshing.
- Echoing the failing claim or the decoder's message into the response body.
- Logging the token for "debugging", which leaks a live credential into log storage.

## Related

- `references/apis.md`
- `best-practices/jwt.md`
- `usecases/sign-and-verify-jwt.md`
- `usecases/access-and-refresh-token-pair.md`
- `usecases/jwks-and-key-rotation.md`
