---
name: follow-framework-ratatui
description: สร้าง TUI ด้วย Ratatui library สำหรับ Rust
related:
  - follow-framework-astro
  - follow-framework-capacitor
  - follow-framework-desktop-app
  - follow-best-practice
  - setup-cicd
  - follow-my-tech-stack
---

## Goal

สร้าง Terminal User Interface (TUI) ด้วย Ratatui library สำหรับ Rust

## Scope

ใช้สำหรับสร้าง TUI applications ด้วย Ratatui และ crossterm

## Execute

### 1. Install Dependencies

> Goal: ติดตั้ง Ratatui และ dependencies ที่จำเป็น

1. เพิ่ม `ratatui` และ `crossterm` ใน `Cargo.toml`
2. เพิ่ม dependencies เสริมตามความต้องการ

### 2. Setup Terminal

> Goal: ตั้งค่า terminal สำหรับ TUI

1. สร้าง `Terminal` instance ด้วย `crossterm`
2. ตั้งค่า `alternate screen` และ `raw mode`
3. จัดการ `PanicHook` สำหรับ graceful shutdown

### 3. Create Layout

> Goal: สร้าง layout สำหรับ UI components

1. ใช้ `Layout` และ `Constraint` จาก `ratatui::layout`
2. กำหนด directions (horizontal, vertical)
3. กำหนด sizes (percentage, fixed, min, max)

### 4. Build Components

> Goal: สร้าง UI components ต่างๆ ด้วย Ratatui widgets

สร้าง UI components ต่างๆ

1. ใช้ `Paragraph`, `Block`, `Borders` สำหรับ text
2. ใช้ `List`, `ListItem` สำหรับ lists
3. ใช้ `Table`, `Row`, `Cell` สำหรับ tables
4. ใช้ `Gauge`, `Sparkline` สำหรับ progress

### 5. Handle Events

> Goal: จัดการ keyboard และ terminal events อย่างเสถียร

จัดการ keyboard และ terminal events

1. สร้าง event loop ด้วย `crossterm::event`
2. จัดการ `KeyEvent`, `MouseEvent`
3. จัดการ terminal resize events

### 6. Render Loop

> Goal: สร้าง render loop สำหรับ update UI อย่างมีประสิทธิภาพ

สร้าง render loop สำหรับ update UI

1. สร้าง `draw` function ด้วย `terminal.draw()`
2. จัดการ state updates
3. ควบคุม frame rate และ refresh rate

## Rules

### 1. Terminal Management

จัดการ terminal state อย่างถูกต้อง

- ต้อง restore terminal state เมื่อ panic หรือ exit
- ใช้ `enable_raw_mode()` และ `disable_raw_mode()` คู่กัน
- ใช้ `enter_alternate_screen()` และ `exit_alternate_screen()` คู่กัน
- ตั้งค่า `PanicHook` สำหรับ restore terminal state

### 2. Layout Design

ออกแบบ layout ให้ responsive และ maintainable

- ใช้ `Constraint` แทน hardcoded sizes
- แบ่ง layout เป็น nested structures ชัดเจน
- ใช้ `Split` สำหรับ complex layouts
- จัดเก็บ layout state แยกจาก render logic

### 3. State Management

จัดการ state อย่างเป็นระบบ

- แยก business logic จาก render logic
- ใช้ structs สำหรับ state management
- จัดการ state updates ใน event loop
- ใช้ immutable updates เมื่อเป็นไปได้

### 4. Performance

เพิ่มประสิทธิภาพ TUI applications

- ลบ buffer ก่อน render เสมอ
- ใช้ `Frame` สำหรับ area calculations
- จัดการ partial updates เมื่อเป็นไปได้
- ใช้ double buffering สำหรับ smooth rendering

### 5. Error Handling

จัดการ errors อย่างเหมาะสม

- ใช้ `Result` types สำหรับ error handling
- แสดง error messages ใน TUI
- จัดการ recoverable errors อย่าง graceful
- Log errors สำหรับ debugging

## Expected Outcome

- TUI application ที่ทำงานได้จริง
- Layout ที่ responsive และ maintainable
- Event handling ที่เสถียร
- State management ที่ชัดเจน