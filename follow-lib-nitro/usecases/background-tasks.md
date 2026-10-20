# Use Case — Background Tasks & Cron

> Run one-off or scheduled server-side actions (migrations, cleanup, sync) on demand, from the CLI, or on a cron. Source: https://nitro.build/docs/tasks (accessed 2026-10-20)

> Tasks are experimental — enable the flag and set `serverDir` (tasks are only scanned, never by default).

```ts [nitro.config.ts]
import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  experimental: {
    tasks: true,
  },
});
```

## 1. Define a task

Tasks live in `tasks/[name].ts` under `serverDir`; nested folders join the name with `:`.

```txt
server/
  tasks/
    cleanup.ts        <-- cleanup
    db/
      migrate.ts      <-- db:migrate
```

```ts [server/tasks/db/migrate.ts]
import { defineTask } from "nitro/task";

export default defineTask({
  meta: { name: "db:migrate", description: "Run database migrations" },
  run({ payload, context }) {
    console.log("Running DB migration task...");
    return { result: "Success" };
  },
});
```

- `meta` (optional): `name` + `description` for the dev server and CLI.
- `run(event)` (required): receives `{ name, payload, context }` and returns `{ result? }` (or a Promise of it).

## 2. Scheduled (cron)

```ts [nitro.config.ts]
export default defineConfig({
  serverDir: "./server",
  experimental: { tasks: true },
  scheduledTasks: {
    "* * * * *": ["cms:update"],   // array = run in parallel
    "0 * * * *": "db:cleanup",     // string shorthand
  },
});
```

Scheduled runs receive `payload.scheduledTime = Date.now()`. Platform support (verified):

| Preset | Scheduler |
|---|---|
| `dev`, `node_*`, `bun`, `deno_server` | croner engine; stops on the Nitro `close` hook |
| `cloudflare_module` / `cloudflare_pages` | native Cron Triggers — Nitro generates them into the wrangler config at build |
| `vercel` | native Vercel Cron Jobs — auto-generated; secure with `CRON_SECRET` |

## 3. Run programmatically

```ts [server/api/migrate.ts]
import { defineHandler } from "nitro";
import { runTask } from "nitro/task";

export default defineHandler(async (event) => {
  // IMPORTANT: authenticate the caller and validate the payload first
  const payload = Object.fromEntries(event.url.searchParams);
  const { result } = await runTask("db:migrate", { payload });
  return { result };
});
```

`runTask` throws `404` if the task doesn't exist and `501` if it has no handler.

## 4. Dev server & CLI

- `GET /_nitro/tasks` lists tasks + scheduledTasks; `POST /_nitro/tasks/:name` runs one (body `{ "payload": {...} }`).
- `nitro task list` and `nitro task run db:migrate --payload "{}"` — only while the dev server is running.

## 5. `waitUntil`

`context.waitUntil` (runtime-dependent) keeps the worker alive until background work finishes:

```ts
run({ context }) {
  const p = fetch(/* ... */);
  context.waitUntil?.(p);
  return { result: "scheduled" };
}
```

## Pitfalls

- No `serverDir`/`scanDirs` → tasks are never scanned (`501`/absent).
- Forgetting `experimental.tasks: true` → the tasks API isn't wired.
- Config `tasks[].handler` path resolved against project root → use an absolute path via `fileURLToPath(new URL(..., import.meta.url))`.
- Triggering a task from a public route without auth → anyone can run your migrations/cleanup.
- Expecting two concurrent runs of the same task → runs are de-duplicated by name; concurrent callers share the first in-flight result (even with different payloads).

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/deploy.md`
