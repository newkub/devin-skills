# Features

## Core Features

| Feature | คำอธิบาย | เวอร์ชัน |
|---------|----------|---------|
| **Cross-Platform** | รองรับ Desktop + Mobile | v2+ |
| **Small Binary** | ขนาดเล็กกว่า Electron 10x | - |
| **Rust Backend** | High performance, memory safe | - |
| **Web Frontend** | ใช้ web technologies ที่คุ้นเคย | - |
| **IPC Commands** | เรียก Rust functions จาก JS | - |
| **Plugin System** | ขยาย functionality ได้ | v2+ |
| **Capabilities** | ระบบ permission ที่ปลอดภัย | v2+ |

## Platform Features

### Desktop

| Feature | Windows | macOS | Linux |
|---------|---------|-------|-------|
| Native Window | ✅ | ✅ | ✅ |
| System Tray | ✅ | ✅ | ✅ |
| Global Shortcuts | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |
| File System | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ |

### Mobile (v2)

| Feature | Android | iOS |
|---------|---------|-----|
| Native Controls | ✅ | ✅ |
| Camera | ✅ | ✅ |
| GPS | ✅ | ✅ |
| Notifications | ✅ | ✅ |
| Bluetooth | ✅ | ✅ |

## Built-in Plugins

| Plugin | คำอธิบาย | Package |
|--------|----------|---------|
| **fs** | File system operations | @tauri-apps/plugin-fs |
| **dialog** | Native dialogs | @tauri-apps/plugin-dialog |
| **http** | HTTP requests | @tauri-apps/plugin-http |
| **shell** | Shell commands | @tauri-apps/plugin-shell |
| **store** | Key-value storage | @tauri-apps/plugin-store |
| **sql** | SQLite database | @tauri-apps/plugin-sql |
| **os** | OS information | @tauri-apps/plugin-os |
| **process** | Process management | @tauri-apps/plugin-process |
| **updater** | Auto updates | @tauri-apps/plugin-updater |
| **clipboard** | Clipboard access | @tauri-apps/plugin-clipboard-manager |
| **log** | Logging | @tauri-apps/plugin-log |

## Security Features

### Capabilities System

```json
{
  "permissions": [
    "core:default",
    "fs:allow-read-text-file",
    "dialog:allow-open"
  ]
}
```

### Permission Types

| Type | คำอธิบาย |
|------|----------|
| **allow-* | อนุญาตให้ทำ action นั้น |
| **deny-* | ห้ามทำ action นั้น |
| **scope-* | กำหนดขอบเขตการใช้งาน |

## Development Features

| Feature | คำอธิบาย |
|---------|----------|
| **Hot Reload** | Reload เมื่อมีการเปลี่ยนแปลง |
| **DevTools** | Built-in developer tools |
| **TypeScript** | Full TS support |
| **Debug Build** | Easy debugging |
| **Watch Mode** | Auto rebuild |

## Build Features

| Feature | คำอธิบาย |
|---------|----------|
| **Code Signing** | Sign สำหรับ distribution |
| **Updater** | Auto update system |
| **Bundle Formats** | Multiple installer formats |
| **Resource Embedding** | Embed resources ใน binary |
| **Target Triple** | Cross-compilation |
