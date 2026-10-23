# ESLint Best Practices

Guidance for configuring and using ESLint with flat config — plugin ordering, performance, CI integration

## Recommended Patterns

### 1. Config layering — order matters

Flat config is an array — later configs override earlier ones:

```typescript
// eslint.config.ts
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // 1. base configs first
  js.configs.recommended,
  ...ts.configs.recommended,
  // 2. plugin configs
  // 3. project-specific rules
  // 4. formatter compat always last (disables style rules that clash with the formatter)
  formatCompat,
  // 5. ignores at the end or as a separate object
  { ignores: ['dist/', 'node_modules/', 'coverage/'] }
])
```

### 2. Scope rules with files patterns

Don't enable a plugin project-wide if it only applies to some files:

```typescript
{
  files: ['**/*.test.ts', '**/*.spec.ts'],
  ...vitest.configs.recommended
},
{
  files: ['**/*.vue'],
  rules: { 'vue/multi-word-component-names': 'off' }
}
```

Benefit: faster linting, no false positives from rules on unrelated files

### 3. Lint ≠ Format

- ESLint handles code quality (unused vars, bugs, patterns)
- the formatter (`vp fmt`/Oxfmt, `bun fmt`, biome, dprint) handles style (spacing, quotes)
- put `eslint-config-prettier` last as the style-rule compat layer — it disables clashing ESLint style rules; never let ESLint report formatting issues

### 4. Severity strategy

- `error` — bugs, security (`no-secrets/no-secrets`), correctness
- `warn` — style preferences, gradual-adoption rules
- in CI use `--max-warnings 0` when warnings should gate too — otherwise warns become noise nobody fixes

## Do / Don't

| Do | Don't |
|---|---|
| use one `eslint.config.ts` flat config at the root | mix `.eslintrc` + flat config in one repo |
| use `ignores` in the flat config | create `.eslintignore` (ESLint 10 no longer reads it) |
| use the single `typescript-eslint` package | install `@typescript-eslint/parser` + `plugin` separately the old way |
| use `--cache` on large codebases | lint the whole repo every time with no cache |
| fix locally/in pre-commit only | run `eslint --fix` in CI (check-only there) |
| debug config resolution with `eslint --inspect-config` | guess which rules apply to a file |

## Common Pitfalls

- Plugin version mismatch: the `typescript-eslint` major version must support the ESLint version — check peer deps before upgrading; old plugins may throw `context.getSource is not a function` on the new flat API
- Wrong config lookup path: ESLint 10 looks up the config from the linted file's directory upward — a monorepo run from a subdir may not find the root config; pass an explicit `--config <path>`
- `files` glob with the wrong scope: `'*.ts'` matches only the root — use `'**/*.ts'` for every directory
- ignores inside a rules object: `{ files, ignores, rules }` scopes the ignores to that config — global ignores must be an object with only `ignores` or use `globalIgnores()`
- Duplicate plugin registration: registering the same plugin in several config objects with the same key → error — register once in a single object or the base config
- Style-rule compat config not last: your own rules override it → style rules clash again

## Performance Notes

- Use `--cache` (`.eslintcache`) in local dev and CI — lints only changed files; gitignore `.eslintcache` and persist it via the CI cache action
- For large projects consider `eslint-plugin-oxlint` — delegate rules oxlint supports to the Rust-based linter (much faster) and disable the duplicates in ESLint
- Type-aware rules (`typescript-eslint` `recommendedTypeChecked`) are slow because they build type info — scope them to `files: ['**/*.ts']` and use `projectService` instead of long `project` lists
- `import/no-cycle`, `import/no-unresolved` carry resolver overhead — CI-only, or tune the `import/resolver` cache

## CI Notes

```bash
eslint . --max-warnings 0 --format json --output-file eslint-report.json
```

- run check mode only — no `--fix` in CI
- `--max-warnings 0` for a zero-warning policy (optional but recommended)
- cache `node_modules` + `.eslintcache` between runs
- in a monorepo: lint only changed files (`--affected` via moon/nx or hk staged files) instead of linting the whole repo on every PR
