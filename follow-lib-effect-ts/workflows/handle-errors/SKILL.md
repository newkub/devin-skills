---
name: follow-lib-effect-ts-handle-errors
description: Effect error handling — TaggedError, catchTag*, Cause/Exit, defects vs expected errors, retry/Schedule
argument-hint: "[scope]"
related:
  - follow-lib-effect-ts
  - run-test
  - resolve-errors
---

## Goal

Handle errors in Effect type-safely — expected errors via the `E` channel, defects (bugs) kept separate, retry/timeout/schedule

## Scope

Effect's error model — `Data.TaggedError`, `Effect.catchTag*`, `Cause`/`Exit`, `Effect.retry`+`Schedule`, `Effect.timeout`

## Execute

### 1. Model Expected Errors

> Goal: Model Expected Errors.

```ts
import { Data } from "effect"

class NotFound extends Data.TaggedError("NotFound")<{ id: string }> {}
class DbError extends Data.TaggedError("DbError")<{ cause: unknown }> {}
// Schema.TaggedError when errors must serialize across a boundary
```

- `yield*` works for errors in `Effect.gen` (TaggedError is yieldable)

### 2. Catch And Recover

> Goal: Catch And Recover.

```ts
program.pipe(
  Effect.catchTag("NotFound", (e) => Effect.succeed(fallback)),
  Effect.catchTags({ DbError: (e) => Effect.fail(new Fatal(e)) }),
  Effect.catchAll((e) => ...),        // remaining: every expected error
  Effect.catchAllDefect((d) => ...),  // bugs/defects kept separate
  Effect.match({ onFailure, onSuccess }),
)
```

- `catchTag` narrows by `_tag`; `catchAll` handles the whole `E` channel
- `Effect.orElse`/`Effect.orElseFail` for fallback effects

### 3. Defects, Cause, Exit

> Goal: Defects, Cause, Exit.

- Defects = bugs (throws, type errors) — shouldn't be caught; inspect with `Cause`/`Effect.sandbox`
- `Effect.exit` → `Exit<A, E>` inspects success/failure without throwing (used in tests)
- `Effect.tapError`/`tapErrorTag` for logging without changing the outcome

### 4. Retry, Timeout, Schedule

> Goal: Retry, Timeout, Schedule.

```ts
Effect.retry(program, Schedule.exponential("100 millis").pipe(Schedule.compose(Schedule.recurs(5))))
Effect.timeout(program, "5 seconds")               // TimeoutException defect? no — Option/timeout error
Effect.timeoutOption / timeoutTo when a custom timeout result is needed
```

- `Schedule` combinators: `exponential`, `fixed`, `jittered`, `recurs`, `whileInput`

## Rules

- Expected errors use `TaggedError` — let defects pass through (don't swallow bugs)
- Never `try/catch` around Effect code — use the `catchTag*` combinators
- Retry only idempotent operations — mutations must account for side effects
- `Effect.timeout` = a real deadline enforced via interruption

## Expected Outcome

- Error types clearly separate expected vs defect
- Retry/timeout follow policy, errors traceable through Cause/Exit
