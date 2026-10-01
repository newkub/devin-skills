# markdown-it — Plugin Ecosystem และ Custom Rules

## Recommended Patterns

### Plugin Usage

- ใช้ `md.use(plugin, opts)` — plugin เป็น function ที่รับ `md` instance + options
- plugin ยอดนิยม: `markdown-it-anchor` (heading links), `markdown-it-toc-done-right` (TOC), `markdown-it-footnote`, `markdown-it-container`, `markdown-it-attrs`
- หา plugins จาก npm keyword `markdown-it-plugin` — เช็ค last publish + issues ก่อนใช้ (ecosystem มี unmaintained plugins เยอะ)
- plugin order มีผล — anchor plugin ต้องโหลดก่อน toc plugin ที่อ่าน anchors

### Custom Render Rules

- override output ผ่าน `md.renderer.rules.<tokenType>` — เช่น `fence`, `heading_open`, `link_open`
- pattern มาตรฐาน: capture default → wrap เพิ่ม logic → fallback ไป default

```js
const defaultRender = md.renderer.rules.link_open ||
  ((tokens, idx, opts, env, self) => self.renderToken(tokens, idx, opts))
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  tokens[idx].attrSet('target', '_blank')
  tokens[idx].attrSet('rel', 'noopener')
  return defaultRender(tokens, idx, opts, env, self)
}
```

- เขียน rule ใหม่ (block/inline) ผ่าน `md.block.ruler` / `md.inline.ruler` — เมื่อ renderer override ไม่พอ ต้องการ token type ใหม่
- toggle rules ด้วย `md.enable([...])` / `md.disable([...])` — ปิด rules ที่ไม่ใช้เพื่อลด surface

### Plugin Development Guidelines

- plugin เป็น function `(md, opts) => {}` — mutate md instance ภายใน
- prefer extending renderer rules ก่อน — เขียน parser rule เฉพาะเมื่อ syntax ใหม่จริงๆ
- เก็บ per-render state ใน `env` ไม่ใช่ closure — closure state leak ข้าม renders
- test กับทั้ง `md.render` และ `md.parse` — renderer override ไม่กระทบ parse

## Do / Don't

| Do | Don't |
|---|---|
| wrap default rule แล้ว call fallback | replace rule แล้ว drop default behavior โดยไม่ตั้งใจ |
| เช็ค plugin maintenance ก่อน adopt | install plugin ที่ unmaintained สำหรับ production |
| ใช้ `env` สำหรับ per-render state | closure state ที่ leak ข้าม renders |
| order plugins ตาม dependencies | assume order ไม่สำคัญ |
| audit plugin output เมื่อ render untrusted | trust ทุก plugin ว่า escape ให้ |

## Common Pitfalls

- `md.renderer.rules.x` แทนที่โดยไม่เก็บ fallback → default rendering หาย, output เปลี่ยนไปทั้งหมด
- plugin ที่ assume `env` มี field บางอย่าง → ลืม pass `env` ใน `md.render(src)` → plugin break silently
- ใช้ plugin ที่ unmaintained → incompat กับ markdown-it major version ใหม่
- anchor + toc plugin order ผิด → TOC ไม่มี anchors ให้ link
- plugin ที่ add raw HTML → XSS hole เมื่อ render user content

## Performance Notes

- plugin เพิ่มต้นทุนต่อ token — chain plugins มาก = render ช้าขึ้น linearly
- `md.disable` rules ที่ไม่ใช้ช่วยลด parse work
- plugin ที่ walk tokens ทุกตัว (`core.ruler` rule) แพงบน doc ใหญ่ — เขียนให้ early-exit

## Ecosystem / Integration

- `@shikijs/markdown-it` สำหรับ syntax highlight — async setup ต้อง await ก่อน render
- `markdown-it` token stream ≠ full AST — ถ้าต้องการ AST manipulation ใช้ unified/remark
- เขียน plugin ให้เป็น pure function ที่รับ `(md, opts)` — test ง่าย
- plugin conflicts: สอง plugin ที่ edit rule เดียวกัน last-loaded wins — เช็ค composed behavior
