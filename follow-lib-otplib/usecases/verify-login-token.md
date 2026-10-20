# Use Case — Verify a Token at Login

> Accept a real user's code under normal clock drift while still blocking brute force and replay. Source: https://github.com/yeojz/otplib (accessed 2026-10-20)

## 1. Verify with a drift window

```ts
import { verify } from "otplib";

const result = await verify({
  secret,
  token,
  epochTolerance: 30, // accept one step of drift (~30s) on each side
});

if (!result.valid) return deny("invalid_code");
```

Devices, containers, and CI runners drift. A zero tolerance rejects correct codes from phones a few seconds off; a wide one enlarges the guessing surface — one step is the usual compromise.

## 2. Rate-limit before the crypto runs

```ts
const key = `totp:${userId}`;
const attempts = await redis.incr(key);
if (attempts === 1) await redis.expire(key, 900); // 15 min window
if (attempts > 5) return deny("too_many_attempts");
```

A six-digit code has a million values; without a limiter an attacker can brute force a valid window in minutes.

## 3. Reject a code that was already used

```ts
const timeStep = Math.floor(Date.now() / 30_000);
const consumed = await redis.set(`totp:used:${userId}:${timeStep}`, "1", "NX", "EX", 90);
if (consumed === null) return deny("code_already_used");
```

The same code stays valid for its whole step — replay protection has to be server state, not a property of the token.

## 4. Fall back to recovery codes

```ts
if (!result.valid) {
  const code = await db.recoveryCode.findFirst({
    where: { userId, hash: sha256(token), usedAt: null },
  });
  if (!code) return deny("invalid_code");
  await db.recoveryCode.update({ where: { id: code.id }, data: { usedAt: new Date() } });
}
```

Mark the code used in the same transaction as the session creation, or a retry can consume it twice.

## 5. Log decisions without logging codes

```ts
logger.info({ userId, factor: "totp", outcome: result.valid ? "ok" : "rejected" });
```

Never log `token` or `secret`; a support ticket is not a reason to weaken that.

## Pitfalls

- Comparing with `===` against a generated token is not constant-time and skips the tolerance window — always use `verify`.
- Accepting an arbitrarily wide `epochTolerance` to "fix" drift turns the second factor into a much weaker secret.
- Allowing unlimited attempts because the code "expires in 30 seconds" — expiry is not a rate limit.
- Forgetting replay protection: a code observed in a URL, proxy log, or shoulder surf still works for its step.
- Leaving recovery codes reusable or stored in plaintext, which makes them the weakest link in the flow.
- Verifying on the client to "save a round trip" — the secret would have to ship to the browser.

## Related

- `references/apis.md`
- `best-practices/totp-2fa.md`
- `usecases/enroll-totp-2fa.md`
