# Use Case — Opt-In Mocking in Browser Dev

> Develop the frontend before the backend exists, behind a flag that every developer can ignore. Source: https://mswjs.io/docs/integrations/browser (accessed 2026-10-20)

## 1. Install and generate the worker

```sh
bun add -D msw
bunx msw init public/ --save
```

`--save` records the worker directory in `package.json` so later upgrades regenerate `public/mockServiceWorker.js` instead of leaving it stale.

## 2. Start a browser worker

```ts
// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

## 3. Gate it behind dev + an env flag

```ts
// src/main.ts
import { createRoot } from "react-dom/client";
import { App } from "./App";

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_MSW !== "1") return;
  const { worker } = await import("./mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: "/mockServiceWorker.js" },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
```

Run with `VITE_MSW=1 bun run dev`. The dynamic `import()` keeps MSW and the handlers out of the production bundle entirely.

## 4. Simulate latency and failures by hand

```ts
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from "msw";

let failNext = false;

export const handlers = [
  http.get("/api/users", async () => {
    await delay(400);
    if (failNext) {
      failNext = false;
      return new HttpResponse(null, { status: 503 });
    }
    return HttpResponse.json([{ id: "1", name: "Ada" }]);
  }),

  // flip a flag from the console: window.__failNext = true
  http.post("/__mock/fail-next", () => {
    failNext = true;
    return new HttpResponse(null, { status: 204 });
  }),
];
```

`bypass` lets unimplemented endpoints hit the real server; switch to `warn` to list them while you are filling in handlers.

## 5. Confirm the worker is live

Open DevTools → Application → Service Workers and check `mockServiceWorker.js` is activated, then look for the `[MSW] Mocking enabled` log before the first request.

## Pitfalls

- Loading MSW unconditionally ships the worker and the handlers into production — always guard on `import.meta.env.DEV` plus your own flag.
- `worker.start()` must resolve before the first `fetch`, otherwise the initial requests escape; await it before rendering.
- A stale `mockServiceWorker.js` after an MSW upgrade silently stops intercepting — re-run `bunx msw init public/ --save`.
- `onUnhandledRequest: 'error'` in dev is hostile when the real API is partly available; use `bypass` in dev and `error` in tests.
- Handlers that hardcode mock data diverge from the API contract; prefer a shared fixtures module and update it with the API.
- A service worker cannot intercept cross-origin requests without CORS — the mocked response still needs the headers the browser checks.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/handlers.md`
- `best-practices/wiring.md`
- `usecases/mock-api-in-tests.md`
