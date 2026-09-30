| key | value |
|---|---|
| install | `bun add effect` |
| package registry | https://www.npmjs.com/package/effect |
| repository | https://github.com/Effect-TS/effect |
| docs | https://effect.website/docs/ |

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

| Package | Purpose |
|---|---|
| `@effect/platform` | FileSystem, Path, Terminal, HttpClient, PlatformError |
| `@effect/platform-node` | NodeRuntime, NodeContext, NodeFileSystem |
| `@effect/platform-bun` | BunRuntime, BunContext, BunFileSystem |
| `@effect/cli` | CLI argument parsing and commands |
| `@effect/vitest` | it.effect, it.scoped, it.live, it.layer, it.prop |
| `@effect/experimental` | Experimental APIs (unstable) |
