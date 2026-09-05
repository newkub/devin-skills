---
name: follow-lib-remotion
description: ใช้ Remotion v4 สร้างวิดีโอแบบโปรแกรมมิ่งด้วย React และ render ผ่าน CLI
argument-hint: "[composition-or-task]"
related:
  - create-video-story
  - create-social-cover-image
  - gen-image-character
  - follow-lib-react
  - follow-framework-astro
  - follow-framework-capacitor
  - follow-framework-desktop-app
  - follow-best-practice
  - setup-cicd
  - follow-my-tech-stack
  - ask-me
---

## Goal

ใช้งาน Remotion v4 (latest ~4.0.520) สำหรับสร้างวิดีโอแบบโปรแกรมมิ่งด้วย React, animations แบบ frame-based, และ render ผ่าน CLI หรือ cloud

## Scope

ใช้สำหรับ:
- สร้างวิดีโอแบบโปรแกรมมิ่งด้วย React components
- Video generation ด้วย `<Composition>` model
- Animations ด้วย `useCurrentFrame()` และ `interpolate()`
- Type-safe props ด้วย Zod schema
- Render วิดีโอ, GIF, image sequence ผ่าน CLI
- Cloud rendering (Lambda, Cloud Run, Vercel)

## Execute

### 1. Create Project

> Goal: Create Project

```bash
bunx create-video@latest --yes --blank my-video
# หรือ skip TailwindCSS
bunx create-video@latest --yes --blank --no-tailwind my-video

cd my-video
bun install
```

- `--yes` เป็น non-interactive mode (ต้องมี template flag และ directory)
- `--blank` ใช้ blank template
- `--no-tailwind` ข้ามการติดตั้ง Tailwind
- `--tmp` สร้างใน temp directory

### 2. Start Studio

> Goal: Start Studio

```bash
bunx remotion studio --no-open
# หรือ
npm run dev
```

- `npx remotion preview` ถูก deprecated; ใช้ `remotion studio`
- กด `s` ใน terminal เพื่อ reopen browser
- `--disable-interactivity` ใช้สำหรับ debugging

### 3. Build Composition

> Goal: Build Composition

ตัวอย่าง `src/Root.tsx`:

```tsx
import { Composition } from 'remotion';
import { MyComp } from './MyComp';

export const RemotionRoot = () => (
  <Composition
    id="MyComp"
    component={MyComp}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: 'Hello' }}
  />
);
```

ในคอมโพเนนต์:

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const MyComp = ({ title }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return <div style={{ opacity }}>{title}</div>;
};
```

### 4. Type-safe Props With Zod

> Goal: Type-safe Props With Zod

```bash
bun add zod @remotion/zod-types
```

```tsx
import { z } from 'zod';
import { Composition } from 'remotion';
import { zColor } from '@remotion/zod-types';

const mySchema = z.object({
  title: z.string(),
  color: zColor(),
});

type MyProps = z.infer<typeof mySchema>;

export const RemotionRoot = () => (
  <Composition
    id="MyComp"
    component={MyComp}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
    schema={mySchema}
    defaultProps={{ title: 'Hello', color: '#000000' }}
  />
);

const MyComp: React.FC<MyProps> = ({ title, color }) => {
  const frame = useCurrentFrame();
  return <div style={{ color, opacity: frame / 100 }}>{title}</div>;
};
```

- ถ้าไม่ต้องการ validation ซับซ้อน สามารถใช้ `defaultProps` อย่างเดียวได้ (Studio infer basic controls ตั้งแต่ v4.0.516)
- ใช้ schema เมื่อต้องการ constraints, choices, descriptions, หรือ specialized controls

### 5. Use Assets And Media

> Goal: Use Assets And Media

```tsx
import { staticFile, Img, OffthreadVideo } from 'remotion';

const img = staticFile('/my-image.png');
const video = staticFile('/video.mp4');

<Img src={img} />
<OffthreadVideo src={video} />
```

- ใช้ `staticFile()` สำหรับไฟล์ใน `public/`
- สำหรับวิดีโอขนาดใหญ่ ใช้ `<OffthreadVideo>` หรือ `<Video>` จาก `@remotion/media`
- ใช้ `trimBefore`/`trimAfter` แทน `startFrom`/`endAt` ที่ deprecated

### 6. Render Video

> Goal: Render Video

```bash
# เรนเดอร์ video ด้วย entry point default
bunx remotion render MyComp

# ระบุ entry point และ output
bunx remotion render src/index.tsx MyComp out/video.mp4

# กำหนด codec, fps, ขนาด
bunx remotion render MyComp --codec=h264 --fps=30 --width=1920 --height=1080
```

Render GIF:

```bash
bunx remotion render MyComp --codec=gif --every-nth-frame=2 --number-of-gif-loops=0
```

Render image sequence:

```bash
bunx remotion render MyComp --sequence
```

### 7. Test, Debug, And Iterate

> Goal: Test, Debug, And Iterate

- test ใน Remotion Studio ก่อน render
- ใช้ `--props props.json` สำหรับ input props (บน Windows ใช้ไฟล์แทน inline JSON)
- ใช้ `--repro` เพื่อบันทึกสถานะสำหรับ debug
- ใช้ `--log=verbose` เมื่อต้องการดู log เพิ่ม

### 8. Cloud Rendering

> Goal: Cloud Rendering

- AWS Lambda: `@remotion/lambda`
- Google Cloud Run: `@remotion/cloudrun`
- Vercel: `@remotion/vercel`
- ดูรายละเอียดที docs.remotion.dev

## Rules

### 1. Animation

- ใช้ `useCurrentFrame()` เสมอ — ไม่ใช้ CSS animations
- ใช้ `interpolate()` สำหรับ smooth transitions
- ใช้ `spring()` สำหรับ physics-based motion
- ใช้ `extrapolateLeft/Right: 'clamp'` เพื่อหยุดค่านอก range
- ใช้ `output: 'perceptual-scale'` สำหรับ scale interpolation (v4.0.490+)

### 2. Type Safety

- ใช้ Zod schema สำหรับ props เมื่อต้องการ validation/controls
- แปลงวินาทีเป็น frames — ใช้ `time * fps`
- ใช้ `z.infer<typeof schema>` สำหรับ TypeScript type

### 3. Assets And Performance

- ใช้ `staticFile()` สำหรับ assets ใน `public/`
- ใช้ `<OffthreadVideo>` หรือ `<Video>` จาก `@remotion/media` สำหรับ videos ขนาดใหญ่
- optimize assets ก่อน rendering
- หลีกเลี่ยง `defaultProps` ทีมี payload ใหญ่

### 4. Composition

- ระบุ `durationInFrames`, `fps`, `width`, `height` ชัดเจน
- ใส่ `defaultProps` เป็น inline object literal เพื่อให้ Studio infer controls
- ใช้ `lazyComponent` เมื่อต้องการ lazy load

### 5. Workflow

- test ใน Studio ก่อน render
- ใช้ `--no-open` สำหรับ remote/CI
- render ด้วย `--codec` ทีเหมาะสม (`h264`, `h265`, `vp9`, `gif`, `png`)
## Expected Outcome

- วิดีโอแบบโปรแกรมมิ่งด้วย React
- Animations ที่ smooth และ consistent
- Programmatic video creation ที่ automated และ flexible
- Cloud rendering ที่ scalable
- Type-safe components ด้วย Zod
