# Rendering Pipeline

## Overview

Remotion rendering pipeline แปลง React components เป็น video files ผ่าน 4 ขั้นตอน:

```
React Code → Bundle → Execute → Capture → Encode → Video
```

## Phase 1: Bundle

### What Happens

React code ถูก bundle เป็น static files ด้วย Webpack หรือ Rspack:

```ts
import { bundle } from '@remotion/bundler';

const bundleLocation = await bundle({
  entryPoint: './src/index.ts',
  webpackOverride: (config) => config,
});
```

### Output

- `index.html` - Entry HTML file
- JavaScript bundle - React code ที่ถูก transpile
- Assets - Images, videos, fonts

### Configuration

```ts
await bundle({
  entryPoint: './src/index.ts',
  webpackOverride: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: 'svg-loader',
    });
    return config;
  },
});
```

## Phase 2: Execute

### What Happens

Bundle ถูก serve และ execute ใน headless browser (Puppeteer):

```ts
import { openBrowser } from '@remotion/renderer';

const browser = await openBrowser('chrome');
const page = await browser.newPage();
await page.goto(bundleLocation);
```

### Frame-by-Frame Execution

Remotion control timeline ผ่าน window properties:

```ts
// Set current frame
await page.evaluate((frame) => {
  window.remotion_setFrame(frame);
}, frame);

// Wait for render ready
await page.waitForFunction(() => window.remotion_renderReady);
```

## Phase 3: Capture

### What Happens

แต่ละ frame ถูก capture เป็น screenshot:

```ts
const screenshot = await page.screenshot({
  type: 'png',
  clip: { x: 0, y: 0, width, height },
});
```

### Frame Collection

Frames ถูก collect และ save:

```ts
const frames = [];
for (let frame = 0; frame < durationInFrames; frame++) {
  const screenshot = await captureFrame(page, frame);
  frames.push(screenshot);
}
```

### Asset Collection

Media assets ถูก collect จาก DOM:

```ts
const assets = await page.evaluate(() => {
  return window.remotion_collectAssets();
});
```

## Phase 4: Encode

### What Happens

Frames และ audio ถูก stitch เป็น video ด้วย FFmpeg:

```ts
import { stitchFramesToVideo } from '@remotion/renderer';

await stitchFramesToVideo({
  dir: framesDir,
  assets,
  outputLocation: 'out/video.mp4',
  fps: 30,
  codec: 'h264',
});
```

### FFmpeg Pipeline

```
Frames (PNG/JPEG) + Audio → FFmpeg → Video (MP4)
```

### Encoding Stages

1. **Encoding** - Frames ถูก encode เป็น video stream
2. **Muxing** - Video และ audio streams ถูก combine
3. **Container** - Final video file ถูก created

## Programmatic Rendering

### Full Example

```ts
import { renderMedia } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';

// 1. Bundle
const bundleLocation = await bundle({
  entryPoint: './src/index.ts',
});

// 2. Render
await renderMedia({
  composition: {
    id: 'MyComposition',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
    props: {},
  },
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: 'out/video.mp4',
  onProgress: (progress) => {
    console.log(`${progress.progress * 100}%`);
  },
});
```

## Progress Tracking

### RenderMediaProgress

```ts
await renderMedia({
  // ... options
  onProgress: (progress) => {
    console.log(`Rendered: ${progress.renderedFrames}`);
    console.log(`Encoded: ${progress.encodedFrames}`);
    console.log(`Progress: ${progress.progress * 100}%`);
    console.log(`Stage: ${progress.stitchStage}`);
  },
});
```

### Stages

- **renderedFrames** - Frames ที่ถูก capture
- **encodedFrames** - Frames ที่ถูก encode
- **stitchStage** - 'encoding' | 'muxing'

## Performance Optimization

### Parallel Rendering

```ts
await renderMedia({
  // ... options
  parallelism: 4, // 4 parallel renders
});
```

### Caching

Remotion cache frames อัตโนมัติ:

```bash
# Clear cache
bunx remotion cache clear
```

### Offthread Video

ใช้ `<OffthreadVideo>` สำหรับ performance:

```tsx
<OffthreadVideo src={staticFile('large-video.mp4')} />
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

## Best Practices

1. **Bundle Once** - Bundle ครั้งเดียวสำหรับ multiple renders
2. **Monitor Progress** - Track progress ด้วย onProgress
3. **Handle Errors** - Handle errors และ retry
4. **Optimize Assets** - Compress assets ก่อน render
5. **Use Cache** - ใช้ cache สำหรับ faster re-renders
