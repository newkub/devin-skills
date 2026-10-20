# Use Case — Layer Composition and Context

> Declare services as tags, build them in layers, and swap the live layer for a test one without touching the program. Source: https://effect.website/docs/requirements-management/layers (accessed 2026-10-20)

## 1. Declare the service shape

```ts
import { Context, Effect } from "effect";

export class Database extends Context.Tag("app/Database")<Database, {
  readonly query: (
    sql: string,
    params?: ReadonlyArray<unknown>,
  ) => Effect.Effect<ReadonlyArray<Record<string, unknown>>>;
}>() {}

export class Mailer extends Context.Tag("app/Mailer")<Mailer, {
  readonly send: (to: string, subject: string) => Effect.Effect<void>;
}>() {}
```

The tag name is a stable string (`app/Database`) so two modules cannot create colliding tags. The service is an interface — no class instance, no constructor, which is what makes the test layer trivial.

## 2. Build layers and wire dependencies

```ts
import { Layer } from "effect";

export const LiveDatabase = Layer.succeed(Database, {
  query: (sql, params) =>
    Effect.tryPromise(() => pool.query(sql, params as unknown[])).pipe(Effect.orDie),
});

export const LiveMailer = Layer.effect(
  Mailer,
  Effect.gen(function* () {
    const db = yield* Database;
    return {
      send: (to, subject) =>
        db.query("insert into outbox (recipient, subject) values ($1, $2)", [to, subject]).pipe(
          Effect.asVoid,
        ),
    };
  }),
);

export const Live = Layer.mergeAll(LiveDatabase, LiveMailer);
```

`Layer.effect` is for a service that needs other services; `Layer.succeed` is for a value with no dependencies. `Layer.mergeAll` keeps both available to the program — neither is hidden.

Order matters for `Layer.provide`, not for `mergeAll`: a layer can only consume services provided to it.

## 3. Provide at the edge, swap in tests

```ts
const program = Effect.gen(function* () {
  const db = yield* Database;
  const mailer = yield* Mailer;
  yield* db.query("select 1");
  yield* mailer.send("a@b.c", "hello");
});

const runnable = program.pipe(Effect.provide(Live));

export const TestLayer = Layer.mergeAll(
  Layer.succeed(Database, { query: () => Effect.succeed([{ id: 1 }]) }),
  Layer.succeed(Mailer, { send: () => Effect.void }),
);
```

`Effect.provide` appears once, at the run site. Services yielded inside `program` are satisfied by the context; the test replaces the whole layer set and asserts on calls instead of hitting a database.

## 4. Verify

1. `/run-typecheck` — removing `Effect.provide(Live)` makes the program unrunnable (`R` not satisfied)
2. `/run-test` — the same program passes with `TestLayer` and no network
3. A service that needs `Database` fails to compile if `LiveDatabase` is not in the merged layer
4. `/run-build` — no `Layer` is constructed per request

## Pitfalls

- Declaring the same tag twice (two modules, same name string), which produces a runtime "service not found".
- Using `Layer.succeed` for a service that needs dependencies, forcing a leaky global for the pool.
- Providing a layer inside a service instead of at the edge, which hides the dependency graph.
- Building the live layer per request, opening a pool each time.
- Returning the tag instead of the service value from `Effect.gen`, so downstream `yield*` sees the wrong type.

## Related

- `references/apis.md`
- `best-practices/effect.md`
- `usecases/retry-and-services.md`
- `usecases/schema-and-config-boundary.md`
