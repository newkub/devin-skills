# Use Case — Bundle, Target, and Dev Flags

> Shape what esm.sh returns with URL flags, so a no-bundler app makes few requests and still runs on the browsers you support. Source: https://esm.sh/#docs (accessed 2026-10-20)

## 1. Start from a plain module URL

```html
<script type="module">
  import { format } from "https://esm.sh/date-fns@4/format";
</script>
```

The path mirrors the package submodule (`date-fns/format`), and the `@version` pins the resolve. Without a version the URL floats to `latest`, and a deploy changes dependency versions without a commit.

Deep subpaths keep the payload small: importing the package root pulls every export esm.sh built.

## 2. Bundle when request count matters

```html
<script type="module">
  import { createApp } from "https://esm.sh/vue@3?bundle&target=es2022";
</script>
```

`?bundle` inlines the dependency graph into one file — fewer round trips on a high-latency connection, and no deep import waterfall. The cost is duplicate copies of shared packages when several libraries bundle their own.

`?target=es2022` pins the output syntax. Use a target your browser matrix actually supports; `esnext` ships syntax that older engines reject with a parse error, not a fallback.

## 3. Keep development readable

```html
<script type="module">
  import { z } from "https://esm.sh/zod@4?dev";
</script>
```

`?dev` serves unminified modules with original names, which makes a stack trace readable. Never ship it — the payload is several times larger.

## 4. Self-host the resolve for production

```bash
bunx esm-build --outdir public/vendor "zod@4"   # or vendor the files once
```

```html
<script type="importmap">
{ "imports": { "zod": "/vendor/zod.js" } }
</script>
```

Vendoring removes the third-party origin from the critical path and makes the build reproducible when esm.sh changes its output. Keep the version pinned in both cases.

## 5. Verify

1. Network panel — count the module requests for a cold load; `?bundle` should reduce them
2. Check the shipped syntax against the browser matrix (`bunx browserslist`), not against your own browser
3. `/follow-tool-lighthouse` — no render-blocking module waterfall
4. Re-deploy after a week — the pinned URLs still resolve to the same version

## Pitfalls

- Shipping `?dev` to production, tripling the transfer size.
- Mixing pinned and unpinned URLs for the same package, which loads two copies at two versions.
- `?bundle` on every import, so three libraries each embed their own copy of a shared dependency.
- `target=esnext` with a browser matrix that includes an engine without that syntax.
- Relying on the CDN origin in a CSP without adding it to `script-src`.

## Related

- `references/apis.md`
- `best-practices/esm-sh.md`
- `usecases/browser-modules-no-bundler.md`
- `usecases/import-maps-and-shared-deps.md`
