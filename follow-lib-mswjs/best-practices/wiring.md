# MSW — Dev Worker and Test Server Wiring

## Recommended Patterns

### Browser Dev Mode

- start the worker only when the flag is on: wrap in `if (import.meta.env.DEV && import.meta.env.VITE_MSW === '1')` — never force every dev run onto mocks
- `await worker.start({ onUnhandledRequest: 'bypass' })` before rendering the app — a race between worker start and the first fetch lets the very first request escape the mock
- `mockServiceWorker.js` lives in `public/` (generated with `msw init`) — commit it to the repo so the team doesn't init themselves; update it when the msw version bumps (re-run `msw init public/ --save`)
- use `onUnhandledRequest: 'warn'` in dev — see not-yet-mocked endpoints in the console immediately
- opt-out path: an env flag readable by both the local dev server and storybook — don't tie it to a hostname check you write yourself

### Node Test Server

- one file `src/mocks/node.ts` exports `server` from `setupServer(...handlers)` — the test setup file imports only this one
- lifecycle in the setup file: `beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))`, `afterEach(() => server.resetHandlers())`, `afterAll(() => server.close())`
- use `onUnhandledRequest: 'error'` in tests — a test that accidentally hits a new endpoint must fail immediately, not pass silently
- point the setup file at `test.setupFiles` in `vitest.config.ts` — don't import the server separately in each spec

### Dual Environment

- share the same `handlers.ts` between `browser.ts` and `node.ts` — identical mock behavior in dev/test
- the browser worker and the Node server are different implementations with the same API — never write a dev-only handler version
- other environments (Storybook, Playwright component tests) reuse the same `setupServer`/`setupWorker` through that tool's entry point

### Auth and State Simulation

- auth flows: the `/api/auth/login` handler returns a token + sets the headers the client expects — don't hard-code cookies in test code
- stateful mocks (cart, draft): keep in-memory state in the handler's module + export `resetMockState()` for tests to call — avoid stateful mocks unless necessary

## Do / Don't

| Do | Don't |
|---|---|
| `VITE_MSW=1` opt-in flag | enable mocks by default on every `bun run dev` |
| `server.listen({ onUnhandledRequest: 'error' })` in tests | `bypass` in tests — requests escape to the real network silently |
| commit `mockServiceWorker.js` | gitignore it — the team will end up with version mismatches |
| `resetHandlers` in `afterEach` | resetting only in `beforeEach` — a test that overrides late leaves state behind |
| reuse one handler set for dev+test | fork handler sets — they will definitely drift |

## Common Pitfalls

- `worker.start()` not awaited before render → first-page requests go through the real network — symptom: real data mixed with mocks
- a `mockServiceWorker.js` older than the `msw` package → worker-update warnings/odd behavior; regenerate after upgrading
- the Node server never closes → the process hangs; always wire `afterAll(server.close)`
- service worker scope: a worker at the `public/` root controls the whole origin — a sub-path deploy must set `serviceWorker.url` to match
- parallel test runners + `server.use` races → state shared across test files in one process; keep overrides within a single test scope

## Performance Notes

- `onUnhandledRequest: 'warn'` adds a little console noise — worth it in dev, can be disabled in production-like previews
- Node server startup is cheap (~ms) — don't lazy-init per test; one setup file call is enough
- disable MSW in test files that don't need it with a suite-scoped `server.close()` for heavy suites — usually unnecessary
