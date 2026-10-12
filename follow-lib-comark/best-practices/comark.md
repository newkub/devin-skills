# Comark — Best Practices

Parse once, render anywhere — `MarkdownDocument` แยก parse ออกจาก render target

## Recommended Patterns

- Parse ฝั่ง server/build แล้ว serialize `MarkdownDocument` ไป render — content outlives stack
- เลือก renderer ตาม target จริง: `@comark/html` (SSG/RSS/email), `@comark/ansi` (CLI), framework component (apps)
- Code highlighting ผ่าน `comark/plugins/shiki` — multi-theme + on-demand langs อยู่แล้ว (ดู `/follow-lib-shiki`); เล็กกว่า/เร็วกว่า → `comark/plugins/rangi` (rangi, ~13kB sync, dual-theme inline colors — เหมาะ dev tools/snippet preview)
- Register เฉพาะ components ที่ต้องการ — content เป็น data, ไม่ใช่ executable code
- Streaming AI output → เปิด streaming prop; auto-close ทำให้ทุก frame render สมบูรณ์
- Docs single-page จาก README → dispatch ไป `/follow-create-web-docs` แทน wire เอง

## Common Pitfalls

- Vue `<Markdown>` นอก `<Suspense>` → render ไม่ขึ้น/ error — wrap เสมอ
- components/attributes/frontmatter เป็น opt-in — assume standard CommonMark ทำงานก่อน เปิดเพิ่มเมื่อต้องการ
- markdown-it plugins ส่วนใหญ่ใช้ได้ แต่เช็ค compat — markdown-exit เป็น TS rewrite
- Untrusted content → sanitize HTML output อีกชั้น (`/follow-lib-dompurify`) แม้ components จะ gated
- Streaming ปิด → mid-token frames แสดง raw syntax — เปิด prop สำหรับ chat/AI UI เสมอ

## UX/UI Integration

- ใช้ใน `/improve-uxui` เมื่อ: markdown content render ผิด, docs ขาด callouts/components, chat streaming แสดง raw markdown, code blocks ไม่มี highlight (pair shiki)
- Attributes syntax `{.class}` → ผูก design-system classes (เช่น UnoCSS utilities) บน content โดยไม่เขียน HTML
- Component syntax → callouts, cards, alerts, embeds ที่ consistent กับ design system

## Do / Don't

| Do | Don't |
|----|-------|
| parse once → render หลาย targets | parse ซ้ำต่อ output target |
| register components explicit | trust content-embedded code |
| streaming prop สำหรับ AI/chat UI | render raw chunks โดย auto-close ปิด |
| plugins official ก่อนเขียนเอง | rebuild shiki/mermaid/toc เอง |
| serialize `MarkdownDocument` สำหรับ cache | re-parse ทุก request |
