# Frame-based Animation

## Why Frame-based?

Remotion ใช้ frame เป็นหน่วยเวลาหลักเพราะ:

- **Deterministic** - ผลลัพธ์เหมือนกันทุกครั้ง
- **Precise Control** - ควบคุมทุก frame ได้
- **Video Native** - video เป็น frame-based อยู่แล้ว
- **Cross-platform** - ทำงานเหมือนกันทุก platform

## useCurrentFrame Hook

Hook หลักสำหรับ animation:

```tsx
import { useCurrentFrame } from 'remotion';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame(); // 0, 1, 2, 3, ...

  return <div>Frame: {frame}</div>;
};
```

### Frame Index

Frames เริ่มที่ 0:

```tsx
const frame = useCurrentFrame();
// frame = 0, 1, 2, 3, ..., durationInFrames - 1
```

### Frame in Sequence

ใน `<Sequence>`, frame เป็น relative:

```tsx
<Sequence from={30} durationInFrames={60}>
  <MyComponent />
</Sequence>

// ใน MyComponent:
// frame = 0, 1, 2, ..., 59 (relative to sequence)
```

## Time to Frame Conversion

แปลงวินาทีเป็น frame:

```tsx
const { fps } = useVideoConfig();

const frameFromSeconds = (seconds: number) => Math.floor(seconds * fps);

// 1 second @ 30fps = 30 frames
// 2.5 seconds @ 30fps = 75 frames
```

## Interpolation

ใช้ `interpolate()` สำหรับ smooth transitions:

```tsx
import { interpolate } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Linear interpolation
const opacity = interpolate(frame, [0, 30], [0, 1]);

// With clamping
const scale = interpolate(frame, [0, 30, 60], [0, 1, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// With easing
const progress = interpolate(frame, [0, 30], [0, 1], {
  easing: (t) => t * t, // ease-in
});
```

## Spring Animation

ใช้ `spring()` สำหรับ physics-based animation:

```tsx
import { spring } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const animation = spring({
  frame,
  fps,
  config: {
    damping: 200,
    stiffness: 100,
    mass: 1,
  },
});

// ใช้กับ style
<div style={{ transform: `scale(${animation})` }} />
```

## Transform

ใช้ `useTransform()` สำหรับ complex transformations:

```tsx
import { useTransform } from 'remotion';

const frame = useCurrentFrame();
const progress = frame / 30;

const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
const scale = useTransform(progress, [0, 1], [0.5, 1]);

<div style={{ opacity, transform: `scale(${scale})` }} />
```

## Color Interpolation

ใช้ `interpolateColor()` สำหรับ color transitions:

```tsx
import { interpolateColor } from 'remotion';

const frame = useCurrentFrame();
const progress = frame / 30;

const color = interpolateColor(
  progress,
  [0, 1],
  ['#000000', '#ffffff']
);

<div style={{ backgroundColor: color }} />
```

## Common Patterns

### Fade In

```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1]);

<div style={{ opacity }}>Content</div>
```

### Slide In

```tsx
const frame = useCurrentFrame();
const x = interpolate(frame, [0, 30], [-100, 0]);

<div style={{ transform: `translateX(${x}px)` }}>Content</div>
```

### Scale Up

```tsx
const frame = useCurrentFrame();
const scale = interpolate(frame, [0, 30], [0, 1]);

<div style={{ transform: `scale(${scale})` }}>Content</div>
```

### Rotate

```tsx
const frame = useCurrentFrame();
const rotation = interpolate(frame, [0, 30], [0, 360]);

<div style={{ transform: `rotate(${rotation}deg)` }}>Content</div>
```

## Timing Functions

### Linear

```tsx
const value = interpolate(frame, [0, 30], [0, 1]);
```

### Ease In

```tsx
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: (t) => t * t,
});
```

### Ease Out

```tsx
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: (t) => t * (2 - t),
});
```

### Ease In Out

```tsx
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
});
```

## Best Practices

1. **Use useCurrentFrame** - ไม่ใช้ CSS animations
2. **Interpolate Values** - ใช้ interpolate() สำหรับ smooth transitions
3. **Clamp Values** - ใช้ extrapolate clamp เพื่อป้องกันค่าผิดปกติ
4. **Frame-based Logic** - คำนวณทุกอย่างจาก frame
5. **Test in Studio** - Preview ใน Studio ก่อน render
