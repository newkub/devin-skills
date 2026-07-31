# Project Structure

## Standard Structure

```
my-video/
├── src/
│   ├── Root.tsx              # ลงทะเบียน compositions
│   ├── index.ts              # Entry point
│   ├── compositions/         # Video components
│   │   ├── MyVideo.tsx
│   │   └── Intro.tsx
│   └── components/           # Reusable UI components
│       ├── Button.tsx
│       └── Text.tsx
├── public/                   # Static assets
│   ├── images/
│   ├── videos/
│   └── fonts/
├── package.json
├── remotion.config.ts        # Remotion configuration
├── tsconfig.json             # TypeScript config
└── vite.config.ts            # Vite config (ถ้าใช้ Vite)
```

## Entry Files

### src/index.ts

Entry point ของ application:

```ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

### src/Root.tsx

ลงทะเบียน compositions ทั้งหมด:

```tsx
import { Composition } from 'remotion';
import { MyVideo } from './compositions/MyVideo';
import { Intro } from './compositions/Intro';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

## Composition Files

Composition คือ video component แต่ละตัว:

```tsx
// src/compositions/MyVideo.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Video content */}
    </AbsoluteFill>
  );
};
```

## Public Folder

ใช้สำหรับ static assets:

```
public/
├── images/
│   ├── logo.png
│   └── background.jpg
├── videos/
│   └── intro.mp4
└── fonts/
    └── custom-font.woff2
```

อ้างอิงด้วย `staticFile()`:

```tsx
import { staticFile } from 'remotion';

<Img src={staticFile('images/logo.png')} />;
```

## Configuration Files

### remotion.config.ts

Configuration สำหรับ Remotion:

```ts
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setQuality(80);
```

### package.json

Scripts สำหรับ development:

```json
{
  "scripts": {
    "start": "remotion studio",
    "build": "remotion render",
    "upgrade": "remotion upgrade"
  }
}
```

## Organizing Large Projects

สำหรับโปรเจกต์ขนาดใหญ่:

```
my-video/
├── src/
│   ├── compositions/
│   │   ├── marketing/
│   │   │   ├── ProductDemo.tsx
│   │   │   └── SocialMedia.tsx
│   │   └── tutorials/
│   │       ├── GettingStarted.tsx
│   │       └── Advanced.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── video/
│   │       ├── TextOverlay.tsx
│   │       └── Transition.tsx
│   ├── hooks/
│   │   ├── useAnimation.ts
│   │   └── useAudioVisualization.ts
│   ├── utils/
│   │   ├── timing.ts
│   │   └── colors.ts
│   └── types/
│       └── video.ts
```

## Best Practices

1. **Separate Concerns** - แยก UI components จาก video logic
2. **Reusable Components** - สร้าง components ที่ใช้ซ้ำได้
3. **Type Safety** - ใช้ Zod สำหรับ props validation
4. **Asset Organization** - จัดระเบียบ assets ใน public/ folder
5. **Configuration** - ใช้ remotion.config.ts สำหรับ settings ทั่วไป
