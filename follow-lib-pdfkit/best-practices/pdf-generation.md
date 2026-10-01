# Best Practices: pdfkit (Server PDF Generation)

แนวทางสร้าง PDF ด้วย pdfkit ให้ layout ถูกต้อง stream ไม่ค้าง และไฟล์ไม่บวม

## Recommended Patterns

- สร้าง `new PDFDocument({size, margins, info})` แล้ว `doc.pipe(stream)` ทันที — output เป็น stream ไม่ใช่ buffer ใหญ่
- Manual positioning: `doc.text()` flow ต่อเนื่อง, `doc.rect`/`circle`/`lineTo` สำหรับ vector — เก็บ cursor `doc.x`/`doc.y` เช็คก่อนเขียน
- Register font ครั้งเดียวด้วย `doc.registerFont(name, path)` แล้วอ้างด้วย `doc.font(name)` — font licensing ต้องอนุญาต embedding
- Multi-page headers/footers: ใช้ `doc.bufferedPageRange()` แล้ว `switchToPage(i)` วาดย้อนหลัง
- จบด้วย `doc.end()` เสมอ — ลืม = stream ค้าง, response ไม่ส่ง, memory leak
- ทดสอบด้วยเปิด PDF จริง — layout overflow, font missing, page break ผิดเห็นได้แค่ตอน render

## Do / Don't

| Do | Don't |
|---|---|
| `doc.pipe(res)` + `Content-Type: application/pdf` สำหรับ HTTP | buffer ทั้งไฟล์ใน memory แล้วส่งทีเดียว |
| ใช้ `bufferedPageRange` สำหรับ page numbers | วาด footer ตอน addPage (ยังไม่รู้จำนวนหน้า) |
| Compress images ก่อน embed | embed PNG ขนาดเต็มใน PDF |
| Handle `doc` error event + stream error | assume pipe สำเร็จเสมอ |
| ใช้ `doc.end()` ใน finally/เสมอ | ลืม end → file corrupt/response hang |
| เลือก pdfkit เมื่อต้อง programmatic layout | ใช้ pdfkit เมื่อ content คือ HTML — ใช้ Playwright `page.pdf()` |

## Common Pitfalls

- pdfkit ต้อง Node runtime — edge/workerd ไม่ได้; ใช้ service แยกหรือ pre-render
- Font path ผิด/หายใน production — register ด้วย absolute path จาก project root
- Text overflow — `doc.text` ไม่ auto-wrap ถ้าไม่กำหนด `width`; ใช้ `doc.widthOfString` เช็ค
- Page break ผิด — `doc.addPage` เมื่อ `doc.y` เกิน printable area; คำนวณ margin ก่อนเขียน
- Image ใหญ่ทำ PDF บวม — compress/resize ก่อน `doc.image()`; `fit`/`width` จำกัดขนาดแสดง
- `doc.end()` ใน async handler ลืม await stream finish — response อาจตัดกลาง

## Performance Notes

- Stream output — ไม่ต้อง buffer ทั้ง PDF; pipe ตรงไป file/response
- Font subsetting: pdfkit embed เฉพาะ glyphs ที่ใช้ — font ขนาดใหญ่ยังโอเคถ้าใช้น้อย
- Reuse font objects — `registerFont` ครั้งเดียว; อย่า re-register ต่อหน้า
- Complex vector หลายพัน path ช้า — พิจารณา rasterize หรือ simplify
- Generation เป็น CPU-bound sync — ใน request handler ควร queue/background job สำหรับ PDF ใหญ่

## Ecosystem / Integration

- HTML → PDF → Playwright `page.pdf()` (ไม่ใช่ pdfkit)
- Storage: pipe เข้า `fs.createWriteStream` หรือ object storage stream
- Fonts: bundle ใน repo (เช็ค license) หรือ mount path — ห้ามดึง font runtime จาก network
- Testing: generate → assert file size/header หรือ snapshot compare บนตัวอย่าง
