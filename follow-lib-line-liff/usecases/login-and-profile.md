# Use Case — Login and Profile Inside a LIFF Mini-App

> Initialize once, branch on in-client vs external browser, and send the ID token to the server instead of trusting profile data. Source: https://developers.line.biz/en/docs/liff/ (accessed 2026-10-20)

## 1. Install and hold one init promise

```bash
bun add @line/liff
```

```ts
import liff from "@line/liff"

let ready: Promise<void> | null = null

export function initLiff() {
  ready ??= liff.init({
    liffId: import.meta.env.VITE_LIFF_ID,
    withLoginOnExternalBrowser: true,
  })
  return ready
}
```

`liff.init` must resolve before any other call; a module-level promise prevents double initialization during hot reloads.

## 2. Branch on the environment

```ts
await initLiff()

if (!liff.isLoggedIn()) {
  liff.login({ redirectUri: window.location.href })
}
```

Inside the LINE app the user is usually already logged in; in an external browser the SDK needs the OAuth redirect.

## 3. Read the profile for display only

```ts
const profile = await liff.getProfile()
renderAvatar(profile.pictureUrl, profile.displayName)
```

## 4. Send the ID token to the server

```ts
const idToken = liff.getIDToken()

const res = await fetch("/api/session", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ idToken }),
})
```

The server verifies the token with LINE's verify endpoint and creates its own session. Client-side `profile` values are display data, not identity.

## 5. Handle init failure visibly

```ts
try {
  await initLiff()
} catch (error) {
  showError("This mini-app must be opened from LINE or a supported browser.")
}
```

`liff.init` rejects when the URL is not registered as the LIFF endpoint or the SDK is blocked.

## Pitfalls

- Calling `getProfile` before `init` resolves → the SDK throws and the page stays blank.
- Using `getProfile().userId` as the authenticated identity → the value comes from the client; verify the ID token server-side.
- Registering the wrong endpoint URL in the console → `init` fails only in production, because local hosts are added separately.
- Assuming `isInClient()` is true → external-browser users skip login and hit an unauthenticated page.

## Related

- `references/apis.md`
- `best-practices/liff.md`
- `usecases/share-and-messaging.md`
