| key | value |
|---|---|
| package registry | https://www.npmjs.com/package/remotion |
| repository | https://github.com/remotion-dev/remotion |
| docs | https://www.remotion.dev/docs |

| commands | description | default | options |
|---|---|---|---|
| `bunx create-video [dir]` | Create a new Remotion project | asks template interactively | `--yes`, `--blank`, `--no-tailwind`, `--tmp` |
| `bunx remotion studio [entry]` | Open Remotion Studio (alias `preview`) | entry point auto-detected | `--port`, `--public-dir`, `--log`, `--no-open`, `--browser`, `--browser-args`, `--disable-keyboard-shortcuts`, `--disable-interactivity`, `--allow-html-in-canvas`, `--rspack` |
| `bunx remotion render [entry\|serve] [comp] [output]` | Render video/audio | output to `out/`, codec `h264` | `--props`, `--codec`, `--fps`, `--width`, `--height`, `--duration`, `--output`, `--overwrite`, `--sequence`, `--frames`, `--muted`, `--concurrency`, `--scale`, `--log`, `--timeout`, `--crf`, `--public-dir`, `--bundle-cache` |
| `bunx remotion still [entry\|serve] [comp] [output]` | Render a still image of 1 frame | output to `out/`, frame `0` | `--props`, `--image-format`, `--frame`, `--output`, `--overwrite`, `--scale`, `--log`, `--timeout`, `--public-dir`, `--bundle-cache` |
| `bunx remotion bundle [entry\|serve]` | Bundle the project into a static site | output to `out/` | `--out-dir`, `--public-dir`, `--public-path`, `--log`, `--disable-git-source`, `--rspack` |
| `bunx remotion compositions [entry\|serve]` | List composition IDs | shows all | `--props`, `--log`, `--port`, `--public-dir`, `--timeout`, `--quiet`, `--bundle-cache` |
| `bunx remotion benchmark [entry] [comp-ids]` | Benchmark rendering | asks for composition | `--runs`, `--concurrencies`, `--codec`, `--crf`, `--frames`, `--log`, `--bundle-cache` |
| `bunx remotion upgrade` | Upgrade all Remotion packages | uses the project's package manager | `--package-manager`, `--version`, `--skip-skills` |
| `bunx remotion versions` | Show Remotion package versions | - | - |

| commands | description | default | options |
|---|---|---|---|
| `<Composition>` | Register a composition for rendering | `defaultProps: {}` | `id`*, `component`\|`lazyComponent`*, `durationInFrames`*, `fps`*, `width`*, `height`*, `defaultProps`, `schema`, `calculateMetadata` |
| `<Still>` | 1-frame composition for still renders | `durationInFrames=1`, `fps=1` | `id`*, `component`\|`lazyComponent`*, `width`*, `height`*, `defaultProps`, `schema`, `calculateMetadata` |
| `<Sequence>` | Shift the timeline for children via `from`/`durationInFrames` | `from=0`, `durationInFrames=Infinity`, `layout='absolute-fill'` | `from`, `durationInFrames`, `trimBefore`, `freeze`, `layout`, `style`, `name`, `showInTimeline`, `hidden`, `premountFor`, `postmountFor` |
| `<Series>` / `<Series.Sequence>` | Play clips one after another in order | `durationInFrames` must be given on `<Series.Sequence>` | `durationInFrames`*, `children` |
| `<AbsoluteFill>` | Absolute container covering the whole frame | full composition size | `style`, `className`, `from`, `durationInFrames`, `hidden` |
| `<Img>` | Display an image (supports canvas effects) | `src`*, `pauseWhenLoading=false` | `src`*, `style`, `maxRetries`, `pauseWhenLoading`, `delayRenderRetries`, `delayRenderTimeoutInMilliseconds`, `effects`, `onImageFrame` |
| `<OffthreadVideo>` | Video with frames extracted outside the browser via FFmpeg | `src`* | `src`*, `volume`, `playbackRate`, `muted`, `trimBefore`, `durationInFrames`, `name`, `onError` |
| `<Video>` (remotion) | Legacy HTML5 video component | `src`* | `src`*, `volume`, `playbackRate`, `muted`, `startFrom`, `endAt` |
| `<Html5Video>` | Plain HTML5 `<video>` tag | `src`* | `src`*, `volume`, `playbackRate`, `muted` |
| `<Audio>` (remotion) | Legacy HTML5 audio component | `src`* | `src`*, `volume`, `playbackRate`, `muted`, `startFrom`, `endAt` |
| `<Html5Audio>` | Plain HTML5 `<audio>` tag | `src`* | `src`*, `volume`, `playbackRate`, `muted` |
| `<Loop>` | Repeat children | `durationInFrames` or `times` | `durationInFrames`, `times`, `children` |
| `<Folder>` | Group compositions in the sidebar | `name`* | `name`*, `children` |
| `<Player>` (from `@remotion/player`) | Embed a Remotion video in a React app | `controls=false` | `component`*, `durationInFrames`*, `fps`*, `compositionWidth`*, `compositionHeight`*, `inputProps`, `controls`, `loop`, `autoPlay`, `style`, `className` |

