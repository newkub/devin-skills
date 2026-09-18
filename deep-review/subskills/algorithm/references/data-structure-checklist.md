# review-algorithm — Full Dimension Checklist

## 1. Inventory

- [ ] data structures ทั้งหมด mapped: collections, maps, trees, custom types
- [ ] usage sites, hot paths, mutation frequency

## 2. Fit And Access Patterns

- [ ] structure ตรง access pattern: lookup/insert/iterate/ordered
- [ ] list vs set vs map vs tree เหมาะสม
- [ ] nested structures ลึกเกิน, flat vs normalized

## 3. Complexity

- [ ] lookup O(1) ที่ต้องการจริง, linear scans ที่ควร indexed
- [ ] memory overhead: boxing, padding, duplication
- [ ] immutable vs mutable trade-offs

## 4. Correctness

- [ ] invariants maintained (sorted, unique, balanced)
- [ ] concurrent access safety, iterator invalidation
- [ ] serialization round-trip preserved

## 5. Language Idioms

- [ ] built-in structures ใช้เต็มที่ (Map/Set vs object, deque vs array shift)
- [ ] specialized libs เมื่อคุ้ม (sorted containers, bloom filter)

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
