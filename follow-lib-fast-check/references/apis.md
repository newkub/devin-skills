| key | value |
|---|---|
| version | 4.10.0 |
| package registry | https://www.npmjs.com/package/fast-check |
| repository | https://github.com/dubzzz/fast-check |
| docs | https://fast-check.dev |

| api | description | default | options |
|---|---|---|---|
| `fc.assert(prop)` | Run property test | 100 runs | `numRuns`, `seed`, `verbose` |
| `fc.property(arb, fn)` | Define property | - | multiple arbs |
| `fc.integer()` / `fc.string()` / `fc.record()` | Arbitraries | - | `min`, `max`, constraints |
| `fc.pre(cond)` | Precondition filter | - | - |
| `fc.configureGlobal(cfg)` | Global defaults | - | `numRuns`, `seed` |
| `fc.sample(arb, n)` | Generate samples | - | - |
| `fc.statistics(prop, classifier)` | Collect stats | - | - |
