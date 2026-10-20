# Use Case — Stream a PDF From a Route

> Generate a document on demand and return it as a real download without buffering the whole file in memory twice. Source: https://github.com/foliojs/pdfkit (accessed 2026-10-20)

## 1. Install for TypeScript

```sh
bun add pdfkit
bun add -D @types/pdfkit
```

pdfkit needs the Node runtime — plan for a Node/Bun service, not an edge worker.

## 2. Draw the document

```ts
import PDFDocument from "pdfkit";

export function buildInvoice(invoice: Invoice): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: "A4", margin: 48, info: { Title: `Invoice ${invoice.id}` } });

  doc.fontSize(20).text(`Invoice ${invoice.id}`);
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#555").text(`Issued ${invoice.issuedAt}`);
  doc.moveDown();

  doc.fillColor("#000").fontSize(12);
  for (const line of invoice.lines) {
    doc.text(`${line.description}  x${line.qty}`, 48, doc.y, { continued: true, width: 380 });
    doc.text(line.total.toFixed(2), { align: "right" });
  }

  doc.moveDown();
  doc.fontSize(14).text(`Total ${invoice.total.toFixed(2)}`, { align: "right" });

  doc.end(); // required — without it the stream never finishes
  return doc;
}
```

`doc.y` is the current cursor; passing `continued: true` keeps the value on the same line as the label.

## 3. Pipe it in a Node handler

```ts
import type { Request, Response } from "express";
import { buildInvoice } from "./invoice-pdf";

export function getInvoice(req: Request, res: Response) {
  res.setHeader("content-type", "application/pdf");
  res.setHeader("content-disposition", `attachment; filename="invoice-${req.params.id}.pdf"`);

  const doc = buildInvoice(loadInvoice(req.params.id));
  doc.pipe(res);
}
```

`pipe` streams page by page, so memory stays flat regardless of document length.

## 4. Buffer it for a fetch-style handler

```ts
export async function handle(request: Request): Promise<Response> {
  const doc = buildInvoice(await loadInvoice(request));
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<void>((resolve) => doc.on("end", () => resolve()));

  doc.end();
  await done;

  return new Response(Buffer.concat(chunks), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'attachment; filename="invoice.pdf"',
    },
  });
}
```

Web `Response` needs a complete body, so the buffered path is the correct one there — keep `doc.end()` before awaiting.

## 5. Test that the bytes are a PDF

```ts
const res = await app.request("/invoices/1");
expect(res.headers.get("content-type")).toBe("application/pdf");
const bytes = new Uint8Array(await res.arrayBuffer());
expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
```

A status-only test passes even when the body is empty — assert the magic bytes.

## Pitfalls

- Forgetting `doc.end()` leaves the response open forever; the client hangs with no error.
- Returning the `PDFDocument` object from a handler serializes it as JSON instead of publishing the stream.
- Setting the content type after `doc.pipe()` throws `ERR_HTTP_HEADERS_SENT`.
- Writing text after the bottom margin triggers an automatic page break, so a footer can create a blank trailing page.
- Passing an image path that is resolved from `process.cwd()` breaks in production — embed from a buffer or an absolute path.
- Running pdfkit on an edge/workerd runtime fails at import time; isolate it in a Node service.

## Related

- `references/apis.md`
- `best-practices/pdf-generation.md`
- `usecases/multi-page-report.md`
