# DOMPurify — Best Practices

Sanitize untrusted HTML อย่างปลอดภัย — XSS prevention ที่ถูกต้อง

## Recommended Patterns

- Sanitize **ทุก** untrusted HTML ก่อน inject: `DOMPurify.sanitize(dirty)` — user input, markdown render output, CMS content
- Default config ปลอดภัยพอส่วนใหญ่ — tighten เมื่อ threat model สูง: `FORBID_TAGS`, `FORBID_ATTR`, `ALLOWED_TAGS` allowlist
- ใช้ `RETURN_TRUSTED_TYPE: true` เมื่อ app ใช้ Trusted Types CSP — sanitize แล้วได้ TrustedHTML ตรงๆ
- Hooks (`addHook`) สำหรับ enforce กฎเพิ่ม — เช่น `afterSanitizeAttributes` เพิ่ม `rel="noopener"` ให้ `target="_blank"`
- Server-side: ใช้ผ่าน `dompurify` + `jsdom` — sanitize ทั้ง server และ client ถ้า data flow ทั้งสองทาง

## Common Pitfalls

- Sanitize แล้วอย่า inject ผ่าน `innerHTML` ถ้าไม่จำเป็น — เลือก `textContent` เมื่อไม่ต้องการ markup เลย
- `sanitize()` return string — อย่า double-sanitize ผลลัพธ์ที่เคย sanitize แล้ว (idempotent แต่เสีย perf)
- Custom elements/web components: default ลบออก — ต้อง `CUSTOM_ELEMENT_HANDLING` ถ้าตั้งใจใช้
- SVG/MathML มี mutation-XSS vectors — DOMPurify จัดการแล้ว แต่อย่า bypass ด้วย `ALLOWED_NAMESPACES` เองถ้าไม่เข้าใจ
- Config เป็น per-call — ไม่มี global mutable config; wrap เป็น `sanitizeHTML()` utility เดียวของ project

## Security Rules

- ห้าม `RETURN_DOM`/`RETURN_DOM_FRAGMENT` แล้ว append โดยไม่เช็ค context — ใช้เมื่อต้องการ DocumentFragment จริง
- อย่า sanitize เฉพาะฝั่ง client ถ้า content เก็บ DB — sanitize ก่อน save หรือก่อน render ทุกครั้ง (defense in depth: ทั้งสอง)
- `data-*` attributes allowed by default — ถ้า app อ่าน data-* เป็น code/config → forbid หรือ whitelist เฉพาะ keys

## Do / Don't

| Do | Don't |
|----|-------|
| sanitize ทุก untrusted HTML | inject `dangerouslySetInnerHTML` ดิบ |
| allowlist (`ALLOWED_TAGS`) เมื่อรู้ schema | blocklist (`FORBID_*`) อย่างเดียว |
| wrap เป็น util เดียวของ project | config กระจายทุก call site |
| Trusted Types + `RETURN_TRUSTED_TYPE` | strip CSP เพื่อให้ HTML ผ่าน |
