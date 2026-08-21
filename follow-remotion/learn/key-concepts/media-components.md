# Media Components

## Video Component

ใช้ `<Video>` สำหรับ embed video files:

```tsx
import { Video } from 'remotion';

<Video
  src={staticFile('intro.mp4')}
  from={0}
  durationInFrames={150}
  volume={1}
/>
```

### Properties

- **src** - URL หรือ path ของ video
- **from** - Frame ที่เริ่มเล่น
- **durationInFrames** - ความยาวที่เล่น
- **volume** - Volume (0-1)
- **trimBefore** - ตัดส่วนต้น (วินาที)
- **trimAfter** - ตัดส่วนท้าย (วินาที)
- **playbackRate** - ความเร็วการเล่น

### Example

```tsx
<Video
  src={staticFile('background.mp4')}
  from={0}
  durationInFrames={300}
  volume={0.5}
  trimBefore={2}
  trimAfter={1}
/>
```

## Audio Component

ใช้ `<Audio>` สำหรับ embed audio files:

```tsx
import { Audio } from 'remotion';

<Audio
  src={staticFile('music.mp3')}
  from={0}
  durationInFrames={150}
  volume={1}
/>
```

### Properties

- **src** - URL หรือ path ของ audio
- **from** - Frame ที่เริ่มเล่น
- **durationInFrames** - ความยาวที่เล่น
- **volume** - Volume (0-1)
- **trimBefore** - ตัดส่วนต้น (วินาที)
- **trimAfter** - ตัดส่วนท้าย (วินาที)

### Example

```tsx
<Audio
  src={staticFile('background-music.mp3')}
  from={0}
  durationInFrames={300}
  volume={0.3}
/>
```

## Img Component

ใช้ `<Img>` สำหรับ static images:

```tsx
import { Img } from 'remotion';

<Img src={staticFile('logo.png')} />
```

### Properties

- **src** - URL หรือ path ของ image
- **style** - CSS styles

### Example

```tsx
<Img
  src={staticFile('logo.png')}
  style={{ width: 200, height: 200 }}
/>
```

## OffthreadVideo

ใช้ `<OffthreadVideo>` สำหรับ video ขนาดใหญ่:

```tsx
import { OffthreadVideo } from 'remotion';

<OffthreadVideo
  src={staticFile('large-video.mp4')}
  from={0}
  durationInFrames={150}
/>
```

### When to Use

- Video ขนาดใหญ่ (> 100MB)
- 4K video
- Long videos (> 1 minute)
- เมื่อต้องการ performance ดีขึ้น

## Gif Component

ใช้ `<Gif>` สำหรับ animated GIFs:

```bash
bun add @remotion/gif
```

```tsx
import { Gif } from '@remotion/gif';

<Gif src={staticFile('animation.gif')} />
```

## Audio Visualization

ใช้ `@remotion/media-utils` สำหรับ audio visualization:

```bash
bun add @remotion/media-utils
```

### useAudioData

```tsx
import { useAudioData } from '@remotion/media-utils';

const audioData = useAudioData(staticFile('music.mp3'));

if (!audioData) return null;

return (
  <div>
    {audioData.map((value, i) => (
      <div
        key={i}
        style={{
          height: value * 100,
          width: 10,
          backgroundColor: 'blue',
        }}
      />
    ))}
  </div>
);
```

### useWindowedAudioData

สำหรับ audio ยาว:

```tsx
import { useWindowedAudioData } from '@remotion/media-utils';

const audioData = useWindowedAudioData(staticFile('long-music.mp3'));
```

## staticFile Function

ใช้ `staticFile()` สำหรับ reference assets:

```tsx
import { staticFile } from 'remotion';

const imagePath = staticFile('images/logo.png');
const videoPath = staticFile('videos/intro.mp4');
const audioPath = staticFile('audio/music.mp3');
```

### Why staticFile?

- **Cross-platform** - ทำงานได้ทุก platform
- **Bundle-safe** - Path ถูก resolve อัตโนมัติ
- **Type-safe** - TypeScript support

## Asset Best Practices

1. **Use staticFile()** - ไม่ใช้ relative paths
2. **Optimize Assets** - Compress images และ videos
3. **Organize Folders** - จัดระเบียบ assets ใน public/
4. **Use OffthreadVideo** - สำหรับ videos ขนาดใหญ่
5. **Preload Assets** - ใช้ `prefetch()` สำหรับ critical assets

## Asset Formats

### Supported Video Formats

- MP4 (H.264)
- WebM (VP9)
- MOV

### Supported Audio Formats

- MP3
- WAV
- AAC
- OGG

### Supported Image Formats

- PNG
- JPEG
- WebP
- SVG

## Performance Tips

1. **Compress Videos** - ใช้ codec ที่ efficient
2. **Use OffthreadVideo** - สำหรับ videos ขนาดใหญ่
3. **Lazy Load** - โหลด assets เมื่อจำเป็น
4. **Cache Assets** - Remotion cache assets อัตโนมัติ
5. **Use Audio Visualization** - ใช้ windowed audio data สำหรับ audio ยาว
