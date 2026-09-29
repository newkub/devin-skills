# Mobile Performance Checklist — review-mobile

## Startup Time

- [ ] cold start ≤2s to interactive — measure on mid-range device, not flagship
- [ ] warm start faster — resume from memory vs full init
- [ ] splash screen — shown only during real init, not artificial delay
- [ ] lazy init — non-critical services deferred past first render
- [ ] bundle/startup I/O — minimize disk reads, font loading, JSON parsing

## Bundle And Assets

- [ ] bundle size budget — JS bundle <5MB, app size <100MB target
- [ ] tree-shaking — dead code eliminated, no unused deps
- [ ] code splitting — screens/features loaded on demand
- [ ] asset optimization — images WebP/HEIF, vector drawables where possible
- [ ] font subsetting — only needed glyphs/weights
- [ ] on-demand resources — downloadable content not bundled upfront

## Rendering And Lists

- [ ] list virtualization — `FlatList`/`RecyclerView`/equivalent, not scroll dump
- [ ] item recycling — view reuse, not re-creation per scroll
- [ ] memoization — `React.memo`/`shouldComponentUpdate` for list items
- [ ] image optimization — resized to display size, not full-res in thumbnails
- [ ] overdraw — no unnecessary layered backgrounds
- [ ] frame budget — 60fps (16ms), drop frames analyzed

## Memory Management

- [ ] memory pressure handling — release caches on warning
- [ ] image memory — downsampled bitmaps, recycled views
- [ ] leak detection — listeners/subscriptions cleaned on unmount
- [ ] large object lifecycle — media/files released when done
- [ ] background memory — reduced footprint when backgrounded

## Network Efficiency

- [ ] request batching — multiple calls → single round-trip where possible
- [ ] caching — HTTP cache headers respected, disk cache for repeat data
- [ ] prefetch — predictive loading for likely next screens
- [ ] compression — gzip/brotli on API responses
- [ ] delta sync — fetch changes only, not full dataset
- [ ] offline-first — local data as source of truth where applicable

## Battery And Thermal

- [ ] background work minimal — no constant polling, wake locks released
- [ ] GPS/sensors — stopped when not needed, appropriate accuracy level
- [ ] wake locks — explicit, timeout, not held indefinitely
- [ ] Doze/app standby — deferred work survives OS power management
- [ ] thermal throttling — heavy ops spread over time, not burst CPU

## Media And Graphics

- [ ] video optimization — streaming not progressive download where possible
- [ ] codec selection — hardware-accelerated formats
- [ ] image format — WebP/HEIF vs PNG/JPEG trade-off
- [ ] GPU-friendly animations — transform/opacity, not layout
- [ ] surface management — video/camera surfaces released promptly

## Startup Dependencies

- [ ] font loading — async/font-display swap, not blocking render
- [ ] API init — parallel where independent, not sequential waterfall
- [ ] config/flags — cached defaults, fetch in background
- [ ] dependency injection — lazy init, not eager graph build
- [ ] first paint — meaningful content ASAP, skeleton screens

## Detection

- profiling — Xcode Instruments, Android Profiler, Flipper
- metrics — startup time, frame drops, memory growth, battery drain
- network inspector — request count, payload sizes, cache hit rates
- device testing — mid-range device, not just dev machine

Severity: startup >5s = High, unbounded memory growth = High, battery drain complaints = High, list jank = Medium
