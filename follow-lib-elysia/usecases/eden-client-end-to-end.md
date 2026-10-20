# Use Case — Type-Safe Client with Eden

> Export the app type, import it in the client, and get every route, body, and response typed without a code generator. Source: https://elysiajs.com/eden/treaty/overview (accessed 2026-10-20)

## 1. Export the type, not the app

```ts
// server.ts
import { Elysia, t } from "elysia";

export const app = new Elysia()
  .post("/users", ({ body }) => ({ id: crypto.randomUUID(), name: body.name }), {
    body: t.Object({ name: t.String({ minLength: 1 }) }),
  })
  .get("/users/:id", ({ params }) => ({ id: params.id, name: "Ada" }));

export type App = typeof app;
```

`export type App` is erased at build time — the client imports only the type and never bundles the server. Exporting the instance itself would pull the database client into the browser.

## 2. Create the client

```ts
import { treaty } from "@elysiajs/eden";
import type { App } from "../server";

export const api = treaty<App>("http://localhost:3000");
```

The base URL is the only untyped part. In production, read it from config once; a hardcoded localhost that ships is the classic Eden bug.

`treaty<App>` returns a proxy: `api.users.post(...)` maps to `POST /users`, `api.users({ id }).get()` maps to `GET /users/:id`.

## 3. Call with explicit success and failure branches

```ts
const { data, error } = await api.users.post({ name: "Ada" });

if (error) {
  switch (error.status) {
    case 422:
      return showFieldErrors(error.value);
    default:
      throw new Error(`request failed: ${error.status}`);
  }
}

return data.id;
```

Eden never throws for an HTTP error — it returns a discriminated result. `data` is `null` when `error` is set, so narrowing on `error` first keeps both branches typed.

`error.value` is typed from the route's error schema when one is declared; without it, the value is `unknown` and must be validated before display.

## 4. Compose with a data layer

```ts
export const usersQuery = {
  queryKey: ["users"],
  queryFn: async () => {
    const { data, error } = await api.users.get();
    if (error) throw new Error(String(error.status));
    return data;
  },
};
```

Unwrapping Eden inside the query function keeps the cache layer framework-agnostic. Do not spread `error` into the cache — throw, so the caller gets a retryable failure.

## 5. Verify

1. `/run-typecheck` — rename a route on the server and the client call fails to compile
2. Send `{ name: "" }` — Eden returns the 422 branch, not a thrown exception
3. `/run-test` — the client is constructed against a mock base URL, not localhost
4. `/run-build` — the client bundle contains no server import

## Pitfalls

- Importing `app` instead of `type App`, which drags the server bundle into the client.
- Assuming Eden throws on 4xx/5xx and wrapping it in `try/catch` that never fires.
- Hardcoding the base URL, so a preview deploy talks to localhost.
- Declaring the route body without a schema, which types the body as `unknown` and hides the mismatch.
- Sharing the `api` proxy across requests on the server without passing the incoming headers.

## Related

- `references/apis.md`
- `best-practices/elysia.md`
- `usecases/validated-rest-crud.md`
- `usecases/openapi-and-swagger.md`
