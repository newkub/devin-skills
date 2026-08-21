# Key Concepts

## Architecture Overview

Tauri ใช้สถาปัตยกรรมแบบ multi-process:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Tauri Architecture                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────┐        ┌─────────────────────────┐  │
│   │     Frontend        │  IPC   │      Rust Backend       │  │
│   │   (Web Technologies)│◄──────►│   (Tauri Core + Apps)   │  │
│   │                     │        │                         │  │
│   │  - HTML/CSS/JS      │        │  - Commands            │  │
│   │  - React/Vue/Svelte │        │  - Events              │  │
│   │  - @tauri-apps/api  │        │  - Plugins             │  │
│   └─────────────────────┘        └───────────┬─────────────┘  │
│                                              │                  │
│                                              ▼                  │
│                                    ┌─────────────────────────┐  │
│                                    │   System Integration    │  │
│                                    │   (Wry / TAO)          │  │
│                                    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Concepts

### 1. IPC (Inter-Process Communication)

Tauri ใช้ IPC สำหรับการสื่อสารระหว่าง Frontend และ Rust:

```
Frontend (JavaScript)          Rust (Backend)
       │                             │
       │    invoke("cmd_name")      │
       │ ──────────────────────────►│
       │                             │
       │    returns data             │
       │ ◄──────────────────────────│
       │                             │
```

### 2. Commands

Commands คือ Rust functions ที่สามารถเรียกจาก Frontend ได้:

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

```javascript
// Frontend
import { invoke } from '@tauri-apps/api/core';
const greeting = await invoke('greet', { name: 'World' });
```

### 3. Capabilities (Tauri v2)

ระบบ permission ใหม่ของ Tauri v2:

```json
// src-tauri/capabilities/main.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "description": "Main application capabilities",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:default",
    "dialog:default"
  ]
}
```

### 4. Plugins

ระบบ plugin สำหรับขยาย functionality:

```bash
bun run tauri add store    # Add built-in plugins
bun run tauri add sql
bun run tauri add fs
```

| Plugin | คำอธิบาย |
|--------|----------|
| **@tauri-apps/plugin-store** | Local key-value storage |
| **@tauri-apps/plugin-fs** | File system operations |
| **@tauri-apps/plugin-dialog** | Native dialogs |
| **@tauri-apps/plugin-sql** | SQLite database |
| **@tauri-apps/plugin-shell** | Shell commands |
| **@tauri-apps/plugin-http** | HTTP requests |

### 5. Window Management

```javascript
import { getCurrentWindow } from '@tauri-apps/api/window';

const win = getCurrentWindow();
// win.hide()
// win.setTitle('New Title')
// win.setFullscreen(true)
```

## Key Files

| File | คำอธิบาย |
|------|----------|
| `src-tauri/tauri.conf.json` | Main configuration |
| `src-tauri/Cargo.toml` | Rust dependencies |
| `src-tauri/src/lib.rs` | Rust entry point |
| `src-tauri/capabilities/` | Permission definitions |
| `package.json` | Node.js scripts |
