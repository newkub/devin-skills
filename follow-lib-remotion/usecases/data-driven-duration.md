# Use Case — Variable-Length Video From Data

> A render whose duration depends on its input: compute metadata from props instead of hardcoding `durationInFrames`, and let the CLI pass the data in. Source: https://www.remotion.dev/docs/composition (accessed 2026-10-20)

## 1. Share the timing constants

```ts
// src/tour-types.ts
export type TourProps = {
  id: string;
  title: string;
  segments: { heading: string; body: string }[];
};
```

```ts
// src/timing.ts
import type { TourProps } from "./tour-types";

export const INTRO_FRAMES = 45;
export const SEGMENT_FRAMES = 90;

export const durationFor = (segments: TourProps["segments"]) =>
  INTRO_FRAMES + segments.length * SEGMENT_FRAMES;
```

The composition and the render both need the same formula; keeping it in one module means a new segment length cannot drift between them.

## 2. Compute duration from props

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { ProductTour } from "./ProductTour";
import { durationFor } from "./timing";
import type { TourProps } from "./tour-types";

export const defaultProps: TourProps = {
  id: "acme",
  title: "Acme",
  segments: [{ heading: "Fast", body: "Ships in seconds" }],
};

export const RemotionRoot = () => (
  <Composition
    id="ProductTour"
    component={ProductTour}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={durationFor(defaultProps.segments)}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      durationInFrames: durationFor(props.segments),
    })}
  />
);
```

`durationInFrames` stays required as the Studio fallback; `calculateMetadata` overrides it whenever props are known. Returning only the changed field keeps the other metadata from the `<Composition>`.

## 3. Play variable segments with `<Series>`

```tsx
// src/ProductTour.tsx
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from "remotion";
import { INTRO_FRAMES, SEGMENT_FRAMES } from "./timing";
import type { TourProps } from "./tour-types";

const Segment = ({ heading, body }: TourProps["segments"][number]) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity, justifyContent: "center", padding: 80 }}>
      <h2>{heading}</h2>
      <p>{body}</p>
    </AbsoluteFill>
  );
};

export const ProductTour = ({ title, segments }: TourProps) => (
  <AbsoluteFill style={{ backgroundColor: "#0b0b0f", color: "#fff" }}>
    <Series>
      <Series.Sequence durationInFrames={INTRO_FRAMES}>
        <h1>{title}</h1>
      </Series.Sequence>
      {segments.map((segment) => (
        <Series.Sequence key={segment.heading} durationInFrames={SEGMENT_FRAMES}>
          <Segment {...segment} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
```

`<Series>` plays children back to back, so adding a segment extends the video without touching any `from` offset — the opposite trade-off from `<Sequence>`, where absolute offsets must be recomputed.

## 4. Fetch the data before the metadata is fixed

```tsx
calculateMetadata={async ({ props, abortSignal }) => {
  const response = await fetch(`https://api.example.com/tours/${props.id}`, {
    signal: abortSignal,
  });
  if (!response.ok) throw new Error(`Tour ${props.id}: ${response.status}`);
  const tour = (await response.json()) as Pick<TourProps, "segments">;

  return {
    durationInFrames: durationFor(tour.segments),
    props: { ...props, segments: tour.segments },
  };
}}
```

`calculateMetadata` may be async, receives an `abortSignal` for cancelled renders, and can return `props` alongside the metadata so the component renders the fetched data. If it throws, the render fails instead of producing a truncated video.

## 5. Render with a props file

```json
{
  "id": "acme-2026",
  "title": "Acme 2026",
  "segments": [
    { "heading": "Fast", "body": "Ships in seconds" },
    { "heading": "Typed", "body": "End to end" },
    { "heading": "Offline", "body": "No network needed" }
  ]
}
```

```sh
bunx remotion compositions src/index.tsx
bunx remotion render src/index.tsx ProductTour out/tour.mp4 --props=tour.json
bunx remotion still src/index.tsx ProductTour out/cover.png --frame=30 --props=tour.json
```

`remotion compositions` prints the resolved durations before a long render, which catches a metadata function that returned 0 or `NaN`.

## 6. Verify

1. `remotion compositions --props=tour.json` — the listed duration equals `(45 + n * 90)` frames for `n` segments
2. `ffprobe -v error -show_entries format=duration -of csv=p=0 out/tour.mp4` — seconds equal frames / 30
3. One segment, then four segments — the last segment is fully visible in both, no black tail
4. Studio with edited props — the timeline length changes when a segment is added
5. An unreachable API in `calculateMetadata` — the render exits non-zero with the thrown message
6. `/run-test` — a unit test on `durationFor` for 0, 1, and many segments

## Pitfalls

- Hardcoding `durationInFrames` and forgetting `calculateMetadata` — extra segments never render because the composition ends early.
- Reading `window`, `document`, or measuring the DOM inside `calculateMetadata` — it runs in Node.js during a render.
- Fetching inside the component body, which re-runs on every frame instead of once per render.
- Returning `props` from `calculateMetadata` without also returning the recomputed `durationInFrames`, so the new data plays inside the old length.
- Swallowing a fetch error and returning defaults, which renders a plausible but wrong video instead of failing loudly.
- Building offsets with `segments.findIndex` inside `<Sequence from>` — `Series.Sequence` already removes the need to compute them.
- Expecting `<Series.Sequence>` without `durationInFrames` to infer its length — it is required.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/remotion.md`
- `usecases/scene-sequence.md`
- `usecases/render-in-ci.md`
