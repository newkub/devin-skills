---
name: effect-ts
description: "Effect คือ TypeScript library สำหรับ functional programming ที่มี type-safe error handling,..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้ Effect-TS สำหรับ functional programming ใน TypeScript ด้วย type-safe error handling, dependency injection, และ composable effects


## Scope

ใช้สำหรับ functional programming, error handling, dependency injection, และ composable effects ใน TypeScript


## Execute

- ติดตั้ง Effect-TS ด้วย `bun add effect`
- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน
- อ่าน `key-concepts/effect.md` สำหรับ effect definitions
- อ่าน `key-concepts/service.md` สำหรับ service และ dependency injection
- อ่าน `key-concepts/runtime.md` สำหรับ runtime และ execution
- อ่าน `key-concepts/error-handling.md` สำหรับ error handling
- อ่าน `guide/configuration.md` สำหรับการตั้งค่า
- อ่าน `references/configuration.md` สำหรับ tsconfig และ project configuration
- ตั้งค่า TypeScript สำหรับ Effect-TS
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- ใช้ effects สำหรับ async operations
- อ่าน `principles/error-first.md` สำหรับ error-first principle
- อ่าน `guide/best-practices.md` สำหรับ best practices
- ใช้ type-safe error handling
- อ่าน `guide/integration.md` สำหรับ framework integration
- อ่าน `guide/architecture.md` สำหรับ system architecture
- อ่าน `guide/structure.md` สำหรับ project structure
- อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป
- อ่าน `references/api.md` สำหรับ API reference
- อ่าน `references/cli.md` สำหรับ CLI commands


## Rules

- ใช้ `bun add effect` สำหรับ installation
- ใช้ `bun add -D @effect/schema` สำหรับ schema validation
- ใช้ backticks สำหรับ `Effect.sync()`, `Effect.try()`, commands
- ใช้ code blocks สำหรับ effect examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture
- ใช้ pure functions เสมอ
- หลีกเลี่ยง side effects ใน pure code
- ใช้ composition สำหรับ complex logic
- ใช้ Effect สำหรับ error handling
- ใช้ type-safe error types
- ใช้ recovery mechanisms สำหรับ error recovery


## Expected Outcome

- Code ที่ type-safe และ functional
- Error handling ที่ robust และ predictable
- Dependency injection ที่ clean และ testable
- Effects ที่ composable และ maintainable
