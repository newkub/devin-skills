# Use Case — Set Up a Publishable Package

> Give a new package the layout, scripts, and shared config the TanStack monorepo expects. Source: https://tanstack.com/config/latest/docs/package-structure (accessed 2026-10-20)

## 1. Confirm the prerequisites

```bash
node -v
pnpm -v
gh --version
```

Node.js 20.17+, the Git CLI, the GitHub CLI, and pnpm 10+ are required. pnpm is the only supported package manager — a bun or npm workspace will not match the documented scripts.

## 2. Install the scoped packages

```bash
pnpm add -D @tanstack/eslint-config @tanstack/vite-config @tanstack/publish-config
```

`@tanstack/config` is deprecated: it only re-exported these packages. Install only the ones the package uses — a library that never publishes from CI does not need `publish-config`.

## 3. Create the layout

```text
packages/my-lib/
├── package.json
├── tsconfig.json
├── tsdown.config.ts
├── vitest.config.ts
├── src/
│   └── index.ts
└── tests/
    └── index.test.ts
```

`src/` contains only code that ships. Tests live in `tests/`, because files under `src/` are built into the package and a test-only edit can invalidate the Nx cache.

## 4. Write `package.json`

```json
{
  "name": "@acme/my-lib",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsdown",
    "test:build": "publint --strict",
    "test:eslint": "eslint --concurrency=auto ./src",
    "test:lib": "vitest run",
    "test:types": "tsc --noEmit"
  }
}
```

These five script names are the ones the monorepo caches: `test:eslint`, `test:types`, `test:lib`, `build`, `test:build`. Renaming them silently removes the package from the cached task graph.

## 5. Extend the root tsconfig

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src", "tests", "tsdown.config.ts", "vitest.config.ts"],
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

Keep `moduleResolution: "bundler"` and include the config files, or the build config itself fails typecheck.

## 6. Add the config files

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  dts: true,
})
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
```

```js
// eslint.config.js
import { tanstackConfig } from '@tanstack/eslint-config'

export default [...tanstackConfig]
```

## 7. Verify

1. `pnpm test:eslint` — shared rules load with no missing plugin
2. `pnpm test:types` — the package and its config files typecheck
3. `pnpm test:lib` — tests run from `tests/`
4. `pnpm build` — `dist/` contains every file the exports map promises
5. `pnpm test:build` — `publint --strict` passes
6. `git status` — no test file sits under `src/`

## Pitfalls

- Installing the deprecated `@tanstack/config` umbrella instead of the scoped packages.
- Naming scripts `lint`/`typecheck`/`test` instead of the cached `test:*` names, so Nx never runs them.
- Importing test helpers from `src/`, which pulls test code into the published bundle.
- Setting `moduleResolution: "node16"` while emitting a dual build; the config files then fail to typecheck.
- Adding `"files": ["src", "dist"]` "just in case", leaking sources into the tarball.
- Forgetting `sideEffects: false`, which defeats tree-shaking for every consumer.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/eslint-config-in-monorepo.md`
- `usecases/build-published-package.md`
