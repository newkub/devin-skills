# แนวคิดหลัก

## Tool Version Management

mise ใช้แนวคิดของการจัดการ tool versions แยกจาก system packages:
- แต่ละ project สามารถมี tool versions ที่แตกต่างกัน
- ไม่ต้องใช้ sudo หรือ system-level installation
- สามารถ switch versions ได้อย่างรวดเร็ว

## Plugin System

mise ใช้ plugin สำหรับจัดการ tools แต่ละประเภท:
- Plugins จัดการ logic สำหรับ download, install, และ version detection
- Auto-load plugins จาก community repository
- สามารถใช้ custom plugins สำหรับ internal tools

## Configuration Hierarchy

mise ใช้ configuration hierarchy สำหรับ determine versions:
1. `.mise.toml` (project level)
2. `~/.config/mise/config.toml` (global level)
3. Environment variables
4. Default versions

## Shell Integration

mise ใช้ shell integration สำหรับ modify PATH และ environment:
- `mise activate` สำหรับ setup shell integration
- Auto-modify PATH ตาม current directory
- รองรับ bash, zsh, fish, powershell
