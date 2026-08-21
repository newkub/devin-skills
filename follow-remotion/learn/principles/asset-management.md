# Asset Management

## Use staticFile()

ใช้ `staticFile()` สำหรับ reference assets:

```tsx
import { staticFile } from 'remotion';

// ✅ Good
<Img src={staticFile('images/logo.png')} />

// ❌ Bad
<Img src="./images/logo.png" />
```

### Why staticFile?

- **Cross-platform** - ทำงานได้ทุก platform
- **Bundle-safe** - Path ถูก resolve อัตโนมัติ
- **Type-safe** - TypeScript support

## Organize Assets

จัดระเบียบ assets ใน public/ folder:

```
public/
├── images/
│   ├── logo.png
│   └── background.jpg
├── videos/
│   ├── intro.mp4
│   └── background.mp4
├── audio/
│   ├── music.mp3
│   └── sfx.wav
└── fonts/
    └── custom-font.woff2
```

## Optimize Images

### Compress Images

```bash
# PNG optimization
optipng -o7 image.png

# JPEG optimization
jpegoptim --max-quality=85 image.jpg

# WebP conversion
cwebp -q 80 image.png -o image.webp
```

### Use Appropriate Formats

- **PNG** - Images ที่มี transparency
- **JPEG** - Photos
- **WebP** - Modern format ที่ efficient
- **SVG** - Vector graphics

## Optimize Videos

### Compress Videos

```bash
# Compress with FFmpeg
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 output.mp4
```

### Use Appropriate Codecs

- **H.264** - Widely supported
- **VP9** - Better compression
- **AV1** - Best compression (slower)

### Trim Videos

```bash
# Trim with FFmpeg
ffmpeg -i input.mp4 -ss 00:00:02 -t 00:00:10 output.mp4
```

## Optimize Audio

### Compress Audio

```bash
# Compress MP3
ffmpeg -i input.wav -b:a 128k output.mp3
```

### Use Appropriate Formats

- **MP3** - Widely supported
- **AAC** - Better quality
- **OGG** - Open format

## Lazy Load Assets

โหลด assets เมื่อจำเป็น:

```tsx
import { prefetch } from 'remotion';

// Prefetch critical assets
prefetch(staticFile('images/logo.png'));
prefetch(staticFile('videos/intro.mp4'));
```

## Use OffthreadVideo

สำหรับ videos ขนาดใหญ่:

```tsx
import { OffthreadVideo } from 'remotion';

// ✅ Good - สำหรับ videos ขนาดใหญ่
<OffthreadVideo src={staticFile('large-video.mp4')} />

// ❌ Bad - ใช้ <Video> สำหรับ videos ขนาดใหญ่
<Video src={staticFile('large-video.mp4')} />
```

### When to Use OffthreadVideo

- Videos > 100MB
- 4K videos
- Long videos (> 1 minute)
- เมื่อต้องการ performance ดีขึ้น

## Asset Caching

Remotion cache assets อัตโนมัติ:

```bash
# Clear cache
bunx remotion cache clear
```

### Cache Strategy

- **Development** - Cache enabled
- **Production** - Cache disabled (optional)
- **CI/CD** - Clear cache ก่อน render

## Asset Versioning

ใช้ versioning สำหรับ assets:

```
public/
├── images/
│   ├── logo@1x.png
│   ├── logo@2x.png
│   └── logo@3x.png
```

```tsx
const logo = staticFile('images/logo@2x.png');
```

## Remote Assets

ใช้ remote URLs สำหรับ external assets:

```tsx
<Video src="https://example.com/video.mp4" />
```

### Best Practices for Remote Assets

- ใช้ HTTPS
- ใช้ CDN
- ใช้ caching headers
- Handle errors gracefully

## Asset Preloading

Preload assets สำหรับ faster rendering:

```tsx
import { prefetch } from 'remotion';

useEffect(() => {
  prefetch(staticFile('images/logo.png'));
  prefetch(staticFile('videos/intro.mp4'));
}, []);
```

## Asset Best Practices

1. **Use staticFile()** - ไม่ใช้ relative paths
2. **Organize Folders** - จัดระเบียบ assets ใน public/
3. **Optimize Assets** - Compress images และ videos
4. **Use OffthreadVideo** - สำหรับ videos ขนาดใหญ่
5. **Lazy Load** - โหลด assets เมื่อจำเป็น
6. **Cache Assets** - ใช้ cache สำหรับ faster re-renders
7. **Version Assets** - ใช้ versioning สำหรับ updates
