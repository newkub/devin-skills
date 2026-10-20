# Use Case — Lint Gate in CI with Cache and Pre-Commit

> Fail the build on any new warning, keep the run fast with a cache, and fix what can be fixed before the commit lands. Source: https://eslint.org/docs/latest/use/command-line-interface (accessed 2026-10-20)

## 1. The gate

```yaml
# .github/workflows/ci.yml
- run: bun install --frozen-lockfile
- name: Lint
  run: bunx eslint . --max-warnings=0 --cache --cache-location node_modules/.cache/eslint
```

`--max-warnings=0` is what turns "warnings" into a real gate; without it the exit code stays 0.

## 2. Cache that survives between runs

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules/.cache/eslint
    key: eslint-${{ runner.os }}-${{ hashFiles('eslint.config.js', '**/eslint.config.js', 'bun.lockb') }}
    restore-keys: eslint-${{ runner.os }}-
```

The cache key must include the config and lockfile — a stale cache hides new rules.

## 3. Fix before commit, not in CI

```json
// package.json
{
  "lint": "eslint . --max-warnings=0",
  "lint:fix": "eslint . --fix",
  "lint:staged": "eslint --fix --max-warnings=0"
}
```

```ts
// hk / lint-staged hook
export default { "*.{js,jsx,ts,tsx}": "eslint --fix --max-warnings=0" }
```

Lint only the staged files in the hook; run the full project in CI.

## 4. Keep output reviewable

```bash
bunx eslint . --max-warnings=0 -f json -o eslint-report.json || true
bunx eslint . --max-warnings=0 -f stylish
```

Attach the JSON as an artifact; humans read the stylish output.

## Pitfalls

- `--fix` in the CI step → the pipeline is green while the repo is still wrong.
- Caching without the config in the key → new rules never execute until the cache expires.
- Ignoring generated code with inline `eslint-disable` → prefer a config `ignores` entry; the config is one change instead of hundreds.
- Linting `node_modules` or `dist` → the run time explodes and real findings get buried.

## Related

- `references/cli.md`
- `best-practices/flat-config.md`
- `usecases/flat-config-typescript-and-react.md`
