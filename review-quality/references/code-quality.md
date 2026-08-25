# Code Quality Criteria

criteria สำหรับ review ด้าน static analysis, architecture, types, naming, readability, และ hardcode

## Static Analysis

- รัน `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge` สำหรับ lint, typecheck, code smells, duplication, unused code, circular dependencies
- ตรวจสอบ `any` type, `console.log`, TODO/FIXME/HACK, ignore comments
- ตรวจสอบ SRP violations, code duplication, long files, complex functions, coupling issues
- ตรวจสอบ TODO, FIXME, MOCK, STUB, placeholder patterns, unimplemented interfaces

## Architecture

- ตรวจสอบ patterns, boundaries, coupling, SOLID, design patterns, anti-patterns
- ตรวจสอบ concurrency, scalability
- ตรวจสอบ cross-module config consistency, coding style, import/export patterns, folder structure, module boundaries

## Types

- ตรวจสอบ generics, type inference, discriminated unions, type narrowing, branded types, type safety, `as const`, exhaustive checks
- ตรวจสอบ `any` usage, type assertions, readonly/immutable patterns
- ไม่ควรมี `any` ใน production code — ใช้ `unknown` + type narrowing แทน
- ไม่ใช้ `as` assertions โดยไม่จำเป็น — ใช้ type guards, `instanceof`, หรือ proper type definitions
- ไม่ใช้ `@ts-ignore` หรือ `@ts-expect-error` — ระบุ root cause แทนการ suppress

## Naming

- ตรวจสอบ variable, function, class, file, directory, API endpoint, database naming
- ตรวจสอบ prefix/suffix conventions, cross-layer consistency, naming clarity
- ตรวจสอบ single-letter names ใน scope ที่ซับซ้อน, misleading names, inconsistent verb usage

## Readability

- function length เกิน 50 บรรทัด
- parameter count เกิน 4
- nesting depth เกิน 3 ระดับ
- cognitive complexity: chained ternary, nested conditions
- naming clarity: `data`, `temp`, single-letter names
- self-documenting code: magic numbers ไม่มี named constant, complex expressions ไม่มี intermediate variable
- comment quality: redundant, stale, missing on complex logic

## Hardcode

- magic numbers ที่ไม่มี named constant (ไม่นับ 0, 1, -1)
- hardcoded strings ที่ไม่ใช่ user messages
- hardcoded URLs/API endpoints ที่ควรเป็น env vars
- hardcoded file paths
- hardcoded secrets/API keys/tokens/credentials
- hardcoded business rules: thresholds, limits, timeouts, rates
- hardcoded feature flags

## Simplicity

- abstraction ที่ไม่จำเป็น: interface เดียว implementor, generic กับ type เดียว, wrapper ที่ไม่เพิ่ม value
- YAGNI: features ไม่ได้ใช้, config options ไม่มี consumer, extension points ไม่มี extension
- premature optimization: cache ก่อน measure, micro-optimizations ก่อน benchmark

## Redundancy

- exact duplicate, near-duplicate, partial overlap, reference-only
- content duplication ใน markdown/docs
- unused exports, circular dependencies

## Severity

- Critical: circular dependency ข้าม module, duplicate secrets/tokens, `any` ใน critical path, type safety bypass, unsafe assertion, function เกิน 200 บรรทัด, nesting เกิน 5 ระดับ, misleading name ที่ก่อให้เกิด bug
- High: cross-file near-duplicate, unused exports สำคัญ, missing type constraint, poor generic design, missing discriminated union, hardcoded URLs/business rules, function เกิน 50 บรรทัด, parameter เกิน 4, cognitive complexity สูงใน critical path
- Medium: partial overlap, intra-file duplication, unnecessary assertion, missing branded type, suboptimal inference, magic numbers ที่ใช้ซ้ำ, function 30-50 บรรทัด, nesting 3-4 ระดับ, redundant comments
- Low: cosmetic, minor naming improvement, minor type improvement, magic numbers ที่ใช้ครั้งเดียวใน context ชัดเจน, missing comment บน minor logic
