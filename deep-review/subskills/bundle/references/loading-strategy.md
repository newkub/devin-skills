# Loading Strategy Checklist — review-bundle

## Compression

- [ ] brotli — `.br` precompressed assets, or dynamic brotli on CDN/server
- [ ] gzip fallback — `.gz` for clients without brotli support
- [ ] compression level — static assets precompressed at max (build time), dynamic at balanced
- [ ] compressible types — JS/CSS/HTML/SVG/JSON compressed; images/videos already compressed (skip)
- [ ] `Content-Encoding` — served correctly, `Vary: Accept-Encoding` set

## Cache Headers

- [ ] hashed assets — `app.a1b2c3.js` → `Cache-Control: public, max-age=31536000, immutable`
- [ ] HTML — `Cache-Control: no-cache` or short TTL + `ETag`/`Last-Modified`
- [ ] service worker — `sw.js` → `no-cache` (always fresh)
- [ ] manifest — `manifest.json` → moderate TTL, versioned if content changes
- [ ] images/fonts — long TTL if hashed, `stale-while-revalidate` otherwise
- [ ] no cache on errors — 404/500 responses not cached long

## Preload And Prefetch

- [ ] critical CSS — inlined or `rel="preload"` for above-fold styles
- [ ] critical JS — `rel="modulepreload"` for entry chunks
- [ ] fonts — `rel="preload" as="font" crossorigin` for critical fonts
- [ ] hero images — `rel="preload" as="image"` or `fetchpriority="high"`
- [ ] next navigation — `rel="prefetch"` for likely next routes (SPA)
- [ ] DNS prefetch — `rel="dns-prefetch"` for third-party domains
- [ ] preconnect — `rel="preconnect"` for API/CDN origins (saves handshake)

## Resource Hints Priority

- [ ] `fetchpriority` — `high` for LCP image, `low` for below-fold
- [ ] `loading="lazy"` — images/iframes below fold
- [ ] `decoding="async"` — images don't block render
- [ ] `defer`/`async` — scripts don't block parsing (`defer` default for app JS)
- [ ] `type="module"` — ES modules for modern browsers, `nomodule` fallback for legacy

## Sourcemaps

- [ ] production policy — `hidden-source-map` (exists but not linked) or `source-map` (public)
- [ ] error tracker — maps uploaded to Sentry/Bugsnag, then removed from public
- [ ] secrets — no source code secrets in maps
- [ ] size — maps not counted in user-facing payload

## Entry And Waterfall

- [ ] minimal entry — initial JS < 200KB (target), critical path clear
- [ ] no serial chains — chunk A doesn't wait for chunk B unnecessarily
- [ ] route splitting — each route loads only its code
- [ ] shared chunks — common code extracted, not duplicated per route
- [ ] vendor split — stable deps (framework) separate from app code (cache efficiency)

## HTTP/2+ Optimizations

- [ ] no domain sharding — HTTP/2 multiplexes, don't split domains
- [ ] no concatenation — don't bundle everything into one file (hurts caching)
- [ ] early hints — `103 Early Hints` for preload headers if server supports
- [ ] server push — deprecated, use preload hints instead

## Third-Party Scripts

- [ ] async/defer — analytics, ads, widgets don't block
- [ ] facade pattern — load lite version, full version on interaction
- [ ] self-hosted — critical third-party (fonts, player) self-hosted if possible
- [ ] CSP — third-party domains allowlisted, no wildcard
- [ ] SRI — `integrity` + `crossorigin` on CDN resources

## Service Worker

- [ ] precache — app shell precached, runtime cached
- [ ] strategy — `CacheFirst` for assets, `NetworkFirst` for API, `StaleWhileRevalidate` for content
- [ ] update flow — `skipWaiting`, `clientsClaim`, version bump on deploy
- [ ] offline fallback — cached page or custom offline page

## Detection

- `curl -I` — check `Cache-Control`, `Content-Encoding`, `Vary`
- DevTools Network — waterfall, compression, cache hits
- Lighthouse — opportunities, diagnostics, third-party code
- `bundlesize`/`size-limit` — CI size tracking
- WebPageTest — real-world loading, filmstrip view

Severity: no compression = High, immutable missing on hashed assets = Medium, no preload on critical = Medium, sourcemaps public = Low
