# Correctness Checklist — review-algorithm

## Edge Cases

- [ ] empty input — `[]`, `""`, `null`, `undefined`, `0`, `{}`
- [ ] single element — arrays 1 item, strings 1 char
- [ ] duplicates — repeated values, same reference, overlapping ranges
- [ ] negative/zero — indices, counts, deltas, durations
- [ ] boundaries — max int, min int, first/last index, overflow near limits
- [ ] unicode — emoji (surrogate pairs), combining marks, RTL, zero-width

## Termination And Invariants

- [ ] loop terminates — index moves toward bound, no infinite loop on edge input
- [ ] recursion terminates — base case reachable, every path hits it
- [ ] invariants hold — sorted stays sorted, count ≥ 0, pointer < length
- [ ] sentinel values — `-1`, `null`, `NaN` as "not found" vs valid values
- [ ] boundary conditions — off-by-one (`<=` vs `<`, `+1` vs `-1`)

## Recursion Safety

- [ ] depth bound — input size ไม่ทำ stack overflow (tree depth, linked list length)
- [ ] memoization correct — cache key ครอบคลุม state ทั้งหมด (not just first param)
- [ ] shared state across calls — mutation ที่ไม่ reset ระหว่าง recursive paths
- [ ] tail-call → iterative — deep recursion แปลงเป็น loop/stack structure

## Optimization Bugs

- [ ] premature caching — stale results เมื่อ input เปลี่ยนแต่ key ไม่เปลี่ยน
- [ ] early exit ผิด — return ก่อนเช็คครบ (found first vs found best)
- [ ] greedy vs optimal — heuristic ที่ไม่ guarantee correct answer
- [ ] rounding/precision — intermediate rounding ทำ final answer ผิด
- [ ] parallel wrongness — concurrent modification ที่เดา order ผิด

## Input Assumptions

- [ ] input validation — algorithm assume sorted/normalized แต่ไม่ check
- [ ] type coercion — `"5" + 1 = "51"` vs `5 + 1 = 6` ใน JS
- [ ] null/undefined handling — `.length`, `.map` บน missing value
- [ ] mutation of input — function แก้ caller's array/object โดยไม่ตั้งใจ

## Correctness Proof Sketch

- [ ] for each key function — informal invariant: what stays true ก่อน/หลัง loop
- [ ] counterexamples — ลองหา input ที่ output ผิด, ไม่ใช่แค่ test happy path
- [ ] property-based thinking — invariants ที่ควร test ด้วย random inputs

## Detection

- code review — trace through edge cases manually
- property-based testing — `fast-check`, `hypothesis` for invariants
- fuzzing — random inputs หา crashes

Severity: wrong result on edge case = Critical, infinite loop = High, stack overflow = High, mutation of input = Medium
