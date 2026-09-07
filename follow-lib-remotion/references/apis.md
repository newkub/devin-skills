# Remotion API Reference

## Install

ติดตั้ง package หลักพร้อม React peer dependencies:

```bash
bun add remotion react react-dom
# หรือ
npm install remotion react react-dom
```

สำหรับ CLI:

```bash
bun add -D @remotion/cli
# หรือ
npm install -D @remotion/cli
```

สำหรับ Player ใน React app:

```bash
bun add @remotion/player
```

สำหรับ media สมัยใหม่ (`<Video>`/`<Audio>` แบบ Mediabunny):

```bash
bun add @remotion/media
```

## Version

- Latest version: `4.0.522`
- Package Registry: https://www.npmjs.com/package/remotion
- Repository: https://github.com/remotion-dev/remotion

## Dependencies

- Peer dependencies: `react >=16.8.0`, `react-dom >=16.8.0`
- CLI ใช้ `@remotion/cli` เป็น dev dependency
- Optional: `@remotion/player`, `@remotion/media`, `zod`, `@remotion/zod-types` สำหรับ props schema
- Rendering ใช้ Chromium/Chrome headless โดยอัตโนมัติ (ดู [browser management](https://www.remotion.dev/docs/cli/browser))

## Common API / Commands

### CLI

| commands | description | default | options |
|---|---|---|---|
| `npx create-video [dir]` | สร้างโปรเจกต์ Remotion ใหม่ | ถาม template แบบ interactive | `--yes`, `--blank`, `--no-tailwind`, `--tmp` |
| `npx remotion studio [entry]` | เปิด Remotion Studio (alias `preview`) | entry point ถูก detect อัตโนมัติ | `--port`, `--public-dir`, `--log`, `--no-open`, `--browser`, `--browser-args`, `--disable-keyboard-shortcuts`, `--disable-interactivity`, `--allow-html-in-canvas`, `--rspack` |
| `npx remotion render [entry\|serve] [comp] [output]` | Render วิดีโอ/เสียง | output ไป `out/`, codec `h264` | `--props`, `--codec`, `--fps`, `--width`, `--height`, `--duration`, `--output`, `--overwrite`, `--sequence`, `--frames`, `--muted`, `--concurrency`, `--scale`, `--log`, `--timeout`, `--crf`, `--public-dir`, `--bundle-cache` |
| `npx remotion still [entry\|serve] [comp] [output]` | Render ภาพนิ่ง 1 frame | output ไป `out/`, frame `0` | `--props`, `--image-format`, `--frame`, `--output`, `--overwrite`, `--scale`, `--log`, `--timeout`, `--public-dir`, `--bundle-cache` |
| `npx remotion bundle [entry\|serve]` | Bundle โปรเจกต์เป็น static site | output ไป `out/` | `--out-dir`, `--public-dir`, `--public-path`, `--log`, `--disable-git-source`, `--rspack` |
| `npx remotion compositions [entry\|serve]` | แสดงรายการ composition IDs | แสดงทั้งหมด | `--props`, `--log`, `--port`, `--public-dir`, `--timeout`, `--quiet`, `--bundle-cache` |
| `npx remotion benchmark [entry] [comp-ids]` | Benchmark การ render | ถาม composition | `--runs`, `--concurrencies`, `--codec`, `--crf`, `--frames`, `--log`, `--bundle-cache` |
| `npx remotion upgrade` | อัปเกรด Remotion packages ทั้งหมด | ใช้ package manager ของโปรเจกต์ | `--package-manager`, `--version`, `--skip-skills` |
| `npx remotion versions` | แสดงเวอร์ชัน Remotion packages | - | - |

### Components

| commands | description | default | options |
|---|---|---|---|
| `<Composition>` | ลงทะเบียน composition สำหรับ render | `defaultProps: {}` | `id`*, `component`\|`lazyComponent`*, `durationInFrames`*, `fps`*, `width`*, `height`*, `defaultProps`, `schema`, `calculateMetadata` |
| `<Still>` | Composition 1 frame สำหรับ render ภาพนิ่ง | `durationInFrames=1`, `fps=1` | `id`*, `component`\|`lazyComponent`*, `width`*, `height`*, `defaultProps`, `schema`, `calculateMetadata` |
| `<Sequence>` | ขยับ timeline ให้ children ด้วย `from`/`durationInFrames` | `from=0`, `durationInFrames=Infinity`, `layout='absolute-fill'` | `from`, `durationInFrames`, `trimBefore`, `freeze`, `layout`, `style`, `name`, `showInTimeline`, `hidden`, `premountFor`, `postmountFor` |
| `<Series>` / `<Series.Sequence>` | เล่น clip ต่อกันเป็นลำดับ | `durationInFrames` ต้องระบุใน `<Series.Sequence>` | `durationInFrames`*, `children` |
| `<AbsoluteFill>` | Container absolute คลุมทั้งเฟรม | ขนาดเต็ม composition | `style`, `className`, `from`, `durationInFrames`, `hidden` |
| `<Img>` | แสดงรูปภาพ (support canvas effects) | `src`*, `pauseWhenLoading=false` | `src`*, `style`, `maxRetries`, `pauseWhenLoading`, `delayRenderRetries`, `delayRenderTimeoutInMilliseconds`, `effects`, `onImageFrame` |
| `<OffthreadVideo>` | วิดีโอที่ extract frame นอก browser ด้วย FFmpeg | `src`* | `src`*, `volume`, `playbackRate`, `muted`, `trimBefore`, `durationInFrames`, `name`, `onError` |
| `<Video>` (remotion) | Legacy HTML5 video component | `src`* | `src`*, `volume`, `playbackRate`, `muted`, `startFrom`, `endAt` |
| `<Html5Video>` | HTML5 `<video>` tag แบบตรง | `src`* | `src`*, `volume`, `playbackRate`, `muted` |
| `<Audio>` (remotion) | Legacy HTML5 audio component | `src`* | `src`*, `volume`, `playbackRate`, `muted`, `startFrom`, `endAt` |
| `<Html5Audio>` | HTML5 `<audio>` tag แบบตรง | `src`* | `src`*, `volume`, `playbackRate`, `muted` |
| `<Loop>` | วนซ้ำ children | `durationInFrames` หรือ `times` | `durationInFrames`, `times`, `children` |
| `<Folder>` | จัดกลุ่ม composition ใน sidebar | `name`* | `name`*, `children` |
| `<Player>` (from `@remotion/player`) | Embed Remotion video ใน React app | `controls=false` | `component`*, `durationInFrames`*, `fps`*, `compositionWidth`*, `compositionHeight`*, `inputProps`, `controls`, `loop`, `autoPlay`, `style`, `className` |

### Hooks & Utility Functions

| commands | description | default | options |
|---|---|---|---|
| `useCurrentFrame()` | คืน frame ปัจจุบัน (0-indexed) | `0` ที่เฟรมแรก | - |
| `useVideoConfig()` | คืน `{width, height, fps, durationInFrames, id, defaultProps, props}` | ค่าของ composition ปัจจุบัน | - |
| `useCurrentScale()` | คืน scale factor ปัจจุบัน | `1` | - |
| `useDelayRender()` | Hook สำหรับ `delayRender/continueRender/cancelRender` แบบ scoped | - | `delayRender(label?, options?)`, `continueRender(handle)`, `cancelRender(error)` |
| `registerRoot(component)` | ลงทะเบียน root component ของโปรเจกต์ | ต้องเรียกครั้งเดียว | `component` (React component) |
| `interpolate(input, inputRange, outputRange, options)` | Map ค่าจากช่วงหนึ่งไปอีกช่วง | `easing: linear`, `extrapolate: 'extend'` | `easing`, `extrapolateLeft`, `extrapolateRight`, `output`, `posterize` |
| `interpolateColors(input, inputRange, outputRange)` | Interpolate ระหว่างสี | linear | - |
| `spring({frame, fps, ...})` | คำนวณ spring animation (0 → 1) | `from=0`, `to=1`, `config` defaults | `config` (`stiffness`, `damping`, `mass`, `overshootClamping`), `durationInFrames`, `delay`, `reverse` |
| `measureSpring({...})` | คืนจำนวน frame ที่ spring ใช้ | - | อากิวเมนต์เดียวกับ `spring()` |
| `Easing` | ชุด easing functions | `Easing.linear` | `bezier`, `step1`, `back`, `bounce`, `circ`, `cubic`, `ease`, `elastic`, `expo`, `quad`, `quart`, `quint`, `sine`, `spring` |
| `random(seed?)` | Pseudo-random ที่ deterministic | สุ่ม 0–1 | `seed` (number\|string) |
| `staticFile(path)` | แปลง path ใน `public/` เป็น URL | คืน `/static-<hash>/...` | `path` สัมพันธ์กับ `public/` |
| `getStaticFiles()` | คืน array ของไฟล์ใน `public/` | - | - |
| `watchStaticFile(path, options)` | Watch ไฟล์ static แล้ว callback | - | `path`, `onUpdate` |
| `getInputProps()` | คืน input props จาก CLI หรือ SSR | `{}` ถ้าไม่มี | - |
| `getRemotionEnvironment()` | คืนสภาพแวดล้อมปัจจุบัน | `'preview'` | - |
| `delayRender(label?, options?)` | หยุด render รอ async task | timeout 30000ms | `label`, `retries`, `timeout` |
| `continueRender(handle)` | บอกให้ render ดำเนินต่อ | - | `handle` (จาก `delayRender`) |
| `cancelRender(err)` | ยกเลิก render เมื่อเกิด error | - | `error` |
| `calculateMetadata(function)` | Prop ของ `<Composition>` สำหรับ dynamic metadata/props | - | `({defaultProps, props, abortSignal, compositionId, isRendering}) => {...}` |

## Source

- Official docs: https://www.remotion.dev/docs
- CLI reference: https://www.remotion.dev/docs/cli
- Composition: https://www.remotion.dev/docs/composition
- Sequence: https://www.remotion.dev/docs/sequence
- Series: https://www.remotion.dev/docs/series
- interpolate: https://www.remotion.dev/docs/interpolate
- spring: https://www.remotion.dev/docs/spring
- Player: https://www.remotion.dev/docs/player/player
- npm: https://www.npmjs.com/package/remotion
