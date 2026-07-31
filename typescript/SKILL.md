---
name: typescript
description: "แนวทางการพัฒนา TypeScript ตาม best practices สำหรับ type-safe JavaScript development ที่เน้น..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

พัฒนา TypeScript ตาม best practices สำหรับ type-safe JavaScript development ที่เน้น type safety, developer experience และ scalability


## Scope

ใช้สำหรับการพัฒนา TypeScript ทุกประเภท เช่น web development, large-scale applications, API development, full-stack development, และ library development


## Execute

- ทำความเข้าใจ type system และ type inference
- เรียนรู้ generics และ utility types
- ศึกษา interfaces และ type aliases
- ทำความเข้าใจ declaration files
- ติดตั้ง TypeScript compiler
- ตั้งค่า `tsconfig.json` สำหรับ project
- ติดตั้ง dependencies ด้วย `bun add`
- ตั้งค่า linting และ formatting tools
- ใช้ type annotations อย่างเหมาะสม
- ใช้ generics สำหรับ reusable code
- ใช้ interfaces สำหรับ contracts
- ใช้ type guards สำหรับ type narrowing
- จัดการ errors อย่างเหมาะสม
- เขียน unit tests สำหรับ functions สำคัญ
- ใช้ TypeScript compiler สำหรับ type checking
- ใช้ debugging tools
- ตรวจสอบ type coverage


## Rules

- ใช้ `strict` mode เสมอ
- ใช้ type annotations เมื่อจำเป็น
- หลีกเลี่ยง `any` type
- ใช้ `unknown` แทน `any` เมื่อจำเป็น
- ใช้ type guards สำหรับ runtime checks
- ใช้ interfaces สำหรับ object shapes
- ใช้ type aliases สำหรับ unions และ complex types
- ใช้ PascalCase สำหรับ types และ interfaces
- ใช้ camelCase สำหรับ variables และ functions
- ใช้ kebab-case สำหรับ file names
- ใช้ generics สำหรับ reusable components
- ใช้ constraints สำหรับ generic types
- ใช้ default type parameters
- หลีกเลี่ยง overly complex generics
- ใช้ utility types เมื่อเหมาะสม
- ใช้ custom error types
- ใช้ Result pattern สำหรับ operations
- ใช้ try/catch สำหรับ async operations
- log errors อย่างเหมาะสม
- ให้ error messages ที่ชัดเจน


## Expected Outcome

- TypeScript code ที่เป็นมาตรฐานและ maintainable
- Type safety ที่เข้มงวด
- Developer experience ที่ดี
- Code ที่ scalable และ maintainable
- Error handling ที่เหมาะสม
- Code ที่ผ่านการทดสอบและ debug แล้ว
