---
name: follow-lang-javascript
description: เขียน JavaScript ตาม modern best practices และ ES2025+
related:
  - follow-lang-bun
  - follow-lang-kotlin
  - follow-lang-lua
  - follow-best-practice
  - setup-cicd
  - use-scripts
---

## Goal

เขียน JavaScript ตาม modern best practices และ ES2025+ features

## Scope

ใช้สำหรับเขียน JavaScript ทั้ง vanilla และ frameworks (ES2025 / 16th edition)

## Execute

### 1. Use Modern Syntax

> Goal: ใช้ modern JavaScript syntax และ ES2025+ features สำหรับ code ที่กระชับและปลอดภัย

1. ใช้ `const`/`let`, arrow functions, template literals, destructuring, spread/rest
2. ใช้ optional chaining (`?.`) และ nullish coalescing (`??`)
3. ใช้ `Promise.withResolvers()`, `Object.groupBy()`, `Map.groupBy()` (ES2024)
4. ใช้ `toSorted()`, `toReversed()`, `toSpliced()`, `with()`, `findLast()` (ES2023)
5. ใช้ `Iterator` helpers, `Set` methods, `Promise.try`, `RegExp.escape` (ES2025)
6. ดูรายละเอียดใน [references/javascript-syntax.md](references/javascript-syntax.md)

### 2. Use Async Patterns

> Goal: ใช้ async patterns และ error handling ที่ถูกต้องและ efficient

1. ใช้ `async/await` แทน callbacks และ `.then()` chains
2. ใช้ `try/catch/finally` สำหรับ error handling
3. ใช้ `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, `Promise.try()` ตาม context
4. ใช้ top-level await และ dynamic `import()`
5. ดูรายละเอียดใน [references/javascript-async.md](references/javascript-async.md)

### 3. Write Clean Code

> Goal: เขียน code ที่ clean, maintainable และ testable ตาม best practices

1. ใช้ named functions, early returns, pure functions, default parameters
2. ใช้ ES Modules (`import`/`export`) แทน CommonJS
3. ใช้ functional programming และ composition over inheritance
4. ใช้ SOLID principles และ naming conventions ที่เหมาะสม
5. ดูรายละเอียดใน [references/javascript-quality.md](references/javascript-quality.md)

### 4. Write Tests

> Goal: เขียน tests ครอบคลุม business logic สำหรับ quality assurance

1. ใช้ `vitest` สำหรับ unit testing
2. ใช้ `describe`/`it` pattern และ `expect` สำหรับ assertions
3. ใช้ `vi.fn()` และ `vi.spyOn()` สำหรับ mocks
4. ใช้ TDD principles เมื่อเหมาะสม
5. ดูรายละเอียดใน [references/javascript-testing.md](references/javascript-testing.md)

### 5. Ensure Security

> Goal: ตั้งค่า security practices สำหรับ JavaScript ที่ปลอดภัย

1. ใช้ `textContent` แทน `innerHTML` สำหรับ user input
2. ใช้ CSP, HTTPS และตรวจสอบ dependencies
3. หลีกเลี่ยง `eval()` และ `Function()` constructor
4. ใช้ `Object.freeze()` สำหรับ immutable configurations
5. ดูรายละเอียดใน [references/javascript-security.md](references/javascript-security.md)

## Rules

### 1. Modern Syntax

- ใช้ ES2025+ features, ไม่ใช้ `var`
- ใช้ `Iterator` helpers, `Set` methods, `Promise.try`, `RegExp.escape` (ES2025)
- ดู [references/javascript-syntax.md](references/javascript-syntax.md)

### 2. Async Patterns

- ใช้ `async/await`, หลีกเลี่ยง callback hell
- ใช้ `Promise.try()` สำหรับ wrapping sync/async code (ES2025)
- ดู [references/javascript-async.md](references/javascript-async.md)

### 3. Code Quality

- ใช้ meaningful names, DRY, SOLID, pure functions
- ใช้ ES Modules (`import`/`export`) แทน CommonJS
- ดู [references/javascript-quality.md](references/javascript-quality.md)

### 4. Performance

- ใช้ lazy loading, debouncing, Web Workers, `structuredClone()`
- ใช้ `requestAnimationFrame` สำหรับ animations
- ดู [references/javascript-quality.md](references/javascript-quality.md)

### 5. Testing

- เขียน tests ครอบคลุม business logic ด้วย `vitest`
- ดู [references/javascript-testing.md](references/javascript-testing.md)

### 6. Security

- sanitize input, หลีกเลี่ยง `eval()`, ใช้ CSP/HTTPS
- ดู [references/javascript-security.md](references/javascript-security.md)

## Expected Outcome

- JavaScript ที่เขียนตาม modern best practices และ ES2025+
- Code ที่ clean, maintainable และ testable
- Async patterns ที่ถูกต้องและ efficient
- Error handling ที่ robust
- Performance ที่ดีขึ้น
- Security ที่ดีขึ้น
- Tests ครอบคลุม business logic
