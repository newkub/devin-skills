# Use Case — Branded QR With a Centered Logo

> qrcode only draws modules. Putting a logo in the middle is an image-composition step on top of a high-error-correction code — and it is the step that most often breaks scanning. Source: https://github.com/soldair/node-qrcode (accessed 2026-10-20)

## 1. Generate with maximum redundancy first

```ts
import QRCode from "qrcode";

const width = 1024;

const png = await QRCode.toBuffer("https://example.com/i/abc123", {
  type: "png",
  errorCorrectionLevel: "H", // ~30% of the code may be covered
  margin: 4,
  width,
  color: { dark: "#111827ff", light: "#ffffffff" },
});
```

Level `H` is the only reason a logo is safe at all; at `L` even a small overlay can push the code past its recoverable damage. The `margin` is the quiet zone in modules and must survive branding — do not trim it.

## 2. Resize the logo before compositing

```ts
import sharp from "sharp";

const logoSize = Math.round(width * 0.2);

const logo = await sharp("assets/logo.png")
  .resize({ width: logoSize, height: logoSize, fit: "contain", background: "#ffffff00" })
  .png()
  .toBuffer();
```

`sharp` is a separate dependency — qrcode has no drawing API. Cap the logo at about 20% of the width, keep it square, and give a transparent PNG a white plate (section 3) so the modules behind it do not show through.

## 3. Composite a white plate, then the logo

```ts
const plateSize = logoSize + 32;

const plate = await sharp({
  create: {
    width: plateSize,
    height: plateSize,
    channels: 4,
    background: "#ffffffff",
  },
})
  .png()
  .toBuffer();

export const branded = await sharp(png)
  .composite([
    { input: plate, gravity: "centre" },
    { input: logo, gravity: "centre" },
  ])
  .png()
  .toBuffer();
```

Order matters: the plate is composited first, the logo second. The plate guarantees a light quiet area around the mark, which is what keeps the covered modules readable at the edges of the logo.

## 4. Keep the logo away from the finder patterns

```ts
// centre placement leaves the three corner squares untouched
{ input: logo, gravity: "centre", blend: "over" }
```

The three finder patterns (top-left, top-right, bottom-left) are how a scanner locates the code. A logo that overlaps any of them fails regardless of error correction — `gravity: "centre"` is the only safe default, and a wide banner across the middle is safer than a tall one that reaches a corner.

## 5. Serve the branded variant as a separate asset

```ts
return new Response(new Uint8Array(branded), {
  headers: {
    "content-type": "image/png",
    "cache-control": "public, max-age=86400, immutable",
  },
});
```

Branding is deterministic for the same text, logo, and options — cache it by content hash instead of re-compositing per request. Keep the unbranded generator available: a fallback is what you ship when a customer reports the code will not scan.

## 6. Verify

1. Scan the branded PNG with two different apps, at arm's length and up close
2. Cover ratio — the logo plus plate stays under roughly 20–25% of the QR area
3. Finder patterns — all three corners are fully visible and undamaged
4. Print the code at the shipped physical size and scan the print, not only the screen
5. Dark modules still darker than the logo's background, with no transparency showing through
6. Compare the branded and unbranded buffers — same dimensions, same module grid
7. `/run-test` — a snapshot asserting the output is a PNG of `width` × `width`

## Pitfalls

- Branding a level `M` or `L` code, then blaming the scanner when it fails in low light.
- A logo larger than a quarter of the area — error correction cannot recover that much damage.
- A transparent logo on a transparent plate, letting dark modules show through the mark.
- Off-centre placement that clips a finder pattern or the timing pattern between them.
- Downscaling the final PNG below one pixel per module — the modules blur together.
- Inverting colors (light modules on a dark plate) and expecting every scanner to cope.
- Generating the branded image on every request instead of caching the deterministic result.

## Related

- `references/apis.md`
- `best-practices/qr-generation.md`
- `usecases/qr-in-api-response.md`
- `usecases/print-labels-at-exact-size.md`
