# Vue CLI / Tooling Reference

## Source

- create-vue: https://github.com/vuejs/create-vue (`create-vue@3.23.0`, verified 2026-09-13)
- vue-tsc: https://github.com/vuejs/language-tools (`vue-tsc@3.3.11`, verified 2026-09-13)

## Scaffolding — `create-vue`

Vue 3 ไม่มี `@vue/cli` แล้ว (deprecated, webpack-based) — ใช้ `create-vue` (Vite-powered scaffolder):

```bash
# Interactive mode (recommended)
npm create vue@latest

# ต้องใส่ @latest เสมอ — ไม่งั้น npm resolve cached outdated version
# PowerShell: npm create vue@latest '--' --help
```

## Feature Flags

ส่ง feature flags เพื่อ skip prompts:

| Flag | Description |
|------|-------------|
| `--typescript` | Enable TypeScript |
| `--router` | Add Vue Router |
| `--pinia` | Add Pinia store |
| `--vitest` | Add Vitest unit tests |
| `--eslint` | Add ESLint |
| `--bare` | Minimal boilerplate (no examples) |
| `--help` | List all available flags |

```bash
npm create vue@latest my-app -- --typescript --router --pinia --vitest
```

## Type Check — `vue-tsc`

`vue-tsc` คือ TypeScript compiler wrapper ที่เข้าใจ SFC (`.vue` files):

```bash
bun add -D vue-tsc
bunx vue-tsc --noEmit    # typecheck .vue + .ts ทั้ง project
```

- ใช้แทน `tsc --noEmit` เสมอใน Vue projects — `tsc` ธรรมดาอ่าน `<script setup>` ใน `.vue` ไม่ได้
- `npm create vue@legacy` สำหรับ Vue 2 เท่านั้น — Vue 2 EOL แล้ว อย่าใช้กับ project ใหม่
