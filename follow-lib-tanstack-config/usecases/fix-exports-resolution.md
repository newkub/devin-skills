# Use Case — Fix an Exports Map That Won't Resolve

> Diagnose "cannot find module" and silent `any` types from a consumer's point of view, then repair the map. Source: https://tanstack.com/config/latest (accessed 2026-10-20)

## 1. Reproduce under both resolvers

```ts
// consumer-esm.mjs
import { thing } from "my-lib";
```

```js
// consumer-cjs.cjs
const { thing } = require("my-lib");
```

Add a `tsconfig.json` per case: `"moduleResolution": "bundler"` and `"node16"`. The failures differ, and a single passing case proves nothing.

## 2. Name the failing condition

| Symptom | Missing or wrong condition |
|---------|---------------------------|
| `ERR_MODULE_NOT_FOUND` from ESM | `import` path does not exist in `dist` |
| `ERR_REQUIRE_ESM` from CJS | no `require` output, or `.js` used inside a `"type": "module"` package |
| types resolve to `any` | `types` not first, or `.d.ts` not emitted next to the declared path |
| deep import fails | subpath not listed under `exports` |

## 3. Write the map in resolver order

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./server": {
      "types": "./dist/server.d.ts",
      "import": "./dist/server.js",
      "require": "./dist/server.cjs"
    },
    "./package.json": "./package.json"
  }
}
```

`exports` is matched top-down and the first hit wins, so `types` goes first and the broadest condition goes last. Any subpath a consumer uses must be declared — `exports` seals everything it does not list.

## 4. Decide ESM-only or dual

If the dependency graph cannot be loaded from CJS, publish ESM only and drop the `require` condition. Half-declared dual output is worse than an honest single format: the consumer gets a clear error instead of a runtime crash after installation.

## 5. Re-verify at the consumer

1. `/run-build`
2. `bunx publint` — zero warnings
3. `bunx @arethetypeswrong/cli --pack .` — no red rows
4. Re-run both scratch consumers, including the deep import

## Pitfalls

- Adding a `"types"` field at the top level while `exports` exists — `exports` wins for every consumer, so the top-level field is only a fallback for very old resolvers.
- Copying a map from another package without matching its `dist/` layout.
- Using `"./*": "./dist/*"` as a shortcut, which exposes internals and breaks the moment a file moves.
- Fixing only the ESM path because that is the one the test suite imports.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/publish-ready-package.md`
