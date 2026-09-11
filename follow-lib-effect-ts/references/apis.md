# Lib Effect Ts API & Dependencies

## Install

```sh
# Runtime dependency — do NOT use -D/--save-dev
bun add effect
```

## Versions (verified 2026-09-11)

- `effect` latest stable: `3.22.2` (v4 RC: `4.0.0-rc.113`)
- `@effect/platform`: `0.97.2`
- `@effect/platform-bun`: `0.91.2`
- `@effect/platform-node`: `0.108.2`
- `@effect/vitest`: `0.30.0` (peers: `effect ^3.22.0`, `vitest ^3.2.0`)
- [Package Registry](https://www.npmjs.com/package/effect)
- [Repository](https://github.com/Effect-TS/effect)

## Import Styles

```ts
// Namespace style (recommended, idiomatic in docs)
import { Effect, Schema, Layer, Context, Schedule, Option, Either } from "effect"

// Subpath style (equivalent — pick one style per project)
import * as Effect from "effect/Effect"
```

## Common Modules (core `effect` package)

| Module | Purpose |
|---|---|
| `Effect` | Core effect type — gen, succeed, fail, all, retry, timeout, scoped, run* |
| `Schema` | Data validation — Struct, Class, TaggedError, decode/encode, parseJson |
| `Context` | DI tags — Tag, GenericTag, Reference |
| `Layer` | Service construction — succeed, effect, scoped, mock, merge, provide, memoize |
| `Data` | Structural data — TaggedError, TaggedClass, struct, tuple |
| `Option`, `Either` | Domain value types (yieldable) |
| `Schedule` | Retry/repeat policies — exponential, spaced, cron, jittered |
| `Config`, `ConfigProvider` | Env/runtime configuration |
| `Stream`, `Sink`, `Channel` | Streaming data pipelines |
| `Fiber`, `Deferred`, `Semaphore`, `Queue`, `PubSub` | Concurrency primitives |
| `Scope` | Resource lifetime management |
| `Exit`, `Cause` | Result inspection — failures + defects |
| `Logger`, `Metric`, `Tracer` | Observability |
| `TestClock`, `TestContext` | Deterministic test services |
| `ManagedRuntime`, `Runtime` | Running layer-provided effects |

## @effect/platform Packages

| Package | Purpose |
|---|---|
| `@effect/platform` | FileSystem, Path, Terminal, HttpClient, PlatformError |
| `@effect/platform-node` | NodeRuntime, NodeContext, NodeFileSystem |
| `@effect/platform-bun` | BunRuntime, BunContext, BunFileSystem |
| `@effect/cli` | CLI argument parsing and commands |
| `@effect/vitest` | it.effect, it.scoped, it.live, it.layer, it.prop |
| `@effect/experimental` | Experimental APIs (unstable) |

## Source

- Official docs: https://effect.website/docs/
- v3 API index: https://effect.website/docs/v3/api
- Description: The missing standard library for TypeScript, for writing production-grade software.
