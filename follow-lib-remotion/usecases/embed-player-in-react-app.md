# Use Case — Embed the Video in a React App

> The same composition that renders to an MP4 can play inside a product UI: `<Player>` handles the frame loop, and a `PlayerRef` gives you play, pause, seek, and mute without writing a video element. Source: https://www.remotion.dev/docs/player/player (accessed 2026-10-20)

## 1. Install and register the player

```sh
bun add @remotion/player remotion
```

```tsx
// src/PromoPreview.tsx
import { Player } from "@remotion/player";
import { Promo } from "./remotion/Promo";

export const PromoPreview = () => (
  <Player
    component={Promo}
    durationInFrames={8 * 30}
    fps={30}
    compositionWidth={1080}
    compositionHeight={1920}
    inputProps={{ product: "Acme" }}
    style={{ width: "100%", aspectRatio: "9 / 16", borderRadius: 16 }}
  />
);
```

`compositionWidth`/`compositionHeight` describe the render size that the composition assumes; `style` describes how large it appears in the page. The player scales the frame, so the same composition works in a card and in a full-screen modal.

## 2. Drive it with a `PlayerRef`

```tsx
import { Player, type PlayerRef } from "@remotion/player";
import { useRef } from "react";

export const PromoPreview = () => {
  const playerRef = useRef<PlayerRef>(null);

  return (
    <div>
      <Player
        ref={playerRef}
        component={Promo}
        durationInFrames={8 * 30}
        fps={30}
        compositionWidth={1080}
        compositionHeight={1920}
        inputProps={{ product: "Acme" }}
        style={{ width: "100%", aspectRatio: "9 / 16" }}
      />

      <button onClickCapture={(event) => playerRef.current?.toggle(event)}>
        Play / pause
      </button>
      <button onClick={() => playerRef.current?.seekTo(30)}>Jump to 1s</button>
      <button onClick={() => playerRef.current?.mute()}>Mute</button>
    </div>
  );
};
```

`play()` and `toggle()` accept the click event so the browser's autoplay policy treats the audio as user-initiated; use `onClickCapture` rather than `onClick` so the propagation works in Safari. `seekTo(frame)` takes frames, not seconds — multiply by `fps`.

## 3. Keep `inputProps` stable and serializable

```tsx
const inputProps = useMemo(() => ({ product, accent, features }), [product, accent, features]);

<Player component={Promo} inputProps={inputProps} ... />
```

```tsx
// Don't: a new component type on every render remounts the player
<Player component={() => <Promo product="Acme" />} ... />
```

A fresh object is cheap, but a fresh component function is not: React treats it as a different type and throws away the player state. Keeping props JSON-serializable also lets the same values go to `remotion render --props` unchanged.

## 4. Move heavy work out of the frame loop

```tsx
// Bad: parses on every frame
const Promo = ({ rows }: { rows: string }) => {
  const sections = parseRows(rows);
  return <Scenes sections={sections} />;
};
```

```tsx
// Better: parse once, pass the result
const inputProps = useMemo(() => ({ sections: parseRows(rows) }), [rows]);
<Player component={Promo} inputProps={inputProps} ... />;

const Promo = ({ sections }: { sections: Section[] }) => <Scenes sections={sections} />;
```

Everything in the component body runs for every frame, so parsing, sorting, or fetching belongs outside it. The same rule applies on the render side: precompute in the parent or at module scope, not inside the composition.

## 5. Render on the client only

```tsx
"use client";

import { Player } from "@remotion/player";
```

Under Next.js App Router or any framework that prerenders to HTML, the player needs a browser: mark the module as a client component, or load it dynamically with `ssr: false` from a client boundary. Rendering it on the server produces a hydration mismatch or a `window is not defined` error.

## 6. Verify

1. The player fills its container at 9:16 and does not overflow on a 360px viewport
2. Play/pause from the custom button starts audio without the browser blocking it
3. `seekTo(fps * 3)` lands at the same visual frame as `remotion still --frame=90`
4. Typing in an unrelated input does not remount the player or reset its position
5. A production build with SSR enabled renders the page without a hydration warning
6. `remotion render` with the same props file produces a video that matches the preview

## Pitfalls

- Passing `width`/`height` to `<Player>` — the props are `compositionWidth`/`compositionHeight`.
- Calling `play()` without the event, so mobile Safari blocks the audio and silently plays muted.
- `onClick` instead of `onClickCapture` on the play button — the event propagation can be lost in Safari.
- `seekTo(3)` expecting three seconds; it seeks to frame 3.
- An inline `component={(props) => <Promo {...props} />}`, which remounts the player on every parent render.
- Fetching data inside the composition, which repeats the request for every frame.
- `autoPlay` with audio on page load — browsers block it; start from a gesture or start muted.
- Shipping a video to production without checking the Remotion license for commercial use.

## Related

- `references/apis.md`
- `best-practices/remotion.md`
- `usecases/scene-sequence.md`
- `usecases/render-in-ci.md`
