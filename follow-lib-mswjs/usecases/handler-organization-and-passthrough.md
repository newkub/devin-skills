# Use Case — Handler Organization and Passthrough

> Split handlers by domain, decide per URL whether Mock Service Worker answers or the real network does, and find the endpoints nobody mocked. Source: https://mswjs.io/docs/best-practices/structuring-handlers (accessed 2026-10-20)

## 1. Split handlers by domain

```ts
// src/mocks/handlers/users.ts
import { http, HttpResponse } from "msw";

export const userHandlers = [
  http.get("/api/users", () => HttpResponse.json([{ id: "1", name: "Ada" }])),
  http.get("/api/users/:id", ({ params }) =>
    HttpResponse.json({ id: params.id, name: "Ada" }),
  ),
];

// src/mocks/handlers/index.ts
import { billingHandlers } from "./billing";
import { userHandlers } from "./users";

export const handlers = [...userHandlers, ...billingHandlers];
```

One file per API area, composed in `index.ts`. A 400-line `handlers.ts` becomes a merge conflict on every branch and hides which endpoints exist when a new one is added.

## 2. Pass third-party calls straight through

```ts
import { http, passthrough } from "msw";

export const handlers = [
  http.get("https://api.stripe.com/*", () => passthrough()),
  http.get("https://*.sentry.io/*", () => passthrough()),
];
```

A wildcard catch-all that returns a fixture for every unknown URL hides the requests that really should leave the process. Name the third-party origins explicitly and pass them through, so `onUnhandledRequest` keeps flagging your own unmocked endpoints.

## 3. Choose what happens to the rest

```ts
// browser dev: let real requests through, just warn
await worker.start({ onUnhandledRequest: "warn" });

// tests: fail loudly
server.listen({ onUnhandledRequest: "error" });
```

`bypass` for a dev session that only mocks one API, `warn` while building out handlers, `error` in CI. A test suite on `bypass` quietly reaches the real backend and turns into an integration test with a network dependency.

## 4. Write an exemption instead of disabling the check

```ts
await worker.start({
  onUnhandledRequest(request, print) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/_vercel/") || url.hostname.endsWith("google-analytics.com")) {
      return;
    }

    print.warning();
  },
});
```

The callback keeps `error`/`warn` semantics for everything else. Switching the whole worker to `bypass` to silence one analytics beacon removes the signal for every genuine miss.

## 5. Watch requests while debugging

```ts
server.events.on("request:start", ({ request }) => {
  console.log("msw saw", request.method, request.url);
});

server.events.on("request:unhandled", ({ request }) => {
  console.warn("unmocked", request.method, request.url);
});
```

A URL that never appears in `request:start` was not intercepted at all — usually a different origin, a `fetch` in a worker thread, or a request made before `worker.start()` resolved. That distinction is what separates a bad handler from a missing interceptor.

## 6. Keep one contract source

```ts
import type { User } from "../../api/types";

const ada: User = { id: "1", name: "Ada", email: "ada@example.com" };

export const userHandlers = [http.get("/api/users", () => HttpResponse.json<User[]>([ada]))];
```

Type the payload with the app's own type and reuse the same factories the UI fixtures use. Hand-written mock objects drift from the contract silently, because nothing fails when the API adds a required field.

## 7. Verify

1. `/run-test` — `onUnhandledRequest: "error"` fails on a request to an endpoint with no handler
2. Trigger a third-party call — it reaches the network, and no warning is printed for it
3. Remove a domain file from `handlers/index.ts` — its tests fail, proving the composition is live
4. `request:start` logs every call the suite makes; a missing one means no interception
5. `/run-verify`

## Pitfalls

- A catch-all `http.get("*/api/*")` that shadows more specific handlers.
- Passing everything through in tests, which makes them depend on the real network.
- Silencing the unhandled-request warning per test instead of adding the missing handler.
- Duplicating response shapes by hand instead of importing the app's types.
- Assuming order of registration disambiguates overlapping handlers — make paths specific enough that it does not matter.
- Registering handlers for a different origin than the app calls, so nothing matches and nothing warns.
- Importing `handlers` into the browser bundle from a file that also imports `msw/node`.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/handlers.md`
- `best-practices/wiring.md`
- `usecases/browser-dev-mocking.md`
- `usecases/mock-api-in-tests.md`
