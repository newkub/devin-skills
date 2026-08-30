---
name: follow-lang-lua
description: แนวทางการพัฒนา Lua ตาม best practices สำหรับ embedded scripting และ lightweight automation
related:
  - follow-lang-bun
  - follow-lang-javascript
  - follow-lang-kotlin
  - follow-best-practice
  - setup-cicd
  - use-scripts
---

## Goal

พัฒนา Lua ตาม best practices สำหรับ embedded scripting และ lightweight automation

## Scope

ใช้สำหรับการพัฒนา Lua ทุกประเภท เช่น game development, embedded systems, scripting within applications, rapid prototyping, configuration files, และ lightweight automation

## Execute

### 1. Setup Environment

> Goal: ติดตั้ง Lua และ tools ที่จำเป็น

1. ติดตั้ง Lua interpreter
2. ติดตั้ง `LuaRocks` package manager
3. ตั้งค่า environment variables
4. ติดตั้ง dependencies ด้วย `LuaRocks`

### 2. Understand Core Concepts

> Goal: เข้าใจหลักการพื้นฐานของ Lua

1. ทำความเข้าใจ tables และ metatables
2. เรียนรู้ coroutines สำหรับ cooperative multitasking
3. ศึกษา Lua VM และ garbage collection
4. ทำความเข้าใจ module system

### 3. Use Data Structures And Async

> Goal: ใช้ tables, metatables และ coroutines อย่างถูกต้อง

1. ใช้ tables สำหรับ arrays, objects, และ modules
2. ใช้ metatables สำหรับ OOP patterns และ operator overloading
3. ใช้ coroutines สำหรับ async operations และ cooperative multitasking
4. จัดการ coroutine states อย่างเหมาะสม

### 4. Organize And Handle Errors

> Goal: จัดระเบียบ code ด้วย modules และจัดการ errors อย่างเหมาะสม

1. ใช้ modules สำหรับ code organization และ encapsulation
2. ใช้ `pcall` และ `xpcall` สำหรับ error handling
3. ใช้ `error()` สำหรับ throw errors พร้อม custom error types
4. log errors อย่างเหมาะสม และให้ error messages ที่ชัดเจน

### 5. Test Debug And Optimize

> Goal: เขียน tests และตรวจสอบปรับปรุง performance

1. เขียน unit tests สำหรับ functions สำคัญ
2. ใช้ debugging tools สำหรับตรวจสอบ issues
3. ตรวจสอบ memory usage และ performance bottlenecks
4. profile และ optimize hot paths ใน code

## Rules

### 1. Code Style

- ใช้ local variables เสมอที่เป็นไปได้
- ใช้ meaningful variable names
- ใช้ consistent indentation
- ใช้ comments อย่างเหมาะสม
- หลีกเลี่ยง global variables

### 2. Data Structures

- ใช้ tables สำหรับ arrays, objects, และ modules
- ใช้ metatables สำหรับ OOP patterns
- ใช้ `__index` สำหรับ inheritance
- ใช้ `__call` สำหรับ callable objects
- ใช้ `__tostring` สำหรับ string representation

### 3. Coroutines

- ใช้ coroutines สำหรับ cooperative multitasking
- ใช้ `coroutine.create()` สำหรับสร้าง coroutines
- ใช้ `coroutine.resume()` สำหรับ execute
- ใช้ `coroutine.yield()` สำหรับ yielding
- จัดการ coroutine states อย่างเหมาะสม

### 4. Error Handling

- ใช้ `pcall` และ `xpcall` สำหรับ error handling
- ใช้ `error()` สำหรับ throw errors
- ใช้ custom error types
- log errors อย่างเหมาะสม
- ให้ error messages ที่ชัดเจน

## Expected Outcome

- Lua code ที่เป็นมาตรฐานและ maintainable
- การใช้ tables และ metatables อย่างถูกต้อง
- Async programming ที่มีประสิทธิภาพด้วย coroutines
- Code ที่ lightweight และ fast
- Error handling ที่เหมาะสม
- Code ที่ผ่านการทดสอบและ debug แล้ว
