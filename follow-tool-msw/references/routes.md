# Tool Msw Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs home | https://mswjs.io |
| Getting started | https://mswjs.io/docs/quick-start |
| Node integration | https://mswjs.io/docs/integrations/node |
| Browser integration | https://mswjs.io/docs/integrations/browser |
| Network behavior | https://mswjs.io/docs/http/mocking-responses |
| Life-cycle events | https://mswjs.io/docs/api/life-cycle-events |
| Vitest setup | `setupFiles: ['./src/mocks/node.ts']` |

## Key Concepts

- `src/mocks/handlers.ts` → `browser.ts` (`setupWorker`) + `node.ts` (`setupServer`)
- Vitest: `server.listen()` in setupFiles + `afterEach(server.resetHandlers)`
- `server.use(...)` per-test override handlers
- `onUnhandledRequest: 'error'` ใน test → catch missing mocks
- v2: `http`/`HttpResponse` API แทน v1 `rest`/`res(ctx)` — ถ้าเจอ `rest.` = legacy
