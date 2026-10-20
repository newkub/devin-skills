# Use Case — QR Scanning and API Availability

> Call a feature that only exists inside the LINE app, after asking the SDK whether it is available, and handle the two ways it can be missing. Source: https://developers.line.biz/en/reference/liff/ (accessed 2026-10-20)

## 1. Ask before calling

```ts
import liff from "@line/liff"

export async function canScan() {
  await liff.init({ liffId: import.meta.env.VITE_LIFF_ID })
  return liff.isInClient() && liff.isApiAvailable("scanCodeV2")
}
```

`isApiAvailable` covers both the SDK version and the environment. Checking `isInClient()` alone is not enough: an older LINE client in a chat reports in-client and still rejects the call.

## 2. Scan and pass the value to the server

```ts
export async function scanCoupon() {
  const { value } = await liff.scanCodeV2()

  const res = await fetch("/api/coupons/redeem", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code: value, idToken: liff.getIDToken() }),
  })

  return res.json()
}
```

`scanCodeV2` returns `{ value }` — the raw string from the QR code. Treat it as untrusted input: the server must validate the format, check expiry, and verify the ID token before granting anything. A QR code is a string a user can photograph, edit, and reprint.

## 3. Give external-browser users a way in

```ts
if (!(await canScan())) {
  renderFallback({
    message: "Scanning works inside the LINE app.",
    action: () =>
      liff.openWindow({
        url: liff.permanentLink.createUrl(),
        external: false,
      }),
  })
}
```

`liff.openWindow({ external: false })` opens the URL in the LINE in-app browser, where the scanner exists. Without this, an external-browser visitor sees a disabled button and no path forward.

## 4. Separate "unsupported" from "cancelled"

```ts
try {
  return await scanCoupon()
} catch (error) {
  if (error instanceof Error && /cancel/i.test(error.message)) {
    return { status: "cancelled" as const }
  }
  return { status: "unavailable" as const }
}
```

Cancelling the scanner and a failed API call are different outcomes for the UI: one returns to the previous screen silently, the other needs an explanation. Logging both as one error makes the cancel rate indistinguishable from a broken feature.

## 5. Keep the scanner behind a user action

```ts
button.addEventListener("click", () => void scanCoupon())
```

Opening the scanner on mount steals control from the user and, on iOS, can be blocked because it is not tied to a gesture. Call it from the click handler.

## 6. Verify

1. Open the LIFF app inside LINE — the scan button is enabled and the scanner opens
2. Open the same URL in a desktop browser — the fallback appears and the deep link opens LINE
3. Cancel the scanner — the UI returns to the previous state with no error toast
4. Submit an edited QR payload — the server rejects it with a validation error, not a generic 500
5. `/run-test` — the availability guard is unit-tested with both branch values

## Pitfalls

- Calling `scanCodeV2` in an external browser, where it rejects and the page stays on a blank state.
- Rendering the scan button before `liff.init` resolves, so the first tap fails on a cold load.
- Trusting the scanned string as an identifier without server-side validation and expiry checks.
- Treating a user cancel as a failure and showing an error dialog.
- Using the deprecated `scanCode` API, which is no longer the documented entry point.

## Related

- `references/apis.md`
- `best-practices/liff.md`
- `usecases/login-and-profile.md`
- `usecases/friendship-gate-and-close-window.md`
- `usecases/context-and-permanent-links.md`
