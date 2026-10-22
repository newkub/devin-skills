# Use Case — Manage Passkeys in Account Settings

> A passkey list is not a read-only page: the user must be able to name a credential, delete one, and have the credential manager learn about both changes. Source: https://simplewebauthn.dev/docs/packages/browser (accessed 2026-10-20)

## 1. Store the fields the screen renders

```ts
// db: passkey — AuthenticatorTransportFuture / CredentialDeviceType come from @simplewebauthn/server
type PasskeyRow = {
  id: string;              // credential id, base64url
  userId: string;
  webauthnUserID: string;  // options.user.id from registration — signals need exactly this value
  publicKey: Uint8Array;
  counter: number;
  transports?: AuthenticatorTransportFuture[];
  deviceType: CredentialDeviceType;  // "singleDevice" | "multiDevice"
  backedUp: boolean;
  label: string;           // user-assigned: "MacBook Touch ID"
  createdAt: Date;
  lastUsedAt: Date | null;
};
```

`deviceType` and `backedUp` come out of `verifyRegistrationResponse` and are what a settings row shows as "synced" or "this device only". `webauthnUserID` is `options.user.id` from `generateRegistrationOptions` — capture it at registration time, because the signal payloads later must carry that exact value.

## 2. Return only safe fields

```ts
export async function listPasskeys(userId: string) {
  const rows = await db.passkey.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  return rows.map(({ id, label, deviceType, backedUp, transports, createdAt, lastUsedAt }) => ({
    id, label, deviceType, backedUp, transports: transports ?? [], createdAt, lastUsedAt,
  }));
}
```

Never serialize `publicKey` or `counter` to the client — the browser has no use for them, and `publicKey` is the verification key.

## 3. Delete by id and owner

```ts
export async function deletePasskey(userId: string, passkeyId: string) {
  const remaining = await db.passkey.count({ where: { userId } });
  const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { passwordHash: true } });

  if (remaining <= 1 && !user.passwordHash) {
    throw new Error("Add another sign-in method before deleting the last passkey");
  }

  const { count } = await db.passkey.deleteMany({ where: { id: passkeyId, userId } });
  if (count === 0) throw new Error("passkey not found");
  return listPasskeys(userId);
}
```

`deleteMany` with both `id` and `userId` is the ownership check — deleting by `id` alone lets any signed-in user remove someone else's credential.

## 4. Tell the credential manager

```ts
// src/passkeys/signals.ts (browser)
import { sendSignal } from "@simplewebauthn/browser";
import type {
  SendSignalAllAcceptedCredentialsOpts,
  SendSignalUnknownCredentialOpts,
} from "@simplewebauthn/browser";

export async function announceSignal(
  payload: SendSignalAllAcceptedCredentialsOpts | SendSignalUnknownCredentialOpts,
) {
  try {
    await sendSignal(payload);
  } catch {
    // fire-and-forget — there is no feedback, and not every manager supports signals
  }
}
```

After a delete, return the fresh list from the server and announce it:

```ts
const { rpID, userID, allAcceptedCredentialIDs } = await res.json();
await announceSignal({ signalName: "allAcceptedCredentials", rpID, userID, allAcceptedCredentialIDs });
```

For a credential the server no longer recognizes — deleted earlier, then picked from autofill — send the narrower signal:

```ts
await announceSignal({ signalName: "unknownCredential", rpID: "app.acme.com", credentialID: assertion.id });
```

Credential managers may hide or delete any passkey whose id is missing from `allAcceptedCredentialIDs`, which is the point: a deleted passkey should stop appearing in the browser's chooser.

## 5. Push profile changes through the same channel

```ts
await announceSignal({
  signalName: "currentUserDetails",
  rpID: "app.acme.com",
  userID,
  userName: next.email,
  userDisplayName: next.name,
});
```

The manager caches whatever name it saw at registration. Send this after a profile change so the account chooser does not keep showing the old email.

## 6. Verify

1. Two devices enrolled — the list shows two rows with the correct `deviceType` / `backedUp` labels
2. Delete one — the row disappears and the browser's chooser stops offering it after the signal
3. Rename — the chooser shows the new label on the next ceremony
4. Delete the last credential of a password-less account — refused with a clear message
5. Delete a credential owned by another user — not found, and the row is still there
6. Response body — no `publicKey`, no `counter`

## Pitfalls

- Deleting by credential `id` alone — every signed-in user can then delete anyone's passkey.
- Expecting `sendSignal` to guarantee removal; it is fire-and-forget and may need re-sending on later visits.
- Passing the internal `userId` to `sendSignal` — it must be the WebAuthn `user.id` captured at registration.
- Hiding the delete action for synced passkeys; remove it server-side and let the signal plus the device's own UI handle the rest.
- Reading `transports` back as a CSV string without splitting it before building `allowCredentials`.
- Letting a user delete their only credential while the account has no password, OTP, or recovery code.

## Related

- `references/apis.md`
- `best-practices/ceremonies-and-credentials.md`
- `best-practices/passkey-ux.md`
- `usecases/register-passkey.md`
- `usecases/detect-support-and-handle-errors.md`
