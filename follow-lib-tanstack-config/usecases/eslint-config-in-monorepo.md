# Use Case — Share One ESLint Rule Set Across a Monorepo

> Adopt the TanStack flat config at the root, then extend it per package without forking the rules. Source: https://tanstack.com/config/latest/docs/eslint (accessed 2026-10-20)

## 1. Install at the root

```bash
pnpm add -D -w eslint @tanstack/eslint-config
```

The package requires ESLint v9+ and is framework-agnostic: it bundles `@eslint/js`, `typescript-eslint`, `eslint-plugin-import-x`, and `eslint-plugin-n`, and nothing else.

## 2. Add the root flat config

```js
// eslint.config.js
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.gen.*'],
  },
]
```

Spread the shared set first. A block placed before it is overwritten by the shared rules for the same files, which looks like a rule that silently does nothing.

## 3. Extend per package, never replace

```js
// packages/my-lib/eslint.config.js
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    files: ['tests/**/*.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
]
```

Only add the block a package actually needs — a copy of the shared config with one changed rule becomes a second source of truth that drifts.

## 4. Add framework plugins where the framework lives

```js
// packages/my-react-lib/eslint.config.js
import { tanstackConfig } from '@tanstack/eslint-config'
import react from 'eslint-plugin-react'

export default [
  ...tanstackConfig,
  react.configs.flat.recommended,
  {
    files: ['src/**/*.tsx'],
    settings: { react: { version: 'detect' } },
  },
]
```

`tanstackConfig` ships no React, Solid, or Vue plugin by design, so the framework package owns that dependency and its settings.

## 5. Run it the cached way

```json
{
  "scripts": {
    "test:eslint": "eslint --concurrency=auto ./src"
  }
}
```

The `test:eslint` name is what the monorepo caches; `--concurrency=auto` keeps large packages from serializing rule evaluation.

## 6. Inspect the effective rules

```bash
pnpm dlx @eslint/config-inspector
```

Use the inspector before overriding a shared rule — the rule's source comment explains why it is enabled, and the answer is often that an override should live in the package rather than in the root.

## 7. Verify

1. `pnpm test:eslint` passes in every package that adopted the config
2. A deliberately bad import in one package is reported
3. A package-level override changes only its own files
4. The framework plugin resolves from the package that declares it

## Pitfalls

- Expecting React or Vue rules from `tanstackConfig`; they are intentionally absent.
- Placing project rules before the spread, so the shared set wins and the block has no effect.
- Installing ESLint 8, which cannot load the flat config.
- Duplicating the whole config per package instead of extending it, creating drift.
- Ignoring `dist/` but not generated route trees, so lint fails on files nobody wrote.
- Running `eslint .` at the repo root without ignores, which walks `node_modules` in pnpm layouts.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/setup-package-toolchain.md`
- `usecases/publish-ready-package.md`
