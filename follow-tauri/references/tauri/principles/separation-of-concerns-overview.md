---
title: Separation of Concerns Overview
description: หลักการ Separation of Concerns ใน Tauri
---

## หลักการ

แยก responsibilities ออกจากกันเพื่อให้แต่ละส่วนมีหน้าที่ชัดเจนและ maintainable

## Application Layers

```
┌─────────────────────────────┐
│      Presentation Layer     │ (Frontend UI)
│      - Components          │
│      - Views               │
│      - User Interactions   │
└─────────────┬───────────────┘
              │ IPC
              v
┌─────────────────────────────┐
│      Application Layer       │ (Business Logic)
│      - Commands             │
│      - Services            │
│      - Use Cases           │
└─────────────┬───────────────┘
              │
              v
┌─────────────────────────────┐
│      Domain Layer          │ (Core Logic)
│      - Entities            │
│      - Value Objects       │
│      - Business Rules      │
└─────────────┬───────────────┘
              │
              v
┌─────────────────────────────┐
│   Infrastructure Layer     │ (External Systems)
│      - File System         │
│      - Network             │
│      - Database            │
└─────────────────────────────┘
```
