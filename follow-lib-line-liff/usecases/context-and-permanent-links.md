# Use Case — Context, Permanent Links, and Logout

> Read where the mini-app was opened from, build a link that reopens the same screen, and end the session cleanly. Source: https://developers.line.biz/en/reference/liff/ (accessed 2026-10-20)

## 1. Read the context once after init

```ts
import liff from "@line/liff"

type Entry =
  | { kind: "one-to-one"; userId: string }
  | { kind: "group"; groupId: string; userId: string }
  | { kind: "room"; roomId: string; userId: string }
  | { kind: "external" }

export async function readEntry(): Promise<Entry> {
  const ctx = liff.getContext()

  if (ctx.type === "utou" && ctx.userId) return { kind: "one-to-one", userId: ctx.userId }
  if (ctx.type === "group" && ctx.groupId && ctx.userId) {
    return { kind: "group", groupId: ctx.groupId, userId: ctx.userId }
  }
  if (ctx.type === "room" && ctx.roomId && ctx.userId) {
    return { kind: "room", roomId: ctx.roomId, userId: ctx.userId }
  }
  return { kind: "external" }
}
```

`getContext().type` tells you whether the app was opened from a one-to-one chat, a group, a multi-person room, or outside LINE. Each shape carries different ids — reading `groupId` from a one-to-one chat returns `undefined` and silently produces a broken link.

## 2. Build a permanent link to the current screen

```ts
const url = liff.permanentLink.createUrl()
console.log(url) // https://liff.line.me/{liffId}/path?query=1
```

A permanent link survives the session and reopens the same path and query in the LIFF app. Copying `window.location.href` instead gives a `liff.line.me` URL with the in-app browser's transient parameters, which behave differently when shared.

For a different screen:

```ts
const settings = liff.permanentLink.createUrlBy("https://app.example.com/settings?tab=billing")
```

## 3. Handle the state parameter on nested routes

```ts
const params = new URLSearchParams(window.location.search)
const state = params.get("liff.state")

const target = state ? decodeURIComponent(state) : "/"
router.navigate(target)
```

When a LIFF URL points at a path under the endpoint, the SDK delivers it in `liff.state` rather than the path the router sees. A deep link that works from the LINE chat but lands on the home screen is almost always this parameter being ignored.

## 4. Open links in the right target

```ts
liff.openWindow({ url: "https://help.example.com", external: true })
liff.openWindow({ url: liff.permanentLink.createUrl(), external: false })
```

`external: true` hands the URL to the OS browser; `external: false` keeps it inside the LINE in-app browser where LIFF APIs still work. Opening an internal screen externally loses `liff.getIDToken()` and every in-client feature on the next page.

## 5. Log out and clear local state

```ts
liff.logout()
localStorage.removeItem("draft")
location.replace(liff.permanentLink.createUrl())
```

`logout` clears the LINE session for this browser; it does not clear what your app stored. Removing the draft and reloading prevents the next user of the device from seeing the previous user's data.

## 6. Verify

1. Open from a one-to-one chat, a group, and a desktop browser — `readEntry` returns the matching shape
2. Share the permanent link into the same group — it reopens the same screen with the query intact
3. Open a nested path link — the router lands on that path, not the home screen
4. Log out, then log in as a different account — no draft or cached profile from the previous user is visible
5. `/run-test` — the four context branches are covered with fixture objects

## Pitfalls

- Reading `groupId`/`roomId` without checking `type`, so a one-to-one chat produces a link with `undefined`.
- Sharing `window.location.href`, which includes transient parameters and breaks outside the current session.
- Ignoring `liff.state`, which makes every deep link land on the root route.
- Opening an internal route with `external: true`, where the next page has no LIFF context.
- Calling `logout` and leaving the app's own cache, so the UI still shows the previous account.

## Related

- `references/apis.md`
- `best-practices/liff.md`
- `usecases/login-and-profile.md`
- `usecases/share-and-messaging.md`
- `usecases/friendship-gate-and-close-window.md`
