# Use Case — Choose and Configure the Build Output

> Emit exactly the formats the package promises, with the build tool the docs recommend for its age. Source: https://tanstack.com/config/latest/docs/vite (accessed 2026-10-20)

## 1. Decide ESM-only or dual

ESM is the module standard; CJS exists for older tooling and is increasingly unnecessary. Publish ESM only unless a real consumer still calls `require()`.

| Decision | When it applies | Output |
|----------|-----------------|--------|
| ESM only | new package, modern consumers, dependency graph is ESM | `dist/index.js` + `dist/index.d.ts` |
| Dual | a named consumer requires CJS | `dist/esm/*` + `dist/cjs/*` with separate declarations |
| No build | types-only or a single-file utility | `tsc` emit, no bundler |

Half-declared dual output is worse than honest ESM-only: the consumer gets a clear error instead of a runtime crash after install.

## 2. New package — use tsdown

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
})
```

The Vite page states that TanStack will adopt tsdown for future projects rather than continue the custom Vite setup. Follow `/follow-tool-tsdown` for options beyond this baseline.

## 3. Legacy package — merge the Vite config

```ts
// vite.config.ts
import { defineConfig, mergeConfig } from 'vite'
import { tanstackViteConfig } from '@tanstack/vite-config'

const config = defineConfig({
  // framework plugins, vitest config, etc.
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
  }),
)
```

Merge your own config first and `tanstackViteConfig` second, and do not modify `build` in the custom config — the preset owns output layout and formats.

## 4. Match the exports map to the emitted layout

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
    "./package.json": "./package.json"
  }
}
```

Nest `types` under each condition when the two builds emit different declaration extensions (`.d.ts` for ESM, `.d.cts` for CJS). Only use the flat `types`/`import`/`require` order when one declaration file genuinely serves both.

## 5. Wire the build gate

```json
{
  "scripts": {
    "build": "vite build && publint --strict",
    "test:build": "publint --strict"
  }
}
```

`publint --strict` fails on warnings, so a mismatched exports map breaks the build instead of reaching npm.

## 6. Keep tsconfig aligned

```json
{
  "include": ["src", "tests", "vite.config.ts", "tsdown.config.ts", "vitest.config.ts"],
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

The Vite setup expects `moduleResolution: "bundler"` and `vite.config.ts` in `include`; without both, the config file itself fails typecheck.

## 7. Verify

1. `/run-build` — the output tree matches the exports map path for path
2. `pnpm test:build` — `publint --strict` reports zero warnings
3. `bunx @arethetypeswrong/cli --pack .` — no red rows
4. Install the tarball and import it from ESM, then from CJS if declared
5. Delete `dist/` and rebuild once to prove the build is not relying on stale output

## Pitfalls

- Adding a new package on the legacy Vite build when tsdown is the documented direction.
- Letting a custom Vite config override `build`, which silently changes output paths the exports map does not know about.
- Declaring `require` while emitting only ESM, so the first `require()` call crashes at runtime.
- Reusing one `.d.ts` for both formats when the CJS build resolves types differently.
- Forgetting `"type": "module"`, so `.js` output is treated as CJS by Node.
- Checking `dist/` by eye instead of running `publint --strict`.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/setup-package-toolchain.md`
- `usecases/fix-exports-resolution.md`
