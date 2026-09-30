| key | value |
|---|---|
| version | 6.5.1 |
| package registry | https://www.npmjs.com/package/edge.js |
| repository | https://github.com/edge-js/edge |
| docs | https://edgejs.dev |

| api | description | default | options |
|---|---|---|---|
| `Edge.create()` | สร้าง instance | - | `cache` |
| `edge.mount(dir)` | Register views directory | - | namespace |
| `edge.render(template, state)` | Render ไฟล์ | - | state object |
| `edge.renderSync` / `renderRaw` | Variants | - | - |
| `edge.registerTemplate(name, {template})` | Inline template | - | - |
| `{{ }}` / `@if` / `@each` / `@component` | Template syntax | escaped | `@!{}` raw |
