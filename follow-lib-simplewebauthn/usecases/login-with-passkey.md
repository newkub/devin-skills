# Use Case — Login With a Passkey

> Verify an assertion, advance the signature counter, and offer passkey autofill on the username field. Source: https://simplewebauthn.dev/docs/ (accessed 2026-10-20)

## 1. Generate authentication options

```ts
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export async function startLogin(user?: User) {
  const options = await generateAuthenticationOptions({
    rpID: "app.acme.com",
    allowCredentials: user?.credentials.map((c) => ({
      id: c.id,
      transports: c.transports.split(",") as AuthenticatorTransportFuture[],
    })),
    userVerification: "preferred",
  });

  if (user) await db.challenge.create({ data: { userId: user.id, challenge: options.challenge, expiresAt: addMinutes(5) } });
  return options;
}
```

Omit `allowCredentials` for a discoverable-credential flow where the user has no username typed yet; the browser then shows every passkey for the site.

## 2. Run the assertion in the browser

```ts
import { startAuthentication } from "@simplewebauthn/browser";

const optionsJSON = await (await fetch("/api/passkey/login/options")).json();
const assertion = await startAuthentication({ optionsJSON });
await fetch("/api/passkey/login/verify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(assertion),
});
```

## 3. Enable passkey autofill on the username field

```ts
const optionsJSON = await (await fetch("/api/passkey/login/options")).json();

try {
  const assertion = await startAuthentication({ optionsJSON, useBrowserAutofill: true });
  await verifyLogin(assertion);
} catch {
  // no credential picked from the autofill dropdown — fall back to the normal form
}
```

```html
<input name="username" autocomplete="username webauthn" />
```

Conditional UI shows passkeys inside the browser's autofill list; the input must carry the `webauthn` token in `autocomplete`.

## 4. Verify and update the counter

```ts
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

export async function verifyLogin(response: AuthenticationResponseJSON) {
  const stored = await db.credential.findUniqueOrThrow({ where: { id: response.id } });
  const pending = await db.challenge.findLatest(stored.userId);

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: pending!.challenge,
    expectedOrigin: "https://app.acme.com",
    expectedRPID: "app.acme.com",
    credential: {
      id: stored.id,
      publicKey: Buffer.from(stored.publicKey, "base64url"),
      counter: stored.counter,
      transports: stored.transports.split(",") as AuthenticatorTransportFuture[],
    },
  });

  if (!verification.verified) return deny("passkey_failed");

  await db.credential.update({
    where: { id: stored.id },
    data: { counter: verification.authenticationInfo.newCounter },
  });
  await db.challenge.delete({ where: { id: pending!.id } });
  return allow(stored.userId);
}
```

A counter that does not increase is the signal of a cloned authenticator — treat it as a security event, not a retryable error.

## 5. Keep a fallback path

```ts
if (!window.PublicKeyCredential) return showPasswordForm();
```

Passkeys are additive: users with an old device or a non-supporting browser still need the previous method.

## Pitfalls

- Skipping the counter update, so a cloned authenticator passes forever.
- Decoding `publicKey` with the wrong encoding (hex or base64 instead of base64url) fails verification with an opaque error.
- Accepting the assertion without matching `expectedOrigin`/`expectedRPID` allows a phishing origin to relay credentials.
- Surfacing `useBrowserAutofill` failures as errors — "user did not pick a passkey" is a normal path.
- Omitting `transports`, which makes the next login slower because the browser has no hint where the credential lives.
- Leaving the challenge row after a failed verify, allowing unlimited attempts against one challenge.

## Related

- `references/apis.md`
- `best-practices/ceremonies-and-credentials.md`
- `best-practices/passkey-ux.md`
- `usecases/register-passkey.md`
