# Framework Integration

## Vite Integration

Remotion รองรับ Vite สำหรับ faster bundling:

### Setup

```bash
bun add -D vite @vitejs/plugin-react
```

### vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

### remotion.config.ts

```ts
import { Config } from '@remotion/cli/config';

Config.setBundlingMode('vite');
```

## Next.js Integration

ใช้ Remotion ใน Next.js project:

### Setup

```bash
bun add remotion
```

### API Route

สร้าง API route สำหรับ rendering:

```ts
// app/api/render/route.ts
import { renderMedia } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';

export async function POST(request: Request) {
  const { compositionId, props } = await request.json();

  const bundleLocation = await bundle({
    entryPoint: './src/remotion/index.ts',
  });

  await renderMedia({
    composition: {
      id: compositionId,
      width: 1920,
      height: 1080,
      fps: 30,
      durationInFrames: 150,
      props,
    },
    serveUrl: bundleLocation,
    outputLocation: `./out/${compositionId}.mp4`,
  });

  return Response.json({ success: true });
}
```

## React Native Integration

ใช้ Remotion concepts ใน React Native:

### Similar Hooks

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

// ใช้ logic เดียวกัน
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1]);
```

## TypeScript Integration

### Type-Safe Props

ใช้ Zod สำหรับ props validation:

```tsx
import { z } from 'zod';
import { Composition } from 'remotion';

const schema = z.object({
  title: z.string(),
  color: z.string(),
  duration: z.number(),
});

<Composition
  id="MyVideo"
  component={MyVideo}
  schema={schema}
  defaultProps={{
    title: 'Hello',
    color: '#ffffff',
    duration: 150,
  }}
/>
```

### Type Definitions

```ts
// src/types/video.ts
export interface VideoProps {
  title: string;
  color: string;
  duration: number;
}

export const MyVideo: React.FC<VideoProps> = ({ title, color, duration }) => {
  // ...
};
```

## Tailwind CSS Integration

### Setup

```bash
bun add -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

### tailwind.config.js

```js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Usage

```tsx
<div className="flex items-center justify-center bg-blue-500">
  <h1 className="text-4xl font-bold text-white">Hello</h1>
</div>
```

## Three.js Integration

ใช้ 3D graphics ด้วย @remotion/three:

### Setup

```bash
bun add @remotion/three three
```

### Usage

```tsx
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame } from 'remotion';

const My3DScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <ThreeCanvas>
      {/* Three.js components */}
    </ThreeCanvas>
  );
};
```

## Framer Motion Integration

ใช้ Framer Motion สำหรับ animations:

### Setup

```bash
bun add framer-motion
```

### Usage

```tsx
import { motion } from 'framer-motion';
import { useCurrentFrame } from 'remotion';

const AnimatedText: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / 30;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: progress }}
    >
      <h1>Hello</h1>
    </motion.div>
  );
};
```

## Media Utils Integration

ใช้ @remotion/media-utils สำหรับ audio visualization:

### Setup

```bash
bun add @remotion/media-utils
```

### Audio Visualization

```tsx
import { useAudioData, Audio } from '@remotion/media-utils';
import { useCurrentFrame } from 'remotion';

const AudioVisualizer: React.FC = () => {
  const audioData = useAudioData(staticFile('music.mp3'));
  const frame = useCurrentFrame();

  if (!audioData) return null;

  return (
    <div>
      {audioData.map((value, i) => (
        <div
          key={i}
          style={{
            height: value * 100,
            width: 10,
            backgroundColor: 'blue',
          }}
        />
      ))}
    </div>
  );
};
```

## Best Practices

1. **Separate Rendering Logic** - แยก rendering code จาก UI logic
2. **Type Safety** - ใช้ TypeScript และ Zod
3. **Performance** - ใช้ appropriate bundler (Vite สำหรับ dev, Webpack สำหรับ production)
4. **Asset Management** - ใช้ `staticFile()` สำหรับ assets
5. **Testing** - Test compositions ใน Studio ก่อน render
