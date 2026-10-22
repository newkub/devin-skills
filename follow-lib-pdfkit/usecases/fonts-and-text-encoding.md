# Use Case — Fonts, Mixed Scripts, and Text That Wraps

> The built-in Helvetica cannot encode Thai, CJK, or emoji, and pdfkit wraps on spaces — so embedding the right font and pre-checking the width is what keeps a generated document readable. Source: https://pdfkit.org/docs/text.html (accessed 2026-10-20)

## 1. Register a family once

```ts
import PDFDocument from "pdfkit";

const doc = new PDFDocument({ size: "A4", margin: 56 });

doc.registerFont("body", "assets/fonts/Inter-Regular.ttf");
doc.registerFont("body-bold", "assets/fonts/Inter-Bold.ttf");
doc.registerFont("body-italic", "assets/fonts/Inter-Italic.ttf");
doc.registerFont("thai", "assets/fonts/NotoSansThai-Regular.ttf");

doc.font("body").fontSize(11);
```

`registerFont(name, path)` maps a name to a file; `doc.font(name)` selects it. Registering the same file twice per page is wasted I/O — do it once, right after creating the document. Ship the font files with the deployment; a missing path throws at generation time, not at build time.

## 2. Use the family variants explicitly

```ts
doc.font("body-bold").fontSize(18).text("Invoice 1042");
doc.font("body").fontSize(10).text("Payment due within 14 days.");
doc.font("body-italic").text("Late payments incur a 2% fee.");
```

There is no synthetic bold you should rely on. If `body-bold.ttf` is missing, the PDF falls back to a standard font and the layout shifts; register every weight you use.

## 3. Mix fonts inside one line

```ts
doc.font("body").text("Total: ", { continued: true });
doc.font("body-bold").text("$1,240.00");
```

`continued: true` keeps the cursor on the same line so the next `text()` call starts where the previous run ended. Forgetting it produces two lines; leaving it `true` at the end of a paragraph merges the following paragraph into that line.

## 4. Measure before you place

```ts
const width = doc.widthOfString("Order #1042");
const lineHeight = doc.currentLineHeight();
const blockHeight = doc.heightOfString(longPolicyText, { width: 460, lineGap: 2 });

doc.text("Order #1042", 56, 40, { width, align: "right" });
```

`widthOfString` uses the currently selected font and size, so call it after `font()` and `fontSize()`. `heightOfString` answers "will this paragraph fit before the footer" — the same question `doc.y > page.height - margin` answers later, but in time to prevent overflow.

## 5. Wrap, truncate, and control spacing

```ts
doc.font("body").fontSize(10).text(description, {
  width: 460,          // without width, text does not wrap
  align: "justify",
  lineGap: 2,
  ellipsis: true,      // truncate instead of overflowing the block
  height: 48,          // hard limit; requires ellipsis or the text is clipped silently
});

doc.text("SPACED HEADING", { characterSpacing: 1.5 });
```

`width` is what turns on wrapping. `height` alone clips; combined with `ellipsis` it truncates cleanly at the last fitting line.

## 6. Handle scripts the standard fonts cannot encode

```ts
try {
  doc.font("Helvetica").text("สวัสดี");
} catch (error) {
  // WinAnsi cannot encode this character
  doc.font("thai").text("สวัสดี");
}
```

The 14 built-in fonts use WinAnsiEncoding — Latin-1 plus a few symbols. Thai, Chinese, Japanese, Korean, Cyrillic, Arabic, and emoji all fail or render as blanks with them. Embed a TTF/OTF that covers the script and select it before writing that run.

Two limits worth knowing before promising a multilingual PDF:

- pdfkit has no shaping engine — combining marks, ligatures, and context-dependent forms are mapped glyph by glyph. Verify stacked vowels and tone marks visually instead of assuming they render like a browser.
- Line breaking is space-based, so scripts written without spaces (Thai, CJK) will not wrap inside a narrow column. Insert explicit breaks, or pre-wrap the text before passing it in.

## 7. Keep the file size sane

```ts
doc.registerFont("body", "assets/fonts/Inter-Regular.ttf");
// pdfkit subsets the embedded font to the glyphs actually used
for (const line of lines) doc.text(line);
```

Embedding a font stores only the glyphs the document used, so a 300 KB TTF with 40 distinct glyphs adds far less than 300 KB. Reusing one registration across pages keeps the subset shared; registering a new copy per page duplicates it.

## 8. Verify

1. Render a page of Latin text at 11 pt — no clipped descenders and no line overlapping the footer
2. Write Thai or Chinese with `Helvetica` — it throws or blanks; select the embedded font and it renders
3. `widthOfString("Order #1042")` then place a right-aligned label — it ends exactly at the margin
4. A paragraph longer than its `height` with `ellipsis: true` — it ends with an ellipsis, not mid-word
5. Mixed-font line with `continued: true` — `Total: **$1,240.00**` sits on one baseline
6. File size with a 40-glyph page vs a 400-glyph page — the subset grows with the glyphs used, not with the file
7. `/run-test` — a fixture comparing `heightOfString` with the actual block height

## Pitfalls

- Relying on the default Helvetica for non-Latin content, then shipping a PDF full of `?` or blanks.
- Calling `widthOfString` before `font()`/`fontSize()`, so the measurement belongs to the previous run.
- `doc.text(longString)` without `width` — it runs off the right edge instead of wrapping.
- `height` without `ellipsis` — the overflow is clipped with no indication that content is missing.
- Leaving `continued: true` on the last run of a paragraph.
- Fetching fonts over the network at request time; a slow CDN becomes a failed invoice.
- Embedding a font whose license forbids redistribution inside documents.
- Expecting browser-grade shaping for Arabic or Devanagari — test the actual output before committing to it.

## Related

- `references/apis.md`
- `best-practices/pdf-generation.md`
- `usecases/multi-page-report.md`
- `usecases/vector-drawings-and-charts.md`
