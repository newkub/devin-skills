# Use Case — Fix an Exports Map That Won't Resolve

> Diagnose "cannot find module" and silent `any` types from a consumer's point of view, then repair the map. Source: https://tanstack.com/config/latest/docs/vite (accessed 2026-10-20)

## 1. Reproduce under both resolvers

```ts
// consumer-esm.mjs
import { thing } from '@acme/my-lib'
```

```js
// consumer-cjs.cjs
const { thing } = require('@acme/my-lib')
```

Add a `tsconfig.json` per case: `"moduleResolution": "bundler"` and `"node16"`. The failures differ, and a single passing case proves nothing.

## 2. Name the failing condition

| Symptom | Missing or wrong condition |
|---------|---------------------------|
| `ERR_MODULE_NOT_FOUND` from ESM | `import` path does not exist in `dist` |
| `ERR_REQUIRE_ESM` from CJS | no `require` output, or `.js` used inside a `"type": "module"` package |
| types resolve to `any` | `types` not nested first inside the matching condition, or the `.d.ts` was never emitted |
| `ERR_PACKAGE_PATH_NOT_EXPORTED` | subpath not listed under `exports` |
| config file fails typecheck | `vite.config.ts` missing from tsconfig `include` |

## 3. Write the documented dual map

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.ts",
        "default": "./dist/esm/index.js"
      },
      "require": {
        "types": "./dist/cjs/index.d.cts",
        "default": "./dist/cjs/index.cjs"
      }
    },
    "./server": {
      "import": {
        "types": "./dist/esm/server.d.ts",
        "default": "./dist/esm/server.js"
      },
      "require": {
        "types": "./dist/cjs/server.d.cts",
        "default": "./dist/cjs/server.cjs"
      }
    },
    "./package.json": "./package.json"
  }
}
```

`exports` is matched top-down and the first hit wins: `types` goes first inside each condition, `default` last. Any subpath a consumer uses must be declared — `exports` seals everything it does not list.

## 4. Match the tsconfig to the build

```json
{
  "include": ["src", "tests", "vite.config.ts", "tsdown.config.ts", "vitest.config.ts"],
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

The TanStack Vite setup expects `moduleResolution: "bundler"` and the build config inside `include`. Without them the package builds but its own config file fails `test:types`.

## 5. Decide ESM-only or dual

If the dependency graph cannot be loaded from CJS, publish ESM only and drop the `require` condition. Half-declared dual output is worse than an honest single format: the consumer gets a clear error instead of a runtime crash after installation.

## 6. Re-verify at the consumer

1. `pnpm build` — confirm every path in the map exists
2. `publint --strict` — zero warnings
3. `bunx @arethetypeswrong/cli --pack .` — no red rows
4. Re-run both scratch consumers, including the deep import
5. Run `/run-typecheck` in the scratch project under both resolvers

## Pitfalls

- A flat `"types"` before `"import"`/`"require"` when the two builds emit different declaration extensions; the CJS consumer then resolves the ESM declaration.
- Adding a top-level `types` field while `exports` exists — `exports` wins for every consumer, so the field is only a fallback for very old resolvers.
- Copying a map from another package without matching its `dist/` layout.
- Using `"./*": "./dist/*"` as a shortcut, which exposes internals and breaks the moment a file moves.
- Fixing only the ESM path because that is the one the test suite imports.
- Forgetting `"./package.json"`, which breaks tooling that reads the manifest through a subpath import.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/build-published-package.md`
- `usecases/publish-ready-package.md`
