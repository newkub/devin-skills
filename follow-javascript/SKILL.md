---
name: follow-javascript
description: เขียน JavaScript ตาม modern best practices และ ES2024+
---

## Goal

เขียน JavaScript ตาม modern best practices และ ES2024+ features

## Scope

ใช้สำหรับเขียน JavaScript ทั้ง vanilla และ frameworks

## Execute

### 1. Use Modern Syntax

ใช้ modern JavaScript syntax และ ES2024+ features

1. ใช้ `const` เป็น default, `let` เฉพาะเมื่อต้อง reassign
2. ใช้ arrow functions สำหรับ callbacks และ short functions
3. ใช้ template literals สำหรับ string interpolation
4. ใช้ destructuring สำหรับ objects และ arrays
5. ใช้ spread operator และ rest parameters
6. ใช้ optional chaining (`?.`) และ nullish coalescing (`??`)
7. ใช้ `Promise.withResolvers()` สำหรับ async patterns (ES2024)
8. ใช้ `Object.groupBy()` และ `Map.groupBy()` สำหรับ grouping (ES2024)
9. ใช้ `toSorted()`, `toReversed()`, `toSpliced()`, `with()` สำหรับ immutable array operations (ES2023)
10. ใช้ `findLast()` และ `findLastIndex()` สำหรับ reverse search (ES2023)

### 2. Use Async Patterns

ใช้ async patterns ที่เหมาะสม

1. ใช้ `async/await` แทน callbacks และ `.then()` chains
2. ใช้ `try/catch/finally` สำหรับ error handling
3. ใช้ `Promise.all()` สำหรับ parallel operations ที่ทุกตัวต้องสำเร็จ
4. ใช้ `Promise.allSettled()` สำหรับ parallel operations ที่รอผลลัพธ์ทั้งหมด
5. ใช้ `Promise.race()` สำหรับ timeout patterns
6. ใช้ top-level await ใน ES modules
7. ใช้ dynamic `import()` สำหรับ lazy loading modules

### 3. Write Clean Code

เขียน code ที่ clean และ maintainable

1. ใช้ named functions สำหรับ debugging และ stack traces
2. ใช้ early returns แทน nested conditions
3. ใช้ pure functions เมื่อเป็นไปได้
4. ใช้ default parameters สำหรับ functions
5. ใช้ ES Modules (`import`/`export`) แทน CommonJS
6. ใช้ functional programming: `map()`, `filter()`, `reduce()` แทน `for` loops เมื่อเหมาะสม
7. ใช้ composition over inheritance
8. ใช้ SOLID principles เมื่อเป็นไปได้

### 4. Error Handling

จัดการ errors อย่างเหมาะสม

1. ใช้ `try/catch` สำหรับ error handling
2. ใช้ `throw` สำหรับ custom errors พร้อม `Error` objects
3. ใช้ `Error` objects พร้อม stack traces และ context
4. Log errors ด้วย context ที่เพียงพอ
5. ใช้ error boundaries ใน frameworks
6. ไม่ใช้ `catch` โดยไม่มี error parameter (optional catch binding)

### 5. Write Tests

เขียน tests สำหรับ quality assurance

1. ใช้ `vitest` สำหรับ unit testing
2. เขียน tests สำหรับ business logic ทุกส่วน
3. ใช้ TDD principles เมื่อเหมาะสม
4. ใช้ `describe`/`it` pattern สำหรับ test organization
5. ใช้ `expect` สำหรับ assertions

## Rules

### 1. Modern Syntax

ใช้ modern JavaScript syntax และ ES2024+ features

- ใช้ `const` เป็น default, `let` เฉพาะต้อง reassign, ไม่ใช้ `var`
- ใช้ arrow functions สำหรับ callbacks
- ใช้ template literals สำหรับ string interpolation
- ใช้ destructuring สำหรับ objects และ arrays
- ใช้ spread/rest operators สำหรับ data manipulation
- ใช้ shorthand properties และ methods
- ใช้ optional chaining (`?.`) และ nullish coalescing (`??`)
- ใช้ `Promise.withResolvers()` แทน manual Promise construction
- ใช้ `Object.groupBy()` แทน external libraries
- ใช้ immutable array methods (`toSorted()`, `toReversed()`, `with()`)
- ใช้ `findLast()` และ `findLastIndex()` สำหรับ reverse search

### 2. Async Patterns

ใช้ async patterns ที่เหมาะสม

- ใช้ `async/await` แทน callback hell และ `.then()` chains
- ใช้ `Promise.all()` สำหรับ parallel async ที่ทุกตัวต้องสำเร็จ
- ใช้ `Promise.allSettled()` สำหรับ parallel async ที่รอผลลัพธ์ทั้งหมด
- ใช้ `Promise.race()` สำหรับ timeout patterns
- ใช้ top-level await ใน ES modules
- ใช้ dynamic `import()` สำหรับ code splitting
- หลีกเลี่ยง callback functions ใน modern code

### 3. Code Quality

เขียน code ที่มีคุณภาพ

- ใช้ meaningful variable และ function names (camelCase)
- ใช้ PascalCase สำหรับ classes และ constructors
- ใช้ UPPER_SNAKE_CASE สำหรับ constants
- ใช้ single responsibility principle
- ใช้ DRY (Don't Repeat Yourself)
- ใช้ SOLID principles เมื่อเป็นไปได้
- ใช้ pure functions เพื่อลด side effects
- ใช้ composition over inheritance
- ใช้ ES Modules (`import`/`export`) เสมอ
- ใช้ JSDoc สำหรับ documentation
- ใช้ early returns แทน nested conditions

### 4. Performance

ปรับปรุง performance

- ใช้ event delegation สำหรับ dynamic elements
- ใช้ `requestAnimationFrame` สำหรับ animations
- ใช้ debouncing และ throttling สำหรับ events
- ใช้ lazy loading สำหรับ heavy operations และ modules
- หลีกเลี่ยง blocking operations ใน main thread
- ใช้ `map()`, `filter()`, `reduce()` แทน `for` loops เมื่อเหมาะสม
- ใช้ Web Workers สำหรับ CPU-intensive tasks
- ใช้ `structuredClone()` สำหรับ deep cloning

### 5. Security

ตั้งค่า security

- ใช้ `textContent` แทน `innerHTML` สำหรับ user input
- Sanitize user input ก่อนใช้
- ใช้ CSP (Content Security Policy)
- ใช้ HTTPS สำหรับ production
- ตรวจสอบ dependencies สำหรับ vulnerabilities
- หลีกเลี่ยง `eval()` และ `Function()` constructor
- ใช้ `Object.freeze()` สำหรับ immutable configurations

### 6. Testing

เขียน tests สำหรับ quality assurance

- ใช้ `vitest` สำหรับ unit testing
- เขียน tests สำหรับ business logic ทุกส่วน
- ใช้ TDD principles เมื่อเหมาะสม
- ใช้ `describe`/`it` pattern สำหรับ organization
- ใช้ `expect` สำหรับ assertions
- ใช้ `vi.fn()` และ `vi.spyOn()` สำหรับ mocks

## Expected Outcome

- JavaScript ที่เขียนตาม modern best practices และ ES2024+
- Code ที่ clean, maintainable และ testable
- Async patterns ที่ถูกต้องและ efficient
- Error handling ที่ robust
- Performance ที่ดีขึ้น
- Security ที่ดีขึ้น
- Tests ครอบคลุม business logic
