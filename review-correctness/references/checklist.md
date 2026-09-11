# review-correctness — Full Dimension Checklist

## 1. Requirements And Contracts

- [ ] behavior ตรง spec/contract/acceptance criteria
- [ ] API contracts, schema conformance, type contracts
- [ ] documented behavior = actual behavior

## 2. Type And Static Correctness

- [ ] typecheck ผ่าน, no `any`/`unknown` leaks ใน public API
- [ ] null/undefined handling exhaustive
- [ ] exhaustive switch/match, unreachable code eliminated

## 3. Logic And Edge Cases

- [ ] boundary conditions: empty, single, max, negative, zero
- [ ] off-by-one, integer overflow, float precision
- [ ] boolean logic errors, inverted conditions
- [ ] error paths return/throw ถูกต้อง

## 4. Concurrency And State

- [ ] race conditions, TOCTOU, lost updates
- [ ] state transitions valid, no impossible states
- [ ] async: unhandled rejections, missing await, ordering
- [ ] locks/transactions correct scope

## 5. Data Transformation

- [ ] serialization/deserialization round-trip
- [ ] encoding (UTF-8), timezone, locale, units
- [ ] schema migrations consistent กับ code

## 6. Test Correctness

- [ ] tests assert จริง (ไม่ใช่ vacuous assertions)
- [ ] test independence, no order dependency
- [ ] mocks ตรง contract จริง

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
