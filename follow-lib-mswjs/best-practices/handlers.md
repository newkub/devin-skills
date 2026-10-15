# MSW — Request Handler Patterns

## Recommended Patterns

### Handler Structure

- split handlers by domain: `src/mocks/handlers/users.ts`, `orders.ts` — export arrays, then combine them in `handlers.ts` with spread
- use `http.get`/`http.post`/etc. with paths matching the real API — relative paths (`/api/users`) for same-origin, absolute URLs for third-party
- GraphQL: use `graphql.query('OperationName', resolver)` bound to the operation name, not the path — client libs hit a single endpoint
- responses use `HttpResponse.json(data, { status })` — don't return a plain object or a manual `Response` unless needed

### Response Realism

- handlers must match the real API contract — field names, types, and error shape like the backend; when the backend changes, update the handler together
- cover cases per endpoint: happy path, 4xx (validation/auth), 5xx (server error), network error (`HttpResponse.error()`), empty state
- use `await delay(150)` or `delay('infinite')` to test loading/timeout UI — don't delay every request needlessly (tests get slow)
- parametrize handlers with `params`/`request.json()` instead of one handler per ID — `http.get('/api/users/:id', ({ params }) => ...)`

### Test Overrides

- base handlers = the default happy path; override per test with `server.use(http.get(...))` inside that test
- `server.resetHandlers()` in `afterEach` restores the base — overrides must never leak across tests
- don't edit a base handler for one test — every other test will change behavior along with it
- runtime handlers for dev use `worker.use()` — handy with a debug panel that toggles error states

### Data Factories

- split mock data into factories (`buildUser({...overrides})`), not long literals in the handler — one shape tweak propagates to every test
- keep factories in `src/mocks/factories/` — not in production code that handlers import back into the app
- deterministic data: seeded or fixed IDs in tests — random data makes snapshots/assertions flaky

## Do / Don't

| Do | Don't |
|---|---|
| intercept at the network layer with MSW | patch `fetch`/`axios`/`vi.mock` http clients — bypasses the whole response pipeline |
| mirror the backend error shape (`{ error: { code, message } }`) | return an empty `HttpResponse.json({})` for errors |
| override per test with `server.use()` | edit the shared base handler to make one case pass |
| use `onUnhandledRequest: 'warn'` to find gaps | leave unhandled requests silent — tests pass without you knowing |
| co-locate handlers near the domain | a single thousand-line `handlers.ts` |

## Common Pitfalls

- `HttpResponse.json` with `ReadableStream`/file uploads needs `HttpResponse` + a body you build yourself — json() doesn't take streams
- forgetting `server.resetHandlers()` → a previous test's override lingers and the next test fails for an unrelated reason
- interceptor order matters: specific paths must come before wildcards — MSW matches in registration order
- cookies/credentials: `request.credentials`/`withCredentials` must be set in the handler if the API really uses cookies
- binary/download endpoints — return `HttpResponse.arrayBuffer()` or a blob; `HttpResponse.json` would stringify it wrongly

## Performance Notes

- avoid a default `delay()` across the whole test suite — use it only in tests asserting loading state
- many handlers aren't slow (matching is ~O(n) with small n) — the slow point is large response payloads rebuilt per request; cache factory output if heavy
- Node tests: call `server.listen()` once in a setup file, not per test file — vitest config's setupFiles already does this

## CI Notes

- tests must never depend on the external network — MSW interception keeps them deterministic on CI with limited egress
- if CI tests pass locally but fail on CI → almost always an unhandled request that bypassed to the real backend locally; enable `onUnhandledRequest: 'error'` in CI temporarily to find it
