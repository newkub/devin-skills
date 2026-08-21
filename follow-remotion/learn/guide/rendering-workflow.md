# Rendering Workflow

## Overview

Remotion rendering pipeline แปลง React components เป็น video files ผ่าน 4 ขั้นตอนหลัก:

1. **Bundle** - Bundle React code เป็น static files
2. **Execute** - Run ใน headless browser frame-by-frame
3. **Capture** - Screenshot แต่ละ frame
4. **Encode** - Stitch frames + audio เป็น video ด้วย FFmpeg

## Local Rendering

### Render to MP4

```bash
bunx remotion render MyComposition
```

### Render to GIF

```bash
bunx remotion render MyComposition --output.gif
```

### Render Specific Frame Range

```bash
bunx remotion render MyComposition --frames=0-100
```

### Render with Custom Props

```bash
bunx remotion render MyComposition --props='{"title":"Hello World"}'
```

### Render with Quality Settings

```bash
bunx remotion render MyComposition --quality=100 --crf=18
```

## Rendering Options

### Output Format

```bash
# MP4 (default)
bunx remotion render MyComposition --output.mp4

# WebM (transparent)
bunx remotion render MyComposition --output.webm --codec=vp9

# GIF
bunx remotion render MyComposition --output.gif
```

### Resolution

```bash
# Full HD
bunx remotion render MyComposition --width=1920 --height=1080

# 4K
bunx remotion render MyComposition --width=3840 --height=2160

# Custom
bunx remotion render MyComposition --width=1280 --height=720
```

### Frame Rate

```bash
# 60 FPS
bunx remotion render MyComposition --fps=60

# 24 FPS (cinematic)
bunx remotion render MyComposition --fps=24
```

### Quality

```bash
# High quality
bunx remotion render MyComposition --quality=100

# Medium quality
bunx remotion render MyComposition --quality=80

# Low quality (faster)
bunx remotion render MyComposition --quality=50
```

## Programmatic Rendering

ใช้ `renderMedia()` API สำหรับ programmatic rendering:

```ts
import { renderMedia } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';

const bundleLocation = await bundle({
  entryPoint: './src/index.ts',
  webpackOverride: (config) => config,
});

await renderMedia({
  composition: {
    id: 'MyComposition',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
    props: {},
    defaultProps: undefined,
  },
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: 'out/video.mp4',
});
```

## Progress Tracking

Track rendering progress:

```ts
const { renderMedia, makeCancelSignal } = await renderMedia({
  // ... options
  onProgress: (progress) => {
    console.log(`${progress.progress * 100}% complete`);
  },
});

// Cancel rendering
makeCancelSignal().cancel();
```

## Still Rendering

Render single frame สำหรับ thumbnail หรือ preview:

```bash
bunx remotion still MyComposition --frame=30 --scale=0.25
```

## Performance Optimization

### Parallel Rendering

ใช้ multiple cores สำหรับ rendering:

```ts
await renderMedia({
  // ... options
  parallelism: 4, // 4 parallel renders
});
```

### Caching

Remotion cache ผลลัพธ์ rendering:

```bash
# Clear cache
bunx remotion cache clear
```

### Offthread Video

ใช้ `<OffthreadVideo>` สำหรับ video assets ขนาดใหญ่:

```tsx
import { OffthreadVideo } from 'remotion';

<OffthreadVideo src={staticFile('large-video.mp4')} />;
```

## Cloud Rendering

### AWS Lambda

Render บน AWS Lambda:

```bash
bun add @remotion/lambda
```

```ts
import { renderMediaOnLambda } from '@remotion/lambda';

const { renderId, bucketName } = await renderMediaOnLambda({
  region: 'us-east-1',
  functionName: 'remotion-render',
  composition: {
    id: 'MyComposition',
    // ... config
  },
  serveUrl: 'https://my-bucket.s3.amazonaws.com/bundle.zip',
});
```

### GCP Cloud Run

Render บน Google Cloud Run:

```bash
bun add @remotion/cloudrun
```

```ts
import { renderMediaOnCloudrun } from '@remotion/cloudrun';

const { renderId } = await renderMediaOnCloudrun({
  region: 'us-central1',
  serviceUrl: 'https://my-service.run.app',
  composition: {
    id: 'MyComposition',
    // ... config
  },
  serveUrl: 'https://storage.googleapis.com/bucket/bundle.zip',
});
```

## Troubleshooting

### FFmpeg Not Found

```bash
# Install FFmpeg
# macOS
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Memory Issues

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" bunx remotion render MyComposition
```

### Slow Rendering

- ลด quality settings
- ใช้ lower resolution
- เปิด parallelism
- ใช้ offthread video
