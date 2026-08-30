---
name: follow-lib-framework-agnostic
description: พัฒนา libraries ที่ใช้ได้บน multiple frameworks โดยไม่ผูกติด framework ใด
related:
  - deep-validate
  - follow-lang-typescript
---

## Goal

พัฒนาโค้ดที่ทำงานได้บน multiple frameworks โดยไม่ผูกติดกับ framework ใด framework หนึ่ง

## Scope

พัฒนาโค้ดที่สามารถทำงานได้บน multiple frameworks (React, Vue, Svelte, Solid) โดยไม่ผูกติดกับ framework ใด framework หนึ่งเป็นพิเศษ

ใช้สำหรับ:

- สร้าง libraries ที่ใช้ได้หลาย frameworks
- แยก business logic ออกจาก UI framework
- สร้าง adapters สำหรับแต่ละ framework
- Design composable interfaces

## Execute

### 1. Design Core API

> Goal: กำหนด interfaces และ adapters ที่ framework-agnostic

1. กำหนด interfaces หลักโดยไม่อ้างอิง framework-specific types
2. กำหนด public API
3. วางแผน adapter สำหรับแต่ละ framework
4. กำหนด framework-specific hooks/composables ทีต้อง implement

### 2. Implement Core

> Goal: สร้าง framework-agnostic business logic

1. สร้าง `src/core/` directory
2. Implement business logic ด้วย vanilla TypeScript/JavaScript
3. สร้าง utility functions โดยใช้ standard Web APIs
4. ห้าม import framework dependencies ใน `src/core/`

### 3. Create Adapters

> Goal: สร้าง adapters สำหรับแต่ละ framework

1. สร้าง `src/react/` directory และ hooks ที่ wrap core logic
2. สร้าง `src/vue/` directory และ composables ที่ wrap core logic
3. ทำซ้ำสำหรับ Svelte, Solid, หรือ frameworks อื่น
4. รักษา consistent API ข้าม adapters

### 4. Test

> Goal: ทดสอบ core และ adapters

1. เขียน unit tests สำหรับ core ด้วย vanilla test framework
2. เขียน integration tests สำหรับแต่ละ adapter
3. ทดสอบ edge cases ข้าม frameworks
4. verify type safety ด้วย TypeScript

## Rules

### 1. Core Principles

- Framework-agnostic core: core logic ไม่ import framework
- Adapter pattern: สร้าง adapters สำหรับแต่ละ framework
- Standard APIs: ใช้ Web APIs มาตรฐาน
- Type-safe: รองรับ TypeScript ทุก framework

### 2. Code Organization

```text
src/
├── core/                   # Framework-agnostic core
│   ├── logic.ts
│   ├── types.ts
│   └── utils.ts
├── react/                  # React adapter
│   ├── useHook.ts
│   └── adapter.tsx
├── vue/                    # Vue adapter
│   ├── composable.ts
│   └── adapter.vue
└── shared/                 # Shared utilities
    └── helpers.ts
```

### 3. Safety

- ไม่ผูก core logic กับ framework lifecycle
- ไม่ใช้ framework-specific global state
- เก็บ types ใน `core/types.ts` ไม่ใช่ใน adapter

## Guide

- `/deep-validate` — ตรวจสอบความถูกต้องก่อนเริ่ม
- `/follow-lang-typescript` — TypeScript best practices

## Expected Outcome

- Core logic ไม่ผูกติด framework
- Adapters ทำงานได้ทุก frameworks
- API consistent ข้าม frameworks
- Type safety ครบถ้วน
