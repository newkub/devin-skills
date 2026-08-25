# Programmatic API Reference — Environment & Additional Packages

## Environment

### useRemotionEnvironment

Get current Remotion environment:

```tsx
import { useRemotionEnvironment } from 'remotion';

const env = useRemotionEnvironment();
// env.isStudio - true if in Studio
// env.isRendering - true if rendering
// env.isPlayer - true if in Player
```

### random

Generate deterministic random values:

```tsx
import { random } from 'remotion';

const value = random('seed-string');
```

### useCurrentScale

Get current scale of composition:

```tsx
import { useCurrentScale } from 'remotion';

const scale = useCurrentScale();
```

### prefetch

Prefetch assets before they're needed:

```tsx
import { prefetch } from 'remotion';

prefetch(staticFile('logo.png'));
```

---

For full API documentation, see [Remotion Docs](https://www.remotion.dev/docs).

## Additional Packages

### @remotion/media-utils

Audio visualization utilities:

```bash
bun add @remotion/media-utils
```

### @remotion/three

Three.js integration:

```bash
bun add @remotion/three three
```

### @remotion/gif

GIF support:

```bash
bun add @remotion/gif
```
