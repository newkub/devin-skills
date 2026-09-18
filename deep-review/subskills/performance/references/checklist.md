# review-performance — Full Dimension Checklist

## 1. Network And API

- [ ] request count/size, waterfall analysis, connection reuse
- [ ] API latency, payload sizes, N+1, over-fetching
- [ ] caching headers, CDN usage, compression

## 2. Bundler And Build

- [ ] bundle size budgets, code splitting (เชื่อม `/review-bundle`)
- [ ] tree-shaking, dead code elimination
- [ ] build time, cache efficiency

## 3. Runtime And CPU

- [ ] hot paths profiled (`/run-profiler`), CPU-bound work
- [ ] main-thread blocking, long tasks, worker offload
- [ ] algorithmic complexity on hot paths (`/review-algorithm`)

## 4. Memory

- [ ] leaks: listeners, closures, detached DOM, cache growth
- [ ] allocation churn, GC pressure, heap snapshots
- [ ] memory ceilings on constrained environments

## 5. I/O And Database

- [ ] disk/DB access patterns, query efficiency (`/review-database`)
- [ ] file I/O batching, streaming vs buffering
- [ ] lock contention, transaction duration

## 6. Caching And Complexity

- [ ] cache hit rates, TTL tuning, invalidation correctness
- [ ] memoization opportunities, redundant computation

## 7. Concurrency

- [ ] parallelism utilization, async overhead
- [ ] contention points, queue depth, backpressure

## 8. Frontend-Specific

- [ ] Core Web Vitals: LCP/INP/CLS (เชื่อม `/review-frontend`)
- [ ] render blocking, hydration cost, layout thrash

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
