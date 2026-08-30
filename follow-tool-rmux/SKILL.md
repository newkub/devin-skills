---
name: follow-tool-rmux
description: ตั้งค่าและใช้งาน RMUX terminal multiplexer สำหรับ automation และ scripting
related:
  - follow-lang-rust
  - follow-tool-cargo
  - follow-framework-ratatui
  - follow-tool-usage
---

## Goal

ตั้งค่าและใช้งาน RMUX สำหรับ terminal multiplexer, automation และ programmatic control

## Scope

ใช้สำหรับ projects ที่ต้องการ tmux-compatible CLI หรือ drive terminal sessions ผ่าน Rust/Python/TypeScript SDK

## Execute

### 1. Install RMUX

> Goal: ติดตั้ง RMUX CLI บน environment

1. ใช้ `mise use -g rmux` หรือ `cargo install rmux --locked`
2. บน Windows ใช้ `winget install rmux` หรือ `scoop install rmux`
3. บน macOS ใช้ `brew install rmux`
4. ยืนยันด้วย `rmux --version`
5. ดูรายละเอียดใน [references/rmux-cli.md](references/rmux-cli.md)

### 2. Create and Attach Sessions

> Goal: สร้างและ attach sessions

1. สร้าง session ด้วย `rmux new-session -s mysession` หรือ `rmux new -s mysession`
2. Attach ด้วย `rmux attach -t mysession`
3. Detach ด้วย `rmux detach`
4. แสดง sessions ทั้งหมดด้วย `rmux ls`
5. ดูรายละเอียดใน [references/rmux-cli.md](references/rmux-cli.md)

### 3. Manage Panes and Windows

> Goal: จัดการ panes, windows และ layouts

1. สร้าง window ด้วย `rmux new-window -n name`
2. Split pane ด้วย `rmux split-window -h` หรือ `rmux split-window -v`
3. เลือก pane/window ด้วย `rmux select-pane -t 0.1` หรือ `rmux select-window -t 1`
4. ส่งคำสั่งไปยัง pane ด้วย `rmux send-keys -t 0.0 "ls" Enter`
5. ดูรายละเอียดใน [references/rmux-cli.md](references/rmux-cli.md)

### 4. Configure RMUX

> Goal: ตั้งค่า RMUX สำหรับ shell และ key bindings

1. สร้างไฟล์ config ที่ `~/.rmux.conf` (Linux/macOS) หรือ `%USERPROFILE%\.rmux.conf` (Windows)
2. ตั้งค่า prefix key, mouse support, history limit และ status line
3. รีโหลด config ด้วย `rmux source-file ~/.rmux.conf`
4. ดูรายละเอียดใน [references/rmux-config.md](references/rmux-config.md)

### 5. Automate with SDK

> Goal: ควบคุม RMUX ผ่าน SDK สำหรับ automation

1. ใช้ Rust crate `rmux-sdk` สำหรับ typed async API
2. ใช้ Python package `librmux` หรือ npm `@rmux/sdk` สำหรับ TypeScript
3. สร้าง session, spawn pane, send text, capture output และ wait for text
4. ดูรายละเอียดใน [references/rmux-api.md](references/rmux-api.md)

### 6. CI Integration

> Goal: รัน RMUX sessions ใน CI pipelines

1. ติดตั้ง RMUX ใน CI ด้วย binary จาก release หรือ package manager
2. ใช้ `rmux new-session -d -s ci` เพื่อสร้าง detached session
3. ส่งคำสั่งและ capture output ด้วย CLI หรือ SDK
4. ดูรายละเอียดใน [references/rmux-cli.md](references/rmux-cli.md)

## Rules

### 1. CLI Compatibility

- RMUX รองรับ tmux-compatible command surface มากกว่า 90 คำสั่ง
- ใช้ `rmux` แทน `tmux` เมื่อต้องการ cross-platform runtime ที native
- ใช้ `mise use -g rmux` สำหรับ global install ตาม `global_rules`

### 2. Configuration

- เก็บ config ไว้ที่ `~/.rmux.conf` หรือ `%USERPROFILE%\.rmux.conf`
- ใช้ `rmux source-file <path>` เพื่อ reload โดยไม่ต้อง restart daemon
- ไม่ hard-code secrets หรือ paths ที่ sensitive

### 3. Automation

- ใช้ SDK สำหรับ programmatic control แทน parse text output ถ้าไปได้
- ใช้ `wait-for` หรือ SDK equivalent เพื่อ synchronize ระหว่าง panes
- ปิด sessions ที่ไม่ใช้งานด้วย `rmux kill-session -t <name>`

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- RMUX CLI ติดตั้งและทำงานได้บน target platform
- Sessions, windows, panes ถูกสร้างและจัดการได้
- Config โหลดได้และ key bindings ทำงานตามตั้งค่า
- SDK หรือ CLI ใช้ automation ได้
- ไม่มี detached sessions ค้างหลังจากจบ workflow
