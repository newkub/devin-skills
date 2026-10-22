# Use Case — Upgrade Password Users to Passkeys

> The cheapest enrollment is the one the user never notices: a conditional registration right after a successful password login, with a visible button as the fallback. Source: https://simplewebauthn.dev/docs/packages/browser (accessed 2026-10-20)

## 1. Gate on capability and account state

```ts
import { browserSupportsPasskeys, getBrowserCapabilities } from "@simplewebauthn/browser";

export async function canOfferPasskey(user: { passkeyCount: number }) {
  if (user.passkeyCount > 0) return false;            // already enrolled somewhere
  if (!(await browserSupportsPasskeys())) return false;

  const caps = await getBrowserCapabilities();
  return caps.passkeyPlatformAuthenticator !== "unsupported";
}
```

`passkeyPlatformAuthenticator: "unknown"` still means "worth trying" — the silent path simply fails and the user never sees it.

## 2. Generate options like a normal registration

```ts
import { generateRegistrationOptions } from "@simplewebauthn/server";

export async function upgradeOptions(user: User) {
  const options = await generateRegistrationOptions({
    rpName: "Acme",
    rpID: "app.acme.com",
    userName: user.email,
    userDisplayName: user.name || user.email,
    attestationType: "none",
    excludeCredentials: user.passkeys.map((p) => ({ id: p.id, transports: p.transports ?? [] })),
    authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
  });

  await db.challenge.create({
    data: { userId: user.id, challenge: options.challenge, expiresAt: addMinutes(5) },
  });
  return options;
}
```

`userDisplayName` must never be an empty string — Chrome up to 127 fails the QR-code path with `NotAllowedError` when it is. Fall back to the email.

## 3. Attempt the silent registration

```ts
import { startRegistration } from "@simplewebauthn/browser";

export async function trySilentUpgrade() {
  try {
    const res = await fetch("/api/passkey/upgrade/options", { method: "POST" });
    const optionsJSON = await res.json();

    const registration = await startRegistration({ optionsJSON, useAutoRegister: true });
    await fetch("/api/passkey/upgrade/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(registration),
    });
  } catch {
    // opportunistic: a decline, an unsupported manager, or a policy failure is not an error
  }
}
```

`useAutoRegister: true` asks the browser to create the passkey through the password manager that just filled the login form, without showing a modal. Call it from the post-login page, not on every page load, and never block the redirect on it.

## 4. Accept the response without user presence

```ts
import { verifyRegistrationResponse } from "@simplewebauthn/server";

const verification = await verifyRegistrationResponse({
  response,
  expectedChallenge: pending.challenge,
  expectedOrigin: "https://app.acme.com",
  expectedRPID: "app.acme.com",
  requireUserPresence: false, // auto-register may report UP as false
});

if (!verification.verified || !verification.registrationInfo) return { stored: false };
```

Keep `requireUserVerification` at its default `true`; auto-register still has to satisfy the authenticator's UV policy. Only the presence flag is relaxed, and only on this endpoint. If verification throws on UV, treat it as `stored: false` and leave the credential unenrolled — do not relax UV globally to make the silent path pass.

## 5. Keep a visible path

```tsx
<button type="button" onClick={() => addPasskey()}>Add a passkey</button>
```

```ts
import { startRegistration, WebAuthnError } from "@simplewebauthn/browser";

export async function addPasskey() {
  const res = await fetch("/api/passkey/upgrade/options", { method: "POST" });
  const optionsJSON = await res.json();

  try {
    const registration = await startRegistration({ optionsJSON });
    await verifyOnServer(registration);
    toast.success("Passkey added — you can use it to sign in next time.");
  } catch (error) {
    if (error instanceof WebAuthnError && error.code === "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED") {
      toast.info("This device already has a passkey for Acme.");
      return;
    }
    throw error;
  }
}
```

The button is what users whose manager ignores `useAutoRegister` will use, and it is the only path that shows a sheet the user can reason about.

## 6. Verify

1. Password login on a fresh profile — a passkey row appears in settings without any prompt
2. Sign out and sign in with that passkey — the enrollment is real, not just a stored row
3. Simulate a declined silent attempt — login still completes, no toast, no error
4. Run the silent path on a device that already has the passkey — `ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED` is handled quietly
5. Fixture with an empty `userDisplayName` — the QR path still succeeds
6. Registration verify — `requireUserPresence: false` appears only on the upgrade endpoint

## Pitfalls

- Firing the silent registration on every page load instead of once after password authentication.
- Showing a spinner or blocking the redirect while it runs.
- Relaxing `requireUserVerification` for every registration because auto-register failed once.
- Passing an empty `userDisplayName`; Chrome's QR flow rejects it.
- Reusing the challenge from the login step.
- Reporting a cancelled silent attempt as an error.
- Skipping `excludeCredentials`, so the settings button reports "already registered" with no explanation.

## Related

- `references/apis.md`
- `best-practices/passkey-ux.md`
- `usecases/register-passkey.md`
- `usecases/manage-passkeys-in-settings.md`
