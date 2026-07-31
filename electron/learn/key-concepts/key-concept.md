# Key Concept

## What is Electron?

Framework สำหรับสร้าง native desktop applications โดยใช้ web technologies (HTML, CSS, JavaScript) ร่วมกับ Node.js และ Chromium

## Architecture

### Main Process
- ทำงานใน Node.js environment
- ควบคุม application lifecycle
- จัดการ native menus, dialogs, system tray
- เข้าถึง Node.js APIs และ native modules

### Renderer Process
- ทำงานใน Chromium
- แสดงผล UI ด้วย HTML/CSS
- ถูก isolate จาก main process (contextIsolation)
- สื่อสารผ่าน IPC (Inter-Process Communication)

### Preload Script
- เป็น bridge ระหว่าง main และ renderer
- เปิดเผย APIs ที่ปลอดภัยผ่าน contextBridge

## Core Features

| Feature | Description |
|---------|-------------|
| Cross-platform | ทำงานบน Windows, macOS, Linux |
| Node.js Integration | เข้าถึง bun ecosystem |
| Native APIs | ไฟล์ system, notifications, etc. |
| Auto-updater | อัปเดต app อัตโนมัติ |
| DevTools | Built-in Chrome DevTools |

## When to Use

- ต้องการ build desktop app จาก web codebase
- ต้องการ cross-platform compatibility
- ต้องการเข้าถึง native features
