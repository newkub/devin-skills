---
name: follow-lib-remotion-setup-remotion
description: Setup Remotion — create-video, Composition, Studio smoke test
argument-hint: "[project-name]"
related:
  - follow-lib-remotion
  - run-install
  - run-dev
  - resolve-errors
---

## Goal

Setup Remotion project — `create-video`, `<Composition>` setup และ Studio smoke test

## Scope

ใช้เมื่อต้องสร้าง Remotion project ใหม่หรือ setup Remotion ใน project ที่มี — ครอบคลุม scaffolding, root composition, Studio และ first render

## Execute

### 1. Create Project

> Goal: scaffold Remotion project ด้วย official CLI

```bash
bunx create-video@latest --yes --blank my-video
# หรือ skip TailwindCSS
bunx create-video@latest --yes --blank --no-tailwind my-video

cd my-video
bun install
```

1. `--yes` เป็น non-interactive (ต้องมี template flag และ directory)
2. `--blank` ใช้ blank template — ใช้ `--no-tailwind` ถ้าไม่ต้องการ Tailwind
3. ถ้า project มีอยู่แล้ว → ติดตั้ง `remotion` กับ `@remotion/cli` ตาม official docs ที่ `https://remotion.dev`

### 2. Setup Composition

> Goal: สร้าง root composition ที่ทำงานได้

```tsx
import { Composition } from 'remotion'
import { MyComp } from './MyComp'

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
)
```

1. ระบุ `id`, `component`, `durationInFrames`, `fps`, `width`, `height` ชัดเจน
2. ใส่ `defaultProps` เป็น inline object literal เพื่อให้ Studio infer controls
3. ใช้ `useCurrentFrame()` + `interpolate()` ใน component — ไม่ใช้ CSS animations
4. ใช้ `staticFile()` สำหรับ assets ใน `public/`

### 3. Start Studio

> Goal: เปิด Remotion Studio เพื่อ preview

1. `bunx remotion studio --no-open` หรือ `bun run dev`
2. `bunx remotion preview` deprecated — ใช้ `remotion studio` เท่านั้น
3. กด `s` ใน terminal เพื่อ reopen browser

### 4. Verify

> Goal: smoke test render แรก

1. Studio เปิดและ composition render ใน preview ถูกต้อง
2. ทดสอบ render จริง: `bunx remotion render MyComp out/video.mp4`
3. ตรวจ output file ถูกสร้างและเล่นได้
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ `create-video` scaffolding เสมอสำหรับ project ใหม่ — อย่า config เองจากศูนย์
- `useCurrentFrame()` เป็น source of truth ของ animation — ไม่ใช้ CSS animations/JS timers
- แปลงวินาทีเป็น frames ด้วย `time * fps`
- ใช้ `--no-open` สำหรับ remote/CI
- ใช้ `/follow-lib-remotion` สำหรับ full reference และ cloud rendering

## Expected Outcome

- Remotion project scaffold สำเร็จและ Studio เปิดได้
- Composition render ใน preview ถูกต้อง
- First render ผ่าน CLI สร้าง output ได้
