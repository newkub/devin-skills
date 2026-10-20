# Use Case — Friendship Gate and Close Window

> Ask whether the user added the official account as a friend, gate the reward on the answer, and finish the flow by closing the mini-app. Source: https://developers.line.biz/en/reference/liff/ (accessed 2026-10-20)

## 1. Read the friendship flag

```ts
import liff from "@line/liff"

export async function isFriend() {
  const { friendFlag } = await liff.getFriendship()
  return friendFlag
}
```

`getFriendship` answers one question: is this user a friend of the official account that owns the LIFF channel. It is not a permission check for your own app — it is the gate most campaigns and coupons use.

## 2. Gate the reward, not the page

```ts
export async function claimReward() {
  if (!(await isFriend())) {
    renderAddFriendPrompt({
      addUrl: "https://line.me/R/ti/p/@yourbrand",
      onDone: () => refresh(),
    })
    return
  }

  const res = await fetch("/api/rewards/claim", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken: liff.getIDToken() }),
  })

  renderReward(await res.json())
}
```

Hiding the whole page behind the gate loses the reason the user came. Show the reward, then the one step needed to unlock it.

## 3. Re-check when the user comes back

```ts
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && (await isFriend())) {
    await claimReward()
  }
})
```

Adding a friend happens in the LINE app, not in your page, so nothing on the page knows it worked. `visibilitychange` fires when the user returns to the mini-app and is the cheapest place to re-read the flag.

## 4. Finish with closeWindow

```ts
await claimReward()
liff.closeWindow()
```

`closeWindow` closes the LIFF view and returns the user to the chat. It is the intended ending for a single-purpose mini-app — leaving the user on a dead "done" screen is the alternative. It only works in-client; in an external browser, render a normal completion state instead.

## 5. Offer the home-screen shortcut

```ts
if (liff.isInClient()) {
  await liff.createShortcutOnHomeScreen({
    url: liff.permanentLink.createUrl(),
  })
}
```

`createShortcutOnHomeScreen` adds an icon to the user's LINE home screen, which is how a campaign turns into a returning user. Pass the permanent link so the shortcut reopens the same screen and not the app root.

## 6. Verify

1. A friend account — the reward path runs with no prompt
2. A non-friend account — the prompt appears, and the reward unlocks after adding without a reload
3. Repeat the claim — the server rejects the second attempt, not only the UI
4. External browser — no `closeWindow` call, and a completion screen renders
5. `/run-test` — both `friendFlag` branches are covered

## Pitfalls

- Treating `friendFlag` as proof of consent for messaging or marketing, which it is not.
- Caching the flag for the session, so a user who unfriends still passes the gate.
- Calling `closeWindow` in an external browser, where it does nothing and the flow appears stuck.
- Trusting the client-side gate for the reward — the server must re-check friendship or entitlement on claim.
- Passing a relative URL to `createShortcutOnHomeScreen`, which cannot resolve outside the current page.

## Related

- `references/apis.md`
- `best-practices/liff.md`
- `usecases/login-and-profile.md`
- `usecases/qr-scan-and-api-availability.md`
- `usecases/context-and-permanent-links.md`
