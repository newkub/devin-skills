# Use Case — Fonts, Async Assets, and Deterministic Layout

> Renders happen on a different machine than the one you previewed on: fonts must be bundled, remote images must block the frame until they exist, and every “random” value must be seeded. Source: https://www.remotion.dev/docs/fonts-api/load-font (accessed 2026-10-20)

## 1. Bundle a font with `@remotion/fonts`

```tsx
// src/fonts.ts
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({
  family: "Bangers",
  url: staticFile("fonts/bangers.ttf"),
  weight: "400",
});
```

```tsx
// src/Title.tsx
export const Title = () => (
  <h1 style={{ fontFamily: "Bangers", fontSize: 96 }}>Acme</h1>
);
```

`loadFont()` registers the font and automatically blocks the render until it is ready. The file lives in `public/fonts/` and is addressed through `staticFile()` — a relative `url` resolves against the bundle, not the project directory.

## 2. Wait for a Google font before the first frame

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily, waitUntilDone } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const Headline = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handle = delayRender("Load Inter");
    waitUntilDone()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, []);

  if (!ready) return null;
  return <h1 style={{ fontFamily }}>Acme</h1>;
};
```

Loading only the weights and subsets used keeps the bundle small. `waitUntilDone()` plus `delayRender` is what prevents a fallback font from being measured on the first frames and swapped mid-video.

## 3. Block on a remote image with `delayRender`

```tsx
import { Img, cancelRender, continueRender, delayRender } from "remotion";

export const RemoteCover = ({ url }: { url: string }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const handle = delayRender(`Fetch ${url}`);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${url}: ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        setSrc(URL.createObjectURL(blob));
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, [url]);

  if (!src) return null;
  return <Img src={src} style={{ width: 1080, height: 1080, objectFit: "cover" }} />;
};
```

`delayRender` returns a handle that must be released with `continueRender`; a rejected request must call `cancelRender`, otherwise the render waits for the 30-second timeout and fails with an unrelated message. Returning `null` until the asset exists keeps the layout honest.

## 4. Give the image a fixed box

```tsx
<Img
  src={src}
  style={{ width: 1080, height: 1080, objectFit: "cover", borderRadius: 24 }}
/>
```

`<Img>` reserves no space by default, so an unmeasured image pushes siblings down on the frame it appears. Explicit `width`/`height` keeps every frame identical whether or not the picture has decoded yet.

## 5. Seed every random value

```tsx
import { interpolate, random, useCurrentFrame } from "remotion";

const dots = Array.from({ length: 60 }, (_, index) => ({
  id: index,
  left: random(`dot-x-${index}`) * 100,
  top: random(`dot-y-${index}`) * 100,
  delay: Math.floor(random(`dot-delay-${index}`) * 20),
}));

export const Confetti = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {dots.map((dot) => (
        <div
          key={dot.id}
          style={{
            position: "absolute",
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            opacity: interpolate(frame, [dot.delay, dot.delay + 10], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
```

`random(seed)` is a deterministic PRNG: the same seed returns the same number for every frame and every render. Computing the array at module scope is safe for the same reason.

## 6. Verify

1. Render the same frame twice (`remotion still` at the same `--frame`) — the pixels match, including the confetti positions
2. Render offline with the network disabled — bundled fonts and assets still load
3. Rename the font file — the render stops with a load error instead of falling back to a system font
4. An image URL returning 404 — the render fails with that URL, not a 30-second timeout
5. Grep `src/` for `Math.random`, `Date.now`, `setTimeout`, `@keyframes` — no hits inside composition code
6. `/run-test` — a test asserting `random("seed")` returns the same value across calls

## Pitfalls

- Declaring `@font-face` with a raw relative URL — the render resolves it against the bundle, so the font silently never loads.
- Calling `loadFont()` inside a component body, which injects the font face again on every render.
- `waitUntilDone()` without `delayRender`, so early frames are measured with the fallback font and the text reflows mid-video.
- Forgetting `cancelRender` on a failed fetch — the render hangs until the timeout and reports the wrong cause.
- Using a raw `<img>` or `<video>` tag instead of `<Img>`/`<OffthreadVideo>`, which is not frame-accurate.
- `Math.random()` or `Date.now()` in the render path — each frame gets a different value, so the output flickers.
- CSS `@keyframes`/`transition` for motion — the renderer captures frames without advancing CSS animation state.
- Relying on the default font stack instead of bundling — Linux runners do not have the same fonts as macOS.

## Related

- `references/apis.md`
- `best-practices/remotion.md`
- `usecases/scene-sequence.md`
- `usecases/data-driven-duration.md`
