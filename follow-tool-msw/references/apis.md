| key | value |
|---|---|
| version | 2.15.0 |
| package registry | https://www.npmjs.com/package/msw |
| repository | https://github.com/mswjs/msw |
| docs | https://mswjs.io |

| api | description | default | options |
|---|---|---|---|
| `http.get(url, resolver)` | REST handler | - | `HttpResponse.json()` |
| `graphql.query/mutation(name, fn)` | GraphQL handler | - | - |
| `setupWorker(...handlers)` | Browser worker | - | `start({onUnhandledRequest})` |
| `setupServer(...handlers)` | Node server | - | `listen`, `use`, `resetHandlers`, `close` |
| `msw init <dir> --save` | สร้าง SW script | public/ | --save writes to package.json |
| `HttpResponse.json/ text/ error()` | Mock response | - | `{status, headers}` |
| `passthrough()` / `delay()` | Utilities | - | - |
