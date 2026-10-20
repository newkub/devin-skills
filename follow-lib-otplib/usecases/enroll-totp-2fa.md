# Use Case — Enroll a User in TOTP 2FA

> Take a user from "no second factor" to a confirmed authenticator app without ever exposing the secret in a response body. Source: https://github.com/yeojz/otplib (accessed 2026-10-20)

## 1. Generate the secret server-side

```ts
import { generateSecret, generateURI } from "otplib";

const secret = await generateSecret();
// store against the user, encrypted, with enabled = false
await db.user.update({
  where: { id: userId },
  data: { totpSecret: await encrypt(secret), totpEnabled: false },
});
```

Generate a new secret per enrollment attempt. Reusing one secret across users or across re-enrollments defeats the factor.

## 2. Build the provisioning URI

```ts
const uri = generateURI({
  issuer: "Acme",
  label: `acme:${user.email}`,
  secret,
});

return c.json({ uri, qr: await toDataURL(uri) }); // QR rendering: /follow-lib-qrcode
```

`issuer` and `label` are what the user sees in the authenticator app — keep the issuer identical across the product or entries fragment.

## 3. Confirm one real code before enabling

```ts
import { verify } from "otplib";

export async function confirmEnrollment(userId: string, token: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.totpEnabled) throw new Error("already enabled");

  const secret = await decrypt(user.totpSecret);
  const result = await verify({ secret, token, epochTolerance: 30 });

  if (!result.valid) return { ok: false as const };
  await db.user.update({ where: { id: userId }, data: { totpEnabled: true } });
  return { ok: true as const };
}
```

`verify` resolves to a `VerifyResult` object — reading it as a boolean always yields a truthy object, including on failure.

## 4. Return recovery codes at the same moment

```ts
const recoveryCodes = Array.from({ length: 10 }, () => randomBytes(5).toString("hex"));
await db.recoveryCode.createMany({
  data: recoveryCodes.map((code) => ({ userId, hash: sha256(code) })),
});
return { ok: true, recoveryCodes };
```

Show them once, store only hashes, and treat each code as single-use.

## 5. Never leak the secret afterwards

The enrollment response is the only place the secret may travel, and only over TLS to the enrolling user. Later endpoints return `totpEnabled` only — a status flag, never the secret.

## Pitfalls

- Treating `verify(...)` as a boolean: it returns an object, so `if (await verify(...))` is always true. Check `.valid`.
- Storing the secret in plaintext or in a JWT — encrypt at rest and keep it out of tokens, logs, and error reports.
- Enabling the factor before the user proves one code works, which locks out anyone who mistyped the QR scan.
- Calling `generateSync`/`verifySync` without a sync crypto plugin — the default path is async.
- Generating the secret per page load, so the secret the user scanned is not the one saved.
- Skipping recovery codes, leaving support to reset 2FA by hand for every lost phone.

## Related

- `references/apis.md`
- `best-practices/totp-2fa.md`
- `usecases/verify-login-token.md`