| commands | description | default | options |
|---|---|---|---|
| `useCurrentFrame()` | Returns the current frame (0-indexed) | `0` at the first frame | - |
| `useVideoConfig()` | Returns `{width, height, fps, durationInFrames, id, defaultProps, props}` | the current composition's values | - |
| `useCurrentScale()` | Returns the current scale factor | `1` | - |
| `useDelayRender()` | Hook for scoped `delayRender/continueRender/cancelRender` | - | `delayRender(label?, options?)`, `continueRender(handle)`, `cancelRender(error)` |
| `registerRoot(component)` | Register the project's root component | must be called once | `component` (React component) |
| `interpolate(input, inputRange, outputRange, options)` | Map a value from one range to another | `easing: linear`, `extrapolate: 'extend'` | `easing`, `extrapolateLeft`, `extrapolateRight`, `output`, `posterize` |
| `interpolateColors(input, inputRange, outputRange)` | Interpolate between colors | linear | - |
| `spring({frame, fps, ...})` | Compute a spring animation (0 → 1) | `from=0`, `to=1`, `config` defaults | `config` (`stiffness`, `damping`, `mass`, `overshootClamping`), `durationInFrames`, `delay`, `reverse` |
| `measureSpring({...})` | Returns the number of frames the spring takes | - | same arguments as `spring()` |
| `Easing` | A set of easing functions | `Easing.linear` | `bezier`, `step1`, `back`, `bounce`, `circ`, `cubic`, `ease`, `elastic`, `expo`, `quad`, `quart`, `quint`, `sine`, `spring` |
| `random(seed?)` | Deterministic pseudo-random | random 0–1 | `seed` (number\|string) |
| `staticFile(path)` | Convert a `public/` path into a URL | returns `/static-<hash>/...` | `path` relative to `public/` |
| `getStaticFiles()` | Returns an array of files in `public/` | - | - |
| `watchStaticFile(path, options)` | Watch a static file and callback | - | `path`, `onUpdate` |
| `getInputProps()` | Returns input props from the CLI or SSR | `{}` if none | - |
| `getRemotionEnvironment()` | Returns the current environment | `'preview'` | - |
| `delayRender(label?, options?)` | Pause the render waiting for an async task | timeout 30000ms | `label`, `retries`, `timeout` |
| `continueRender(handle)` | Tell the render to continue | - | `handle` (from `delayRender`) |
| `cancelRender(err)` | Cancel the render when an error occurs | - | `error` |
| `calculateMetadata(function)` | `<Composition>` prop for dynamic metadata/props | - | `({defaultProps, props, abortSignal, compositionId, isRendering}) => {...}` |
