# Edge.js — Best Practices

Template engine สำหรับ Node.js — patterns, escaping และ component discipline

## Recommended Patterns

- Escape by default — Edge escape `{{ }}` อัตโนมัติ; ใช้ `{{{ }}}` (unescaped) เฉพาะ content ที่ sanitize แล้ว (เช่น ผ่าน DOMPurify)
- Layouts + components: `@layout`/`@component`/`@slot` แทน include chains ยาว — components ได้ scoped props + slots
- Business logic อยู่นอก template — prepare view model ใน controller; template ทำ presentation เท่านั้น (`@if`, `@each`, helpers)
- Register helpers/globals ครั้งเดียวตอน boot — `edge.global()` สำหรับ shared data (csrf token, current user)
- Cache templates ใน production (`edge.mount` + cache flag) — dev = no cache, prod = cached

## Common Pitfalls

- `@each` บน array ว่าง → ใช้ `@else` branch เสมอ เพื่อ empty state
- อย่า render user input ผ่าน `{{{ }}}` — mutation-XSS surface เดียวกับ innerHTML
- Async logic ใน template — Edge รองรับ `@async`/`await` บางรูปแบบแต่ควร fetch ก่อน render
- Template paths: ใช้ `edge.mount()` namespaces (`'components'`) — relative includes เปราะเมื่อย้ายไฟล์
- CSRF: Edge ไม่ inject token เอง — ส่ง `csrfToken` ผ่าน global/locals แล้ว hidden input ทุก form

## Perf Notes

- Compiled templates cache ใน memory — restart worker เมื่อ deploy; no disk thrash
- Inline partials เล็กๆ ดีกว่า file-per-partial สำหรับ tiny fragments — I/O per render

## Do / Don't

| Do | Don't |
|----|-------|
| `{{ }}` escaped output | `{{{ }}}` บน user content |
| components + slots | include spaghetti |
| view model เตรียมนอก template | query/logic ใน template |
| `edge.global()` สำหรับ shared | ส่ง locals ซ้ำทุก render |
