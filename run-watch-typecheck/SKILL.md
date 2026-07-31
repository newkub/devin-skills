---
name: run-watch-typecheck
description: รัน type checking แบบ watch mode เพื่อตรวจสอบ type errors อย่างต่อเนื่อง
---

## Goal

รัน type checking แบบ watch mode เพื่อตรวจสอบ type errors อย่างต่อเนื่อง

## Scope

ใช้สำหรับ project ที่ต้องการรัน type checking แบบ watch mode ขณะพัฒนา

## Prompt

ใช้ workflow นี้เมื่อต้องการรัน type checking แบบ watch mode เพื่อตรวจสอบ type errors อย่างต่อเนื่องขณะพัฒนา

## Execute

1. ตรวจสอบ Type Checking Setup

- ตรวจสอบว่าโปรเจกต์มี TypeScript หรือ type checking tool ที่เหมาะสม
- ตรวจสอบ tsconfig.json หรือ configuration files ที่เกี่ยวข้อง
- ยืนยันว่า type checking script ถูกกำหนดใน main config
- ตรวจสอบว่า dependencies ที่จำเป็นถูกติดตัวแล้ว

2. รัน Type Check Watch Mode

- รัน type check ด้วย watch mode (tsc --watch, vue-tsc --watch, ฯลฯ)
- กำหนด files ที่จะ monitor ตาม project structure
- ตั้งค่า ignore patterns สำหรับ files ที่ไม่ต้อง type check
- ติดตาม output จาก type checker

3. ติดตามและแก้ไข Type Errors

- ตรวจสอบ type errors ที่เกิดขึ้นทันที
- แก้ไข type errors ตาม priority
- อัพเดท type definitions ถ้าจำเป็น
- รัน `/resolve-errors` สำหรับ errors ที่ซับซ้อน หรือ `/deep-debug` สำหรับ errors ที่ต้องวางแผนแก้

4. ปรับปรุง Type Safety

- เพิ่ม type annotations สำหรับ code ที่ขาด
- แก้ไข any types ที่สามารถระบุ type ได้
- ปรับปรุง generic types ให้เหมาะสม
- อัพเดท interface และ type definitions

5. ตรวจสอบ Performance

- ตรวจสอบว่า type checking ไม่ช้าเกินไป
- ปรับปรุง tsconfig options ถ้าจำเป็น
- ใช้ incremental compilation ถ้ารองรับ
- จัดการ project references ถ้าใช้

## Rules

1. Type Safety First

- ไม่ ignore type errors โดยไม่มีเหตุผลชัดเจน
- ใช้ strict mode เมื่อเป็นไปได้
- หลีกเลี่ยง any types
- Document @ts-ignore และ @ts-expect-error

2. Real-time Monitoring

- ตรวจสอบ type errors ทันทีที่เกิด
- แก้ไข errors ก่อนทำงานต่อ
- ไม่ commit code ที่มี type errors
- รัน type check ก่อน merge

3. Performance

- ใช้ watch mode อย่างมีประสิทธิภาพ
- ปรับ configuration ให้เหมาะกับ project size
- ใช้ incremental compilation
- จัดการ project references

4. Consistency

- ใช้ consistent type definitions
- ทำตาม TypeScript best practices
- อัพเดท types อย่างสม่ำเสมอ
- Review type errors อย่างเป็นระบบ

## Expected Outcome

- Type checking ทำงานแบบ watch mode อย่างต่อเนื่อง
- Type errors ถูกตรวจสอบและแก้ไขทันที
- Codebase มี type safety สูง
- Performance ของ type checking เหมาะสม
