# Lib Dompurify API & Dependencies

## Install

```sh
bun add dompurify
bun add -D @types/dompurify   # สำหรับ TypeScript (types แยกตั้งแต่ v3+)
```

## Version

- Latest: `3.4.15` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/dompurify)
- [Repository](https://github.com/cure53/DOMPurify)

## Dependencies

- Zero runtime dependencies — pure browser/DOM library
- Server-side (Node/Bun) ต้องใช้ร่วมกับ `jsdom` หรือ `happy-dom` (`bun add -D jsdom`)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `DOMPurify.sanitize(dirty)` | Sanitize HTML string | remove dangerous tags/attrs | config object |
| `DOMPurify.sanitize(dirty, cfg)` | Sanitize with config | - | `ALLOWED_TAGS`, `ALLOWED_ATTR`, `RETURN_DOM`, `FORBID_TAGS` |
| `DOMPurify.addHook('afterSanitizeAttributes', fn)` | Add post-processing hook | - | hook name |
| `DOMPurify.isSupported` | Check DOM support | boolean | - |
| `DOMPurify.setConfig(cfg)` | Set global config | - | - |

## Source

- Official docs: https://github.com/cure53/DOMPurify#readme
- Description: XSS sanitizer for HTML, MathML and SVG.
