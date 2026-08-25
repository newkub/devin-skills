---
name: follow-lang-javascript
description: เขียน JavaScript ตาม modern best practices และ ES2024+
---

## Goal

เขียน JavaScript ตาม modern best practices และ ES2024+ features

## Scope

ใช้สำหรับเขียน JavaScript ทั้ง vanilla และ frameworks

## Execute

### 1. Use Modern Syntax

> Goal: Use Modern Syntax

ใช้ modern JavaScript syntax และ ES2024+ features ตามรายละเอียดใน `references/javascript-syntax.md`

1. ใช้ `const`/`let`, arrow functions, template literals, destructuring, spread/rest
2. ใช้ optional chaining (`?.`) และ nullish coalescing (`??`)
3. ใช้ `Promise.withResolvers()`, `Object.groupBy()`, `Map.groupBy()` (ES2024)
4. ใช้ `toSorted()`, `toReversed()`, `toSpliced()`, `with()`, `findLast()` (ES2023)

### 2. Use Async Patterns

> Goal: Use Async Patterns

ใช้ async patterns และ error handling ตามรายละเอียดใน `references/javascript-async.md`

1. ใช้ `async/await` แทน callbacks และ `.then()` chains
2. ใช้ `try/catch/finally` สำหรับ error handling
3. ใช้ `Promise.all()`, `Promise.allSettled()`, `Promise.race()` ตาม context
4. ใช้ top-level await และ dynamic `import()`

### 3. Write Clean Code

> Goal: Write Clean Code

เขียน code ที่ clean และ maintainable ตามรายละเอียดใน `references/javascript-quality.md`

1. ใช้ named functions, early returns, pure functions, default parameters
2. ใช้ ES Modules (`import`/`export`) แทน CommonJS
3. ใช้ functional programming และ composition over inheritance
4. ใช้ SOLID principles และ naming conventions ที่เหมาะสม

### 4. Write Tests

> Goal: Write Tests

เขียน tests สำหรับ quality assurance ตามรายละเอียดใน `references/javascript-testing.md`

1. ใช้ `vitest` สำหรับ unit testing
2. ใช้ `describe`/`it` pattern และ `expect` สำหรับ assertions
3. ใช้ `vi.fn()` และ `vi.spyOn()` สำหรับ mocks
4. ใช้ TDD principles เมื่อเหมาะสม

### 5. Ensure Security

> Goal: Ensure Security

ตั้งค่า security ตามรายละเอียดใน `references/javascript-security.md`

1. ใช้ `textContent` แทน `innerHTML` สำหรับ user input
2. ใช้ CSP, HTTPS และตรวจสอบ dependencies
3. หลีกเลี่ยง `eval()` และ `Function()` constructor
4. ใช้ `Object.freeze()` สำหรับ immutable configurations

## Rules

- Modern syntax: ใช้ ES2024+ features, ไม่ใช้ `var` — ดู `references/javascript-syntax.md`
- Async: ใช้ `async/await`, หลีกเลี่ยง callback hell — ดู `references/javascript-async.md`
- Code quality: ใช้ meaningful names, DRY, SOLID, pure functions — ดู `references/javascript-quality.md`
- Performance: ใช้ lazy loading, debouncing, Web Workers, `structuredClone()` — ดู `references/javascript-quality.md`
- Testing: เขียน tests ครอบคลุม business logic — ดู `references/javascript-testing.md`
- Security: sanitize input, หลีกเลี่ยง `eval()`, ใช้ CSP/HTTPS — ดู `references/javascript-security.md`

## Expected Outcome

- JavaScript ที่เขียนตาม modern best practices และ ES2024+
- Code ที่ clean, maintainable และ testable
- Async patterns ที่ถูกต้องและ efficient
- Error handling ที่ robust
- Performance ที่ดีขึ้น
- Security ที่ดีขึ้น
- Tests ครอบคลุม business logic
