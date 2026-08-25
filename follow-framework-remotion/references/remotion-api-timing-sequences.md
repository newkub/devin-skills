# Programmatic API Reference — Timing, Sequences & Layout

## Timing

### spring

Create smooth animations:

```tsx
import { spring } from 'remotion';

const animation = spring({
  frame,
  fps,
  config: {
    damping: 200,
    stiffness: 100,
    mass: 1,
  },
});
```

### interpolateColor

Interpolate between colors:

```tsx
import { interpolateColor } from 'remotion';

const color = interpolateColor(
  progress,
  [0, 1],
  ['#000000', '#ffffff']
);
```

### useTransform

Transform values based on frame:

```tsx
import { useTransform } from 'remotion';

const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
```

## Sequences

### Sequence

Control timing of child components:

```tsx
import { Sequence } from 'remotion';

<Sequence from={0} durationInFrames={30}>
  <Intro />
</Sequence>;
```

## Loops

### loop

Loop content for duration:

```tsx
import { loop } from 'remotion';

const repeatedFrames = loop(frame, 30);
```

## Series

### Series

Play sequences one after another:

```tsx
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={30}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <Main />
  </Series.Sequence>
</Series>
```

## Delay Render

### delayRender / continueRender

Handle async operations:

```tsx
import { delayRender, continueRender } from 'remotion';

const handle = delayRender('Loading data...');
fetchData().then(() => continueRender(handle));
```

## Offthread Video

### OffthreadVideo

Use for large videos:

```tsx
import { OffthreadVideo } from 'remotion';

<OffthreadVideo src={staticFile('large-video.mp4')} />
```

## Absolute Fill

### AbsoluteFill

Fill the entire composition area:

```tsx
import { AbsoluteFill } from 'remotion';

<AbsoluteFill style={{ backgroundColor: 'red' }}>
  <h1>Content</h1>
</AbsoluteFill>;
```
