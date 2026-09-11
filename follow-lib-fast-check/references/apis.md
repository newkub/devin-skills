# Lib Fast Check API & Dependencies

## Install

```sh
bun add -D fast-check
```

## Version

- Latest: `4.9.0` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/fast-check)
- [Repository](https://github.com/dubzzz/fast-check)

## Dependencies

- Zero runtime dependencies — pure JavaScript/TypeScript
- ใช้คู่กับ `vitest` ผ่าน `@fast-check/vitest` (`bun add -D @fast-check/vitest`)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `fc.assert(prop)` | Run property test | 100 runs | `numRuns`, `seed`, `verbose` |
| `fc.property(arb, fn)` | Define property | - | multiple arbs |
| `fc.integer()` / `fc.string()` / `fc.record()` | Arbitraries | - | `min`, `max`, constraints |
| `fc.pre(cond)` | Precondition filter | - | - |
| `fc.configureGlobal(cfg)` | Global defaults | - | `numRuns`, `seed` |
| `fc.sample(arb, n)` | Generate samples | - | - |
| `fc.statistics(prop, classifier)` | Collect stats | - | - |

## Source

- Official docs: https://fast-check.dev
- Description: Property-based testing framework for JavaScript/TypeScript.
