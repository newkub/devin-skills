---
name: follow-kotlin
description: พัฒนา Kotlin applications ด้วย Clean Architecture และ Compose
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

พัฒนา Kotlin project ด้วย Clean Architecture, Compose, Coroutines, Koin และ Arrow

## Scope

ใช้สำหรับ project ที่พัฒนาด้วย Kotlin (Compose Desktop/Multiplatform)

## Execute

### 1. Setup

ติดตั้ง dependencies และตั้งค่า project

> Goal: มี dependencies และ config ครบ

1. ติดตั้ง: Compose Multiplatform, Coroutines, Koin, Ktor, Arrow
2. ตั้งค่า `build.gradle.kts` พร้อม Kotlin plugin
3. ใช้ Kotlin 2.0+

### 2. Project Structure

จัดโครงสร้างตาม Clean Architecture

> Goal: โครงสร้าง project เป็น Clean Architecture

1. แบ่งเป็น `data/`, `domain/`, `presentation/`
2. `domain/` มี pure business logic ไม่มี side effects
3. `data/` มี I/O layer (API, database)
4. `presentation/` มี UI layer (Compose)

### 3. Core Principles

เขียน Kotlin ตาม best practices

> Goal: โค้ดเป็นไปตาม Kotlin best practices

1. ใช้ Coroutines สำหรับ async operations
2. ใช้ Koin สำหรับ dependency injection
3. ใช้ Ktor สำหรับ HTTP client
4. ใช้ Arrow สำหรับ functional error handling (Either)
5. ใช้ `data class` สำหรับ immutable data models

### 4. Error Handling

จัดการ error ด้วย Arrow Either pattern

> Goal: error handling เป็น type-safe

1. ใช้ `Either<Error, Success>` สำหรับ operations ที่อาจ fail
2. ใช้ `Either.catch` สำหรับ exception handling
3. หลีกเลี่ยง throwing exceptions โดยตรง

### 5. Testing

เขียน tests สำหรับทุก layer

> Goal: มี unit tests ครอบคลุม

1. ใช้ `kotlin.test` หรือ `JUnit 5`
2. เขียน tests สำหรับ domain layer (pure functions)
3. เขียน tests สำหรับ data layer (mock API)

## Rules

- ใช้ Clean Architecture แบ่งเป็น data, domain, presentation layers
- ใช้ Compose Multiplatform สำหรับ UI
- ใช้ Coroutines สำหรับ async operations
- ใช้ Koin สำหรับ dependency injection
- ใช้ Ktor สำหรับ HTTP client
- ใช้ Arrow สำหรับ functional error handling
- ใช้ `data class` สำหรับ immutable data models

## Expected Outcome

- Kotlin project ใช้ Clean Architecture แบ่ง layers ชัดเจน
- UI ด้วย Compose Multiplatform
- Async operations ด้วย Coroutines
- DI ด้วย Koin
- Error handling ด้วย Arrow Either pattern
- มี unit tests ครอบคลุม

### Setup

### config

#### `build.gradle.kts`

```kotlin
plugins {
    kotlin("jvm")
    kotlin("plugin.serialization") version "1.9.23"
    id("org.jetbrains.compose") version "1.6.10"
}

repositories { /* ... */ }

dependencies {
    // Compose UI
    implementation(compose.desktop.currentOs)

    // Coroutines & Flow
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")

    // Dependency Injection
    implementation("io.insert-koin:koin-core:3.5.6")
    implementation("io.insert-koin:koin-compose:1.1.5")

    // HTTP Client & Serialization
    implementation("io.ktor:ktor-client-cio:2.3.11")
    implementation("io.ktor:ktor-client-content-negotiation:2.3.11")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.11")

    // Functional Programming & Error Handling
    implementation("io.arrow-kt:arrow-core:1.2.4")

    // Testing
    testImplementation(kotlin("test"))
    testImplementation("io.mockk:mockk:1.13.10")
}
```

### Libraries

- Compose for Desktop
- Coroutines & Flow
- DI: Koin
- HTTP Client: Ktor
- Functional / Error Handling: Arrow (`Either`)
- Testing: Kotlin Test + MockK
