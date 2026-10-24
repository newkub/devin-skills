| key | value |
|---|---|
| version | 4.10.2 (npm latest, verified 2026-10-23) |
| package registry | https://www.npmjs.com/package/fast-check |
| repository | https://github.com/dubzzz/fast-check |
| docs | https://fast-check.dev |

| api | description | default | options |
|---|---|---|---|
| `fc.assert(prop)` | Run property test | 100 runs | `numRuns`, `seed`, `verbose` |
| `fc.property(arb, fn)` | Define property | - | multiple arbs |
| `fc.integer()` / `fc.string()` / `fc.record()` | Arbitraries | - | `min`, `max`, constraints |
| `fc.pre(cond)` | Precondition filter | - | - |
| `fc.configureGlobal(cfg)` | Merge global defaults | - | `numRuns`, `seed`, `verbose`, reporters |
| `fc.readConfigureGlobal()` | Read active global defaults | `{}` | - |
| `fc.resetConfigureGlobal()` | Clear all global defaults | - | no return value |
| `fc.check(prop, params?)` | Run and return the outcome instead of throwing | 100 runs | same `Parameters` as `assert` |
| `fc.installGlobalPlugin(plugin)` | Wrap every run with a plugin (since 4.10) | - | outermost wrapper |
| `fc.beforeEach(fn)` / `fc.afterEach(fn)` | Build a life-cycle plugin | - | pass via `plugins: [...]` |
| `fc.sample(arb, n)` | Generate samples | - | - |
| `fc.statistics(prop, classifier)` | Collect stats | - | - |

`Parameters` recognised by `fc.assert` / `fc.check` in v4: `seed`, `path`, `numRuns`, `maxSkipsPerRun`, `examples`, `endOnFailure`, `verbose`, `randomType`, `plugins`, `reporter` / `asyncReporter`. The library reads no `FAST_CHECK_*` environment variables — an env-driven override must be passed to `fc.configureGlobal` by your own setup file.
