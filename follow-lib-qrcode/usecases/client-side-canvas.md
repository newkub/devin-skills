# Use Case — Render in the Browser With a Canvas

> Generating in the browser avoids a round trip, but the canvas needs device-pixel sizing and the call must not run during server rendering. Source: https://github.com/soldair/node-qrcode#browser (accessed 2026-10-20)

## 1. Draw into a canvas element

```ts
import QRCode from "qrcode";

const canvas = document.querySelector<HTMLCanvasElement>("#qr");
if (!canvas) throw new Error("canvas not mounted");

await QRCode.toCanvas(canvas, "https://example.com/i/abc123", {
  errorCorrectionLevel: "M",
  margin: 2,
  width: 320,
});
```

`toCanvas` draws the modules and sets the canvas `width`/`height` attributes. The promise resolves after the draw, so `canvas.toDataURL()` is safe immediately after `await`.

## 2. Size for the device pixel ratio

```ts
const cssSize = 320;
const dpr = window.devicePixelRatio || 1;

await QRCode.toCanvas(canvas, text, {
  errorCorrectionLevel: "M",
  margin: 2,
  width: cssSize * dpr,
});

canvas.style.width = `${cssSize}px`;
canvas.style.height = `${cssSize}px`;
```

`width` is the backing-store size; the CSS size is what the user sees. Without the ratio, a phone renders a 320 px canvas across 960 device pixels and every module edge blurs — which is exactly where scanners start failing.

## 3. Regenerate on state change, not on every keystroke

```ts
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function QrPreview({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !url) return;

    const timer = setTimeout(() => {
      void QRCode.toCanvas(canvas, url, { width: 320, margin: 2 });
    }, 150);

    return () => clearTimeout(timer);
  }, [url]);

  return <canvas ref={canvasRef} />;
}
```

The effect body only runs in the browser, so the same component survives SSR. The debounce keeps a typing user from regenerating a code per character; the cleanup cancels a pending draw when the URL changes again.

## 4. Provide a download without a second endpoint

```ts
const dataUrl = canvas.toDataURL("image/png");
const link = document.createElement("a");
link.href = dataUrl;
link.download = "qr.png";
link.click();
```

The canvas already holds the rendered image — no server call, no blob URL to revoke. If the page has a strict CSP that blocks `data:` navigation, switch to `canvas.toBlob()` and `URL.createObjectURL(blob)`.

## 5. Generate for other outputs from the same text

```ts
const svg = await QRCode.toString(text, { type: "svg", margin: 2 });
const png = await QRCode.toDataURL(text, { width: 640, margin: 2 });
```

`toDataURL` is convenient for `<img src>` and email templates; `toCanvas` is for an interactive preview; `toString` gives markup you can print or store. All three take the same options, so the encoded payload stays identical between preview and download.

## 6. Verify

1. Open the page on a phone — the code scans from the screen at normal brightness
2. Zoom to 200% — module edges stay sharp, proving the canvas is not upscaled
3. Type in the input — the code updates after the debounce, not on every character
4. Clear the input — the old code is removed rather than left stale
5. Click download — the saved PNG matches the preview
6. Build and run the SSR page — no `document is not defined` during the server render
7. `/run-test` — a component test asserting the canvas gets a non-zero width in jsdom

## Pitfalls

- Calling `toCanvas` during SSR or at module scope — there is no `document` on the server.
- Forgetting the device pixel ratio, leaving a blurry preview on every retina screen.
- Setting only `style.width` and letting the backing store default to 300 × 150.
- Regenerating on every keystroke without a debounce, causing visible jank on low-end phones.
- Reading `toDataURL()` before the draw resolves — the canvas is still blank.
- Leaving the previous code on screen when the input becomes empty or invalid.
- Rendering the QR with CSS `width` but a fixed pixel `height`, which stretches modules out of square.
- Assuming the canvas is tainted — it is not, because nothing cross-origin is drawn into it.

## Related

- `references/apis.md`
- `best-practices/qr-generation.md`
- `usecases/qr-in-api-response.md`
- `usecases/print-labels-at-exact-size.md`
