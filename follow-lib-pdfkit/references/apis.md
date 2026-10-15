| key | value |
|---|---|
| version | 0.20.2 |
| package registry | https://www.npmjs.com/package/pdfkit |
| repository | https://github.com/foliojs/pdfkit |
| docs | http://pdfkit.org |

| api | description | default | options |
|---|---|---|---|
| `new PDFDocument()` | create doc | letter, margin 72 | `size`, `margins`, `layout`, `info` |
| `doc.text(str, x?, y?)` | write text | flowing | `align`, `width`, `lineGap` |
| `doc.font(path).size(n)` | Font | Helvetica | registered fonts |
| `doc.image(src, x, y)` | PNG/JPEG image | - | `width`, `fit`, `align` |
| `doc.rect/circle/lineTo` | Vector drawing | - | `.fill`, `.stroke` |
| `doc.addPage()` | new page | - | page opts |
| `doc.pipe(fs.createWriteStream)` + `doc.end()` | Output | - | - |
