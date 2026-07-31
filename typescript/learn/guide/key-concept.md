# Key Concept

## What is TypeScript?

TypeScript เป็น programming language ที่พัฒนาโดย Microsoft โดยเพิ่ม static typing เข้าไปใน JavaScript ช่วยให้ตรวจจับ errors ได้ตั้งแต่ compile time

## Core Features

- **Static Typing**: กำหนด type ให้ตัวแปร ตรวจหา errors ก่อน runtime
- **Type Inference**: TypeScript สรุป type ให้อัตโนมัติจากค่าที่กำหนด
- **Generics**: สร้าง reusable components ที่ type-safe
- **Interfaces**: กำหนด contract สำหรับ object shapes
- **Union Types**: ตัวแปรรับค่าได้หลาย type (`string | number`)
- **Intersection Types**: รวมหลาย types เข้าด้วยกัน (`A & B`)
- **Utility Types**: Built-in type transformations (`Partial<T>`, `Pick<T>`)
- **Decorators**: เพิ่ม metadata และ modify behavior
- **Enums**: กำหนด named constants
- **Type Guards**: Narrow types ด้วย conditions

## When to Use

- Web development (Frontend และ Backend)
- Large-scale JavaScript applications
- API development (REST, GraphQL)
- Full-stack development (Next.js, NestJS)
- Library และ package development
- โปรเจกต์ที่ต้องการ type safety และ maintainability

## TypeScript vs JavaScript

| Feature | TypeScript | JavaScript |
|---------|-----------|-----------|
| Type System | Static | Dynamic |
| Compilation | Required | Not needed |
| Error Detection | Compile-time | Runtime |
| IDE Support | Excellent | Good |
| Learning Curve | Moderate | Easy |
| Ecosystem | Compatible with JS | Native |
