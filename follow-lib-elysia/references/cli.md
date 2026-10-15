| key | value |
|---|---|
| note | Elysia has no standalone CLI — use Bun commands + `@elysia/codemod` |

| command | description | options |
|---|---|---|
| `bun create elysia app` | scaffold a new project | — |
| `bun --hot src/index.ts` | dev server with hot reload | — |
| `bun run src/index.ts` | run directly (Bun runs TS natively) | — |
| `bun build src/index.ts --target bun --outfile dist/index.js` | bundle for production | `--target`, `--outfile` |
| `bun build --compile src/index.ts --outfile app` | compile to a single binary | `--compile`, `--outfile` |
| `bunx @elysia/codemod@latest` | migrate v1 → v2.0 "DayDream" | — |
