# Use Case — Schema and Config at the Edge

> Decode untrusted input and environment variables once with `Schema` and `Config`, so the rest of the program works with typed values. Source: https://effect.website/docs/schema/introduction (accessed 2026-10-20)

## 1. Decode an API payload

```ts
import { Effect, Schema } from "effect";

const User = Schema.Struct({
  id: Schema.String,
  email: Schema.String.pipe(Schema.pattern(/^[^@\s]+@[^@\s]+$/)),
  createdAt: Schema.DateFromString,
});

export type User = Schema.Schema.Type<typeof User>;

export const handleCreate = (body: unknown) =>
  Schema.decodeUnknown(User)(body).pipe(
    Effect.catchTag("ParseError", (error) =>
      Effect.fail(new BadRequest(error.message)),
    ),
  );
```

`Schema.decodeUnknown` returns an `Effect`, so a failure flows through the same channel as every other error — no `try/catch` around a parser. `Schema.decodeUnknownSync` exists for scripts and tests, not for a request handler.

`Schema.DateFromString` both validates and converts: after decoding, `createdAt` is a `Date`, not a string.

## 2. Read config as an effect

```ts
import { Config } from "effect";

const DbUrl = Config.string("DATABASE_URL");
const PoolSize = Config.integer("DB_POOL_SIZE").pipe(Config.withDefault(10));
const Debug = Config.boolean("DEBUG").pipe(Config.withDefault(false));

const config = Effect.all({ dbUrl: DbUrl, poolSize: PoolSize, debug: Debug });
```

`Config.withDefault` keeps optional values out of the failure channel. A missing required variable fails at startup with the variable name, which is the point — not at the first query.

Redact secrets with `Config.redacted("API_KEY")` so they never appear in logs or spans.

## 3. Compose into the boot effect

```ts
const boot = Effect.gen(function* () {
  const { dbUrl, poolSize } = yield* config;
  const pool = yield* Effect.tryPromise(() => createPool(dbUrl, poolSize));
  yield* Effect.logInfo("database pool ready");
  return pool;
});

const pool = await Effect.runPromise(boot);
```

Run the boot effect once, at the composition root. Passing a decoded config object into services turns every consumer into a validator again.

## 4. Verify

1. `/run-test` — a payload missing `email` fails with a `ParseError` naming the field
2. Remove `DATABASE_URL` — the process exits with a message naming it, not a connection error
3. `/run-typecheck` — `User["createdAt"]` is `Date`; assigning a string fails
4. `Effect.logDebug` output never contains the redacted value

## Pitfalls

- `Schema.decodeUnknownSync` inside a request handler, throwing where the effect channel expects a typed failure.
- Casting `body as User` and skipping the decode, which makes every later `Effect` a lie.
- Reading `process.env` in three places instead of one `Config` layer.
- `Config.withDefault` on a connection string, which hides a missing secret behind a localhost default.
- Decoding the same payload at two layers, so the error message and the type come from different schemas.

## Related

- `references/apis.md`
- `best-practices/effect.md`
- `usecases/typed-error-pipeline.md`
- `usecases/layer-composition-and-context.md`
