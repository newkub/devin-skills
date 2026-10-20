# Use Case — HOTP with a Monotonic Counter

> Counter-based codes need the counter stored next to the secret, advanced only on success, and a tolerance window that cannot be replayed. Source: https://otplib.yeojz.dev/guide/advanced-usage (accessed 2026-10-20)

## 1. Choose HOTP only when a counter exists

HOTP is the right choice for hardware tokens, printed scratch cards, and offline devices that cannot read a clock. For an authenticator app on a phone, use TOTP — it needs no server-side counter state at all.

```ts
import { generateSecret, generate } from "otplib";

const secret = generateSecret();          // Base32, 20 bytes by default
const counter = 0;                        // stored per user

const token = await generate({
  secret,
  strategy: "hotp",
  counter,
});
```

## 2. Verify ahead of the stored counter

```ts
import { verify } from "otplib";

const result = await verify({
  secret,
  token,
  strategy: "hotp",
  counter: user.hotpCounter,
  counterTolerance: 10,                   // current + 10 future counters
});
```

`counterTolerance: 10` checks `counter` through `counter + 10`, which covers a user pressing the button a few times while offline. A tuple sets both directions explicitly:

```ts
counterTolerance: [5, 5],                 // ±5 counters
```

The numeric form is look-ahead only and is the recommended shape — accepting a lower counter re-opens a window that already produced a valid code.

## 3. Advance the counter by the delta, not by one

```ts
if (result.valid) {
  const nextCounter = user.hotpCounter + result.delta + 1;
  await db.user.update({
    where: { id: user.id },
    data: { hotpCounter: nextCounter },
  });
  return allow();
}
return deny("invalid_code");
```

`result.delta` is how far ahead the accepted counter was. Writing `counter + 1` after a resynchronization lets the same code pass again on the next login.

## 4. Serialize verification per user

```ts
await db.transaction(async (tx) => {
  const user = await tx.user.findUniqueOrThrow({
    where: { id: userId },
    // SELECT ... FOR UPDATE
  });

  const result = await verify({
    secret: await decrypt(user.hotpSecret),
    token,
    strategy: "hotp",
    counter: user.hotpCounter,
    counterTolerance: [5, 0],
  });

  if (!result.valid) throw new InvalidCode();

  await tx.user.update({
    where: { id: userId },
    data: { hotpCounter: user.hotpCounter + result.delta + 1 },
  });
});
```

Two concurrent requests carrying the same token both read the old counter and both succeed unless the row is locked. The lock is the replay defense; the counter alone is not.

## 5. Provision with the counter in the URI

An HOTP enrollment URI carries the starting counter, and the authenticator app advances it locally. Keep the starting value in the database before showing the URI, so the first login verifies against the same number.

```ts
const uri = `otpauth://hotp/Acme:${encodeURIComponent(email)}?secret=${secret}&counter=0&issuer=Acme`;
```

The user must never see or edit the counter; it is server state, not a user setting.

## 6. Verify

1. `generate({ strategy: "hotp", counter: 0 })` twice — both calls return the same code (that is what a counter means)
2. Verify at counter 0, then persist `0 + delta + 1` — the same code is rejected on the next attempt
3. Skip three codes offline, then verify — the code for counter 3 is accepted at counter 0 and the stored counter jumps to 4
4. Verify a code from counter 20 with `counterTolerance: 10` — rejected, outside the window
5. Fire two concurrent verifications with the same token — exactly one succeeds under the row lock
6. `/run-test` — RFC 4226 test vectors pass for the chosen algorithm

## Pitfalls

- Storing `counter + 1` instead of `counter + delta + 1`, which accepts a resynchronized code twice.
- Using a signed delta to move the counter backwards — always move forward.
- `counterTolerance: [0, 10]` written as symmetric when only look-ahead was intended.
- No row lock, so parallel requests replay the same code.
- Skipping HOTP provisioning state and leaving the counter `null` on first login.
- Choosing HOTP for a phone-based authenticator app, adding state that TOTP would not need.
- Logging the counter change at `debug` with the token attached.

## Related

- `references/apis.md`
- `best-practices/totp-2fa.md`
- `usecases/verify-login-token.md`
- `usecases/sync-api-and-error-handling.md`
