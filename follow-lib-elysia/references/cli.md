| key | value |
|---|---|
| note | Elysia ไม่มี standalone CLI — ใช้ Bun commands + `@elysia/codemod` |

| command | description | options |
|---|---|---|
| `bun create elysia app` | scaffold project ใหม่ | — |
| `bun --hot src/index.ts` | dev server พร้อม hot reload | — |
| `bun run src/index.ts` | run โดยตรง (Bun รัน TS ได้) | — |
| `bun build src/index.ts --target bun --outfile dist/index.js` | bundle สำหรับ production | `--target`, `--outfile` |
| `bun build --compile src/index.ts --outfile app` | compile เป็น single binary | `--compile`, `--outfile` |
| `bunx @elysia/codemod@latest` | migrate v1 → v2.0 "DayDream" | — |
