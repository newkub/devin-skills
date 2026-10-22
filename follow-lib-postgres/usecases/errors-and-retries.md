# Use Case — Map Postgres Errors and Retry Only What Is Safe

> Database errors reach the query that caused them with a PostgreSQL SQLSTATE in `code`. Branching on that code is what turns a 500 into a 409, and retrying the wrong code multiplies load without ever succeeding. Source: https://github.com/porsager/postgres#error-handling (accessed 2026-10-20)

## 1. Read the code, not the message

```ts
// src/db/errors.ts
export function dbCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code?: unknown };
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}
```

Errors from the database arrive in the native Postgres format, so `code` is the five-character SQLSTATE. `message` is localized and version-dependent — a test that matches `"duplicate key"` breaks on the next server upgrade.

## 2. Map the codes an API can act on

```ts
export function toHttpResult(error: unknown) {
  switch (dbCode(error)) {
    case "23505":
      return { status: 409, code: "DUPLICATE", message: "That value is already taken." };
    case "23503":
      return { status: 422, code: "MISSING_REFERENCE", message: "A referenced record does not exist." };
    case "23502":
      return { status: 422, code: "MISSING_FIELD", message: "A required field is empty." };
    case "40001":
    case "40P01":
      return { status: 503, code: "RETRY_LATER", message: "Please retry the request." };
    default:
      return { status: 500, code: "DB_ERROR", message: "Database error." };
  }
}
```

`23505` is a unique violation, `23503` a foreign-key violation, `23502` a not-null violation, `40001` a serialization failure, and `40P01` a deadlock. A unique violation does not say which index fired — decide from the endpoint that ran the insert, or check the driver's error fields for the constraint name.

## 3. Retry only serialization failures and deadlocks

```ts
const RETRYABLE = new Set(["40001", "40P01"]);

export async function withRetry<T>(work: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await work();
    } catch (error) {
      if (attempt >= attempts || !RETRYABLE.has(dbCode(error) ?? "")) throw error;
      const backoff = 25 * 2 ** (attempt - 1) + Math.random() * 25;
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
}
```

Both codes mean the transaction was aborted before committing, so re-running it is correct. Wrap the whole `sql.begin`, never a single statement inside it:

```ts
await withRetry(() =>
  sql.begin(async (tx) => {
    await tx`select id from accounts where id = ${from} for update`;
    await tx`select id from accounts where id = ${to} for update`;
    await tx`update accounts set balance = balance - ${amount} where id = ${from}`;
    await tx`update accounts set balance = balance + ${amount} where id = ${to}`;
  }),
);
```

`for update` on both rows in a fixed order is what makes the deadlock rare in the first place; the retry handles the case where two requests still cross.

## 4. Do not retry a unique violation

```ts
try {
  await sql`insert into users ${sql({ email, passwordHash })}`;
} catch (error) {
  if (dbCode(error) === "23505") {
    throw new ConflictError("email", "An account with this email already exists.");
  }
  throw error;
}
```

The same insert fails identically forever, and each retry burns a connection. Turn it into a field-level validation error instead. The same rule applies to `23503` and `22001` (value too long for the column) — the input has to change.

## 5. Keep the statement out of the response

```ts
catch (error) {
  logger.error("query failed", {
    code: dbCode(error),
    statement: (error as { query?: string }).query,
    parameters: (error as { parameters?: unknown[] }).parameters,
  });
  return c.json({ error: "Internal error" }, 500);
}
```

The driver attaches `query` and `parameters` to query errors, but keeps them non-enumerable so they are easy to log and hard to leak by accident. Access them explicitly server-side; a serialized `error` in an HTTP body would expose table names, SQL, and the values that were bound to it — including secrets if they were passed as parameters.

## 6. Treat connection failures differently

```ts
process.on("SIGTERM", async () => {
  await sql.end({ timeout: 5 });
});
```

`CONNECTION_ENDED` after `end()` means the process is shutting down and a request raced it; `CONNECTION_DESTROYED` means the drain timeout expired with queries pending; `CONNECT_TIMEOUT` means the startup handshake never finished. None of these are fixed by retrying the query forever — surface them as 503 and let the load balancer route elsewhere.

## 7. Verify

1. Insert a duplicate email — the response is 409 with a field-level message, and no SQL appears in the body
2. Insert an order for a missing user — 422 with a reference error
3. Fire two concurrent transfers from the same account — both either commit or one returns 503 after three attempts, and the balances still add up
4. Break a query in development — 500 returned, with the statement and parameters visible in the server log only
5. Call `sql.end()` then run a query — `CONNECTION_ENDED` is logged, the request does not hang
6. Grep the response fixtures for `insert into`, `parameters`, and table names — nothing found
7. `/run-test` — a unit test throwing a stub with `code: "23505"` and asserting the 409 mapping

## Pitfalls

- Matching on `error.message`, which changes with server locale and version — use the SQLSTATE.
- Retrying `23505`/`23503`: deterministic failures that amplify load.
- Retrying a statement instead of the transaction, leaving part of the work applied.
- Retrying work that already caused a side effect outside the database (an email, a charge).
- Returning `error.message` to the client, leaking table, column, and constraint names.
- Serializing the whole error into logs and shipping the bound parameters to a third-party aggregator.
- Catching inside `sql.begin` and continuing, which commits an incomplete transaction.
- Treating a pool connection error as a query error, so the handler retries a dead connection instead of returning 503.

## Related

- `references/apis.md`
- `best-practices/postgres-js.md`
- `usecases/transactions-with-rollback.md`
- `usecases/result-types-and-transforms.md`
