# Use Case — Multi-Scene Video with Sequences

> Cut one composition into timed scenes with spring motion and frame-accurate transitions. Source: https://www.remotion.dev/docs/sequence (accessed 2026-10-20)

## 1. Define the composition and its timing

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { Promo } from "./Promo";

export const RemotionRoot = () => (
  <Composition
    id="Promo"
    component={Promo}
    durationInFrames={8 * 30} // 8 seconds at 30 fps
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ product: "Acme" }}
  />
);
```

Duration is always in frames: `seconds * fps`. Writing `durationInFrames={8}` gives an eight-frame video, not eight seconds.

## 2. Compose scenes with `<Sequence>`

```tsx
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";

export const Promo = ({ product }: { product: string }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0f", color: "#fff" }}>
      <Sequence from={0} durationInFrames={2 * fps}>
        <Title product={product} />
      </Sequence>
      <Sequence from={2 * fps} durationInFrames={4 * fps}>
        <FeatureGrid />
      </Sequence>
      <Sequence from={6 * fps} durationInFrames={2 * fps}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};
```

Inside a `<Sequence>`, `useCurrentFrame()` restarts at 0 — every scene animates locally without subtracting an offset.

## 3. Animate with `interpolate` for linear, `spring` for physics

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const Title = ({ product }: { product: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ opacity, transform: `scale(${0.9 + scale * 0.1})` }}>{product}</h1>
    </AbsoluteFill>
  );
};
```

`extrapolateRight: "clamp"` keeps the value at 1 after frame 15 instead of continuing to grow.

## 4. Stagger a grid without CSS delays

```tsx
const FeatureGrid = () => {
  const frame = useCurrentFrame();
  const items = ["Fast", "Typed", "Offline", "Free"];

  return (
    <AbsoluteFill style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {items.map((label, i) => {
        const progress = interpolate(frame, [i * 4, i * 4 + 10], [0, 1], { extrapolateRight: "clamp" });
        return (
          <div key={label} style={{ opacity: progress, transform: `translateY(${(1 - progress) * 20}px)` }}>
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

Offsetting the frame window per item is the idiomatic stagger — CSS `animation-delay` is ignored by the frame-based renderer.

## 5. Add audio and verify in Studio

```tsx
import { Audio, staticFile } from "remotion";
<Audio src={staticFile("/music.mp3")} volume={0.4} />
```

Run `bunx remotion studio` and scrub through the boundaries; a scene that looks right at frame 0 can overlap the next one by a frame.

## Pitfalls

- Using CSS transitions or `@keyframes` — nothing advances outside `useCurrentFrame()`, so the render shows the initial state.
- Hardcoding pixel offsets instead of `useVideoConfig()` values; a 1080x1920 composition re-used at 1920x1080 breaks.
- Overlapping `<Sequence from>` windows without intending it, which renders two scenes on top of each other.
- Forgetting `extrapolateRight: "clamp"` so opacity grows past 1 and the element disappears.
- Multiplying seconds by a hardcoded 30 while the composition uses a different `fps`.
- Reading `frame` from the root component inside a nested `<Sequence>` — it is the local frame there.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/remotion.md`
- `usecases/render-in-ci.md`
