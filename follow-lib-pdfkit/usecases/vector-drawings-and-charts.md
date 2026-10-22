# Use Case — Vector Drawings and Charts

> Draw bars, line series, and transformed shapes on the page canvas. Source: https://pdfkit.org/docs/vector.html (accessed 2026-10-22)

## 1. Draw a bar chart

```ts
import PDFDocument from "pdfkit";

type Point = { label: string; value: number };

function drawBarChart(
  doc: PDFKit.PDFDocument,
  data: Point[],
  box: { x: number; y: number; width: number; height: number },
) {
  const max = Math.max(...data.map((d) => d.value));
  const slot = box.width / data.length;
  const barWidth = slot * 0.6;

  doc.save().lineWidth(1).strokeColor("#94a3b8");
  doc.moveTo(box.x, box.y + box.height).lineTo(box.x + box.width, box.y + box.height).stroke();
  doc.moveTo(box.x, box.y).lineTo(box.x, box.y + box.height).stroke();

  for (const [i, d] of data.entries()) {
    const height = (d.value / max) * box.height;
    const x = box.x + i * slot + (slot - barWidth) / 2;
    const y = box.y + box.height - height;

    doc.rect(x, y, barWidth, height).fill("#3b82f6");
    doc.fontSize(8).fillColor("#334155");
    doc.text(d.label, x, box.y + box.height + 6, { width: barWidth, align: "center" });
    doc.text(String(d.value), x, y - 12, { width: barWidth, align: "center" });
  }

  doc.restore();
}
```

pdfkit's origin is the top-left corner, so invert each value (`box.y + box.height - height`) to make bars grow upward.

## 2. Stroke a line series and fill the area

```ts
const values = [12, 18, 9, 24, 20, 31];
const plot = { x: 56, y: 80, width: 400, height: 160 };
const max = Math.max(...values);
const step = plot.width / (values.length - 1);
const points = values.map(
  (v, i) => [plot.x + i * step, plot.y + plot.height - (v / max) * plot.height] as const,
);

doc.save();
doc.moveTo(points[0][0], plot.y + plot.height);
for (const [x, y] of points) doc.lineTo(x, y);
doc.lineTo(points[points.length - 1][0], plot.y + plot.height);
doc.closePath().fillOpacity(0.15).fill("#2563eb");

doc.lineWidth(2).lineCap("round").lineJoin("round").strokeColor("#2563eb");
doc.moveTo(points[0][0], points[0][1]);
for (const [x, y] of points.slice(1)) doc.lineTo(x, y);
doc.stroke();
doc.restore();
```

`fill()` and `stroke()` paint and clear the current path — build the area path, paint it, then build the line path separately.

## 3. Group shapes with save/restore and transforms

```ts
for (let i = 0; i < 6; i++) {
  doc.save();
  doc.translate(300, 140).rotate(-30, { origin: [0, 0] });
  doc.rect(i * 18, i * 18, 40, 12).fillAndStroke("#fde68a", "#92400e");
  doc.restore();
}
```

`save()`/`restore()` bracket the graphics state — transforms, colors, line styles, and opacity set inside the block do not leak into later text or shapes. `rotate(angle, { origin })` rotates around a page coordinate, not the shape center; translate first to rotate around a local point.

## 4. Style strokes and fills

```ts
doc.save();
doc.lineWidth(2).dash(6, { space: 3 }).strokeColor("#64748b");
doc.moveTo(56, 360).lineTo(456, 360).stroke();
doc.undash();

const gradient = doc.linearGradient(56, 0, 456, 0);
gradient.stop(0, "#2563eb").stop(1, "#10b981");
doc.rect(56, 380, 400, 24).fill(gradient);

doc.circle(256, 440, 40).clip();
doc.rect(196, 380, 120, 120).fill("#f59e0b");
doc.restore();
```

`dash()` stays active until `undash()`, gradient coordinates are absolute page points (unaffected by a later transform), and `clip()` constrains everything drawn after it until the state is restored.

## 5. Verify the output

```ts
doc.end();
```

Render the PDF and inspect a chart page before shipping — check that bars are not inverted, labels do not overlap, and no blank page appeared. With `bufferPages: true`, tests can assert `bufferedPageRange().count`.

## Pitfalls

- Treating coordinates as a math plot with y growing upward — pdfkit is top-left origin, so subtract from the baseline.
- Chaining `rect()`/`lineTo()` without `fill()`/`stroke()` — unpainted subpaths merge into the next painted shape.
- Forgetting `restore()` after `save()` — the transform/color/clip stack leaks into subsequent text and page stamps.
- Rotating labels without `save()`/`restore()` — the rotation persists for the rest of the document.
- Using `dash()` without `undash()` — later borders and rules become dashed.
- Clipping without restoring — page numbers, headers, and footers drawn afterward get clipped away.
- Building charts from thousands of raw points — downsample first; oversized paths inflate PDF size and render slowly.

## Related

- `references/apis.md`
- `best-practices/pdf-generation.md`
- `usecases/multi-page-report.md`
