---
name: follow-lang-zig
description: เขียน Zig ตาม best practices และ language conventions
---

## Goal

เขียน Zig ตาม best practices และ language conventions

## Scope

ใช้สำหรับเขียน Zig applications และ libraries

## Execute

### 1. Setup Project

> Goal: Setup Project

ตั้งค่า Zig project

1. สร้าง project ด้วย `zig init`
2. ตั้งค่า `build.zig.zon` สำหรับ build configuration
3. ตั้งค่า dependencies ใน `build.zig.zon`
4. ตั้งค่า target สำหรับ cross-compilation

### 2. Write Zig Code

> Goal: Write Zig Code

เขียน Zig code ตาม conventions

1. ใช้ `const` สำหรับ immutable values
2. ใช้ `var` สำหรับ mutable values
3. ใช้ `error unions` สำหรับ error handling
4. ใช้ `defer` สำหรับ cleanup
5. ใช้ `try` สำหรับ error handling

### 3. Memory Management

> Goal: Memory Management

จัดการ memory อย่างเหมาะสม

1. ใช้ allocators สำหรับ memory allocation
2. ใช้ `defer` สำหรับ automatic cleanup
3. ตรวจสอบ memory leaks
4. ใช้ stack allocation เมื่อเป็นไปได้
5. ใช้ RAII patterns สำหรับ resource management

### 4. Optimize Performance

> Goal: Optimize Performance

ปรับปรุง performance

1. ใช้ `comptime` สำหรับ compile-time computation
2. ใช้ `inline` สำหรับ small functions
3. ใช้ SIMD สำหรับ vectorized operations
4. ตรวจสอบ assembly output
5. ใช้ profiling tools สำหรับ optimization

## Rules

### 1. Zig Conventions

ทำตาม Zig language conventions

- ใช้ `camelCase` สำหรับ variable names
- ใช้ `PascalCase` สำหรับ type names
- ใช้ `snake_case` สำหรับ file names
- ใช้ 4 spaces indentation
- ใช้ 100 characters line length

### 2. Error Handling

จัดการ errors อย่างเหมาะสม

- ใช้ `error unions` (`!T`, `?T`, `try`)
- ใช้ `errdefer` สำหรับ cleanup on error
- ใช้ `orelse` สำหรับ early returns
- ใช้ `unwrap` อย่างระมัดระวัง
- ใช้ meaningful error messages

### 3. Memory Safety

รักษา memory safety

- ใช้ allocators สำหรับ safe memory management
- ใช้ `defer` สำหรับ guaranteed cleanup
- ตรวจสอบ bounds สำหรับ arrays
- ใช้ `@ptrCast` อย่างระมัดระวัง
- ใช้ `@safety` สำหรับ safety checks

### 4. Performance

ปรับปรุง performance

- ใช้ `comptime` สำหรับ compile-time evaluation
- ใช้ `inline` สำหรับ hot paths
- ใช้ `@vectorCall` สำหรับ SIMD
- ใช้ `@optimize` สำหรับ optimization hints
- ตรวจสอบ assembly output

### 5. Interop

ใช้ Zig interop features

- ใช้ `@cInclude` สำหรับ C interop
- ใช้ `@cDefine` สำหรับ C macros
- ใช้ `extern` สำหรับ C functions
- ใช้ `@import` สำหรับ library imports
- ตรวจสอบ ABI compatibility

## Expected Outcome

- Zig code ที่เขียนตาม conventions
- Memory safety ที่ดีขึ้น
- Performance ที่ดีขึ้น
- Error handling ที่ robust
- Clean และ maintainable code