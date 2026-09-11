# Lib Edgejs Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs home | https://edgejs.dev |
| Getting started | https://edgejs.dev/docs/getting_started |
| Tags reference | https://edgejs.dev/docs/tags/introduction |
| Components | https://edgejs.dev/docs/components/introduction |
| Conditionals/loops | https://edgejs.dev/docs/conditionals |
| Helpers | https://edgejs.dev/docs/guides/helpers |

## Key Concepts

- Syntax: `{{ expr }}` (escaped), `{{{ }}}` (unescaped HTML), `@if`/`@each`/`@component`/`@include`
- Layouts: `@layout` + `@section` / components ผ่าน `edge.mount` namespace
- State: `edge.render(name, state)` — globals ผ่าน `edge.global()`
- ESM-only — ต้อง `"type": "module"` หรือ `.mjs`
