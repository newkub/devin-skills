# Use Case — Step Up Before a Sensitive Action

> Re-authenticating with a passkey should raise the current session's assurance for a few minutes, not create a second session or replace the user's login. Source: https://simplewebauthn.dev/docs/packages/server (accessed 2026-10-20)

## 1. Mark the actions that need it

```ts
// src/auth/sensitive-actions.ts
export const SENSITIVE_ACTIONS = new Set([
  "account.delete",
  "email.change",
  "payment_method.add",
  "recovery_codes.rotate",
]);

export function isSensitive(action: string) {
  return SENSITIVE_ACTIONS.has(action);
}
```

Keep the list explicit and short. Prompting on every action trains users to approve the sheet without reading it.

## 2. Generate options bound to this user

```ts
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export async function stepUpOptions(userId: string, action: string) {
  if (!isSensitive(action)) throw new Error("unknown sensitive action");

  const credentials = await db.passkey.findMany({ where: { userId } });
  if (credentials.length === 0) return { kind: "no_passkey" as const };

  const options = await generateAuthenticationOptions({
    rpID: "app.acme.com",
    allowCredentials: credentials.map((c) => ({ id: c.id, transports: c.transports ?? [] })),
    userVerification: "required",
  });

  await db.challenge.create({
    data: { userId, action, challenge: options.challenge, expiresAt: addMinutes(3) },
  });

  return { kind: "options" as const, options };
}
```

`userVerification: "required"` is the point of a step-up: the authenticator must check a PIN or biometrics, so an unlocked phone alone is not enough. Always pass `allowCredentials` here — an unbound discoverable-credential prompt would let the user prove a credential for a different account.

## 3. Run the assertion in the browser

```ts
import { startAuthentication } from "@simplewebauthn/browser";

const optionsRes = await fetch(`/api/step-up/options?action=${action}`, { method: "POST" });
const { kind, options } = await optionsRes.json();
if (kind === "no_passkey") return fallBackToPasswordReentry();

const assertion = await startAuthentication({ optionsJSON: options });

const verified = await fetch("/api/step-up/verify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ action, assertion }),
});
```

This is the same ceremony as login — reuse the existing passkey button and its error mapping instead of writing a second client path.

## 4. Verify and raise the session's assurance

```ts
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

export async function stepUpVerify({ session, action, assertion }: StepUpInput) {
  const stored = await db.passkey.findFirst({
    where: { id: assertion.id, userId: session.userId },
  });
  if (!stored) return deny("unknown_credential");

  const pending = await db.challenge.findFirst({
    where: { userId: session.userId, action },
    orderBy: { expiresAt: "desc" },
  });
  if (!pending || pending.expiresAt < new Date()) return deny("challenge_expired");

  const verification = await verifyAuthenticationResponse({
    response: assertion,
    expectedChallenge: pending.challenge,
    expectedOrigin: "https://app.acme.com",
    expectedRPID: "app.acme.com",
    credential: {
      id: stored.id,
      publicKey: stored.publicKey,
      counter: stored.counter,
      transports: stored.transports ?? [],
    },
  });

  if (!verification.verified || !verification.authenticationInfo.userVerified) {
    return deny("user_verification_required");
  }

  await db.$transaction([
    db.passkey.update({
      where: { id: stored.id },
      data: {
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      },
    }),
    db.challenge.delete({ where: { id: pending.id } }),
    db.session.update({
      where: { id: session.id },
      data: { stepUpAt: new Date(), stepUpAction: action },
    }),
  ]);

  return allow();
}
```

`verifyAuthenticationResponse` already defaults `requireUserVerification` to `true`, so a response without UV throws. The explicit `authenticationInfo.userVerified` check keeps the contract visible in the handler and survives a future change to that default.

## 5. Enforce the window in the action handler

```ts
const STEP_UP_WINDOW_MS = 5 * 60 * 1000;

// db: session — stepUpAt: Date | null, stepUpAction: string | null
export function requireRecentStepUp(session: Session, action: string) {
  const recent = session.stepUpAt !== null && Date.now() - session.stepUpAt.getTime() < STEP_UP_WINDOW_MS;
  if (!recent || session.stepUpAction !== action) throw new HttpError(403, "step_up_required");
}
```

Bind the grant to the action and a short window. A session-wide "verified" boolean that never expires defeats the purpose, and one grant should not silently cover a different sensitive action.

## 6. Keep a fallback

```ts
if (user.passkeys.length === 0) return requirePasswordReentry({ action });
```

Users without a passkey still need to delete an account or change an email. Password re-entry is weaker, but a dead end is worse; log which method was used so the gap shows up in the data.

## 7. Verify

1. Delete-account flow — the passkey sheet appears and the action is refused until it succeeds
2. A credential belonging to another account — `unknown_credential`, no elevation
3. A security key without a PIN — refused even though the signature is valid
4. Wait past the window — the action asks again
5. Reuse the grant for a different action — refused
6. Session id and `createdAt` — unchanged by the step-up; only the assurance fields move

## Pitfalls

- Using `userVerification: "preferred"` and assuming `userVerified` is true.
- Omitting `allowCredentials`, which turns step-up into a login for whoever holds the device.
- Rotating the session id on step-up, which signs the user out of their other tab for no reason.
- Storing the grant as a session-wide boolean with no expiry.
- Trusting `action` from the client without checking it against the server-side allow-list.
- Skipping the counter update, so a cloned authenticator becomes undetectable after a step-up.
- Requiring a passkey-only step-up from users who have none.

## Related

- `references/apis.md`
- `best-practices/ceremonies-and-credentials.md`
- `usecases/login-with-passkey.md`
- `usecases/detect-support-and-handle-errors.md`
