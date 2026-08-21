# Performance Optimization

## Bundle Optimization

### Use Rspack

Rspack เร็วกว่า Webpack:

```ts
import { Config } from '@remotion/cli/config';

Config.setBundler('rspack');
```

### Optimize Bundle Size

ลด bundle size:

```ts
await bundle({
  entryPoint: './src/index.ts',
  webpackOverride: (config) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
      },
    };
    return config;
  },
});
```

### Tree Shaking

ลบ unused code:

```ts
// ✅ Good - Import เฉพาะที่ใช้
import { useCurrentFrame } from 'remotion';

// ❌ Bad - Import ทั้งหมด
import * as Remotion from 'remotion';
```

## Rendering Optimization

### Parallel Rendering

ใช้ multiple cores:

```ts
await renderMedia({
  // ... options
  parallelism: 4, // 4 parallel renders
});
```

### Frame Skipping

Skip frames สำหรับ preview:

```bash
bunx remotion render MyComposition --every-nth-frame=2
```

### Quality Settings

ลด quality สำหรับ faster rendering:

```bash
bunx remotion render MyComposition --quality=50
```

## Memory Optimization

### Increase Node.js Memory

```bash
NODE_OPTIONS="--max-old-space-size=4096" bunx remotion render MyComposition
```

### Use OffthreadVideo

ลด memory usage:

```tsx
<OffthreadVideo src={staticFile('large-video.mp4')} />
```

### Windowed Audio Data

ลด memory สำหรับ audio ยาว:

```tsx
import { useWindowedAudioData } from '@remotion/media-utils';

const audioData = useWindowedAudioData(staticFile('long-music.mp3'));
```

## Caching

### Enable Caching

Remotion cache ผลลัพธ์อัตโนมัติ:

```bash
# Clear cache
bunx remotion cache clear
```

### Cache Strategy

- **Development** - Cache enabled
- **Production** - Cache disabled (optional)
- **CI/CD** - Clear cache ก่อน render

## Asset Optimization

### Compress Images

```bash
# PNG optimization
optipng -o7 image.png

# JPEG optimization
jpegoptim --max-quality=85 image.jpg
```

### Compress Videos

```bash
# Compress with FFmpeg
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 output.mp4
```

### Use WebP

```bash
# Convert to WebP
cwebp -q 80 image.png -o image.webp
```

## Code Optimization

### Avoid Expensive Calculations

Cache ผลลัพธ์:

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

### Use React.memo

Prevent unnecessary re-renders:

```tsx
const MyComponent = React.memo(({ prop }) => {
  // ...
});
```

### Use useCallback

Cache functions:

```tsx
const handleClick = useCallback(() => {
  // ...
}, [dependency]);
```

## Rendering Pipeline Optimization

### Reduce Frame Count

ลด duration ถ้าเป็นไปได้:

```tsx
<Composition durationInFrames={150} /> // 5 seconds @ 30fps
```

### Use Lower Resolution

Render ที่ resolution ต่ำกว่าสำหรับ preview:

```bash
bunx remotion render MyComposition --width=1280 --height=720
```

### Use Appropriate Codec

```bash
# H.264 - Widely supported
bunx remotion render MyComposition --codec=h264

# VP9 - Better compression
bunx remotion render MyComposition --codec=vp9
```

## Cloud Rendering Optimization

### AWS Lambda

```ts
await renderMediaOnLambda({
  // ... options
  memorySizeInMb: 2048,
  timeoutInSeconds: 120,
  framesPerLambda: 10,
});
```

### GCP Cloud Run

```ts
await renderMediaOnCloudrun({
  // ... options
  memory: '2Gi',
  timeoutInSeconds: 120,
});
```

## Monitoring

### Track Progress

```ts
await renderMedia({
  // ... options
  onProgress: (progress) => {
    console.log(`Progress: ${progress.progress * 100}%`);
    console.log(`Rendered: ${progress.renderedFrames}`);
    console.log(`Encoded: ${progress.encodedFrames}`);
  },
});
```

### Profile Performance

```bash
# Profile with Node.js
NODE_OPTIONS="--prof" bunx remotion render MyComposition
```

## Best Practices Summary

1. **Use Rspack** - ใช้ Rspack สำหรับ faster bundling
2. **Parallel Rendering** - ใช้ multiple cores
3. **Optimize Assets** - Compress images และ videos
4. **Cache Results** - ใช้ cache สำหรับ faster re-renders
5. **Reduce Memory** - ใช้ offthread video และ windowed audio
6. **Monitor Progress** - Track rendering progress
7. **Profile Performance** - Profile และ optimize bottlenecks
