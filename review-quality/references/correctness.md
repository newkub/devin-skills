# Correctness Criteria

criteria สำหรับตรวจสอบ logic correctness, edge cases, และ invariant checks

## Correctness

- ตรวจสอบว่า code/config ทำงานตาม requirements และ criteria ที่ระบุ
- ตรวจสอบ calculations, transformations, data mappings, serialization
- ตรวจสอบ error handling, defaults, assumptions, invariants
- ตรวจสอบ references, links, และ configuration values

## Logic

- ตรวจสอบ control flow: `if/else`, `switch`, loops ว่า complete และ correct
- ตรวจสอบ boolean expressions, conditions, short-circuit
- ตรวจสอบ ordering, sequencing, dependencies
- ตรวจสอบ type safety, narrowing, assertions
- หา non-exhaustive `switch`/`if-else` หรือ discriminated unions ที่ขาด case

## Edge Cases

- ตรวจสอบ `null`/`undefined`, empty, zero, negative, maximum, minimum
- ตรวจสอบ concurrency, race conditions, timeouts, async cancellation
- ตรวจสอบ malformed input, boundary values, unexpected states
- ตรวจสอบ recovery paths และ fallback behavior
- หา implicit assumptions และ unsafe defaults

## Validation

- ตรวจสอบ input validation, schema validation, output validation
- ตรวจสอบ data contracts, sanitization, type coercion
- ตรวจสอบ error messages, validation coverage across layers
- ตรวจสอบ verify ด้วย tests, commands, scripts เช่น `bun run lint`, `bun run typecheck`

## Invariant Checks

- ตรวจสอบ invariants ที่ code อ้างถึงว่ายังคง valid
- ตรวจสอบ assertions, contracts, property tests, exhaustive checks ที่มีใน codebase
- ตรวจสอบ formal verification patterns ถ้ามี: property-based testing (`fast-check`, `Hypothesis`, `QuickCheck`), SMT solvers (`Z3`), runtime verification

## Severity

- Critical: logic ที่ผิดจาก requirements ใน critical path, invariant violation ใน critical path, calculation error ที่ก่อให้เกิด data loss
- High: missing edge case handling ใน critical path, non-exhaustive control flow ใน critical path, validation gap ข้าม layer
- Medium: missing edge case ใน non-critical path, minor logic inconsistency, incomplete validation
- Low: cosmetic, documentation gap, minor assumption

## Skip Conditions

- ถ้า project ไม่มี TypeScript → ข้าม type safety checks
- ถ้า project ไม่มี generics → ข้าม generics checks
- ถ้า project ไม่มี discriminated unions → ข้าม exhaustive union checks
- ถ้า project ไม่มี branded types/opaque types → ข้าม branded type checks
