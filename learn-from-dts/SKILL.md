---
name: learn-from-dts
description: เรียนรู้ API surface ของ library จาก .d.ts declaration files ใน node_modules
argument-hint: "[package-or-dts-path]"
related:
  - learn
  - learn-from-web
  - learn-from-cli
  - use-lib-effective
  - check-dts
  - report
---

## Goal

เรียนรู้ API surface ของ library จาก `.d.ts` (TypeScript declaration) files — exports, functions, classes, types, overloads — เพื่อรู้ว่า library ทำอะไรได้บ้างจริงโดยไม่ต้องพึ่ง docs

## Scope

ใช้เมื่อต้องรู้ API ที่ library expose จริงจาก type declarations:

- library ติดตั้งแล้วใน `node_modules` หรือ `.d.ts` อยู่ใน project
- ต้องการ authoritative API surface — types เป็นสัญญาจริงของ compile-time
- docs ล้าสมัยหรือไม่ครบ → `.d.ts` คือ source of truth ของ exported API

ไม่ใช่เรียนรู้จาก web docs (ใช้ `/learn-from-web`) หรือ CLI tool (ใช้ `/learn-from-cli`) — ถ้าต้อง review dts emit config ของ project ตัวเองใช้ `/check-dts`

## Execute

### 1. Locate Declaration Entry

> Goal: หา `.d.ts` entry point ของ package

1. รับ package name หรือ path จาก user
2. อ่าน `node_modules/<pkg>/package.json` — ดู `types`, `typings`, `exports["."].types` เพื่อหา entry `.d.ts`
3. ถ้าไม่มี bundled types → เช็ค `node_modules/@types/<pkg>` หรือ DefinitelyTyped
4. ถ้า package เป็น monorepo exports หลาย entry → list ทุก `exports` key ที่มี `.types`

### 2. Map Exported Surface

> Goal: รู้ว่า package export อะไรบ้าง

1. อ่าน entry `.d.ts` — จด `export` statements: `export function`, `export class`, `export const`, `export type`, `export interface`, `export default`, `export * from`, `export =`
2. ตาม `export * from './x'` ไปยังไฟล์ย่อย — แต่อ่านเฉพาะ re-exported names ไม่ใช่ทั้งไฟล์
3. จัดกลุ่มเป็น: functions, classes, constants, types/interfaces, enums, namespaces
4. สำหรับ functions/methods → บันทึก signature, params, return type, overloads
5. สำหรับ classes → บันทึก constructor params, public methods, properties
6. สำหรับ generics → บันทึก type params, constraints และ defaults

### 3. Extract Semantics

> Goal: เข้าใจความหมายไม่ใช่แค่ signature

1. อ่าน JSDoc comments เหนือ declarations — มักมี description, `@example`, `@deprecated`, `@since`
2. ดู union types และ literal types เพื่อรู้ valid values (เช่น `mode: 'a' | 'b'`)
3. ดู optional params (`?`) และ default-related types
4. ดู generic constraints (`<T extends ...>`) เพื่อรู้ข้อจำกัด
5. สังเกต `@deprecated` — อย่าแนะนำ API ที่ deprecated
6. ถ้า declaration ซับซ้อน → อ่าน implementation `.js` ประกอบหรือ docs ต่อด้วย `/learn-from-web`

### 4. Summarize API Surface

> Goal: สรุป capability ที่ใช้งานได้จริง

สรุปในแชทตาม `/report`:

- exported functions พร้อม signatures ที่ใช้บ่อย
- classes พร้อม constructor และ methods หลัก
- types/interfaces ที่ผู้ใช้ต้องส่งหรือรับ
- things the docs อาจไม่บอก — overloads, deprecated APIs, hidden capabilities
- version จาก `package.json` ที่อ่าน `.d.ts` นั้นมา

## Rules

### 1. Declarations Are Ground Truth

- `.d.ts` คือ compile-time contract จริง — ถ้า docs ขัดแย้งให้เชื่อ `.d.ts` แล้ว flag ความขัดแย้ง
- อ่านจาก `node_modules` ของ project ปัจจุบันเสมอ — version ต้องตรงกับที่ใช้จริง
- ถ้าหา `.d.ts` ไม่เจอ → report ว่า package ไม่มี types แล้ว fallback เป็น `/learn-from-web`

### 2. Coverage Without Noise

- list exports ครบ แต่ลงรายละเอียดเฉพาะที่เกี่ยวกับ use case — ไม่ dump ทั้งไฟล์
- แยกชัดระหว่าง public API กับ internal types ที่รั่วออกมาใน declarations

### 3. No Guessing

- ทุก claim ต้องชี้ได้ว่าอยู่ใน `.d.ts` ไฟล์ไหน — ห้ามเดา signature จาก memory
- ถ้าไม่แน่ใจ semantics → cross-check ด้วย `/learn-from-web` หรือ JSDoc ใน declaration

## Expected Outcome

- API surface สรุปจาก declarations จริงของ version ที่ติดตั้งอยู่
- รู้ exports, signatures, overloads, deprecated APIs โดยไม่เดา
- ถ้าถูกเรียกเพื่อ skill dependency → ข้อมูลพร้อมเขียน reference file จริง
