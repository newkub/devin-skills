# Getting Started with Remotion

## Why Remotion?

Remotion คือ framework สำหรับสร้างวิดีโอแบบโปรแกรมมิ่งโดยใช้ React ช่วยให้คุณ:

- **สร้างวิดีโอด้วย React** - ใช้ความรู้ React ที่คุณมีอยู่แล้ว
- **Programmatic Video Creation** - สร้างวิดีโอจาก data, API, หรือ automation
- **Frame-based Animation** - ควบคุมทุก frame ด้วย hooks เช่น `useCurrentFrame()`
- **Type Safety** - ใช้ Zod สำหรับ props validation
- **Scalable Rendering** - Render ได้ทั้ง local และ cloud (AWS Lambda, GCP Cloud Run)

## Prerequisites

- Node.js 18+ หรือ Bun
- React knowledge
- TypeScript (recommended)

## Installation

### Create New Project

สร้างโปรเจกต์ใหม่ด้วย template:

```bash
bunx create-video@latest my-video
```

หรือใช้ template เฉพาะ:

```bash
# Blank template
bunx create-video@latest --blank my-video

# Hello World template
bunx create-video@latest --helloworld my-video

# No Tailwind
bunx create-video@latest --blank --no-tailwind my-video
```

### Install Remotion in Existing Project

```bash
bun add remotion
bun add -D @remotion/cli
```

## Project Structure

```
my-video/
├── src/
│   ├── Root.tsx          # ลงทะเบียน compositions
│   ├── index.ts         # Entry point
│   └── MyComposition.tsx # Components ของคุณ
├── public/              # Static assets
├── package.json
└── remotion.config.ts   # Configuration
```

## Your First Video

### Step 1: Define Root Component

สร้าง `src/Root.tsx`:

```tsx
import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';

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
    </>
  );
};
```

### Step 2: Create Video Component

สร้าง `src/MyVideo.tsx`:

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <h1
        style={{
          fontSize: 80,
          opacity,
          textAlign: 'center',
          marginTop: 300,
        }}
      >
        Hello Remotion!
      </h1>
    </AbsoluteFill>
  );
};
```

### Step 3: Register Root

สร้าง `src/index.ts`:

```ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

### Step 4: Start Preview

```bash
bun run dev
# หรือ
bunx remotion studio
```

เปิด browser ที่ `http://localhost:3000` เพื่อดู preview

### Step 5: Render Video

```bash
bunx remotion render MyVideo
```

วิดีโอจะถูกบันทึกเป็น `out/MyVideo.mp4`

## Key Concepts

### Frame-based Animation

Remotion ใช้ frame เป็นหน่วยเวลาหลัก ไม่ใช่ milliseconds:

```tsx
const frame = useCurrentFrame(); // 0, 1, 2, 3, ...
const { fps } = useVideoConfig();

// แปลงวินาทีเป็น frame
const frameFromSeconds = (seconds: number) => seconds * fps;
```

### Static Files

ใช้ `staticFile()` สำหรับ assets:

```tsx
import { staticFile } from 'remotion';
import { Img } from 'remotion';

<Img src={staticFile('logo.png')} />;
```

### Sequences

ควบคุม timing ด้วย `<Sequence>`:

```tsx
import { Sequence } from 'remotion';

<Sequence from={0} durationInFrames={30}>
  <Intro />
</Sequence>
<Sequence from={30} durationInFrames={60}>
  <MainContent />
</Sequence>
```

## Next Steps

- เรียนรู้เกี่ยวกับ [Project Structure](./project-structure.md)
- ศึกษา [Rendering Workflow](./rendering-workflow.md)
- ดู [API Reference](../../references/api.md)
- อ่าน [Best Practices](../../principles/)
