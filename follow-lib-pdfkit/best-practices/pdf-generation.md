# Best Practices: pdfkit (Server PDF Generation)

Guidance for building PDFs with pdfkit so the layout is correct, streams don't hang, and files don't bloat

## Recommended Patterns

- Create `new PDFDocument({size, margins, info})` then `doc.pipe(stream)` right away — output is a stream, not one big buffer
- Manual positioning: `doc.text()` flows continuously, `doc.rect`/`circle`/`lineTo` for vector — check the cursor `doc.x`/`doc.y` before writing
- Register a font once with `doc.registerFont(name, path)` then reference it with `doc.font(name)` — font licensing must allow embedding
- Multi-page headers/footers: use `doc.bufferedPageRange()` then `switchToPage(i)` to draw retroactively
- Always finish with `doc.end()` — forgetting it = hung stream, unsent response, memory leak
- Test by opening the real PDF — layout overflow, missing fonts, and wrong page breaks only show up when rendered

## Do / Don't

| Do | Don't |
|---|---|
| `doc.pipe(res)` + `Content-Type: application/pdf` for HTTP | buffer the whole file in memory then send at once |
| Use `bufferedPageRange` for page numbers | draw footers at addPage time (page count not known yet) |
| Compress images before embedding | embed full-size PNGs in the PDF |
| Handle the `doc` error event + stream error | assume the pipe always succeeds |
| Use `doc.end()` in finally/always | forget end → corrupt file/hung response |
| Choose pdfkit when layout must be programmatic | use pdfkit when the content is HTML — use Playwright `page.pdf()` |

## Common Pitfalls

- pdfkit needs a Node runtime — not edge/workerd; use a separate service or pre-render
- Wrong/missing font path in production — register with an absolute path from the project root
- Text overflow — `doc.text` does not auto-wrap unless `width` is set; check with `doc.widthOfString`
- Wrong page breaks — call `doc.addPage` when `doc.y` exceeds the printable area; compute margins before writing
- Large images bloat the PDF — compress/resize before `doc.image()`; `fit`/`width` limit the display size
- Forgetting to await stream finish after `doc.end()` in an async handler — the response may cut off mid-stream

## Performance Notes

- Stream output — no need to buffer the whole PDF; pipe directly to file/response
- Font subsetting: pdfkit embeds only the glyphs used — large fonts stay acceptable when few glyphs are needed
- Reuse font objects — `registerFont` once; don't re-register per page
- Complex vector work with thousands of paths is slow — consider rasterizing or simplifying
- Generation is CPU-bound sync — in request handlers, use a queue/background job for large PDFs

## Ecosystem / Integration

- HTML → PDF → Playwright `page.pdf()` (not pdfkit)
- Storage: pipe into `fs.createWriteStream` or an object-storage stream
- Fonts: bundle in the repo (check the license) or a mounted path — never fetch fonts at runtime from the network
- Testing: generate → assert file size/header, or snapshot-compare samples
