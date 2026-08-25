---
name: follow-tool-rmux
description: ใช้งาน RMUX สำหรับ terminal multiplexer และ automation
---

## Goal

ใช้งาน RMUX สำหรับ terminal multiplexer และ automation

## Scope

ใช้สำหรับ:
- ใช้ terminal multiplexer สำหรับ automation
- เขียน Rust code เพื่อ control tmux sessions
- Programmatic terminal management
- Session automation และ scripting

## Execute

### 1. Create Session

> Goal: สร้าง session ใหม่ด้วย rmux

สร้าง session:
```bash
rmux new-session -s mysession
```

### 2. Attach to Session

> Goal: Attach ไปยัง session
```bash
rmux attach -t mysession
```

### 3. List Sessions

> Goal: แสดง sessions
```bash
rmux ls
```

## Rules

- ใช้ Rust SDK สำหรับ programmatic control
- เข้ากันได้กับ tmux
- ใช้สำหรับ automation และ scripting
- ใช้ session management ที่ efficient

## Expected Outcome

- Terminal multiplexer ที่ automated
- Rust code สำหรับ control tmux sessions
- Programmatic terminal management ที่ flexible
- Session automation ที่ reliable
