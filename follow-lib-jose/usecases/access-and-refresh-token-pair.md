# Use Case — Access and Refresh Token Pair

> Two tokens with different jobs: a short access token every request verifies, and a long refresh token that is checked rarely and revocable. Source: https://github.com/panva/jose (accessed 2026-10-20)

## 1. Issue the pair with an explicit token kind

```ts
import { SignJWT, type CryptoKey } from "jose";

const ISSUER = "https://auth.example.com";
const AUDIENCE = "https://api.example.com";

export async function issuePair(userId: string, key: CryptoKey, kid: string) {
  const now = Math.floor(Date.now() / 1000);

  const access = await new SignJWT({ token_use: "access", scope: "orders:read" })
    .setProtectedHeader({ alg: "EdDSA", kid })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime("15m")
    .sign(key);

  const refresh = await new SignJWT({ token_use: "refresh" })
    .setProtectedHeader({ alg: "EdDSA", kid })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime("30d")
    .setJti(crypto.randomUUID())
    .sign(key);

  return { access, refresh };
}
```

`token_use` is what stops a refresh token from being accepted as an access token. Without it, the two tokens differ only by lifetime, and a stolen refresh token is a valid bearer credential for every endpoint.

## 2. Verify with claim checks, not just a signature

```ts
import { jwtVerify } from "jose";

export async function verifyAccess(token: string, key: CryptoKey) {
  const { payload } = await jwtVerify(token, key, {
    issuer: ISSUER,
    audience: AUDIENCE,
    algorithms: ["EdDSA"],
    requiredClaims: ["sub", "exp", "iss", "aud", "token_use"],
  });

  if (payload.token_use !== "access") {
    throw new Error("wrong token kind");
  }

  return payload;
}
```

`issuer`, `audience`, and `algorithms` are the three checks that turn a signature into an authorization decision. A token signed with the right key but issued for another service is otherwise accepted, which is the classic confused-deputy bug.

## 3. Check the refresh token on one route only

```ts
export async function rotateSession(refresh: string, key: CryptoKey) {
  const { payload } = await jwtVerify(refresh, key, {
    issuer: ISSUER,
    audience: AUDIENCE,
    algorithms: ["EdDSA"],
    maxTokenAge: "30d",
  });

  if (payload.token_use !== "refresh" || !payload.jti) {
    throw new Error("not a refresh token");
  }

  const consumed = await revocations.consume(payload.jti); // SET NX, one use
  if (!consumed) throw new Error("refresh token already used");

  return issuePair(payload.sub!, key, await currentKid());
}
```

`maxTokenAge` adds a second bound in case `exp` was set too far out or the clock is wrong. Tracking `jti` is what makes rotation and revocation possible — a refresh token that cannot be revoked is a permanent credential in a cookie.

## 4. Keep the two lifetimes honest

| Token | Lifetime | Verified by | Revocable |
|---|---|---|---|
| Access | minutes | every API request, locally | no (short life is the control) |
| Refresh | weeks | the auth service only | yes, by `jti` |

A 30-day access token removes the reason to have a refresh token. A 15-minute refresh token forces a re-login more often than the access token expires.

## 5. Store each in the right place

```ts
// access: memory only, sent as a bearer header
headers.set("authorization", `Bearer ${access}`);

// refresh: http-only, secure, same-site cookie scoped to the auth route
cookies.set("refresh", refresh, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/auth",
  maxAge: 60 * 60 * 24 * 30,
});
```

An access token in `localStorage` is readable by any script on the page. A refresh token in `localStorage` is a long-lived session theft. Keep the access token in memory and the refresh token in a cookie the JavaScript cannot read.

## 6. Verify

1. `/run-test` — a refresh token is rejected on an API route and accepted on the refresh route
2. Replay the same refresh token twice — the second call fails because the `jti` was consumed
3. Verify after the access token expires — the API returns 401 and the client refreshes once, not in a loop
4. Decode a token in the debugger — `iss`, `aud`, `sub`, `token_use`, `exp` are all present
5. `/run-verify` — no token is logged in full, and the refresh cookie is `httpOnly`

## Pitfalls

- No `token_use` claim, so a refresh token works as an access token everywhere.
- Verifying with a signature check only, skipping `issuer` and `audience`.
- Reusing one lifetime for both tokens, which either expires sessions constantly or leaves long-lived bearer credentials.
- Rotating the refresh token without storing `jti`, so an old token stays valid forever.
- Putting the refresh token in `localStorage` and relying on a short access lifetime for security.

## Related

- `references/apis.md`
- `best-practices/jwt.md`
- `usecases/sign-and-verify-jwt.md`
- `usecases/key-generation-and-import.md`
- `usecases/verify-errors-and-status-codes.md`
