---
title: Latest Features 2024-2025
description: ฟีเจอร์ล่าสุดและการอัปเดตใน SolidJS 1.9.x
---

## Version 1.9.x Updates

### Version 1.9.12

- แก้ไข `createDeferred` ป้องกัน Node.js process ไม่ให้ค้างอยู่
- Lazy creation ของ `inTransition` external sources
- ปรับปรุง SSR attribute serialization และ escaping

### Version 1.9.11

- อัปเดต `dom-expressions/seroval` เป็นเวอร์ชันล่าสุด

### Version 1.9.10

- แก้ไข collision ระหว่าง SSR ใน `createResource` เนื่องจาก `loading` property
- ปรับปรุง performance ของ `splitProps`
- อัปเดต `dom-expressions` และ `seroval` plugins

### Version 1.9.8

- เพิ่ม `createMutable` support สำหรับ class inheritance
- เพิ่ม support สำหรับ `is` ใน `Dynamic` component
- อัปเดต compiler และ JSX types
- แก้ไข SSR styling และ double-escaped arrays

### Version 1.8.0

- De-duping streaming serialization โดยใช้ `seroval`
- ปรับปรุง hydration ป้องกัน element duplication
- ทำให้ templates เล็กลงโดยลบ quotes ที่ไม่จำเป็น
- Decouple promise serialization จาก Resources อนุญาต nested promises

### Version 1.7.0

- เริ่ม migration roadmap ไปยัง v2.0
- ปรับปรุง TypeScript support
- Null-asserted control flow สำหรับ `<Show>` และ `<Match>` components

## New Features

### Improved Hydration

SolidJS ปรับปรุง hydration อย่างมีนัยสำคัญ:
- ไม่ set attributes หรือ props ซ้ำระหว่าง hydration
- DOM snapshots ที่แม่นยำยิ่งขึ้น
- Performance ดีขึ้นสำหรับ SSR applications

### Seroval Integration

ใช้ `seroval` สำหรับ streaming serialization:
- De-duping serialization data
- ขนาด bundle เล็กลง
- Performance ดีขึ้นสำหรับ data transfer

### TypeScript Improvements

ปรับปรุง TypeScript support:
- Type narrowing สำหรับ control flow components
- Null-asserted control flow ใน `<Show>` และ `<Match>`
- Better type inference สำหรับ reactive primitives

### createMutable Class Inheritance

`createMutable` รองรับ class inheritance:
- ใช้งานร่วมกับ OOP patterns ได้ดีขึ้น
- Interoperability กับ libraries อื่นๆ ดีขึ้น
- ใช้ด้วยความระมัดระวังเนื่องจาก potential anti-patterns

### Dynamic Component with `is`

`Dynamic` component รองรับ `is` prop:
- ใช้สำหรับ dynamic component rendering
- Performance ดีขึ้นเมื่อเปลี่ยน components

## Migration to v2.0

SolidJS กำลังเตรียม migration ไปยัง v2.0:
- Re-evaluate core APIs
- Introduce new APIs
- Deprecate older APIs
- เป้าหมาย: Better developer experience และ performance

## Best Practices for Latest Version

### Use Latest TypeScript Config

ตั้งค่า `tsconfig.json` สำหรับ SolidJS:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true
  }
}
```

### Leverage Improved Hydration

ตรวจสอบว่า server-rendered output สอดคล้องกับ client-side:
- ใช้ `renderToWebStream` สำหรับ streaming SSR
- ใช้งานกับ Cloudflare Workers และ edge environments
- ได้ประโยชน์จาก hydration optimizations

### Use createMutable Carefully

`createMutable` มีประโยชน์สำหรับ:
- Interoperation กับ libraries อื่น
- OOP patterns
- แต่ระวัง performance cliffs และ anti-patterns

### Stay Updated

ติดตาม updates จาก:
- [SolidJS GitHub Releases](https://github.com/solidjs/solid/releases)
- [SolidJS Documentation](https://docs.solidjs.com/)
- [CHANGELOG.md](https://github.com/solidjs/solid/blob/main/CHANGELOG.md)
