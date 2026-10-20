# Use Case — Effects Through Cmd and Services

> Keep `core.ts` inside the compiled subset while still doing file I/O, HTTP, and SQLite — effects go out as `Cmd`, full-TS work lives in services. Source: https://native-sdk.dev (accessed 2026-10-20)

## 1. Model the state and every message

```ts
// src/core.ts
export type Model = Readonly<{ count: number; running: boolean; saving: boolean }>;

export type Msg =
  | { type: "increment" }
  | { type: "toggle" }
  | { type: "tick" }
  | { type: "save" }
  | { type: "saved" }
  | { type: "save-failed"; message: string };
```

The model is a plain readonly record and the message union is closed — that is what lets the compiler check `update` exhaustively.

## 2. Return `[model, cmd]` from update

```ts
export function update(model: Model, msg: Msg): Model | [Model, Cmd<Msg>] {
  switch (msg.type) {
    case "increment":
      return { ...model, count: model.count + 1 };
    case "toggle":
      return { ...model, running: !model.running };
    case "tick":
      return { ...model, count: model.count + 1 };
    case "save":
      return [{ ...model, saving: true }, Cmd.persist()];
    case "saved":
      return { ...model, saving: false };
    case "save-failed":
      return [{ ...model, saving: false }, Cmd.showNotification(msg.message)];
  }
}
```

A bare `Model` means "no effect"; a tuple means "apply this effect after the state is committed". Never mutate the model in place — the runtime diffs the returned record.

## 3. Subscribe only while the model says so

```ts
export function subscriptions(model: Model): Sub<Msg> {
  if (!model.running) return Sub.timer("idle", 30_000, "tick");
  return Sub.timer("tick", 1_000, "tick");
}
```

Timers stop when the returned subscription stops including them — there is no manual interval to clear.

## 4. Push ordinary TypeScript into a service

Put code the core subset cannot express (regex, JSON parsing, `Map`, `Date`, `child_process`) in `src/services/` and call it by name:

```ts
// src/core.ts — inside update
case "save":
  return [
    { ...model, saving: true },
    Cmd.request("write-report", { count: model.count }, { key: "report", ok: "saved", err: "save-failed" }),
  ];
```

```ts
// src/services/report.ts — ordinary TS, runs on the <app>_services carrier
export async function writeReport(input: { count: number }) {
  const report = new Map([["count", String(input.count)]]);
  await Bun.write("report.txt", [...report].map(([k, v]) => `${k}=${v}`).join("\n"));
  return { ok: true };
}
```

`Cmd.request` fans the result back in as the `ok`/`err` messages, so the update loop stays pure.

## 5. Use the native data capabilities instead of rolling your own

1. Declare the capability in `app.json` — the manifest is what `native validate app.json` checks
2. `persist` gives `Cmd.persist()`: debounced snapshot with a `.bak`, plus `migrate(snapshot, fromVersion)`
3. `store` gives key-value access — `Cmd.store.set/get/delete/scan/setMany` (key ≤512B, value ≤1MiB)
4. `sqlite` gives `app.db` in WAL mode; name queries in `src/queries.sql` so the CLI generates typed `Cmd.qName` and `Sub.qName`

## 6. Verify before claiming done

```sh
native check --strict
native test
native build -Dautomation=true && native automate snapshot
```

## Pitfalls

- Memory is a 1 MiB per-dispatch arena — anything held across dispatches outside the `Model` is a bug, not a leak you can debug later.
- Text is bytes: use `utf8Bytes`/`asciiBytes` and byte offsets, not JS code units, or slicing corrupts non-ASCII.
- Relative imports only, under `src/`, no `../`, no cycles, no `export default` — the bundler for the core is stricter than Bun.
- Hiding the window on close on Windows needs the `tray` capability; without it the window is gone and the app looks crashed.
- Reading a path outside the app roots requires the `filesystem` permission — otherwise the call fails at runtime, not at check time.
- Calling a service by a name that is not exported fails only at invocation; keep the `Cmd.request` name and the export in sync.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/ts-core-subset.md`
- `best-practices/native-ui-markup.md`
- `best-practices/automation-testing.md`
- `usecases/scaffold-app.md`
