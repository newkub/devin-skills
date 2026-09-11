# Lib Pdfkit Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs site | http://pdfkit.org |
| Getting started | http://pdfkit.org/docs/getting_started.html |
| Text | http://pdfkit.org/docs/text.html |
| Images | http://pdfkit.org/docs/images.html |
| Vector graphics | http://pdfkit.org/docs/vector.html |
| Fonts | http://pdfkit.org/docs/text.html#fonts |
| Demo | http://pdfkit.org/demo/out.pdf |

## Key Concepts

- Streaming API: `doc.pipe(stream)` → เรียก methods → `doc.end()`
- Text flow: auto pagination เมื่อ `text` เกินหน้า — ควบคุมด้วย `continued`, `pageBreakBefore`
- Custom fonts: `.ttf/.otf` ผ่าน `doc.registerFont(name, path)` (ต้องมี fontkit)
- ไม่รองรับ HTML→PDF — ถ้าต้องการให้ใช้ Playwright `page.pdf()` แทน
