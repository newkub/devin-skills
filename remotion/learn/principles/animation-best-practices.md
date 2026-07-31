# Animation Best Practices

## Use Frame-based Animation

ใช้ `useCurrentFrame()` แทน CSS animations:

```tsx
// ✅ Good
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1]);

// ❌ Bad
<div style={{ animation: 'fadeIn 1s' }} />
```

### Why?

- **Deterministic** - ผลลัพธ์เหมือนกันทุกครั้ง
- **Precise Control** - ควบคุมทุก frame ได้
- **Video Native** - video เป็น frame-based อยู่แล้ว

## Interpolate Values

ใช้ `interpolate()` สำหรับ smooth transitions:

```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

### Clamping

ใช้ clamp เพื่อป้องกันค่าผิดปกติ:

```tsx
const scale = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

## Use Spring Animations

ใช้ `spring()` สำหรับ physics-based animations:

```tsx
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

### Spring Config

- **damping** - ความเร็วในการหยุด (สูง = หยุดเร็ว)
- **stiffness** - ความแข็งของ spring (สูง = เด้งเร็ว)
- **mass** - มวลของ object (สูง = เด้งช้า)

## Timing Functions

ใช้ easing functions สำหรับ natural motion:

```tsx
// Ease In
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: (t) => t * t,
});

// Ease Out
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: (t) => t * (2 - t),
});

// Ease In Out
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
});
```

## Sequence Animations

ใช้ `<Sequence>` สำหรับ timing control:

```tsx
<Sequence from={0} durationInFrames={30}>
  <Intro />
</Sequence>
<Sequence from={30} durationInFrames={60}>
  <MainContent />
</Sequence>
```

### Nested Sequences

Sequences สามารถ nest ได้:

```tsx
<Sequence from={0} durationInFrames={90}>
  <Sequence from={0} durationInFrames={30}>
    <Intro />
  </Sequence>
  <Sequence from={30} durationInFrames={60}>
    <MainContent />
  </Sequence>
</Sequence>
```

## Performance Optimization

### Avoid Expensive Calculations

Cache ผลลัพธ์ที่คำนวณแล้ว:

```tsx
const frame = useCurrentFrame();
const progress = frame / 30;

// ❌ Bad - คำนวณทุก frame
const expensiveValue = calculateExpensiveValue(progress);

// ✅ Good - cache ค่า
const expensiveValue = useMemo(
  () => calculateExpensiveValue(progress),
  [progress]
);
```

### Use Offthread Video

สำหรับ videos ขนาดใหญ่:

```tsx
<OffthreadVideo src={staticFile('large-video.mp4')} />
```

### Optimize Images

Compress images ก่อนใช้:

```bash
# Optimize PNG
optipng -o7 image.png

# Optimize JPEG
jpegoptim --max-quality=85 image.jpg
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

## Testing Animations

### Preview in Studio

ใช้ Remotion Studio สำหรับ preview:

```bash
bunx remotion studio
```

### Frame-by-Frame

ตรวจสอบทีละ frame:

```tsx
const frame = useCurrentFrame();
console.log(`Frame: ${frame}, Value: ${animation}`);
```

### Render Single Frame

Render single frame สำหรับ sanity check:

```bash
bunx remotion still MyComposition --frame=30 --scale=0.25
```

## Best Practices Summary

1. **Use useCurrentFrame** - ไม่ใช้ CSS animations
2. **Interpolate Values** - ใช้ interpolate() สำหรับ smooth transitions
3. **Clamp Values** - ใช้ extrapolate clamp
4. **Use Spring** - ใช้ spring() สำหรับ physics-based animations
5. **Sequence Timing** - ใช้ `<Sequence>` สำหรับ timing control
6. **Optimize Performance** - Cache ค่าและใช้ offthread video
7. **Test in Studio** - Preview ก่อน render
