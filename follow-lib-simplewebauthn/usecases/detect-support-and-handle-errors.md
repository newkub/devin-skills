# Use Case — Detect Passkey Support and Handle Ceremony Errors

> Support is not a boolean: a browser can speak WebAuthn yet have no passkey provider, and a cancelled sheet is not a failure. Source: https://simplewebauthn.dev/docs/packages/browser (accessed 2026-10-20)

## 1. Gate the UI on passkey support

```tsx
// src/auth/passkey-support.ts
import { browserSupportsPasskeys } from "@simplewebauthn/browser";

export type PasskeySupport = "checking" | "passkeys" | "web-authn-only" | "none";

export async function detectPasskeySupport(): Promise<PasskeySupport> {
  if (await browserSupportsPasskeys()) return "passkeys";
  if (window.PublicKeyCredential) return "web-authn-only";
  return "none";
}
```

`browserSupportsPasskeys()` is async and checks `PublicKeyCredential.getClientCapabilities()` for a local or hybrid platform authenticator; it already implies `browserSupportsWebAuthn()`. Use the plain `window.PublicKeyCredential` check only to separate "WebAuthn but no passkey provider" from "no WebAuthn at all" — the first group can still register a security key.

## 2. Branch on individual capabilities

```ts
import { getBrowserCapabilities } from "@simplewebauthn/browser";

const caps = await getBrowserCapabilities();
// each value: "supported" | "unsupported" | "unknown"
if (caps.conditionalGet === "supported") enableAutofill();
if (caps.hybridTransport !== "unsupported") showCrossDeviceHint();
if (caps.passkeyPlatformAuthenticator === "unknown") showGenericPasskeyCopy();
```

`unknown` means "try it and see" — hide the button only for `unsupported`. This is the finer-grained call behind `browserSupportsPasskeys()`; most pages only need section 1.

## 3. Name the button after the device, not the vendor

```ts
import { platformAuthenticatorIsAvailable } from "@simplewebauthn/browser";

const label = (await platformAuthenticatorIsAvailable())
  ? "Use this device"
  : "Use a security key";
```

`platformAuthenticatorIsAvailable()` answers whether a Touch ID / Face ID / Windows Hello-style authenticator exists. Avoid hard-coding a brand — the same page renders on macOS, Windows, Android, and iOS.

## 4. Map `WebAuthnError` to a message

```ts
import { WebAuthnError } from "@simplewebauthn/browser";

function messageFor(error: unknown): string | null {
  if (!(error instanceof WebAuthnError)) return "Something went wrong. Try again.";
  switch (error.code) {
    case "ERROR_CEREMONY_ABORTED":
      return null; // the user dismissed the sheet — no message
    case "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED":
      return "This device already has a passkey for Acme.";
    case "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT":
      return "This authenticator cannot verify you with a PIN or biometrics.";
    case "ERROR_INVALID_RP_ID":
    case "ERROR_INVALID_DOMAIN":
      return "This domain is not configured for passkeys.";
    case "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY":
      return causeMessage(error.cause);
    default:
      return "The passkey prompt failed. Try again or use your password.";
  }
}
```

`WebAuthnError.code` is the library's classification, while `name` and `cause` carry the raw `DOMException`. `ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY` is the catch-all — inspect `cause` before deciding it is fatal.

## 5. Cancel the pending ceremony on navigation

```tsx
import { onCleanup } from "solid-js";
import { WebAuthnAbortService } from "@simplewebauthn/browser";

export function usePasskeyCleanup() {
  onCleanup(() => WebAuthnAbortService.cancelCeremony());
}
```

Autofill starts a long-lived WebAuthn request at page load. Client-side routing away from the login page does not cancel it, and a stale request can hold the authenticator until it times out. `cancelCeremony()` aborts it and surfaces `ERROR_CEREMONY_ABORTED`, which section 4 already ignores. Any framework with a mount/cleanup hook works the same way.

## 6. Verify

1. Chrome on Windows and Safari on iOS — the passkey button appears and the label matches the device
2. A browser without WebAuthn — the passkey section is hidden and the password form still works
3. Cancel the sheet — no error toast appears
4. Register the same device twice — the "already has a passkey" message appears
5. Navigate away mid-autofill — the ceremony is aborted and the next visit starts a fresh one
6. Point `rpID` at the wrong subdomain in staging — the domain message appears, not a generic one

## Pitfalls

- Using `browserSupportsWebAuthn()` as proof that passkeys work — it only checks that the API exists.
- Hiding the passkey button when a capability reports `unknown`.
- Treating a cancelled sheet as an error — the user chose to stop.
- Showing the raw `DOMException` message; it is written for developers.
- Hard-coding "Use Touch ID" on a page that also serves Windows and Android.
- Leaving the autofill promise running after the route changes.
- Calling these helpers during SSR — none of them exist outside the browser, so render a neutral state first.

## Related

- `references/apis.md`
- `best-practices/passkey-ux.md`
- `usecases/login-with-passkey.md`
- `usecases/manage-passkeys-in-settings.md`
