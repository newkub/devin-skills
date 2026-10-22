# Use Case — Clickable Links, Annotations, and Document Metadata

> A PDF that a reader can navigate — title in the viewer, links that open, an outline in the sidebar — is metadata and annotation work on top of the same drawing code. Source: https://pdfkit.org/docs/annotations.html (accessed 2026-10-20)

## 1. Declare the document info at construction

```ts
import PDFDocument from "pdfkit";

const doc = new PDFDocument({
  size: "A4",
  margin: 56,
  compress: true,
  pdfVersion: "1.7",
  info: {
    Title: "Invoice 1042 — Acme Ltd",
    Author: "Acme Ltd",
    Subject: "Invoice for March 2026",
    Keywords: "invoice, acme, 2026",
    Creator: "billing-service",
  },
});

doc.pipe(response);
```

`info` lands in the PDF trailer and is what viewers show in the title bar and the document properties panel. Set it at construction — writing it afterwards means every stream already produced missed it. `compress: true` is the default; keep it explicit when file size matters.

## 2. Inline links on text

```ts
doc.font("body").fontSize(11);
doc.fillColor("#2563eb").text("View the order in the dashboard", {
  link: "https://app.example.com/orders/1042",
  underline: true,
});

doc.fillColor("#111827").text("Questions? ", { continued: true });
doc.fillColor("#2563eb").text("support@example.com", {
  link: "mailto:support@example.com",
  underline: true,
});
```

`link` on `text()` covers exactly the text run — the annotation rectangle is measured for you. Pair it with `underline: true` (or a link-colored fill) so the reader knows it is clickable before hovering. Set `fillColor` back afterwards; text color is part of the graphics state and carries forward.

## 3. Links on a measured rectangle

```ts
const label = "Download the signed copy (PDF, 240 KB)";
const w = doc.widthOfString(label);
const h = doc.currentLineHeight();

const x = doc.x;
const y = doc.y;
doc.text(label);
doc.link(x, y, w, h, "https://app.example.com/invoices/1042.pdf");
```

`doc.link(x, y, w, h, url)` places a rectangle annotation at an absolute position. `widthOfString` and `currentLineHeight` use the currently selected font and size, so call them after `font()`/`fontSize()` and before the text advances the cursor. Capture `doc.x`/`doc.y` before `text()` — after it, the cursor has already moved to the next line.

## 4. Highlights and other annotation types

```ts
const noteText = "Payment is due within 14 days.";
const noteWidth = doc.widthOfString(noteText);
const noteY = doc.y;

doc.text(noteText);
doc.highlight(56, noteY, noteWidth, doc.currentLineHeight());

doc.note(56, doc.y + 8, 120, 24, "Escalate after 30 days");
```

`highlight`, `underline`, and `strike` mark up existing text without changing it; `note` adds a sticky note, `rectAnnotation`/`ellipseAnnotation`/`lineAnnotation` draw callout shapes, and `textAnnotation` places free text on top of the page. Measure and capture `doc.y` before `text()` — after it the cursor has already advanced past the line you want to mark. Annotations stack in the order they are added, so a later `highlight` can cover an earlier `link`; add the link last when they overlap.

## 5. Build the outline for the sidebar

```ts
const sectionPages: Record<string, number> = {};

doc.addPage();
sectionPages["Line items"] = doc.bufferedPageRange().start;

doc.outline.addItem("Invoice 1042");
doc.outline.addItem("Line items", {
  pageNumber: sectionPages["Line items"],
  expanded: true,
  fit: true,
});
doc.outline.addItem("Terms", { pageNumber: doc.bufferedPageRange().start });
```

`doc.outline.addItem(title, options)` appends to the bookmark tree; `pageNumber` is zero-based, so record it when the section starts. `expanded: true` opens the node in the viewer's sidebar. The `fit`/`top`/`left`/`zoom` options control the destination view — `fit: true` scales the page to the window, `top`/`left` scroll to a coordinate, and `zoom` sets an explicit factor.

## 6. Know what pdfkit does not produce

```ts
// pdfkit does not emit tagged PDF / structure tree.
// For PDF/UA or Section 508 output, render HTML instead:
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
const pdf = await page.pdf({ format: "A4", tagged: true, outline: true });
```

Metadata, links, and outlines are supported; the accessibility structure tree (reading order, alt text per element, table headers) is not. If the deliverable must pass a PDF/UA check, generate it from HTML with a browser or a dedicated converter and keep pdfkit for documents where visual fidelity matters more than tagging.

## 7. Verify

1. Open the file — the window title and the properties panel show `Title`/`Author` from `info`
2. Click each link — it opens the URL, and the click area matches the visible text (not a neighbouring line)
3. Hover the highlighted sentence — the annotation sits over the text, not offset by one line height
4. The sidebar shows the outline with the same titles as the sections, and `Line items` opens expanded
5. Jump to a section from the outline — the destination page matches `pageNumber`
6. `pdfinfo invoice.pdf` — `Tagged: no` is expected; if the spec requires `yes`, switch to the HTML pipeline
7. `/run-test` — a fixture asserting the byte stream contains the `/Outlines` object and the link URI

## Pitfalls

- Setting `info` after `doc.end()` (or after piping) — the trailer is already written.
- Measuring with `widthOfString` before `font()`/`fontSize()`, so the link rectangle belongs to the previous run.
- Capturing `doc.x`/`doc.y` after `text()` instead of before — the rectangle lands one line low.
- Adding a `highlight` after a `link` over the same words, which swallows the click.
- Passing a one-based page number to `outline.addItem` — bookmarks point one page off.
- Expecting a tagged, screen-reader-friendly PDF from pdfkit — it has no structure tree.
- Leaving `compress: false` on high-volume invoices, producing multi-megabyte files with no visual gain.
- Putting secrets or internal ids in `Subject`/`Keywords` — metadata travels with the file wherever it is forwarded.

## Related

- `references/apis.md`
- `best-practices/pdf-generation.md`
- `usecases/multi-page-report.md`
- `usecases/vector-drawings-and-charts.md`
- `usecases/fonts-and-text-encoding.md`
