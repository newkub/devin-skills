# Use Case — REST API (CRUD)

> Build a JSON API with file-based routes, validation, and structured errors. Source: https://nitro.build/docs/routing, /docs/h3-utilities (accessed 2026-10-20)

## Enable scanning

Filesystem routing requires `serverDir` (or `scanDirs`); nothing is scanned by default.

```ts [nitro.config.ts]
import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
});
```

## File → URL mapping

| File | Route |
|---|---|
| `server/routes/hello.ts` | `/hello` |
| `server/routes/api/users.get.ts` | `GET /api/users` |
| `server/routes/api/users.post.ts` | `POST /api/users` |
| `server/routes/api/users/[id].get.ts` | `GET /api/users/:id` |
| `server/routes/api/[org]/[repo].ts` | `/api/:org/:repo` (one param per folder) |
| `server/routes/[...].ts` | catch-all fallback |

- Append the HTTP method to the filename to match one method only; a path matched only by other methods gets `405 Method Not Allowed` + an `Allow` header.

## List + create (verified from /docs/routing)

```ts [server/routes/api/users.get.ts]
import { defineHandler } from "nitro";
import { useDatabase } from "nitro/database";

export default defineHandler(async () => {
  const db = useDatabase();
  const { rows } = await db.sql`SELECT id, firstName, lastName FROM users`;
  return rows;
});
```

```ts [server/routes/api/users.post.ts]
import { defineHandler, createError } from "nitro";
import { useDatabase } from "nitro/database";
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string(),
  email: z.email(),
});

export default defineHandler(async (event) => {
  const body = await event.req.json();
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid body", data: parsed.error.flatten() });
  }
  const db = useDatabase();
  const id = crypto.randomUUID();
  await db.sql`INSERT INTO users (id, firstName, lastName, email) VALUES (${id}, ${parsed.data.firstName}, ${parsed.data.lastName}, ${parsed.data.email})`;
  return { id, ...parsed.data };
});
```

## Read one by dynamic param

```ts [server/routes/api/users/[id].get.ts]
import { defineHandler, createError } from "nitro";
import { useDatabase } from "nitro/database";

export default defineHandler(async (event) => {
  const { id } = event.context.params;
  const db = useDatabase();
  const { rows } = await db.sql`SELECT * FROM users WHERE id = ${id}`;
  const user = rows[0];
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  return user;
});
```

## Conventions

- Return a plain object/array → Nitro serializes to JSON with the right `content-type`.
- Read the body with `event.req.json()` (web `Request`); read query with `event.url.searchParams`.
- Always signal failures with `createError({ statusCode, statusMessage })` — never return a bare string for an error.
- Split shared logic into `server/utils/*` (auto-imported) so a route file exports one handler only.

## Pitfalls

- No `serverDir`/`scanDirs` set → routes are never registered (404 everywhere).
- Two dynamic params in one filename → invalid; each `[param]` must be its own folder segment.
- Trusting `event.req.json()` without validation → malformed/unsafe input reaches the DB.
- Mutating module-scope state to "remember" data across requests → wrong under concurrency and on edge (instance recycled per request).
