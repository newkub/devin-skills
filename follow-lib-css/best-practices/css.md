# CSS — Modern Best Practices

Modern CSS patterns และ Baseline features — ใช้กับทุก project

## Recommended Patterns

- **Cascade layers** — `@layer reset, base, components, utilities` คุม specificity war ตั้งแต่ต้น
- **Logical properties** — `margin-inline`, `padding-block`, `inset-inline-start` แทน physical (รองรับ RTL/vertical writing ฟรี)
- **Custom properties** — design tokens เป็น `--color-*`, `--space-*` ที่ `:root` — theme switching ง่าย
- **`:has()`** — parent-aware styling โดยไม่ต้อง JS (form states, card-with-image layouts)
- **Container queries** — `@container` สำหรับ component-driven responsive แทน viewport media queries
- **Native nesting** — nest selectors ใน stylesheet เดียว (Baseline แล้ว) — ลด specificity ที่ซ้ำกัน

## Common Pitfalls

- เลี่ยง `!important` ทุกกรณี — ถ้าต้อง override ใช้ layer order หรือ specificity ที่คิดไว้
- `100vh` บน mobile พัง (URL bar) — ใช้ `100dvh`/`svh`/`lvh` ตาม use case
- อย่าใส่ units บน `line-height` — unitless (`1.5`) inherit ถูกต้อง
- `gap` ใน flex/grid ทำงานดีแล้ว — ไม่ต้องใช้ margin hacks
- Media queries ที่ overlap breakpoints ต่างกันนิดเดียว = maintenance hell — ใช้ container queries หรือ fluid (`clamp()`) แทน

## Performance

- `content-visibility: auto` + `contain-intrinsic-size` สำหรับ long pages — skip offscreen render
- `will-change` เฉพาะตอน animate จริง — ทิ้งไว้ = memory waste
- Animations: `transform`/`opacity` เท่านั้นสำหรับ 60fps; `@media (prefers-reduced-motion)` เสมอ

## Do / Don't

| Do | Don't |
|----|-------|
| `@layer` + custom properties | specificity hacks + `!important` |
| `clamp()` fluid typography | breakpoint ทุก 50px |
| `:has()`, `:is()`, `:where()` | JS class toggles ที่ CSS ทำได้ |
| `dvh`/`svh` บน mobile layouts | `100vh` ตรงๆ |
