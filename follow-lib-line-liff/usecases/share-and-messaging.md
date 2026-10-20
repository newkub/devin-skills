# Use Case — Share Content and Send Messages From LIFF

> Offer the native share picker everywhere, and use direct messaging only where the SDK actually supports it. Source: https://developers.line.biz/en/docs/liff/ (accessed 2026-10-20)

## 1. Check capability first

```ts
import liff from "@line/liff"

const canShare = liff.isApiAvailable("shareTargetPicker")
const inClient = liff.isInClient()
```

Some APIs work only inside the LINE app. Check before rendering the button so users never tap a dead control.

## 2. Share through the picker

```ts
async function shareResult(text: string) {
  if (!liff.isApiAvailable("shareTargetPicker")) return

  const result = await liff.shareTargetPicker([
    {
      type: "text",
      text,
    },
  ])

  if (!result) {
    // the user cancelled the picker
  }
}
```

`shareTargetPicker` returns `null` when the user closes the picker without sending; that is not an error.

## 3. Send a message to the current chat

```ts
async function sendToChat(text: string) {
  if (!liff.isInClient()) return

  await liff.sendMessages([{ type: "text", text }])
  liff.closeWindow()
}
```

`sendMessages` requires an open chat context and the `chat_message.write` scope; outside the client it rejects.

## 4. Read the context to adapt the UI

```ts
const context = liff.getContext()

if (context?.type === "group") {
  showGroupHeader(context.groupId)
}
```

`getContext()` reports the launch type (`utou`, `group`, `room`, `external`) and the ids that go with it.

## 5. Handle rejections per API

```ts
try {
  await liff.shareTargetPicker(messages)
} catch (error) {
  showToast("Sharing is unavailable in this environment.")
}
```

Each LIFF call returns a promise that rejects on missing scope, unsupported environment, or a closed window.

## Pitfalls

- Calling `sendMessages` in an external browser → always rejects; gate it with `isInClient()`.
- Treating a `null` picker result as failure → shows a false error after the user cancels.
- Sharing a URL that the LIFF endpoint redirects → recipients land on a broken page; share the canonical URL.
- Calling LIFF APIs on the server → the SDK is browser-only.

## Related

- `references/apis.md`
- `best-practices/liff.md`
- `usecases/login-and-profile.md`
