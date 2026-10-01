# Best Practices: qrcode (QR Code Generation)

แนวทางสร้าง QR ที่ scan ได้จริง output ตรง consumer และขนาดเหมาะสม

## Recommended Patterns

- เลือก output ตาม consumer: `toDataURL` สำหรับ `<img>` inline, `toBuffer` สำหรับ download/API binary, `toString({type:'svg'})` สำหรับ vector/scalable
- ตั้ง `errorCorrectionLevel` ตามใช้งาน — `M` default ดี, `Q`/`H` เมื่อจะ overlay logo หรือ print เสี่ยงเสียหาย
- `margin` อย่างน้อย 2 (quiet zone) — scanner หลายตัว reject ถ้า QR ชิดขอบ
- `width` ให้พอ scan — screen แนะนำ ~200px+, print ขึ้นกับขนาดจริงและระยะ scan
- ใช้ `QRCode.create` + segments เมื่อต้อง control ละเอียด (mixed alphanumeric/binary, optimal encoding)
- ทดสอบ scan จริงด้วยกล้อง/แอป — generator output ถูกแต่ contrast/size/quiet zone ผิด scan ไม่ได้

## Do / Don't

| Do | Don't |
|---|---|
| `toBuffer` + `Content-Type: image/png` ใน API | ส่ง base64 dataURL เมื่อ client ต้องการ binary |
| เพิ่ม `errorCorrectionLevel` เมื่อ overlay logo | วาง logo ใหญ่บน QR level L — module ถูกบัง scan พัง |
| เก็บ payload สั้น — QR capacity ~4KB binary จริงๆ น้อยกว่ามากสำหรับ scan ง่าย | embed JSON ใหญ่ — QR หนาแน่น scan ยาก |
| ใช้ SVG สำหรับ print/high-res | ส่ง PNG ความละเอียดต่ำไป print |
| ตั้ง margin ≥2 modules | crop QR ชิดขอบเพื่อความสวย |

## Common Pitfalls

- Data ใหญ่เกิน — QR version สูงสุด ~40; payload 4KB binary เต็มแล้ว dense มาก scan ยาก; ส่ง URL แทน embed data
- `errorCorrectionLevel` ต่ำ + logo overlay = scan fail — module redundancy ชดเชยพื้นที่ที่ถูกบัง
- Margin/quiet zone หายเมื่อ CSS crop หรือ background ติดขอบ — scanner reject
- Contrast ต่ำ — `color.dark`/`color.light` ต้องต่างชัด; QR สีอ่อนบนพื้นขาวล้มเหลว
- SVG ไม่มี `width` attribute → responsive พัง; ใส่ width/height หรือ CSS ควบคุม
- Terminal output `toString({type:'terminal'})` เหมาะ debug ไม่ใช่ production

## Performance Notes

- Generation เร็ว — ไม่ใช่ bottleneck; async API (`toDataURL`) ไม่ block event loop สำหรับเคสปกติ
- `toBuffer` สำหรับ server-side binary — เบากว่า base64 dataURL ~33% ขนาด
- Cache generated QR เมื่อ payload ซ้ำบ่อย — deterministic output สำหรับ input เดียวกัน
- `QRCode.create` แยก encode/render — reuse segments เมื่อ batch generate

## Ecosystem / Integration

- TOTP enrollment QR → สร้าง `otpauth://` ด้วย `/follow-lib-otplib` `generateURI` แล้ว render ที่นี่
- CLI `qrcode` สำหรับ quick terminal/file output — ดู `references/cli.md`
- สำหรับ URL/short-link QR — ตรวจ URL reachable ก่อน generate
- Printable labels/tickets — SVG + error correction Q/H เหมาะสุด
