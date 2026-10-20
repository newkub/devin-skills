# Use Case — Schema-Validated REST Endpoints

> Validate the body and params with `t.*`, return typed rows, and map failures to real HTTP statuses instead of 200-with-error. Source: https://elysiajs.com/essential/validation.html (accessed 2026-10-20)

## 1. Declare shapes once with `model`

```ts
// src/modules/todos.ts
import { Elysia, t } from "elysia"

const todoBody = t.Object({
  title: t.String({ minLength: 1, maxLength: 200 }),
  done: t.Optional(t.Boolean()),
})

export const todoRoutes = new Elysia({ prefix: "/todos" })
  .model({ todoBody })
  .get("/", async () => db.select().from(todos))
  .get("/:id", async ({ params, status }) => {
    const [row] = await db.select().from(todos).where(eq(todos.id, params.id))
    return row ?? status(404, { message: "Not found" })
  }, { params: t.Object({ id: t.String({ format: "uuid" }) }) })
  .post("/", async ({ body, status }) => {
    const [row] = await db.insert(todos).values(body).returning()
    return status(201, row)
  }, { body: "todoBody" })
```

`body` and `params` are inferred from the schema — no manual parsing, and an invalid payload is rejected before the handler runs.

## 2. One error mapping for the whole app

```ts
new Elysia()
  .onError(({ code, error, status }) => {
    switch (code) {
      case "VALIDATION":
        return status(422, { message: "Invalid request", details: error.message })
      case "NOT_FOUND":
        return status(404, { message: "Route not found" })
      default:
        return status(500, { message: "Internal error" })
    }
  })
  .use(todoRoutes)
```

## 3. Share the type with the client

```ts
// src/app.ts
export const app = new Elysia().use(todoRoutes)
export type App = typeof app
```

```ts
// client.ts
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "./src/app"

const api = edenTreaty<App>("http://localhost:3000")
const { data, error } = await api.todos.post({ title: "Write docs" })
if (error) throw new Error(error.value.message)
```

Eden derives the client types from the same `app` — no generated client to keep in sync.

## Pitfalls

- Returning `{ error }` with status 200 → clients cannot retry reliably; use `status(4xx, ...)`.
- `t.Any()` on a write endpoint → you lose the whole point of validation; describe the fields.
- Validating only the body → `params`/`query` are strings from the URL; coerce with `t.Numeric()` or `t.Object`.
- Adding `.use()` after routes that depend on it → hooks apply only to what registers later; compose in order.

## Related

- `references/apis.md`
- `best-practices/elysia.md`
- `usecases/plugin-with-scoped-hooks.md`
