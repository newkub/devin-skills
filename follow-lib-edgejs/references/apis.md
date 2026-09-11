# Lib Edgejs API & Dependencies

## Install

```sh
bun add edge.js   # runtime dependency (Edge template engine)
```

## Version

- Latest: `6.5.1` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/edge.js)
- [Repository](https://github.com/edge-js/edge)

## Dependencies

- Runtime deps น้อย — template compiler + lexer ในตัว
- TypeScript types รวมใน package (ESM-only)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `Edge.create()` | สร้าง instance | - | `cache` |
| `edge.mount(dir)` | Register views directory | - | namespace |
| `edge.render(template, state)` | Render ไฟล์ | - | state object |
| `edge.renderSync` / `renderRaw` | Variants | - | - |
| `edge.registerTemplate(name, {template})` | Inline template | - | - |
| `{{ }}` / `@if` / `@each` / `@component` | Template syntax | escaped | `@!{}` raw |

## Source

- Official docs: https://edgejs.dev
- Description: Edge.js — template engine สำหรับ Node.js (AdonisJS ecosystem).
