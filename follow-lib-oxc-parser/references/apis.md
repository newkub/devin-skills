# Lib Oxc Parser API & Dependencies

## Install

```sh
bun add -d oxc-parser              # pin version — publish ทุก ~7 วัน, breaking บ่อย
bun add -d @oxc-project/types      # AST type definitions
```

## Version

- Latest: `0.149.0` (verified 2026-09-11) — 0.x: pin exact version เสมอ
- [Package Registry](https://www.npmjs.com/package/oxc-parser)
- [Repository](https://github.com/oxc-project/oxc)

## Dependencies

- N-API native binding — platform-specific binary (`@oxc-parser/binding-*`)
- `@oxc-project/types` สำหรับ ESTree-compatible AST types

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `parseSync(filename, code)` | Parse → `{program, errors, comments}` | - | `sourceType`, `lang`, `astType: 'ts'` |
| `parseSync(code, {astType:'ts'})` | TypeScript-aware AST (TS nodes preserved) | - | - |
| `parseSync` options | `lang: 'ts'\|'tsx'\|'js'\|'jsx'` | infer | `preserveParens`, `showSemanticErrors` |
| AST walk | ต้อง walk เอง หรือใช้ `oxc-walker` (`bun add -d oxc-walker`) | - | - |

## Source

- Official docs: https://oxc.rs/docs/guide/usage/parser.html
- Description: Oxc (oxidation compiler) JavaScript/TypeScript parser — Rust-based, ESTree AST.
