# Use Case — Inline SVG and Terminal Output

> Render a QR as markup that never blurs, or print one straight to the terminal for a manual scan. Source: https://github.com/soldair/node-qrcode (accessed 2026-10-20)

## 1. Emit an inline SVG

```ts
import QRCode from "qrcode";

const svg = await QRCode.toString("https://example.com/invite/abc123", {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
});
```

`toString` resolves to the markup itself, so it can be embedded in a server-rendered page without a second request.

## 2. Embed it in HTML safely

```ts
function qrCard(svg: string) {
  return `<figure class="qr">${svg}<figcaption>Scan to join</figcaption></figure>`;
}
```

The SVG comes from your own library call, not from user input — never interpolate untrusted text into markup; the input is the encoded data, not HTML.

## 3. Or render with an `<img>` data URL

```ts
const dataUrl = await QRCode.toDataURL("https://example.com/invite/abc123", {
  margin: 2,
  width: 320,
});
```

Data URLs are convenient for email templates where SVG support is inconsistent, at the cost of a larger string.

## 4. Print one in the terminal

```sh
bunx qrcode "https://example.com/invite/abc123"
```

The CLI prints a block-character QR block plus the encoded text. Add `--small` for a compact version when the terminal is narrow.

## 5. Use it for a local handoff

```ts
console.error(await QRCode.toString(localUrl, { type: "terminal", small: true }));
```

A CLI that prints a URL can print a scannable code instead — one command, no copy-paste between machines.

```sh
# in a dev script
bun run src/print-qr.ts "http://192.168.1.20:5173"
```

## Pitfalls

- Expecting a file path from `toString` — it returns a string, nothing is written to disk.
- Terminal output needs a dark background and a monospace font; some themes render the blocks inverted.
- `small: true` halves the block size and hurts scanning from a photo of the screen — use it only for manual viewing.
- Embedding an SVG string into HTML through user input opens an XSS hole; keep the encoded value data-only.
- Data URLs inflate email size; keep `width` modest when generating many codes.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/qr-generation.md`
- `usecases/qr-in-api-response.md`
