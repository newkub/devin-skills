# Use Case — OpenAPI, Swagger, and Route Detail

> Publish an accurate spec from the same schemas that validate traffic, so docs cannot drift from behaviour. Source: https://elysiajs.com/plugins/swagger.html (accessed 2026-10-20)

## 1. Mount the plugin once

```ts
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

export const app = new Elysia()
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: { title: "Acme API", version: "1.0.0" },
        tags: [
          { name: "Users", description: "Account lifecycle" },
          { name: "Orders", description: "Checkout and fulfilment" },
        ],
      },
    }),
  );
```

`/docs` serves the UI and `/docs/json` the raw spec. Mount it before routes so the generated document includes them; a plugin registered last can miss routes added earlier in some compositions.

Disable the plugin in production if the spec is internal, or keep it behind auth — the schema reveals every field name.

## 2. Attach detail per route

```ts
app.post(
  "/users",
  ({ body }) => createUser(body),
  {
    body: t.Object({ email: t.String({ format: "email" }), name: t.String() }),
    response: {
      200: t.Object({ id: t.String(), email: t.String(), name: t.String() }),
      422: t.Object({ message: t.String(), field: t.Optional(t.String()) }),
    },
    detail: {
      tags: ["Users"],
      summary: "Create a user",
      description: "Creates an account and sends a verification email.",
    },
  },
);
```

`detail.tags` decides where the route appears in the UI. `response` is what makes the spec show the real shape instead of an empty object — and it also validates the handler's return value at runtime.

## 3. Describe auth and errors

```ts
app.get("/me", ({ user }) => user, {
  detail: {
    tags: ["Users"],
    summary: "Current user",
    security: [{ bearerAuth: [] }],
    responses: { 401: { description: "Missing or invalid token" } },
  },
});
```

Declare the security scheme in the plugin config (`components.securitySchemes.bearerAuth`) and reference it by name. A route with `security` but no scheme renders a lock icon that documents nothing.

## 4. Verify

1. `/run-dev` → `/docs` — every route appears under the right tag
2. Send an invalid body from the UI — the 422 schema matches the real error payload
3. `/docs/json` — pipe into a validator (`bunx @redocly/cli lint`) with no errors
4. `/run-test` — a response that violates the declared schema fails the test, not just the docs

## Pitfalls

- Documenting routes with `detail` only and no `body`/`response` schema, producing a spec that drifts from the code.
- Adding `swagger()` after the routes and getting an incomplete document.
- Exposing `/docs` publicly on an internal API.
- Declaring `security` without the matching scheme, so the UI shows a lock that authorizes nothing.
- Trusting the spec as the contract without validating responses, so the docs describe a shape the server never returns.

## Related

- `references/apis.md`
- `best-practices/elysia.md`
- `usecases/validated-rest-crud.md`
- `usecases/eden-client-end-to-end.md`
