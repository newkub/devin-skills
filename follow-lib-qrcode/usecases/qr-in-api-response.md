# Use Case — QR Code in an API Response

> Return a scannable QR image from a route, sized and error-corrected for real phone cameras. Source: https://github.com/soldair/node-qrcode (accessed 2026-10-20)

## 1. Generate a PNG buffer on the server

```ts
import QRCode from "qrcode";

export async function createQrPng(text: string) {
  return QRCode.toBuffer(text, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: { dark: "#000000ff", light: "#ffffffff" },
  });
}
```

`width` is the rendered pixel size and `margin` is the quiet zone in modules. A margin below 2 is the most common reason a printed code will not scan.

## 2. Publish it as an image response

```ts
import { Hono } from "hono";

const app = new Hono();

app.get("/qr", async (c) => {
  const target = c.req.query("url");
  if (!target) return c.json({ error: "url is required" }, 400);

  const png = await createQrPng(target);
  return new Response(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=3600",
    },
  });
});
```

Wrapping the buffer in `Uint8Array` keeps the body a valid `BodyInit` on every runtime.

## 3. Offer a download instead of inline display

```ts
return new Response(new Uint8Array(png), {
  headers: {
    "content-type": "image/png",
    "content-disposition": 'attachment; filename="qr.png"',
  },
});
```

## 4. Raise error correction when a logo sits on top

```ts
const png = await QRCode.toBuffer(url, { errorCorrectionLevel: "H", margin: 4, width: 1024 });
```

`H` tolerates roughly 30% damage — the level to pick when you overlay a logo, not because "higher is better". Higher levels reduce real capacity, so long URLs may overflow.

## 5. Validate the payload before generating

```ts
if (target.length > 1000) return c.json({ error: "payload too large for a reliable scan" }, 422);
```

Keep the encoded text short — a QR code at 4 KB needs a high module count and becomes hard to scan at normal print size.

## Pitfalls

- Returning the `Buffer` directly on a Web-standard runtime sends a JSON-shaped object instead of bytes.
- A `margin` of 0–1 removes the quiet zone, so scanners fail even though the image looks fine on screen.
- Encoding a huge JSON blob produces an unscannable grid; encode an ID or a short URL instead.
- Choosing `errorCorrectionLevel: "L"` under a logo produces codes that fail in poor lighting.
- Forgetting `content-type` makes browsers download the file instead of rendering it inline.
- Generating a fresh code per request with no caching burns CPU on an endpoint that is trivially cacheable.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/qr-generation.md`
- `usecases/qr-svg-and-terminal.md`
