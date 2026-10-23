# Vite+ Best Practices

Guidance for adopting Vite+ (`vp`) as the single toolchain for a web project — one config, one formatter/linter stack, predictable checks

## Recommended Patterns

### 1. One config source

- keep `vite.config.ts` as the only config for Vite, Vitest, tsdown, Oxlint, Oxfmt, Vite Task, and staged checks
- do not create `vitest.config.ts`, a separate bundler config, or a second lint/format config next to it
- root blocks win in a workspace — package-level overrides only through `fmt.overrides`

```ts
import { defineConfig } from 'vite-plus'

export default defineConfig({
  server: { port: 5173 },
  build: { target: 'baseline-widely-available' },
  fmt: { singleQuote: true, semi: false, ignorePatterns: ['dist/**'] },
  lint: { options: { typeAware: true, typeCheck: true } },
  test: { environment: 'jsdom' },
  pack: { dts: true, format: ['esm'] },
  staged: { '*': 'vp check --fix' },
})
```

### 2. Make `vp check` the static gate

- enable `lint.options.typeAware` + `lint.options.typeCheck` so `vp check` covers format, lint, and types
- local loop: `vp check --fix`; CI: `vp check --deny-warnings`
- use `--no-fmt` / `--no-lint` to narrow a run instead of invoking the underlying tools directly
- wire `/run-check` to `vp check` whenever `vite-plus` is detected

### 3. Pick the right runner

- `vp dev` starts the built-in Vite server; `vp run dev` executes the `dev` script through Vite Task — they are not interchangeable
- `vp run` caches task graphs; plain `package.json` scripts are uncached unless `--cache` is passed
- use `vp vpx` for one-off binaries inside the toolchain instead of mixing package-manager exec calls

### 4. Test imports and config

- import test APIs from `vite-plus/test`, not from `vitest`
- Vitest 5 under `vp test` runs on Node — Bun-only APIs are unavailable in those tests
- keep the test environment in the `test` block; `vp test watch` is the watch entry

### 5. Migration discipline

- upgrade to Vite 7+ and Vitest 4+ first; run `vp migrate` from a clean tree with a green baseline
- use `--full` when the project wants framework shims, tsconfig `baseUrl`, and editor settings migrated together
- rewrite imports and the Vite core alias exactly as the migration output specifies
- delete legacy tool configs only after `vp check`, `vp test`, and `vp build` match the baseline

### 6. CI and editor alignment

- use `setup-vp` in CI instead of running the installer per job
- install the Vite Plus Extension Pack and point the default formatter at Oxc
- disable nested Oxc configs (`oxc.disableNestedConfig`, `oxc.fmt.disableNestedConfig`) so the root config is the only truth

## Do / Don't

| Do | Don't |
|---|---|
| keep one `vite.config.ts` | keep parallel lint/format/test/bundler configs |
| enable `typeAware` + `typeCheck` before claiming `vp check` type-checks | assume format + lint equals type checking |
| use `vp staged` for pre-commit | format the whole repo in the hook |
| let `vp` detect the package manager | hard-code a package manager in CI scripts |
| run `vp check --fix` locally | run `--fix` in a CI job that expects a clean tree |
| delete legacy configs after parity is proven | delete them in the same commit as the migration |

## Common Pitfalls

- **`vp check` without type info**: `typeAware`/`typeCheck` live under `lint.options`; when either is missing, the run is format + lint only
- **Two formatters**: leaving a second formatter active produces flip-flopping diffs — Oxfmt must be the only writer
- **Nested configs ignored**: package-level `.oxlintrc`/format configs do not override the root in Vite+ mode — use the root blocks and `fmt.overrides`
- **`vp dev` vs `vp run dev`**: `vp dev` ignores a custom `dev` script; a custom dev pipeline must be a task
- **Bun-only APIs in tests**: Vitest 5 runs on Node under `vp test`; `Bun.*` is undefined there
- **Bare commands at a workspace root**: `vp dev`/`build`/`preview`/`pack` need `defaultPackage` or `-C <dir>` when the app lives in a subdirectory
- **`defaultPackage` must stay a literal**: `vp` reads it without executing the config, so expressions do not work

## Performance / CI Notes

- `vp check` merges format, lint, and type checks into one process — faster than three separate CLI calls in CI and pre-commit
- Vite Task caching only applies to task-graph runs (`vp run`); add `--cache` deliberately and invalidate it when task inputs change
- `vp test` is Vitest 5 — keep Node in the CI matrix even for Bun projects
- `vp pack --exe` requires Node 25.7+; keep executable builds in a dedicated job when the main matrix uses an older Node
- Pin the toolchain through the project lockfile (`vite-plus`), not through a global install, so local and CI match
