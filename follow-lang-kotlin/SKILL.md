---
name: follow-lang-kotlin
description: พัฒนา Kotlin applications ด้วย Clean Architecture และ Compose
---

## Goal

พัฒนา Kotlin project ด้วย Clean Architecture, Compose, Coroutines, Koin และ Arrow

## Scope

ใช้สำหรับ project ที่พัฒนาด้วย Kotlin (Compose Desktop/Multiplatform)

## Execute

### 1. Setup

> Goal: ติดตั้ง dependencies และตั้งค่า project

1. ติดตั้ง: Compose Multiplatform, Coroutines, Koin, Ktor, Arrow
2. ตั้งค่า `build.gradle.kts` พร้อม Kotlin plugin
3. ใช้ Kotlin 2.0+

### 2. Project Structure

> Goal: จัดโครงสร้างตาม Clean Architecture

1. แบ่งเป็น `data/`, `domain/`, `presentation/`
2. `domain/` มี pure business logic ไม่มี side effects
3. `data/` มี I/O layer (API, database)
4. `presentation/` มี UI layer (Compose)
5. ดูรายละเอียดใน `references/project-structure.md`

### 3. Core Principles

> Goal: เขียน Kotlin ตาม best practices

1. ใช้ Coroutines สำหรับ async operations
2. ใช้ Koin สำหรับ dependency injection
3. ใช้ Ktor สำหรับ HTTP client
4. ใช้ Arrow สำหรับ functional error handling (Either)
5. ใช้ `data class` สำหรับ immutable data models

### 4. Error Handling

> Goal: จัดการ error ด้วย Arrow Either pattern

1. ใช้ `Either<Error, Success>` สำหรับ operations ที่อาจ fail
2. ใช้ `Either.catch` สำหรับ exception handling
3. หลีกเลี่ยง throwing exceptions โดยตรง
4. ดูรายละเอียดใน `references/error-handling.md`

### 5. Testing

> Goal: เขียน tests สำหรับทุก layer

1. ใช้ `kotlin.test` หรือ `JUnit 5`
2. เขียน tests สำหรับ domain layer (pure functions)
3. เขียน tests สำหรับ data layer (mock API)
4. ดูรายละเอียดใน `references/testing.md`

## Rules

### 1. Architecture

- ใช้ Clean Architecture แบ่งเป็น `data/`, `domain/`, `presentation/` layers
- ใช้ Compose Multiplatform สำหรับ UI

### 2. Async And DI

- ใช้ Coroutines สำหรับ async operations
- ใช้ Koin สำหรับ dependency injection
- ใช้ Ktor สำหรับ HTTP client

### 3. Error Handling

- ใช้ Arrow สำหรับ functional error handling (Either pattern)
- ใช้ `data class` สำหรับ immutable data models
- ดูรายละเอียดใน `references/error-handling.md`

## Expected Outcome

- Kotlin project ใช้ Clean Architecture แบ่ง layers ชัดเจน
- UI ด้วย Compose Multiplatform
- Async operations ด้วย Coroutines
- DI ด้วย Koin
- Error handling ด้วย Arrow Either pattern
- มี unit tests ครอบคลุม
