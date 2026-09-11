# Tool Msw API & Dependencies

## Install

```sh
bun add -D msw
```

## Version

- Latest: `2.15.0` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/msw)
- [Repository](https://github.com/mswjs/msw)

## Dependencies

- Node: `msw/node` (setupServer) — intercept http/https/fetch/undici/axios/graphql
- Browser: Service Worker — `msw init public/` สร้าง `mockServiceWorker.js`
- Peer optional: `graphql` (สำหรับ `graphql.query`/`mutation` handlers)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `http.get(url, resolver)` | REST handler | - | `HttpResponse.json()` |
| `graphql.query/mutation(name, fn)` | GraphQL handler | - | - |
| `setupWorker(...handlers)` | Browser worker | - | `start({onUnhandledRequest})` |
| `setupServer(...handlers)` | Node server | - | `listen`, `use`, `resetHandlers`, `close` |
| `msw init <dir> --save` | สร้าง SW script | public/ | --save writes to package.json |
| `HttpResponse.json/ text/ error()` | Mock response | - | `{status, headers}` |
| `passthrough()` / `delay()` | Utilities | - | - |

## Source

- Official docs: https://mswjs.io
- Description: API mocking via request interception — browser SW + Node interceptors.
