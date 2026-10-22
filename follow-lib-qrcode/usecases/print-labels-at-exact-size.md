# Use Case — Print Labels at an Exact Physical Size

> On screen one pixel is one pixel; on paper the code has to come out at a measured size. The conversion from millimetres and the quiet zone are what decide whether the printed label scans. Source: https://github.com/soldair/node-qrcode (accessed 2026-10-20)

## 1. Convert millimetres to pixels for raster output

```ts
const DPI = 300;

const mmToPx = (mm: number) => Math.ceil((mm / 25.4) * DPI);

const qrPx = mmToPx(30); // 30 mm at 300 DPI → 355 px

const png = await QRCode.toBuffer("https://example.com/t/1042", {
  type: "png",
  errorCorrectionLevel: "Q",
  margin: 2,
  width: qrPx,
});
```

`width` is pixels and `margin` is modules, not millimetres. At 30 mm with a 25-module code, one module is about 1.2 mm — so `margin: 2` gives roughly a 2.4 mm quiet zone, which is what scanners expect.

## 2. Prefer SVG and size it in the layout

```ts
const svg = await QRCode.toString("https://example.com/t/1042", {
  type: "svg",
  errorCorrectionLevel: "Q",
  margin: 2,
});
```

```html
<div class="label">
  <div class="qr" style="width: 30mm; height: 30mm">{svg}</div>
  <span class="code">#1042</span>
</div>
```

An inline SVG has no fixed pixel grid, so the printer renders it at its native resolution and there is no DPI math to get wrong. Give the wrapper an explicit millimetre size; an SVG without dimensions collapses or stretches.

## 3. Lay out a sheet that survives page breaks

```html
<style>
  @page { size: A4; margin: 8mm; }
  .sheet { display: grid; grid-template-columns: repeat(3, 50mm); gap: 4mm; }
  .label { width: 50mm; height: 30mm; break-inside: avoid; display: flex; align-items: center; gap: 3mm; }
  .qr { width: 26mm; height: 26mm; flex: none; }
  .code { font: 600 9pt/1.2 ui-monospace, monospace; }
</style>
```

`break-inside: avoid` keeps a label from splitting across two pages, and millimetre units in the grid mean the sheet still measures correctly when the printer scales by 100%.

## 4. Generate the sheet from data, not by hand

```ts
import QRCode from "qrcode";

const cells = await Promise.all(
  tickets.map(async (t) => {
    const svg = await QRCode.toString(t.url, { type: "svg", margin: 2, errorCorrectionLevel: "Q" });
    return `<li class="label"><div class="qr">${svg}</div><span class="code">${escapeHtml(t.code)}</span></li>`;
  }),
);

const html = `<ul class="sheet">${cells.join("")}</ul>`;
```

The SVG comes from your own call, but the ticket code is data — escape it before interpolating. For hundreds of labels, generate once and cache the HTML; the output is deterministic for the same inputs.

## 5. Write files directly when labels are assets

```ts
await QRCode.toFile(`out/labels/${ticket.code}.png`, ticket.url, {
  type: "png",
  width: mmToPx(30),
  margin: 2,
  errorCorrectionLevel: "Q",
});
```

`toFile` resolves after the file is written — useful for a batch job that hands a folder to a print service. Keep the file name derived from a safe id, never from user text.

## 6. Verify

1. Print at 100% scale, not "fit to page" — measure one 30 mm label with a ruler
2. Scan every label on the first sheet with a phone, including the ones at the page edges
3. Quiet zone — at least 2 mm of white around each code, with nothing printed over it
4. The code is not stretched: the QR is square inside its box
5. Font size on the caption is legible at arm's length, and the caption does not touch the code
6. Page breaks — no label is split between two pages
7. `/run-test` — a test asserting `mmToPx(30)` and the label grid dimensions in the generated HTML

## Pitfalls

- Forgetting the DPI conversion and printing a 355 px image as 355 mm, or a 90 px code at 30 mm.
- Printer scaling set to "fit to page", which silently shrinks every label by a few percent.
- Treating `margin` as millimetres — it is measured in modules, so the quiet zone scales with the code.
- A CSS rule that crops the wrapper, cutting the quiet zone to the code edge.
- Dark mode, print styles, or a color filter inverting the code to light-on-dark.
- A caption or border overlapping the code area, which counts as damage.
- Regenerating hundreds of codes per page load instead of caching the deterministic output.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/qr-generation.md`
- `usecases/branded-qr-with-logo.md`
