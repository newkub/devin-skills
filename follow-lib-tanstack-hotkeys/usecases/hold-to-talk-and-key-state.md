# Use Case — Hold-to-Talk and Hold-to-Preview With Key State

> Use held-key state for push-to-talk and a "hold to reveal" gesture, without polling and without leaving a recording running after the key is released. Source: https://tanstack.com/hotkeys/latest (accessed 2026-10-20)

## 1. Read held state, not keydown events

```tsx
import { useKeyState } from "@tanstack/react-hotkeys"

function PushToTalk() {
  const holdingSpace = useKeyState("Space")
  return <MicButton active={holdingSpace} />
}
```

`useKeyState` reports whether the key is currently down, so the UI follows the physical key even when `keydown` fires repeatedly from auto-repeat. Confirm the export name in the current release — this package is `0.x`.

## 2. Start and stop around the held window

```tsx
function PushToTalk() {
  const holding = useKeyState("Space")
  const recorder = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (!holding) return
    let cancelled = false

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }
      const mr = new MediaRecorder(stream)
      mr.start()
      recorder.current = mr
    })

    return () => {
      cancelled = true
      const mr = recorder.current
      if (mr?.state === "recording") mr.stop()
      mr?.stream.getTracks().forEach((t) => t.stop())
      recorder.current = null
    }
  }, [holding])

  return <MicButton active={holding} />
}
```

The cleanup function is the contract: releasing the key (or unmounting, or alt-tabbing) must release the microphone. A keydown/keyup pair would leak the stream whenever the keyup lands on another window.

## 3. Use hold for a two-state preview

```tsx
function DiffToggle() {
  const peeking = useKeyState("Shift")   // hold Shift to reveal the original
  return <pre>{peeking ? original : edited}</pre>
}
```

Hold gestures are momentary by definition — no state to reset, so no stale "still peeking" bug after the page loses focus.

## 4. Guard against accidental triggers

```tsx
useHotkey("Space", togglePreview, {
  enabled: !isTyping(),
  ignoreInputs: true,
})
```

Auto-repeat fires `keydown` many times per second; if you must use `useHotkey`, debounce or make the handler idempotent. For momentary actions prefer `useKeyState`, which is level-triggered by construction.

## 5. Verify

1. `/run-test` — dispatch `keydown` then `keyup`: the recording starts once and stops once
2. Hold Space, switch windows, release outside the page — the stream is stopped (no mic indicator left on)
3. Focus a text field — Space types a space instead of starting the recorder
4. Hold Shift and interact with other keys — preview state follows the modifier without flicker
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Toggling on `keydown` → auto-repeat flips the state dozens of times and the recording restarts.
- `preventDefault` on `Space` globally → the page can no longer scroll and forms cannot type spaces.
- Forgetting `getTracks().forEach(stop)` → the browser keeps the mic indicator after the component is gone.
- Relying on `keyup` on `window` alone → an alt-tab release never reaches the page; the effect cleanup covers it.
- Treating a hold gesture as the only way to trigger the action → provide a click path as well.

## Related

- `references/apis.md`
- `best-practices/tanstack-hotkeys.md`
- `usecases/command-palette-mod-k.md`
- `usecases/scope-layering-for-modals-and-editors.md`
