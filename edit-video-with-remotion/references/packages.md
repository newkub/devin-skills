# Remotion Packages

Dependencies ของ `/edit-video-with-remotion` — ข้อมูลจาก official docs (remotion.dev) และ repo `remotion-dev/remotion`, verified v4.0.520 (Sep 2026)

## Install

ติดตั้งผ่าน Remotion CLI เพื่อ sync version กับ core อัตโนมัติ:

```bash
bunx remotion add @remotion/media @remotion/transitions @remotion/captions @remotion/gif
```

## Package Table

| No. | Package | Purpose | Key Exports |
|-----|---------|---------|-------------|
| 1 | `remotion` | core | `Composition`, `Sequence`, `Series`, `AbsoluteFill`, `Img`, `staticFile`, `useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`, `useDelayRender`, `OffthreadVideo`, `Html5Video`, `Html5Audio` |
| 2 | `@remotion/media` | video/audio tags (recommended) | `Video`, `Audio`, `useRemotionEnvironment` pattern via `remotion` |
| 3 | `@remotion/transitions` | scene transitions | `TransitionSeries`, `linearTiming`, `springTiming`, `fade`, `slide`, `wipe`, `TransitionSeries.Overlay` |
| 4 | `@remotion/captions` | subtitle parsing | `parseSrt`, `Caption` type (`startMs`, `endMs`, `text`, `confidence`) |
| 5 | `@remotion/gif` | GIF source/overlay | `Gif` (`src`, `width`, `height`, `fit`, `playbackRate`, `loopBehavior`) |
| 6 | `@remotion/cli` | CLI + config | `remotion studio`, `remotion render`, `Config` from `@remotion/cli/config` |
| 7 | `@remotion/lambda` | AWS Lambda rendering | serverless render at scale |
| 8 | `@remotion/cloudrun` | GCP Cloud Run rendering | serverless render at scale |

## Video Tag Selection (docs/video-tags)

| No. | Tag | Engine | Frame-perfect | Render speed | Note |
|-----|-----|--------|---------------|--------------|------|
| 1 | `<Video>` `@remotion/media` | Mediabunny/WebCodecs | yes | fastest | default สำหรับ new code — partial asset download, client-side render ได้ |
| 2 | `<OffthreadVideo>` `remotion` | Rust + FFmpeg | yes | fast | fallback เมื่อ codec/container ไม่รองรับ (AV1, H.265, ProRes, .avi, .flv) |
| 3 | `<Html5Video>` `remotion` | HTML5 tag | no | medium | legacy — preview เท่านั้น, ไม่ frame-perfect |

Pattern preview/render แยก tag (ถ้าจำเป็น):

```tsx
const env = useRemotionEnvironment();
return env.isRendering ? <Video {...props} /> : <OffthreadVideo {...props} />;
```

## Key API Signatures

```tsx
// trim (หน่วย frames — ไม่ re-encode)
<Video src={staticFile('in.mp4')} trimBefore={5 * fps} trimAfter={10 * fps} />

// transitions
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>...</TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 30})} />
  <TransitionSeries.Sequence durationInFrames={60}>...</TransitionSeries.Sequence>
</TransitionSeries>

// captions
const {captions} = parseSrt({input: srtText}); // Caption.startMs/endMs → frame = (ms / 1000) * fps

// audio fade
<Audio src={staticFile('bg.mp3')} volume={(f) => interpolate(f, [0, fps], [0, 1], {extrapolateRight: 'clamp'})} />
```

## CLI

```bash
bunx remotion studio                          # preview
bunx remotion render <CompId> out/video.mp4   # render (--codec, --concurrency, --props, --image-format, --every-nth-frame)
```

Config defaults ใน `remotion.config.ts`: `Config.setConcurrency(8)`, `Config.setCodec('h265')`, `Config.setPixelFormat('yuv444p')`
