# Use Case — Register a Passkey

> Add a passkey to an existing account with the two-step server/client ceremony and store the credential correctly. Source: https://simplewebauthn.dev/docs/ (accessed 2026-10-20)

## 1. Generate registration options on the server

```ts
import { generateRegistrationOptions } from "@simplewebauthn/server";

export async function startRegistration(user: User) {
  const options = await generateRegistrationOptions({
    rpName: "Acme",
    rpID: "app.acme.com",
    userName: user.email,
    userDisplayName: user.name,
    attestationType: "none",
    excludeCredentials: user.credentials.map((c) => ({ id: c.id, transports: c.transports })),
    authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
  });

  await db.challenge.create({ data: { userId: user.id, challenge: options.challenge, expiresAt: addMinutes(5) } });
  return options;
}
```

`rpID` is the bare domain — no scheme, no port. `excludeCredentials` is what stops the same device registering twice.

## 2. Run the ceremony in the browser

```ts
import { startRegistration } from "@simplewebauthn/browser";

const res = await fetch("/api/passkey/register/options", { method: "POST" });
const optionsJSON = await res.json();

const registration = await startRegistration({ optionsJSON });
await fetch("/api/passkey/register/verify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(registration),
});
```

Since v11 the browser helpers take a single object — `startRegistration({ optionsJSON })`, never a positional argument.

## 3. Verify and persist on the server

```ts
import { verifyRegistrationResponse } from "@simplewebauthn/server";

export async function finishRegistration(userId: string, response: RegistrationResponseJSON) {
  const pending = await db.challenge.findLatest(userId);
  if (!pending || pending.expiresAt < new Date()) throw new Error("challenge expired");

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: pending.challenge,
    expectedOrigin: "https://app.acme.com",
    expectedRPID: "app.acme.com",
  });

  if (!verification.verified || !verification.registrationInfo) throw new Error("registration failed");
  const { credential } = verification.registrationInfo;

  await db.credential.create({
    data: {
      userId,
      id: credential.id,
      publicKey: Buffer.from(credential.publicKey).toString("base64url"),
      counter: credential.counter,
      transports: credential.transports?.join(",") ?? "",
    },
  });
  await db.challenge.delete({ where: { id: pending.id } });
}
```

Store the public key as base64url text and decode it on the way back in — binary columns are painful to migrate later.

## 4. Keep the challenge one-time

```ts
await db.challenge.delete({ where: { id: pending.id } });
```

Deleting after a successful verify is the simplest single-use guarantee; a retained challenge is a replay window.

## 5. Guard the flow in the UI

```ts
if (!window.PublicKeyCredential) {
  showMessage("This browser cannot create passkeys — use a security key or password");
  return;
}
```

WebAuthn needs a secure context: HTTPS in production, `http://localhost` in dev.

## Pitfalls

- `rpID: "https://app.acme.com"` fails — it must be the bare domain, while `expectedOrigin` keeps the scheme.
- Reusing one challenge across attempts, or storing it without expiry.
- Persisting only the credential id: without `publicKey` and `counter` a later login cannot be verified.
- Passing raw `Uint8Array` keys into a JSON column — encode base64url at the boundary.
- Expecting `attestationType: "none"` to produce attestation data; it deliberately returns none.
- Testing only in a desktop browser; passkeys must be re-checked on a phone and a security key.

## Related

- `references/apis.md`
- `best-practices/ceremonies-and-credentials.md`
- `best-practices/passkey-ux.md`
- `usecases/login-with-passkey.md`
