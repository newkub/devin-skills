# markdown-it — Rendering Pipeline และ Security

## Recommended Patterns

### Presets และ Instance Setup

- สร้าง instance ครั้งเดียว reuse: `const md = new MarkdownIt()` หรือ `markdown-it()` — อย่า new ต่อ render
- presets: `default` (CommonMark + extras: tables, strikethrough ฯลฯ), `commonmark` (strict spec), `zero` (minimal — เปิดเฉพาะที่ต้องการ)
- `zero` preset + `md.enable([...])` เมื่อต้องการ minimal surface — ลด attack surface สำหรับ untrusted input
- options สำคัญ: `html`, `linkify`, `typographer`, `breaks`, `highlight`

### Security — Untrusted Content

- default `html: false` — inline HTML ถูก escape อัตโนมัติ (safe default)
- อย่าเปิด `html: true` สำหรับ user content — XSS ผ่าน inline HTML ได้ทันที
- ถ้าจำเป็นต้องเปิด `html: true` → sanitize output ด้วย DOMPurify เสมอ (ดู `/follow-lib-dompurify`)
- `linkify: true` auto-link URLs — ระวัง `javascript:` URIs (markdown-it filter ให้บางส่วน แต่ sanitize เพิ่มเมื่อ untrusted)
- plugin ที่ inject HTML เช่น raw attribute plugins — audit ก่อนใช้กับ untrusted input

### Render Flow

- `md.render(src, env)` คืน HTML string; `md.parse(src, env)` คืน token stream สำหรับ inspect/transform ก่อน render
- `env` object ส่งข้ามไปยัง rules/plugins — เช่นเก็บ references, collect headings (toc)
- สำหรับ syntax highlighting: `@shikijs/markdown-it` (async — await setup ก่อน render) หรือ `highlight.js` ผ่าน `highlight` option
- `md.renderer.rules.<name>` override output ต่อ token type — wrap default fallback เสมอ

## Do / Don't

| Do | Don't |
|---|---|
| reuse instance เดียวทั้ง app | `new MarkdownIt()` ทุก render call |
| `html: false` สำหรับ user content | `html: true` โดยไม่ sanitize |
| sanitize output ด้วย DOMPurify เมื่อต้อง `html: true` | trust plugin output เสมอ |
| ใช้ `env` ส่ง per-render context | mutate shared state ผ่าน closure |
| wrap default rule ใน renderer override | replace rule แล้วลืม fallback |

## Common Pitfalls

- `html: true` + user input → XSS — pitfall ใหญ่สุดของ lib นี้
- async highlighter (`@shikijs/markdown-it`) เรียก sync `md.render` ก่อน setup เสร็จ → code block ไม่ highlight
- modify shared `md` instance กลาง request → rules เปลี่ยนข้าม renders ใน concurrent usage — สร้าง instance แยกหรือ lock config ตอน init
- `env` ไม่ pass → plugin ที่ต้องการ env (toc collectors) return stale/empty data
- assume output safe เพราะ `html: false` — linkify/attrs ยัง inject ได้ผ่าน URLs

## Performance Notes

- `md.render` เป็น CPU-bound sync — สำหรับ content ซ้ำ cache HTML output (key = content hash)
- markdown-it parse เร็วแต่ big docs (หลาย MB) ยังช้า — split content หรือ render ใน worker
- อย่า parse ซ้ำเพื่อ extract metadata — ใช้ `md.parse` ครั้งเดียวแล้ว inspect tokens
- typographer + linkify เพิ่ม cost เล็กน้อย — ปิดถ้าไม่ใช้

## Ecosystem / Integration

- ถ้าต้องการ full markdown pipeline ที่มี AST/unist → remark/rehype หรือ framework integration (VitePress, Slidev) — markdown-it เป็น token-stream ไม่ใช่ full AST
- sanitize → `/follow-lib-dompurify`; syntax highlight → `@shikijs/markdown-it` หรือ `highlight.js`
- v15 เป็น ESM+CJS dual — types รวมใน package ไม่ต้อง `@types/markdown-it`
- CLI สำหรับ quick render: `bunx markdown-it file.md` — options `--html`, `--linkify`, `--typographer`
