---
name: follow-tauri/references/tauri
description: Build cross-platform desktop and mobile applications with Rust backend and web frontend....
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

สร้าง cross-platform desktop และ mobile applications ด้วย Rust backend และ web technologies frontend


## Scope

ใช้สำหรับการพัฒนา applications บน Linux, macOS, Windows, Android และ iOS ด้วย single codebase


## Execute

### 1. Installation

อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup

### 2. Quick Start

อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน

### 3. Architecture

อ่าน `guide/architecture.md` สำหรับ multi-process architecture (Core process, WebView processes)

### 4. Key Concepts

อ่าน `key-concepts/` สำหรับแนวคิดเฉพาะทาง (IPC, Commands, Events, ACL, Capabilities, WebView, System APIs)

### 5. Configuration

อ่าน `guide/configuration.md` สำหรับการตั้งค่า
อ่าน `references/configuration.md` สำหรับ configuration reference (tauri.conf.json, Capabilities, ACL)

### 6. Security

อ่าน `guide/security.md` สำหรับ ACL system และ security best practices

### 7. Features

อ่าน `guide/features.md` สำหรับ features ที่มี (mobile support, multi-webview, system tray, updater)

### 8. Principles

อ่าน `principles/` สำหรับหลักการพัฒนา (separation of concerns, async programming, type safety)

### 9. Best Practices

อ่าน `guide/best-practices.md` สำหรับ best practices

### 10. Integration

อ่าน `guide/integration.md` สำหรับ framework integration

### 11. Testing

อ่าน `guide/testing.md` สำหรับ testing strategies

### 12. Performance

อ่าน `guide/performance.md` สำหรับ performance optimization

### 13. Ecosystem

อ่าน `guide/ecosystem.md` สำหรับ Tauri ecosystem และ plugins

### 14. CLI

อ่าน `references/cli.md` สำหรับ CLI documentation (init, dev, build, mobile)

### 15. API

อ่าน `references/api.md` สำหรับ API reference (Core APIs, Plugin APIs)

### 16. Resources

อ่าน `references/website.md` สำหรับ resources (official docs, plugins, community)


## Rules

- ใช้ Rust สำหรับ backend logic ใน Core process
- ใช้ web technologies สำหรับ frontend ใน WebView processes
- ใช้ IPC สำหรับ secure communication ระหว่าง Core และ WebView
- ใช้ ACL และ Capabilities สำหรับ permission management
- ไม่ hardcode secrets ใน frontend
- Optimize bundle size (สามารถเล็กถึง 600KB)
- Test บน target platforms (desktop และ mobile)
- Use Tauri plugins สำหรับ common tasks
- ใช้ backticks สำหรับ `tauri`, commands, APIs
- ใช้ code blocks สำหรับ configuration examples


## Expected Outcome

- Cross-platform desktop และ mobile applications ที่มีขนาดเล็ก (600KB+)
- Rust backend และ web technologies frontend
- Secure foundation ด้วย ACL และ Capabilities
- Multi-webview support สำหรับ complex UI layouts
