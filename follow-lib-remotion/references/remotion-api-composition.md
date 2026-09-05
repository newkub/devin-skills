# Programmatic API Reference — Composition & Core Hooks

## Composition API

### registerRoot

Register the root component of your Remotion project:

```tsx
import { registerRoot } from 'remotion';
import { Root } from './Root';

registerRoot(Root);
```

### Composition

Define compositions with type-safe props:

```tsx
import { Composition } from 'remotion';
import { z } from 'zod';
import { MyVideo } from './MyVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={z.object({
          title: z.string(),
          color: z.string(),
        })}
        defaultProps={{
          title: 'Hello World',
          color: '#ffffff',
        }}
      />
    </>
  );
};
```

## Core Hooks

### useCurrentFrame

Get the current frame number:

```tsx
const frame = useCurrentFrame();
```

### useVideoConfig

Get video configuration:

```tsx
const { fps, durationInFrames, width, height } = useVideoConfig();
```

### useTransform

Transform values based on frame:

```tsx
const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
```

### interpolate

Interpolate values between frames:

```tsx
const scale = interpolate(frame, [0, 30, 60], [0, 1, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```
