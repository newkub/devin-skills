---
name: kotlin
description: "แนวทางการพัฒนาด้วย Kotlin ตาม best practices สำหรับ modern software development ที่เน้น null..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

พัฒนา Kotlin ตาม best practices สำหรับ modern software development ที่เน้น null safety, coroutines และ concise syntax


## Scope

ใช้สำหรับการพัฒนา Kotlin ทุกประเภท เช่น Android development, server-side development, multiplatform development, scripting and automation, และ desktop applications


## Execute

- ทำความเข้าใจ null safety และ safe calls
- เรียนรู้ coroutines และ async programming
- ศึกษา data classes และ sealed classes
- ทำความเข้าใจ extension functions
- ติดตั้ง Kotlin compiler และ toolchain
- ตั้งค่า Gradle หรือ Maven build system
- ตั้งค่า `build.gradle.kts` สำหรับ project
- ติดตั้ง IDE plugins (IntelliJ IDEA, Android Studio)
- ใช้ null safety features (safe calls, Elvis operator)
- ใช้ coroutines สำหรับ async operations
- ใช้ data classes สำหรับ data models
- ใช้ extension functions สำหรับ extending functionality
- ใช้ sealed classes สำหรับ state management
- จัดการ errors อย่างเหมาะสม
- เขียน unit tests ด้วย Kotlin Test
- ใช้ debugging tools ใน IntelliJ IDEA
- ตรวจสอบ performance และ memory usage


## Rules

- ใช้ `val` สำหรับ immutable variables
- ใช้ `var` เฉพาะเมื่อจำเป็น
- ใช้ expression body สำหรับ functions สั้นๆ
- ใช้ string templates สำหรับ string interpolation
- ใช้ data classes สำหรับ data holders
- ใช้ safe call operator `?.`
- ใช้ Elvis operator `?:`
- หลีกเลี่ยง `!!` operator
- ใช้ nullable types เฉพาะเมื่อจำเป็น
- ใช้ `lateinit` สำหรับ dependency injection
- ใช้ `suspend` functions สำหรับ async operations
- ใช้ coroutine scopes อย่างเหมาะสม
- ใช้ structured concurrency
- จัดการ exceptions ใน coroutines
- ใช้ Flow สำหรับ data streams
- ใช้ `try/catch` สำหรับ exceptions
- ใช้ `Result` type สำหรับ error handling
- ใช้ sealed classes สำหรับ error types
- log errors อย่างเหมาะสม
- ให้ error messages ที่ชัดเจน


## Expected Outcome

- Kotlin code ที่เป็นมาตรฐานและ maintainable
- การใช้ null safety อย่างถูกต้อง
- Async programming ที่มีประสิทธิภาพด้วย coroutines
- Code ที่ concise และ expressive
- Error handling ที่เหมาะสม
- Code ที่ผ่านการทดสอบและ debug แล้ว
