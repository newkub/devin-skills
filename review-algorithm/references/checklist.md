# review-algorithm — Full Dimension Checklist

## 1. Hot Paths

- [ ] profile จริง (`/run-profiler`, `/run-bench`) — ไม่เดา
- [ ] call frequency, input size distribution
- [ ] nested loops, O(n²)+ patterns, repeated work

## 2. Complexity

- [ ] time complexity (worst/average/amortized)
- [ ] space complexity + allocation churn
- [ ] lower bound ที่เป็นไปได้ — ช่องว่างกับ lower bound
- [ ] hidden costs: string concat, spread, sort-in-loop, regex recompile

## 3. Correctness

- [ ] edge cases: empty, single, duplicate, negative, overflow, cycle
- [ ] termination conditions + loop invariants
- [ ] off-by-one, boundary conditions
- [ ] numerical stability: float accumulation, precision, rounding
- [ ] determinism: same input → same output

## 4. Data And Memory

- [ ] data structure fit (เชื่อม `/review-data-structure`)
- [ ] cache-friendliness: sequential access, locality
- [ ] unnecessary copies, clone-in-loop
- [ ] streaming vs load-all สำหรับ input ใหญ่

## 5. Concurrency

- [ ] parallelizable hot loops ที่ไม่ถูก parallelize
- [ ] lock contention, false sharing
- [ ] async overhead ที่เกินประโยชน์

## 6. Benchmark Methodology

- [ ] baseline benchmark ก่อน optimize
- [ ] realistic input sizes
- [ ] warmup, variance, environment notes

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
