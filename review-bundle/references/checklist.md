# review-bundle — Full Dimension Checklist

## 1. Build Configuration

- [ ] bundler config minimal, no unused plugins/loaders
- [ ] target/transpile level ตรง browser support matrix
- [ ] sourcemaps: production-safe (hidden/external)
- [ ] deterministic builds, content hashing

## 2. Bundle Composition

- [ ] total size, per-route size budgets
- [ ] tree-shaking works (ESM, sideEffects flags)
- [ ] duplicate deps, polyfill bloat, moment.js/lodash-style issues
- [ ] dynamic imports สำหรับ heavy/rarely-used features

## 3. Chunking And Loading

- [ ] code splitting: route-level + vendor splitting strategy
- [ ] critical path minimal, preload/prefetch directives
- [ ] shared chunks ไม่ duplicate, long-term caching works
- [ ] lazy boundaries: below-fold, modals, admin

## 4. Dependencies In Bundle

- [ ] bundle analysis (analyzer output) — top contributors
- [ ] lighter alternatives flagged
- [ ] devDeps ไม่รั่วใน prod bundle

## 5. Compression And Delivery

- [ ] brotli/gzip sizes reported (ไม่ใช่แค่ raw)
- [ ] asset compression, immutable caching
- [ ] module/nomodule หรือ modern-only output ตาม target

## 6. Runtime Signals

- [ ] hydration/TTI impact, third-party script budget
- [ ] source map coverage สำหรับ error tracking

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
