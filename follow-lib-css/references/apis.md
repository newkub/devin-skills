# Lib Css API & Dependencies

> CSS เป็น web platform standard — ไม่มี npm package ของตัวภาษา (npm package `css` คือ reworkcss parser ไม่เกี่ยวกัน)
> Feature reference หลักอยู่ใน [css-best-practices.md](css-best-practices.md)

## Install

```sh
# ไม่ต้อง install CSS — built-in ใน browser
# Optional toolchain:
bun add -D postcss autoprefixer   # vendor prefix fallbacks
bun add -D lightningcss           # fast transform/minify
```

## Version

- Feature set ล่าสุดที่ Widely available: `Baseline 2025` (verified 2026-09-13)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Baseline](https://web.dev/baseline)

## Dependencies

- ไม่มี — browser built-in; toolchain เป็น optional build-time dev dependencies

## Common Features / Topics

| feature | description | baseline |
|---|---|---|
| `@layer` | Cascade layers คุม priority | Widely available (2022-03) |
| CSS Nesting | `&` nesting แบบ native | Widely available (2023-12) |
| `:has()` | Relational/parent selector | Widely available (2023-12) |
| `@container` | Container queries | Widely available (2024-02) |
| `@property` | Typed custom properties | Widely available |
| `clamp()`/`min()`/`max()` | Fluid sizing | Widely available |
| `oklch()`/`color-mix()`/`light-dark()` | Modern color functions | Widely available |
| `@starting-style` + `allow-discrete` | Entry/exit transitions บน `display:none` | Baseline 2024/2025 |
| `::view-transition` | View Transitions API | Baseline 2025 |
| `popover` attr + `:popover-open` | Popover API | Baseline 2025 |
| `text-wrap: balance/pretty` | Typography wrapping | Baseline 2024 |
| `scrollbar-color`/`scrollbar-width` | Scrollbar styling | Baseline 2025 |
| `content-visibility`/`contain` | Rendering performance | Widely available |

## Source

- Official docs: https://developer.mozilla.org/en-US/docs/Web/CSS
- Description: Cascading Style Sheets — web platform standard for styling
