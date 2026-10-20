# Use Case — Multi-Page Report with Headers and Footers

> Produce a paginated report where every page carries the same header/footer, with custom fonts and images. Source: https://github.com/foliojs/pdfkit (accessed 2026-10-20)

## 1. Enable page buffering and register fonts

```ts
import PDFDocument from "pdfkit";

const doc = new PDFDocument({
  size: "A4",
  margin: 56,
  bufferPages: true, // required for bufferedPageRange()
});

doc.registerFont("body", "assets/fonts/Inter-Regular.ttf");
doc.registerFont("bold", "assets/fonts/Inter-Bold.ttf");
doc.font("body");
```

`bufferPages` keeps every page addressable so you can return and stamp footers after the body is written.

## 2. Write the body in one pass

```ts
doc.font("bold").fontSize(18).text(report.title);
doc.moveDown(0.5);
doc.font("body").fontSize(10).fillColor("#444").text(report.summary);

for (const section of report.sections) {
  doc.moveDown();
  doc.font("bold").fontSize(13).fillColor("#000").text(section.heading);
  doc.moveDown(0.25);
  doc.font("body").fontSize(10).fillColor("#333").text(section.body, { align: "justify" });
}
```

Text flows onto new pages automatically once the cursor reaches the bottom margin — do not compute page breaks by hand.

## 3. Stamp header and footer on every buffered page

```ts
const range = doc.bufferedPageRange();
const generatedAt = new Date().toISOString();

for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);

  // stop auto page-breaks while drawing in the margin
  const bottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  doc.font("body").fontSize(8).fillColor("#777");
  doc.text(report.title, 56, 32, { width: doc.page.width - 112, align: "left" });
  doc.text(`Page ${i + 1} of ${range.count}`, 56, doc.page.height - 40, {
    width: doc.page.width - 112,
    align: "right",
  });

  doc.page.margins.bottom = bottom;
}
```

Resetting `page.margins.bottom` around the footer write is what prevents an extra blank page per stamped page.

## 4. Add a cover image and a totals table

```ts
doc.image("assets/cover.png", { fit: [doc.page.width - 112, 220], align: "center" });
doc.moveDown();

const columns = [220, 80, 80];
const headers = ["Item", "Qty", "Total"];
doc.font("bold");
headers.forEach((h, i) => doc.text(h, 56 + columns.slice(0, i).reduce((a, b) => a + b, 0), doc.y, { width: columns[i] }));
doc.moveDown(0.5);
doc.font("body");
for (const row of report.rows) {
  const y = doc.y;
  doc.text(row.item, 56, y, { width: columns[0] });
  doc.text(String(row.qty), 276, y, { width: columns[1] });
  doc.text(row.total.toFixed(2), 356, y, { width: columns[2] });
}
```

Position each cell at an absolute `y` captured once per row — chained `text()` calls advance the cursor and stagger the columns.

## 5. Finish and verify the page count

```ts
doc.end();

const pages = doc.bufferedPageRange().count;
console.error({ pages, bytes: "see stream" });
```

## Pitfalls

- Calling `bufferedPageRange()` without `bufferPages: true` only ever reports the current page.
- Writing a footer without zeroing `page.margins.bottom` appends a blank page for every page stamped.
- Registering a font family without the bold/italic variants and then calling `.bold()` silently falls back to a synthetic face.
- Laying out table cells with `continued: true` across many rows drifts because each `text()` advances `doc.y`.
- Embedding a large PNG without resizing inflates the PDF; compress with `sharp` first or set `fit`.
- Not licensing the embedded font — check the font's redistribution terms before shipping the PDF.

## Related

- `references/apis.md`
- `best-practices/pdf-generation.md`
- `usecases/stream-pdf-from-route.md`
