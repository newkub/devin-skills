# Effect-TS — Best Practices

Patterns for Effect — services, layers, error handling and boundary discipline

## Recommended Patterns

- `Effect.gen` for composition — yield* effects, written like imperative but lazy until run
- Services via `Context.Tag` + `Layer` — typed dependency injection; compose layers at bootstrap
- Errors as values: `Effect.fail`, `Effect.catchTag`, `Effect.catchAll` — catch only the tags you can handle
- `Effect.runPromise`/`BunRuntime.runMain` at the entry point only — everything inside the program is an Effect
- Schema (`effect/Schema` or `@effect/schema`) for boundary validation — decode/encode typed

## Common Pitfalls

- Effect is lazy — creating it does nothing until `run*`; don't forget to run or assume code executes immediately
- `Effect.tryPromise` wraps async — never put bare `await` inside gen (breaks the fiber model)
- Layers: the dependency order must be right — `Layer.provide` chain; a circular layer = a hard-to-debug runtime error
- Don't mix `Promise` + `Effect` freely — convert only at the boundary (`Effect.promise`, `Effect.runPromise`)
- Defects vs typed errors vs interruptions — 3 different channels; the typed `E` is expected errors only

## Perf Notes

- Fibers are cheaper than native promises — structured concurrency via `Effect.fork`, `Effect.all` (parallel)
- `Effect.cached`/`MemoMap` for expensive computations — memoize at the layer level
- Tracing/logging: built-in `Effect.withSpan` + Logger — don't sprinkle console.log inside fibers

## Do / Don't

| Do | Don't |
|----|-------|
| `runPromise`/`runMain` at the boundary | `run*` in the middle of business logic |
| `catchTag` on a specific error type | `catchAll` swallowing everything |
| `Layer` composition at boot | hand-constructing services at every call site |
| `Effect.all` parallel | sequential `await` chains that are independent |
