# Programmatic API Reference — Audio/Video & Static Files

## Audio/Video

### useAudioData

Load audio data for visualization (from @remotion/media-utils):

```tsx
import { useAudioData } from '@remotion/media-utils';

const audioData = useAudioData(staticFile('music.mp3'));

if (!audioData) return null;

return (
  <div>
    {audioData.map((value, i) => (
      <div key={i} style={{ height: value * 100 }} />
    ))}
  </div>
);
```

### useWindowedAudioData

Load audio data windowed for long audio (from @remotion/media-utils):

```tsx
import { useWindowedAudioData } from '@remotion/media-utils';

const audioData = useWindowedAudioData(staticFile('long-music.mp3'));
```

### useAudio

Load and control audio:

```tsx
import { useAudio } from 'remotion';

const { volume } = useAudio('background.mp3');
```

### Audio

Play audio in composition:

```tsx
import { Audio } from 'remotion';

<Audio src={staticFile('music.mp3')} startFrom={0} />;
```

### Video

Embed video files:

```tsx
import { Video } from 'remotion';

<Video src={staticFile('intro.mp4')} startFrom={0} />;
```

## Static Files

### staticFile

Reference static assets:

```tsx
import { staticFile } from 'remotion';

<Img src={staticFile('logo.png')} />;
```
