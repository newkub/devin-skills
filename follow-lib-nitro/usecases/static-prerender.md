# Use Case — Static, Prerender & Route Rules (Blog / Docs)

> Ship a content site: build-time prerendering, config-driven caching, and redirects/headers — without touching handler code. Source: https://nitro.build/config (routeRules, prerender, static), /docs/cache (accessed 2026-10-20)

## 1. Build-time prerender

Any route listed is fetched during the build and copied into `.output/public/` as a static asset — served with no worker hit.

```ts [nitro.config.ts]
import { defineConfig } from "nitro";

export default defineConfig({
  prerender: {
    routes: ["/", "/about"],
    crawlLinks: true,   // follow <a> tags from the seed routes
    failOnError: true,  // break CI if a route can't render
    ignore: ["/admin/**"],
  },
});
```

- Default `prerender` shape: `{ interval: 0, failOnError: false, crawlLinks: false, ignore: [], routes: [] }`.
- `static: true` (top level) prerenders every route — good for a fully static site.
- Compress prerendered output with the `compressPublicAssets` option (gzip/brotli/zstd) for zero-overhead delivery without a CDN.

## 2. Route rules

`routeRules` applies caching / SWR / static / headers / redirects per glob pattern:

```ts [nitro.config.ts]
export default defineConfig({
  routeRules: {
    "/blog/**":     { swr: true },                 // serve stale, revalidate in background
    "/feed/**":     { swr: 600 },                  // swr shortcut = cache:{swr,maxAge}
    "/docs/**":     { static: true },              // prerender these routes
    "/dashboard/**":{ cache: { maxAge: 60 } },     // explicit cache options
    "/old-path":    { redirect: "/new-path" },     // 301 redirect
    "/api/**":      { cors: true },                // CORS headers
    "/**":          { headers: { "x-frame-options": "DENY" } },
  },
});
```

- `swr: true | number` is a shortcut for `cache: { swr: true, maxAge: number }`.
- Prefer route rules for a global strategy — they're declarative and don't couple caching into each handler.

## 3. On-demand revalidation with a cached function

Route rules / `defineCachedHandler` can't be purged per key on demand. When you need invalidation, move the expensive work into a `defineCachedFunction` and call `.expire()`/`.invalidate()`:

```ts [server/utils/posts.ts]
import { defineCachedFunction } from "nitro/cache";

export const getPost = defineCachedFunction(
  async (slug: string) => fetchFromCMS(slug),
  { maxAge: 60 * 60, name: "getPost", getKey: (slug) => slug },
);
```

```ts [server/api/revalidate.post.ts]
import { defineHandler } from "nitro";
import { getPost } from "../utils/posts";

export default defineHandler(async (event) => {
  const { slug } = await event.req.json();
  await getPost.invalidate(slug); // next request re-renders fresh
  return { ok: true };
});
```

## 4. Global cache defaults

Set a baseline every route inherits, then override per rule:

```ts [nitro.config.ts]
export default defineConfig({
  cache: {
    driver: "fs",                 // memory (default) | fs | kv
    defaults: { maxAge: 60, swr: true },
  },
});
```

- Only `GET`/`HEAD` are cached; `POST`/`PUT`/`DELETE` and `Range` requests bypass it.
- Cached handlers auto-manage `etag`, `cache-control`, `vary`, and `x-cache` (`HIT`/`STALE`/`REVALIDATED`/`MISS`).

## Pitfalls

- `maxAge` defaults to 1 second — an unset/omitted value barely caches; set it explicitly.
- `fs` cache driver on serverless/edge → not persisted/shared; use `kv` (or the platform binding) there.
- `crawlLinks` without any seed route → only `/` is crawled; add `routes` for a sitemap-style seed.
- `failOnError: false` (default) → a broken page silently ships instead of failing CI; set `true` for content sites.
- Caching a per-user page → cached handlers strip cookies/headers unless `allowCookies`/`varies` list them; otherwise one variant replays to everyone.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/deploy.md`
