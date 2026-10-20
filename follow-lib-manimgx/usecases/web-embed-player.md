# Use Case — Embed a Scene in a Web Page

> Run the scene in the browser through `<manimgx-player>` with Pyodide and WebGPU, so there is no render server and no MP4 to ship. Source: https://manimgx.academa.ai/llms.txt (accessed 2026-10-20)

## 1. Install the browser package

```sh
npm install manimgx
```

```html
<script type="module">
  import "manimgx";
</script>
```

The import registers the custom element. It is a side-effect import — nothing to call, and the module must load as `type="module"` so the worker and WASM assets resolve.

## 2. Put the scene inline

```html
<manimgx-player autoplay>
  <script type="text/python">
import manimgx as m

class Hello(m.Scene):
    def construct(self):
        circle = m.Circle(radius=1.2, color=m.BLUE)
        label = m.Text("manimgx").scale(0.8)

        self.play(m.Create(circle))
        self.play(m.Write(label), run_time=1.5)
        self.wait(1)
  </script>
</manimgx-player>
```

The Python source lives in a `<script type="text/python">` child of the player, not in a file the page fetches. `autoplay` starts it on load; without it the player waits for its own control.

## 3. Serve it over HTTP

```sh
python -m http.server 8000
# then open http://localhost:8000
```

Opening the file with `file://` breaks the module and worker loading. Any static server works; there is no build step and no server-side rendering.

## 4. Check the runtime requirement first

The player needs WebGPU: Chrome/Edge 113+ and Safari 26+. The first visit downloads roughly 26 MB (Pyodide plus the engine), after which the browser caches it.

```ts
const supported = "gpu" in navigator;
if (!supported) document.querySelector("manimgx-player")?.remove();
```

A page that ships a player to a browser without WebGPU shows a blank rectangle. Detect, then fall back to the pre-rendered MP4 rather than leaving a hole in the layout.

## 5. Design within the current limits

- Shapes composed from other shapes (`Union`) are not supported in the browser
- Chinese, Japanese, and Korean characters do not render
- Everything runs on the visitor's GPU, so a scene that renders in seconds on a desktop may stutter on a laptop

Keep an embedded scene short — a few seconds of animation — and pre-render anything longer. A 60-second narration belongs in an MP4, not in Pyodide.

## 6. Decide between embed and MP4

| Need | Choose |
|------|--------|
| A visitor interacts, or the scene depends on page state | `<manimgx-player>` |
| A few seconds of animation on a modern browser | `<manimgx-player>` |
| Narration, captions, or a long sequence | `manimgx render` → MP4 |
| Must work on any device or older browser | MP4 |
| No server, but the scene is long | MP4 served as a static file |

## 7. Verify

1. `npm install manimgx` and the page loads with no console error about the custom element
2. Serve over HTTP — the player renders and the animation finishes
3. Open in a browser without WebGPU — the fallback path runs, not a blank box
4. Reload twice — the second load skips the 26 MB download (check the network panel)
5. A CJK label and a `Union` shape are absent from the scene, or replaced with supported constructs
6. `/run-verify` — no unused import and the page still builds

## Pitfalls

- Opening the page from `file://`, where the module and worker never load.
- Putting the Python in an external file and expecting the player to fetch it.
- Shipping a player to a browser without WebGPU and showing an empty box.
- Using `Union` or CJK text, both unsupported in the browser path.
- Embedding a narrated scene — voice belongs to the CLI render, not the player.
- Treating the 26 MB first load as free on a mobile connection.
- Debugging only in the desktop browser where the scene is fast enough to hide a bad layout.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/scene-authoring.md`
- `best-practices/inspect-and-render.md`
- `usecases/first-math-scene.md`
- `usecases/narrated-video.md`
