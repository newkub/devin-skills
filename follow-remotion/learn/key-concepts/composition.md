# Composition

## What is a Composition?

Composition คือหน่วยพื้นฐานของ Remotion video แต่ละตัว ประกอบด้วย:

- **React Component** - UI ที่จะ render
- **Metadata** - width, height, fps, duration
- **Props** - Data ที่ส่งเข้าไป
- **Schema** - Type validation ด้วย Zod

## Defining a Composition

```tsx
import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';

<Composition
  id="MyVideo"
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
```

## Composition Properties

### id

Unique identifier สำหรับ composition:

```tsx
<Composition id="MyVideo" />
```

ใช้เมื่อ render:
```bash
bunx remotion render MyVideo
```

### component

React component ที่จะ render:

```tsx
<Composition component={MyVideo} />
```

### durationInFrames

ความยาวของ video เป็น frames:

```tsx
<Composition durationInFrames={150} /> // 5 seconds @ 30fps
```

### fps

Frames per second:

```tsx
<Composition fps={30} /> // 30 frames per second
```

### width & height

Resolution ของ video:

```tsx
<Composition width={1920} height={1080} /> // Full HD
```

### schema

Zod schema สำหรับ props validation:

```tsx
<Composition
  schema={z.object({
    title: z.string(),
    color: z.string(),
  })}
/>
```

### defaultProps

Default values สำหรับ props:

```tsx
<Composition
  defaultProps={{
    title: 'Hello',
    color: '#ffffff',
  }}
/>
```

## Multiple Compositions

สามารถลงทะเบียน compositions หลายตัวใน Root:

```tsx
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Intro" component={Intro} durationInFrames={60} />
      <Composition id="Main" component={Main} durationInFrames={150} />
      <Composition id="Outro" component={Outro} durationInFrames={30} />
    </>
  );
};
```

## Lazy Loading

ใช้ lazy component สำหรับ large projects:

```tsx
import { lazy } from 'react';

const MyVideo = lazy(() => import('./MyVideo'));

<Composition
  id="MyVideo"
  lazyComponent={MyVideo}
  durationInFrames={150}
/>
```

## Composition Lifecycle

1. **Registration** - Composition ถูกลงทะเบียนใน Root
2. **Collection** - CompositionManager เก็บ compositions ทั้งหมด
3. **Selection** - User เลือก composition ที่จะ render
4. **Rendering** - Component ถูก render frame-by-frame
5. **Encoding** - Frames ถูก stitch เป็น video

## Best Practices

1. **Use Schema** - ใช้ Zod สำหรับ type safety
2. **Default Props** - ให้ defaultProps เสมอ
3. **Descriptive IDs** - ใช้ ID ที่ชัดเจน
4. **Consistent FPS** - ใช้ FPS เดียวกันทั้ง project
5. **Standard Resolution** - ใช้ resolution มาตรฐาน (1920x1080, 1280x720)
