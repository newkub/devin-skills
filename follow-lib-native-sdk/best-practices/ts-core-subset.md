# TypeScript Core Subset (compiled AOT — no runtime)

`src/core.ts` is not ordinary TypeScript — it is checked then compiled to native code; every line must stay in the subset

## Recommended patterns

- Model is a readonly record — every field immutable; new state comes back only from `update`
  ```ts
  type Model = {
    readonly count: i32;
    readonly name: Str;
    readonly items: readonly Item[];
  };
  ```
- Msg is a discriminated union + `update` uses an exhaustive switch (no `default` that swallows new cases)
  ```ts
  type Msg =
    | { readonly kind: "increment" }
    | { readonly kind: "load"; readonly key: Str }
    | { readonly kind: "fetched"; readonly ok: Bool; readonly body: Str };

  export function update(model: Model, msg: Msg): Model | [Model, Cmd<Msg>] {
    switch (msg.kind) {
      case "increment": return { ...model, count: model.count + 1 };
      case "load": return [model, Cmd.fetch(msg.key, "fetched")];
      case "fetched": return { ...model, name: msg.body };
    }
  }
  ```
- Effect orchestration: `initialModel()` may return `[Model, Cmd]`; `update` returns `Model` (pure state) or `[Model, Cmd<Msg>]` (state + effect) — never perform side effects directly in update
- Subscriptions declarative: `subscriptions(model): Sub<Msg>` — e.g. `Sub.timer("tick", 1000, "tick")` turned on/off by state (no manual setInterval)
- Commonly used Cmd vocabulary: `Cmd.none/now/delay/fetch/readFile/writeFile/appendFile/statFile/deleteFile/clipboardRead/clipboardWrite/showNotification/openExternalUrl/spawn/quitApp/persist/store.set/db.query/Cmd.request/Cmd.batch/Cmd.cancel` — bind the returned result to the matching `Msg` kind
- Text is bytes: use `utf8Bytes`/`asciiBytes` from `@native-sdk/core`; slice/index are byte offsets, not UTF-16 code units — you can cut mid-multibyte, so think in bytes
- Modules: relative imports with the real filename under `src/` (e.g. `import { Item } from "./item.ts"`), no `../`, no circular imports, no `export default` / `export x =` / `export *`
- Classes allowed only as "data classes" — the checker converts them to records (no inheritance, no methods holding hidden state)
- Services are the official escape hatch: regex/JSON/Map/Set/Date/class logic/child_process/filesystem work → write it in `src/services/` (full ordinary TS, compiled to native) then call from core via `Cmd.request(name, payload, { key, ok, err })` or a typed client (`feedsParse(request, {key, ok, err})` from `@native-sdk/services`) — separate carrier (`<app>_services` process on desktop)
- Memory: per-dispatch arena 1 MiB — anything crossing dispatches must live only in `Model`

## Pitfalls

- Forbidden in core (checker rejects): npm imports (except `@native-sdk/core`), regex, `JSON.*`, Promises/`async`/`await`, `eval`, class inheritance, `Map`/`Set`, mutable module-level state, `Date.now()`/random directly (ambient time/randomness forbidden — use `Cmd.now`/timer msg), runtime type tests (`instanceof`)
- deferred: generators, `BigInt`, `Symbol` — don't use them
- error from service: `throw { kind, message }` (plain object union) — the core side receives it as a declared `err` msg
- streaming service: `emit` + `@streamBuffer`, `@deadlineMs` default 30s — set the request's key to match the Msg that waits
- rules the checker enforces: NS1065/1066/1067 (service boundary), NS1068 (persist migrate) — error codes start with `NS`, search them in the docs
- don't translate a task into async/await in core — the correct pattern is split into msgs: request msg → Cmd → result msg → update
