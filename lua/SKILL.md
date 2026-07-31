---
name: lua
description: "แนวทางการพัฒนา Lua ตาม best practices สำหรับ embedded scripting และ lightweight automation"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

พัฒนา Lua ตาม best practices สำหรับ embedded scripting และ lightweight automation


## Scope

ใช้สำหรับการพัฒนา Lua ทุกประเภท เช่น game development, embedded systems, scripting within applications, rapid prototyping, configuration files, และ lightweight automation


## Execute

- ทำความเข้าใจ tables และ metatables
- เรียนรู้ coroutines สำหรับ cooperative multitasking
- ศึกษา Lua VM และ garbage collection
- ทำความเข้าใจ module system
- ติดตั้ง Lua interpreter
- ติดตั้ง LuaRocks package manager
- ตั้งค่า environment variables
- ติดตั้ง dependencies ด้วย LuaRocks
- ใช้ tables สำหรับ data structures
- ใช้ metatables สำหรับ OOP
- ใช้ coroutines สำหรับ async operations
- ใช้ modules สำหรับ code organization
- จัดการ errors อย่างเหมาะสม
- เขียน unit tests สำหรับ functions สำคัญ
- ใช้ debugging tools
- ตรวจสอบ memory usage และ performance


## Rules

- ใช้ local variables เสมอที่เป็นไปได้
- ใช้ meaningful variable names
- ใช้ consistent indentation
- ใช้ comments อย่างเหมาะสม
- หลีกเลี่ยง global variables
- ใช้ tables สำหรับ arrays, objects, และ modules
- ใช้ metatables สำหรับ OOP patterns
- ใช้ `__index` สำหรับ inheritance
- ใช้ `__call` สำหรับ callable objects
- ใช้ `__tostring` สำหรับ string representation
- ใช้ coroutines สำหรับ cooperative multitasking
- ใช้ `coroutine.create()` สำหรับสร้าง coroutines
- ใช้ `coroutine.resume()` สำหรับ execute
- ใช้ `coroutine.yield()` สำหรับ yielding
- จัดการ coroutine states อย่างเหมาะสม
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
