# Use Case — Keep Devtools Out of the Production Bundle

> Prove that the devtools panels exist in dev and are absent from the built output. Source: https://tanstack.com/devtools (accessed 2026-10-20)

## 1. Gate the import, not just the render

```tsx
// src/Devtools.tsx
import { lazy, Suspense } from "react";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      })),
    )
  : () => null;

export function Devtools() {
  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools />
    </Suspense>
  );
}
```

The ternary sits around the dynamic `import()` itself. Guarding only the JSX still leaves the module reachable, and a bundler that cannot statically fold `import.meta.env.DEV` keeps the chunk.

## 2. Match the guard to the bundler

| Bundler | Static-replaced guard |
|---------|-----------------------|
| Vite | `import.meta.env.DEV` |
| Webpack / Rspack | `process.env.NODE_ENV !== "production"` |
| Bun build | `process.env.NODE_ENV !== "production"` |

A guard the bundler does not replace is a runtime check, and a runtime check still ships the code.

## 3. Build and search the output

```bash
# through the project's own build
bun run build
grep -r "react-query-devtools" dist/
grep -r "ReactQueryDevtools" dist/
```

Both searches must come back empty. Grepping the minified bundle for the package id is faster and more reliable than eyeballing a bundle report.

## 4. Check the route-level panels too

`TanStackRouterDevtools` gets the same treatment. If it is imported at the module scope of the root route, the panel ships even when the query panel does not.

## 5. Keep the dev path honest

1. `/run-dev` — the panel must still appear
2. `/run-build` then serve the built output — the panel must be gone and the app must render normally
3. `/deep-review` when a bundle needs formal confirmation

## Pitfalls

- Guarding with `import.meta.env.MODE === "development"` in a build that sets a custom mode, so the devtools vanish in dev too.
- A lazy import inside a `try/catch` that the bundler cannot analyze, producing a chunk that is always emitted.
- Checking only the entry chunk; the devtools chunk is separate and needs a search across `dist/`.
- Leaving a `console.log` of devtools internals, which keeps a reference alive after tree-shaking.

## Related

- `references/apis.md`
- `best-practices/tanstack-devtools.md`
- `usecases/query-and-router-devtools.md`
