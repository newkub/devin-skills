# Use Case — Pin Dependencies and Switch CDN Sources

> Load from npm, JSR, GitHub, or a preview build URL — always with an explicit version and a locked dependency graph. Source: https://esm.sh (accessed 2026-10-20)

## 1. Choose the source prefix

```ts
// npm (default)
import { z } from "https://esm.sh/zod@4.1.0"

// JSR
import { encodeBase64 } from "https://esm.sh/jsr/@std/encoding@1.0.0/base64"

// GitHub tag
import tslib from "https://esm.sh/gh/microsoft/tslib@v2.8.1"

// pkg.pr.new preview build
import { feature } from "https://esm.sh/pr/my-org/my-pkg@abc1234"
```

## 2. Lock transitive versions

```text
https://esm.sh/@tanstack/react-query@5.90.0?deps=react@19.3.0
```

`?deps` forces the CDN build to use the React copy the app already loads; without it the package may pull a second one.

## 3. Alias a dependency

```text
https://esm.sh/some-chart-lib@2.1.0?alias=react:preact/compat
```

Use aliases only at the boundary — an alias deep inside the graph is invisible to the next reader.

## 4. Choose the build shape

| Need | Query |
|------|-------|
| One bundle per package | (default) |
| Keep shared modules as separate imports | `?bundle=false` |
| Bundle everything except peers | `?standalone` |
| Only named exports | `?exports=a,b` |
| Older browser target | `?target=es2022` |
| Local development | `?dev` |

## 5. Verify before deploying

1. Open the exact URL in the browser or run it under Deno — a 200 with a broken import graph still fails at runtime.
2. Confirm the version resolves to the intended one in the network panel.
3. Track changes at https://github.com/esm-dev/esm.sh/releases.

## Pitfalls

- Using `?dev` in a production URL → unminified output and extra requests.
- Relying on the legacy `/v135/...` build prefix → old pinned URLs redirect; regenerate the URLs with the current route.
- Omitting a version → the CDN serves the moving latest release; pin it.
- Forgetting `&` instead of `?` on subpath URLs → the second parameter is ignored and the dependency lock silently disappears.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/esm-sh.md`
- `usecases/browser-modules-no-bundler.md`
