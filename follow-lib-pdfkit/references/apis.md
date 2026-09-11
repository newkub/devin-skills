# Lib Pdfkit API & Dependencies

## Install

```sh
bun add pdfkit
bun add -D @types/pdfkit   # TypeScript
```

## Version

- Latest: `0.20.2` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/pdfkit)
- [Repository](https://github.com/foliojs/pdfkit)

## Dependencies

- Runtime: `fontkit`, `png-js`, `crypto-js` (embedded subset), `linebreak`, `vite-compatible-readable-stream`/`brotli`
- Browser: ใช้ bundle ที่แนบมา (`pdfkit.standalone.js`) + `blob-stream`

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `new PDFDocument()` | สร้าง doc | letter, margin 72 | `size`, `margins`, `layout`, `info` |
| `doc.text(str, x?, y?)` | เขียนข้อความ | flowing | `align`, `width`, `lineGap` |
| `doc.font(path).size(n)` | Font | Helvetica | registered fonts |
| `doc.image(src, x, y)` | ภาพ PNG/JPEG | - | `width`, `fit`, `align` |
| `doc.rect/circle/lineTo` | Vector drawing | - | `.fill`, `.stroke` |
| `doc.addPage()` | หน้าใหม่ | - | page opts |
| `doc.pipe(fs.createWriteStream)` + `doc.end()` | Output | - | - |

## Source

- Official docs: http://pdfkit.org
- Description: PDF generation library for Node and the browser.
