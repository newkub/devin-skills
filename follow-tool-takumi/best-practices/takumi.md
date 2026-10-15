# Takumi — Best Practices

JSX/HTML → images/PDFs โดยไม่ต้อง browser — OG images, social cards, SVG, animations

## Recommended Patterns

- OG image spec: `1200×630` PNG/WebP — pair กับ `summary_large_image` card
- ใช้ `ImageResponse` (`takumi-js/response`) ใน route handlers — drop-in แทน `next/og`
- Register fonts ครั้งเดียวบน `Renderer` เมื่อ render หลายภาพ — อย่าโหลด font ทุก request
- `googleFonts` helper ดึง families ใน request เดียว — variable fonts ผ่าน `axes` ให้ `font-variation-settings` ทำงาน
- Style ด้วย `tw="..."` (Tailwind) สำหรับ layout เร็ว + `style={{}}` สำหรับสิ่งที่ Tailwind ไม่ครอบ (gradient text, clip-path)
- Cache output ตาม content hash — OG images deterministic, ไม่ต้อง render ซ้ำทุก request

## Common Pitfalls

- ไม่อ่าน system fonts — built-in มีแค่ Geist Latin; ภาษาไทย/CJK/Arabic ต้องผ่าน `fonts` เสมอไม่งั้น missing glyphs
- Migrating จาก Satori: bare `<div>` ของ Takumi default เป็น block layout (Satori เป็น flex) — คง explicit flex styles ไว้
- CSS subset ไม่ใช่ browser เต็ม — เช็ค support matrix (grid, position, filters, mask) ก่อนออกแบบ
- Edge runtimes เลือก WASM binding เอง — bundle size ใหญ่กว่า native; ทดสอบ cold start บน Workers/Edge
- Animation output (WebP/APNG/GIF) ใหญ่ — จำกัด frames/duration; prefer WebP สำหรับ size

## SEO Integration

- ใช้ใน `/improve seo` สำหรับ findings `og:image`/`twitter:image` ที่ขาดหรือ static — generate per-page OG แบบ dynamic
- Route handler deterministic: input = title/slug → output = image; cache ตาม slug hash
- ทดสอบด้วย social debuggers (Facebook/Twitter card validators) หลัง deploy

## Do / Don't

| Do | Don't |
|----|-------|
| preload fonts บน `Renderer` | โหลด font ทุก render call |
| `1200×630` สำหรับ OG images | render ขนาดอื่นโดยไม่เช็ค platform spec |
| cache image bytes ตาม content hash | render ซ้ำทุก request |
| เช็ค CSS support matrix ก่อนออกแบบ | assume browser-parity CSS |
| `tw` + inline `style` ผสมตามจำเป็น | บังคับ Tailwind ทุกอย่าง |
