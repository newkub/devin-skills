# Use Case — Error Simulation and Delays

> Exercise the paths that only appear when the network misbehaves: error statuses, rejected requests, slow responses, and endpoints that fail then recover. Source: https://mswjs.io/docs/api/delay (accessed 2026-10-20)

## 1. Return an error status with a real body

```ts
import { http, HttpResponse } from "msw";

server.use(
  http.get("/api/users", () =>
    HttpResponse.json(
      { code: "rate_limited", message: "Too many requests" },
      { status: 429, headers: { "Retry-After": "30" } },
    ),
  ),
);
```

Send the body the real API sends. A test that only checks `status >= 400` passes while the UI shows "undefined" because the mock returned an empty body.

## 2. Fail the request instead of answering it

```ts
server.use(http.get("/api/users", () => HttpResponse.error()));
```

`HttpResponse.error()` makes `fetch` reject the way a dropped connection does. This is a different code path from a `500`: `response.ok` never runs, so the client's `catch` block is what gets tested. Covering both is the point.

## 3. Slow the response down on purpose

```ts
import { delay } from "msw";

server.use(
  http.get("/api/report", async () => {
    await delay(150);
    return HttpResponse.json({ rows: [] });
  }),
);
```

Keep the number in the low tens to low hundreds of milliseconds: enough to show a pending state, not enough to make the suite slow. For a random spread that catches ordering bugs, `delay({ min: 50, max: 250 })` returns a different duration per request.

## 4. Prove the client times out

```ts
server.use(
  http.get("/api/slow-report", async () => {
    await delay("infinite");
    return HttpResponse.json({});
  }),
);

it("aborts and shows a timeout message", async () => {
  const response = fetch("/api/slow-report", { signal: AbortSignal.timeout(50) });

  await expect(response).rejects.toThrow();
  expect(await screen.findByText("Taking longer than expected")).toBeInTheDocument();
});
```

`delay("infinite")` holds the request open forever, which is exactly what a hung backend looks like. The abort is what ends it — without a timeout in the client the test would hang, which is itself the finding.

## 5. Simulate an endpoint that recovers

```ts
it("retries once after a 503 and then renders the data", async () => {
  const attempts: number[] = [];

  server.use(
    http.get("/api/users", () => {
      attempts.push(Date.now());
      return attempts.length < 2
        ? new HttpResponse(null, { status: 503 })
        : HttpResponse.json([{ id: "1", name: "Ada" }]);
    }),
  );

  render(<UserList />);

  expect(await screen.findByText("Ada")).toBeInTheDocument();
  expect(attempts).toHaveLength(2);
});
```

Counter state lives inside the test so `resetHandlers()` restores both the handler and the count. A module-level counter leaks between tests and produces a failure that depends on run order.

## 6. Keep failure cases out of the happy path

```ts
export const handlers = [
  http.get("/api/users", () => HttpResponse.json([{ id: "1", name: "Ada" }])),
];
```

Base handlers describe the working system; every failure belongs in a `server.use()` inside the test that needs it. A base handler that fails by default means the happy path has to override it back, and nobody notices when it stops matching.

## 7. Verify

1. `/run-test` — the 429 test asserts the rendered message and the retry delay
2. The `HttpResponse.error()` test fails if the client has no `catch` branch
3. The timeout test finishes in well under a second and asserts the abort path
4. The retry test records exactly two attempts
5. Run the suite twice — the flaky-endpoint test passes both times, proving no leaked counter
6. `/run-verify`

## Pitfalls

- Treating a `500` as equivalent to a network failure; the client handles them in different places.
- Asserting only on the status code, so a body change that breaks the UI goes unnoticed.
- A long `delay()` in a base handler that slows every test that touches the endpoint.
- `delay("infinite")` without an abort in the client, which hangs the test instead of proving a timeout.
- Shared mutable counters across tests, producing order-dependent flakes.
- Mocking an error the real API cannot produce, which teaches the UI to handle fiction.
- Forgetting `resetHandlers()` after a `server.use()`, leaking the failure into later tests.

## Related

- `references/apis.md`
- `best-practices/handlers.md`
- `best-practices/wiring.md`
- `usecases/mock-api-in-tests.md`
- `usecases/graphql-handlers.md`
