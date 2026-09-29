# Types And DX Checklist — review-sdk

## Type Declarations

- [ ] `.d.ts` generate ถูก — ครบทุก export, ไม่มี stale types หลัง refactor
- [ ] `any` leaks ใน public signatures — params, returns, generics, callbacks
- [ ] error types exported — `class MyError extends Error` ไม่ใช่ `throw new Error` ดิบ
- [ ] branded/opaque types สำหรับ primitives ที่ห้ามปน — `UserId`, `RequestId` ไม่ใช่ `string` ดิบ
- [ ] `export type` vs `export` แยกชัด — pure types ไม่ drag runtime code

## Generics And Overloads

- [ ] generics อ่านง่าย — names มีความหมาย (`TItem`, `TResult`) ไม่ใช่ `T`, `U`, `V` ซ้อน
- [ ] generic constraints ชัด — `extends Record<string, unknown>` ไม่ใช่ unconstrained `T`
- [ ] overloads ≤3-4 signatures — มากกว่านั้นใช้ options object แทน
- [ ] inference ทำงาน — `const result = api.call(input)` infer ได้ไม่ต้อง manual annotation

## Options And Config

- [ ] options objects มี defaults — `api({ timeout: 5000 })` ไม่บังคับทุก field
- [ ] optional fields เป็น `?` ไม่ใช่ `| undefined` — call site สะอาด
- [ ] config validation ที่ boundary — invalid options fail fast + message ชัด
- [ ] readonly/immutable options — package ไม่ mutate caller's object

## Consumer Ergonomics

- [ ] autocomplete ดี — IntelliSense เห็น params/docs/defaults
- [ ] error messages actionable — "expected X, got Y at path Z" ไม่ใช่ "invalid input"
- [ ] common patterns ง่าย — one-call setup, fluent API ถ้าเหมาะ, factory functions
- [ ] edge cases documented — empty arrays, null, unicode, boundaries

## Type Tests

- [ ] `tsd` / `expect-type` / `attest` — public signatures locked
- [ ] negative tests — invalid inputs ไม่ compile (type-level guard)
- [ ] type tests ใน CI — types เปลี่ยนแล้ว break เห็นทันที
- [ ] coverage ครบ public exports — ไม่ test แค่ happy path

## Documentation

- [ ] JSDoc บนทุก public export — description, params, returns, throws, example
- [ ] `@example` ใน JSDoc — runnable snippets ที่ extract ได้
- [ ] type-level docs — generics explained, constraints, variance notes
- [ ] internal APIs marked — `@internal`/`@private` ไม่ leak เข้า public types

## Detection

- `attw` — types resolve ทุก consumer setup
- `tsc --noEmit` บน consumer test file — imports resolve, inference works
- `tsd` run — type assertions pass
- grep `: any`, `=> any`, `any[]` ใน `dist/*.d.ts`

Severity: `any` leaks = Medium–High, no `.d.ts` = High, poor inference = Medium, no type tests = Low–Medium
