---
name: javascript
description: "แนวทางการพัฒนา JavaScript ตาม best practices สำหรับ modern web development ที่เน้น ES6+..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

พัฒนา JavaScript ตาม best practices สำหรับ modern web development ที่เน้น ES6+ features, async programming และ module systems


## Scope

ใช้สำหรับการพัฒนา JavaScript ทุกประเภท เช่น web development, server-side development, mobile applications, desktop applications, API development, และ full-stack development


## Execute

- ทำความเข้าใจ ES6+ syntax และ features
- เรียนรู้ async programming (Promises, async/await)
- ศึกษา module systems (CommonJS, ES Modules)
- ทำความเข้าใจ JavaScript engine และ event loop
- ติดตั้ง Node.js หรือ Bun runtime
- ตั้งค่า `package.json` สำหรับ project
- ติดตั้ง dependencies ด้วย `bun add`
- ตั้งค่า linting และ formatting tools
- ใช้ ES6+ syntax (arrow functions, destructuring, spread operators)
- ใช้ async/await สำหรับ asynchronous operations
- ใช้ ES Modules (import/export)
- ใช้ classes สำหรับ OOP
- ใช้ closures สำหรับ lexical scoping และ privacy
- จัดการ errors อย่างเหมาะสม
- เขียน unit tests สำหรับ functions สำคัญ
- ใช้ debugging tools (Chrome DevTools, Node.js debugger)
- ตรวจสอบ memory leaks และ performance issues


## Rules

- ใช้ `const` และ `let` แทน `var`
- ใช้ arrow functions สำหรับ callbacks
- ใช้ template literals แทน string concatenation
- ใช้ destructuring สำหรับ objects และ arrays
- ใช้ default parameters สำหรับ functions
- ใช้ `async/await` แทน callback hell
- ใช้ `Promise.all()` สำหรับ parallel operations
- จัดการ errors ด้วย `try/catch`
- หลีกเลี่ยง blocking operations
- ใช้ ES Modules (import/export)
- ใช้ named exports สำหรับ multiple exports
- ใช้ default exports สำหรับ main export
- หลีกเลี่ยง circular dependencies
- ใช้ `try/catch` สำหรับ async operations
- ใช้ custom error classes สำหรับ specific errors
- log errors อย่างเหมาะสม
- ให้ error messages ที่ชัดเจน


## Expected Outcome

- JavaScript code ที่เป็นมาตรฐานและ maintainable
- การใช้ ES6+ features อย่างถูกต้อง
- Async programming ที่มีประสิทธิภาพ
- Module system ที่เป็นระบบ
- Error handling ที่เหมาะสม
- Code ที่ผ่านการทดสอบและ debug แล้ว
