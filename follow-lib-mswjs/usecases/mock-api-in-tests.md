# Use Case — Mock the API Inside the Test Suite

> Make unit and integration tests deterministic by intercepting HTTP at the network layer, with per-test overrides for error cases. Source: https://mswjs.io/docs/integrations/node (accessed 2026-10-20)

## 1. Share one handler list

`src/mocks/handlers.ts` is the single source of mocked endpoints — browser dev and tests import the same file.

```ts
import { http, HttpResponse, delay } from "msw";

export const handlers = [
  http.get("/api/users", () => HttpResponse.json([{ id: "1", name: "Ada" }])),
  http.post("/api/users", async ({ request }) => {
    const body = (await request.json()) as { name: string };
    return HttpResponse.json({ id: "2", ...body }, { status: 201 });
  }),
  http.get("/api/users/:id", ({ params }) =>
    HttpResponse.json({ message: "not found" }, { status: 404 }),
  ),
];
```

Relative URLs resolve against `location` in the browser and are matched loosely in Node — use the real base URL if the client hardcodes one.

## 2. Start a Node server

```ts
// src/mocks/node.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

## 3. Wire the lifecycle once

```ts
// src/test/setup.ts
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "../mocks/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```ts
// vitest.config.ts
export default defineConfig({
  test: { setupFiles: ["src/test/setup.ts"] },
});
```

`resetHandlers()` after each test is what keeps per-test overrides from leaking into the next one.

## 4. Override per test

```ts
import { http, HttpResponse, delay } from "msw";
import { server } from "../mocks/node";

it("shows an error banner when the list request fails", async () => {
  server.use(
    http.get("/api/users", async () => {
      await delay(10);
      return new HttpResponse(null, { status: 500 });
    }),
  );

  render(<UserList />);
  expect(await screen.findByRole("alert")).toHaveTextContent("failed to load");
});
```

For an offline/network-error path use `return HttpResponse.error()` instead of a status code — the client then rejects like a real socket failure.

## 5. Keep tests honest

1. `onUnhandledRequest: "error"` in CI so an unmocked endpoint fails the test instead of hitting the real network
2. Assert on what the UI renders, not on that a handler was called
3. Run the suite with network access disabled once to prove nothing escapes

## Pitfalls

- Patching `fetch` or `axios` instead of using MSW breaks once the HTTP client changes — intercept only at the network layer.
- Forgetting `server.close()` in `afterAll` leaves the interceptor installed and hangs the runner.
- A `500` response is not a network error; `HttpResponse.error()` is what exercises the reject path.
- Overrides registered with `server.use()` persist until `resetHandlers()` — order-dependent tests usually come from a missing reset.
- Handlers drift from the real contract; update them when the API changes and assert the 4xx shapes the UI depends on.
- `delay()` with a long timeout in every test slows the suite — keep it in the low tens of ms.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/handlers.md`
- `best-practices/wiring.md`
- `usecases/browser-dev-mocking.md`
