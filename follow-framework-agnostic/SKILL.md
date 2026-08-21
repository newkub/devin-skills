---
name: follow-framework-agnostic
description: แนวทางการพัฒนาโค้ดที่ทำงานได้บน multiple frameworks โดยไม่ผูกติดกับ framework ใด framework หนึ่ง
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

พัฒนาโค้ดที่ทำงานได้บน multiple frameworks โดยไม่ผูกติดกับ framework ใด framework หนึ่ง

## Execute

พัฒนาโค้ดที่สามารถทำงานได้บน multiple frameworks (React, Vue, Svelte, Solid) โดยไม่ผูกติดกับ framework ใด framework หนึ่งเป็นพิเศษ

## Scope

ใช้สำหรับ:

- สร้าง libraries ที่ใช้ได้หลาย frameworks
- แยก business logic ออกจาก UI framework
- สร้าง adapters สำหรับแต่ละ framework
- Design composable interfaces

## Inputs

| Input | Details |
|-------|---------|
| Target Frameworks | รายการ frameworks ที่ต้องการรองรับ |
| Core Logic | business logic ที่ต้องการแยก |

## Rules

### Core Principles

| Principle | Description |
|-----------|-------------|
| Framework-agnostic core | Core logic ไม่ import framework |
| Adapter pattern | สร้าง adapters สำหรับแต่ละ framework |
| Standard APIs | ใช้ Web APIs มาตรฐาน |
| Type-safe | รองรับ TypeScript ทุก framework |

### Code Organization

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

## Structure

### Phase Definitions

| Phase | Description | Main Activities |
|-------|-------------|---------------|
| Design | ออกแบบ | กำหนด core API |
| Implement Core | พัฒนา core | framework-agnostic logic |
| Create Adapters | สร้าง adapters | สำหรับแต่ละ framework |
| Test | ทดสอบ | verify ทุก frameworks |

## Steps

### Phase 1: Design

- 1.1 Define Core API
  - กำหนด interfaces หลัก
  - กำหนด public API
  - ไม่ใช้ framework-specific types

- 1.2 Design Adapters
  - วางแผน adapter สำหรับแต่ละ framework
  - กำหนด adapter interface
  - วางแผน framework-specific hooks

### Phase 2: Implement Core

- 2.1 Create Core Logic
  - สร้าง `src/core/` directory
  - Implement business logic
  - ใช้ vanilla TypeScript/JavaScript
  - ไม่ import framework dependencies

- 2.2 Core Utilities
  - สร้าง utility functions
  - ใช้ standard Web APIs
  - สร้าง pure functions

### Phase 3: Create Adapters

- 3.1 React Adapter
  - สร้าง `src/react/` directory
  - สร้าง hooks ที่ wrap core logic
  - ใช้ React patterns (useState, useEffect)

- 3.2 Vue Adapter
  - สร้าง `src/vue/` directory
  - สร้าง composables ที่ wrap core logic
  - ใช้ Vue patterns (ref, computed, watch)

- 3.3 Other Frameworks
  - ทำซ้ำสำหรับ frameworks อื่น
  - รักษา consistent API
  - ใช้ framework-specific patterns

### Phase 4: Test

- 4.1 Core Tests
  - เขียน unit tests สำหรับ core
  - ใช้ vanilla test framework

- 4.2 Adapter Tests
  - เขียน integration tests สำหรับแต่ละ adapter
  - ทดสอบกับ framework-specific patterns
  - verify compatibility

- 4.3 Cross-Framework Tests
  - ทดสอบว่า behavior consistent ทุก framework
  - ทดสอบ edge cases
  - verify type safety

## Outputs

| Output | Details |
|--------|---------|
| Core Library | Framework-agnostic core |
| Adapters | Adapters สำหรับแต่ละ framework |
| Tests | Test suite ครอบคลุม |
| Documentation | คู่มือการใช้งาน |

## Expected Outcome

- Core logic ไม่ผูกติด framework
- Adapters ทำงานได้ทุก frameworks
- API consistent ข้าม frameworks
- Type safety ครบถ้วน

## Reference

- `/validate` - ตรวจสอบความถูกต้องก่อนเริ่ม
- `/follow-typescript` - TypeScript best practices
