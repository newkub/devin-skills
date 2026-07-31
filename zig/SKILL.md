---
name: zig
description: "แนวทางการพัฒนา Zig ตาม best practices สำหรับ systems programming ที่เน้นความเรียบง่าย,..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

พัฒนา Zig ตาม best practices สำหรับ systems programming ที่เน้นความเรียบง่าย, performance และ memory safety โดยไม่มี hidden control flow หรือ hidden allocations


## Scope

ใช้สำหรับการพัฒนา Zig ทุกประเภท เช่น systems programming, game development, CLI tools, WebAssembly development, และ C/C++ interoperability


## Execute

- ทำความเข้าใจ comptime evaluation
- เรียนรู้ allocators และ memory management
- ศึกษา error handling ด้วย error unions
- ทำความเข้าใจ Zig build system
- ติดตั้ง Zig compiler
- ตั้งค่า `build.zig` สำหรับ project
- ตั้งค่า environment variables
- ติดตั้ง IDE plugins
- ใช้ comptime สำหรับ compile-time computation
- ใช้ allocators อย่างเหมาะสม
- ใช้ error unions สำหรับ error handling
- ใช้ defer สำหรับ cleanup
- จัดการ memory อย่างชัดเจน
- เขียน unit tests ด้วย built-in test framework
- ใช้ `zig test` สำหรับ running tests
- ใช้ debugging tools
- ตรวจสอบ memory leaks


## Rules

- ใช้ snake_case สำหรับ variables และ functions
- ใช้ PascalCase สำหรับ types
- ใช้ consistent indentation
- ใช้ comments อย่างเหมาะสม
- หลีกเลี่ยง hidden allocations
- ใช้ comptime สำหรับ compile-time computation
- ใช้ comptime สำหรับ type generation
- หลีกเลี่ยง runtime overhead
- ใช้ inline functions เมื่อเหมาะสม
- ใช้ generic types ด้วย comptime
- ใช้ allocators อย่างชัดเจน
- ใช้ stack allocation เมื่อเป็นไปได้
- ใช้ defer สำหรับ cleanup
- หลีกเลี่ยง memory leaks
- ใช้ arena allocators สำหรับ temporary allocations
- ใช้ error unions สำหรับ error handling
- ใช้ try สำหรับ error propagation
- ใช้ catch สำหรับ error handling
- ใช้ custom error types
- ให้ error messages ที่ชัดเจน


## Expected Outcome

- Zig code ที่เป็นมาตรฐานและ maintainable
- Memory safety ที่ชัดเจน
- High performance ด้วย zero-cost abstractions
- No hidden control flow หรือ allocations
- Error handling ที่เหมาะสม
- Code ที่ผ่านการทดสอบและ debug แล้ว
