# Use Case — Persistence, Key-Value Store, and SQLite

> Pick the smallest store that answers the question: a model snapshot for the whole state, key-value for a few settings, SQLite for anything you query. Source: https://native-sdk.dev (accessed 2026-10-20)

## 1. Declare the capability first

Persistence, key-value, and SQLite are opt-in capabilities. The API compiles either way, so a missing declaration fails at runtime, not at `native check`:

```sh
native validate app.json
```

Add the capability (`persist`, `store`, or `sqlite`) to `app.json`, then run the validator again before writing the call.

## 2. Snapshot the model with a migration

```ts
// src/core.ts
export function migrate(snapshot: unknown, fromVersion: number): Model {
  if (fromVersion < 3) {
    const legacy = snapshot as { count?: number; items?: readonly Item[] };
    return { ...initialModel(), count: legacy.count ?? 0, items: legacy.items ?? [] };
  }

  return snapshot as Model;
}
```

`Cmd.persist()` writes a debounced snapshot (`snapshot.nsd` plus a `.bak`) and calls `migrate` on the way back in. The version bump is what makes the old shape addressable — without a branch per version, a renamed field silently loads as `undefined`. The checker enforces the migrate contract (NS1068), so a missing migration is a compile error rather than corrupt state.

## 3. Persist after a state change

```ts
case "increment":
  return [{ ...model, count: model.count + 1 }, Cmd.persist()];

case "note-added":
  return [{ ...model, items: [...model.items, msg.note] }, Cmd.persist()];
```

Return the new model in the tuple, then the effect. The runtime commits the state before running the command, so the snapshot always contains the value the user just saw.

## 4. Use the key-value store for a few settings

```ts
case "theme-changed":
  return [{ ...model, theme: msg.theme }, Cmd.store.set("theme", msg.theme)];
```

Bounds are the design constraint: keys up to 512 B, values up to 1 MiB, with `Cmd.store.scan` for enumeration and `Cmd.store.setMany` for a batch. A store is not a database — storing a growing list under one key turns every write into a full rewrite and eventually crosses the size limit.

## 5. Put queryable data in SQLite

```sql
-- src/schema/0002_notes.sql
CREATE TABLE note (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX note_updated_idx ON note (updated_at DESC);
```

```sql
-- src/queries.sql
-- name: notesList :live
SELECT id, title, updated_at FROM note ORDER BY updated_at DESC;

-- name: noteInsert
INSERT INTO note (id, title, body, updated_at) VALUES (?, ?, ?, ?);
```

```ts
case "boot":
  return [model, Cmd.notesList({}, "notes-loaded")];

case "add-note":
  return [model, Cmd.noteInsert([msg.id, msg.title, msg.body, msg.at], "note-saved")];
```

```sh
native db new-migration add-notes   # creates src/schema/0003_add_notes.sql
native db status
```

A named query becomes a generated `Cmd.qName(params, route)` — the second argument is the message that receives the result — and a `:live` query also becomes a `Sub.qName`, so the view refreshes when the table changes. The app database runs in WAL mode, which is why a read during a write does not block.

## 6. Choose the store deliberately

| Need | Use | Reason |
|------|-----|--------|
| Whole model survives a restart | `Cmd.persist()` | One snapshot, versioned, debounced |
| A handful of preferences | `Cmd.store.*` | Cheap random access, no schema |
| Lists you filter, sort, or join | SQLite | Indexes, queries, live subscriptions |
| Payload larger than 1 MiB | A file via `Cmd.writeFile` with the `filesystem` permission | Both memory stores cap out |

## 7. Verify

1. `native db status` — the migration is applied, no pending version
2. Add a note, quit, relaunch — the note is present and the list is ordered by `updated_at`
3. Change the theme, relaunch — the value comes back from the store, not from the default
4. Lower the snapshot version artificially and load it — `migrate` takes the legacy branch without crashing
5. `native test` — the `NativeApp` snapshot shows the persisted items after a simulated restart
6. Insert 1,000 rows and confirm the `:live` query still drives the list through `Sub`

## Pitfalls

- Writing to `app.db` in `update` directly instead of returning a `Cmd` — the core has no runtime and no async.
- Bumping the schema version without a migration file, so an existing install fails at startup.
- Storing a list in one key-value entry and hitting the 1 MiB value cap.
- Forgetting `native db new-migration` before editing a schema file that already shipped.
- Passing more than 64 parameters to one query, or returning more than 1 MiB from it.
- Treating `:live` as a polling subscription — it fires on table changes, so a write from outside the app still refreshes the view.
- Migrating by casting `snapshot as Model` without checking the version, which loses data on the first rename.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/ts-core-subset.md`
- `best-practices/packaging-platform-security.md`
- `usecases/cmd-and-services.md`
- `usecases/windows-menus-and-permissions.md`
