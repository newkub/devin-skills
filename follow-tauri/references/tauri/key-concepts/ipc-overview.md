---
title: IPC Overview
description: ภาพรวมของ IPC (Inter-Process Communication)
---

## ภาพรวม

IPC คือ mechanism ที่ใช้สื่อสารระหว่าง frontend (JavaScript) และ backend (Rust) ใน Tauri applications

## วิธีการทำงาน

### Communication Flow

```
┌─────────────┐         IPC         ┌─────────────┐
│  Frontend   │ <───────────────> │   Backend   │
│ (JavaScript)│                   │   (Rust)    │
└─────────────┘                   └─────────────┘
       │                                 │
       │ invoke()                        │
       v                                 v
┌─────────────┐                   ┌─────────────┐
│  Tauri API  │                   │  Commands   │
└─────────────┘                   └─────────────┘
```

### Request-Response Pattern

```typescript
// Frontend
import { invoke } from '@tauri-apps/api/core'

const result = await invoke('greet', { name: 'World' })
console.log(result) // "Hello, World!"
```

```rust
// Backend
#[tauri::command]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
```
