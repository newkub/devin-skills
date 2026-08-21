---
name: follow-rmux
description: "Terminal multiplexer สำหรับ automation ที่เขียนด้วย Rust เข้ากันได้กับ tmux และมี Rust SDK..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
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

สร้าง session:
```bash
rmux new-session -s mysession
```

### 2. Attach to Session

Attach ไปยัง session:
```bash
rmux attach -t mysession
```

### 3. List Sessions

แสดง sessions:
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
