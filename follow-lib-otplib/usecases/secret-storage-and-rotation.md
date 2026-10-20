# Use Case — Store, Rotate, and Reset the Secret

> The shared secret is a long-lived credential: encrypt it at rest with a versioned key, rotate the key without re-enrolling users, and reset it in one auditable path when a device is lost. Source: https://otplib.yeojz.dev/guide/security (accessed 2026-10-20)

## 1. Decide the stored representation

```ts
import { generateSecret } from "otplib";

const base32Secret = generateSecret();      // 20 bytes, Base32 string — default
const sha256Secret = generateSecret(32);    // 32 bytes for algorithm: "sha256"
```

- Base32 string — required by `otpauth://` URIs and by authenticator apps; store it only in ciphertext
- `Uint8Array` — smaller and faster for internal use; pass `crypto` and the raw bytes, no Base32 plugin
- Never mix representations in one column: decide once and validate the length on write (16–64 bytes)

A SHA-1 secret at 20 bytes is the RFC 4226 default. Generating 32 bytes for sha1 is harmless but wasted; generating 20 bytes for sha256 weakens the HMAC.

## 2. Encrypt at rest with AAD bound to the user

```ts
// src/crypto/totp-secret.ts
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const KEYS: Record<number, Buffer> = {
  3: Buffer.from(process.env.TOTP_ENC_KEY_V3!, "base64"), // retired versions stay here until rotation finishes
};

export function encryptSecret(plain: string, userId: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  cipher.setAAD(Buffer.from(userId, "utf8"));

  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);

  return {
    keyVersion: 3,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ct: ct.toString("base64"),
  };
}

export function decryptSecret(row: EncryptedSecret, userId: string) {
  const key = KEYS[row.keyVersion];
  if (!key) throw new Error(`no encryption key for version ${row.keyVersion}`);

  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(row.iv, "base64"),
  );
  decipher.setAAD(Buffer.from(userId, "utf8"));
  decipher.setAuthTag(Buffer.from(row.tag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(row.ct, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
```

AES-GCM authenticates as well as encrypts; binding `userId` as AAD means a row copied onto another user's record fails to decrypt instead of silently granting that user a second factor they do not control.

## 3. Shape the columns

```prisma
model User {
  id             String   @id
  totpSecretCt   String?
  totpSecretIv   String?
  totpSecretTag  String?
  totpKeyVersion Int?
  totpEnabled    Boolean  @default(false)
  totpLastStep   BigInt?
  hotpCounter    Int?
}
```

`totpKeyVersion` is what makes rotation possible — the decrypt path chooses the key by that column, not by the key that happens to be configured today.

## 4. Rotate the encryption key without touching users

```ts
// scripts/rotate-totp-key.ts
const stale = await db.user.findMany({
  where: { totpSecretCt: { not: null }, totpKeyVersion: { lt: CURRENT_KEY_VERSION } },
  take: 500,
});

for (const user of stale) {
  const plain = decryptSecret(user, user.id);
  await db.user.update({
    where: { id: user.id },
    data: encryptSecret(plain, user.id),
  });
}
```

Run in batches under a lock, keep the old key readable until the batch with zero stale rows completes, then retire it. Users notice nothing; the token keeps verifying.

## 5. Reset a lost device in one path

```ts
export async function resetTotp(userId: string, actor: "user" | "support") {
  await db.transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        totpSecretCt: null,
        totpSecretIv: null,
        totpSecretTag: null,
        totpKeyVersion: null,
        totpEnabled: false,
        totpLastStep: null,
        hotpCounter: null,
      },
    });
    await tx.recoveryCode.deleteMany({ where: { userId } });
    await tx.session.deleteMany({ where: { userId } });
    await tx.auditLog.create({
      data: { userId, action: "totp.reset", actor },
    });
  });
}
```

Deleting the secret disables the factor; deleting recovery codes prevents the old set from re-enabling access; deleting sessions forces a fresh login. The next enrollment generates a brand-new secret.

## 6. Rotate the factor itself when it may be compromised

A leaked secret cannot be rotated in place — the user's authenticator holds it. Force re-enrollment:

```ts
await db.user.update({
  where: { id: userId },
  data: { totpEnabled: false, totpSecretCt: null, totpResetReason: "compromised" },
});
await sendEmail(userId, "re_enroll_2fa");
```

Until the user re-enrolls, sign-in must require another factor (password + email code) rather than silently dropping to single-factor.

## 7. Verify

1. Encrypt then decrypt with the same `userId` — the original secret is returned
2. Decrypt with a different `userId` — GCM tag check fails, no plaintext
3. Flip a byte in `ct` — authentication fails instead of producing a wrong secret
4. Run the rotation script — every row moves to `CURRENT_KEY_VERSION`, and a login still succeeds afterwards
5. `resetTotp` — the old authenticator code is rejected, recovery codes no longer work, other sessions are logged out
6. Inspect the database and logs — no column, log line, error report, or JWT payload contains the plaintext secret
7. `/run-test` — one test each for wrong AAD, wrong key version, and reset

## Pitfalls

- Storing the secret in plaintext "because the database is private" — backups, replicas, and support dumps leak it.
- Putting the secret in the JWT or session cookie so every request carries the factor.
- One global encryption key without a version column, making rotation impossible without downtime.
- Reusing an IV with AES-GCM, which destroys confidentiality and integrity.
- Logging the decrypted secret or `error.cause` from a crypto failure.
- Resetting 2FA without deleting sessions and recovery codes, leaving the old factor alive.
- Silently disabling 2FA on reset instead of forcing re-enrollment, which downgrades the account.
- Encrypting with a key that lives in the same repository as the code.

## Related

- `references/apis.md`
- `best-practices/totp-2fa.md`
- `usecases/enroll-totp-2fa.md`
- `usecases/sync-api-and-error-handling.md`
