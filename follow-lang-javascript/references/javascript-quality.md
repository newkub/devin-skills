# JavaScript Code Quality

code quality, naming, functional programming และ SOLID principles

## Naming Conventions

- ใช้ meaningful variable และ function names
- ใช้ `camelCase` สำหรับ variables และ functions
- ใช้ `PascalCase` สำหรับ classes และ constructors
- ใช้ `UPPER_SNAKE_CASE` สำหรับ constants

## Function Design

- ใช้ named functions สำหรับ debugging และ stack traces
- ใช้ early returns แทน nested conditions
- ใช้ pure functions เพื่อลด side effects
- ใช้ default parameters สำหรับ functions
- ใช้ JSDoc สำหรับ documentation

## Modules

- ใช้ ES Modules (`import`/`export`) แทน CommonJS เสมอ

## Functional Programming

- ใช้ `map()`, `filter()`, `reduce()` แทน `for` loops เมื่อเหมาะสม
- ใช้ composition over inheritance

## Principles

- ใช้ single responsibility principle
- ใช้ DRY (Don't Repeat Yourself)
- ใช้ SOLID principles เมื่อเป็นไปได้

## Performance

- ใช้ event delegation สำหรับ dynamic elements
- ใช้ `requestAnimationFrame` สำหรับ animations
- ใช้ debouncing และ throttling สำหรับ events
- ใช้ lazy loading สำหรับ heavy operations และ modules
- หลีกเลี่ยง blocking operations ใน main thread
- ใช้ Web Workers สำหรับ CPU-intensive tasks
- ใช้ `structuredClone()` สำหรับ deep cloning
