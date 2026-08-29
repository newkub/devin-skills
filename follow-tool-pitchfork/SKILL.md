---
name: follow-tool-pitchfork
description: ตั้งค่าและใช้งาน pitchfork สำหรับจัดการ daemons/processes ใน project
related:
  - follow-tool-mise
  - follow-tool-github-actions
  - follow-tool-cargo
  - follow-tool-usage
---

## Goal

จัดการ background daemons ด้วย pitchfork สำหรับ development workflows

## Scope

ครอบคลุม `pitchfork.toml`, daemon lifecycle, ready checks, shell hooks, และ TUI

## Execute

### 1. Install

> Goal: มี pitchfork CLI พร้อมใช้

1. แนะนำติดตั้งผ่าน `mise`: `mise use -g pitchfork` หรือ `mise use pitchfork`
2. ทางเลือก: `cargo install pitchfork-cli`
3. ถ้า project ไม่มี mise ให้ทำ `/follow-tool-mise` ก่อน
4. ยืนยันด้วย `pitchfork --version`
5. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 2. Create Configuration

> Goal: กำหนด daemons สำหรับ project

1. สร้าง `pitchfork.toml` ใน root หรือ `.config/pitchfork.toml`
2. กำหนด `[daemons.<name>]` ด้วย `run = "..."`
3. ใช้ `ready_http`, `ready_output`, `ready_port`, `ready_cmd` สำหรับ ready checks
4. ใช้ `depends` สำหรับ dependency ordering
5. ใช้ `auto = ["start", "stop"]` สำหรับ shell hook
6. ใช้ `pitchfork.local.toml` สำหรับ local overrides (ไม่ commit)
7. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 3. Manage Daemons

> Goal: start/stop/monitor daemons

1. `pitchfork start --all` หรือ `pitchfork start <name>`
2. `pitchfork list` เพื่อดู daemons ทั้งหมด
3. `pitchfork status <name>` เพื่อดูรายละเอียด
4. `pitchfork logs <name> --tail` เพื่อ follow logs
5. `pitchfork stop <name>` หรือ `pitchfork stop --all`
6. `pitchfork start <name> --force` เพื่อ restart
7. `pitchfork tui` สำหรับ dashboard
8. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 4. Shell Hook

> Goal: auto-start/stop เมื่อ enter/leave directory

1. เพิ่ม `eval "$(pitchfork activate bash)"` ใน `.bashrc`
2. หรือ `pitchfork activate zsh` สำหรับ zsh
3. หรือ `pitchfork activate fish | source` สำหรับ fish
4. ใช้ `auto = ["start"]` สำหรับ start on enter
5. ใช้ `auto = ["stop"]` สำหรับ stop on exit
6. ใช้ `auto = ["start", "stop"]` สำหรับทั้งสอง
7. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 5. Lifecycle Hooks

> Goal: react ต่อ events ของ daemon

1. กำหนด `[daemons.<name>.hooks]` ด้วย `on_ready`, `on_fail`, `on_retry`, `on_stop`, `on_exit`, `on_output`
2. ใช้ environment variables ใน hooks:
   - `PITCHFORK_DAEMON_ID`
   - `PITCHFORK_EXIT_CODE`
   - `PITCHFORK_EXIT_REASON`
   - `PITCHFORK_MATCHED_LINE`
3. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

## Rules

### 1. Naming

- daemon names ใช้ ASCII alphanumeric, `_`, `-`, `.` เท่านั้น
- ห้ามใช้ double dashes, slashes, spaces, leading/trailing dashes
- namespace ใช้ชื่อ directory ถ้าไม่ได้กำหนด `namespace` ใน config
- ใน `pitchfork.toml` กำหนด `namespace = "..."` ถ้าชื่อ directory ไม่ valid

### 2. Configuration

- ใช้ `pitchfork.toml` หรือ `.config/pitchfork.toml`
- `pitchfork.local.toml` สำหรับ local overrides (ไม่ commit)
- ใช้ `exec` นำหน้า command เพื่อให้ PID ตรงกับ daemon binary
- กำหนด `ready_*` เพื่อรอจน daemon พร้อม
- ใช้ `retry` สำหรับ auto-restart

### 3. Example pitchfork.toml

```toml
[daemons.api]
run = "exec bun run dev"
ready_http = "http://localhost:3000/health"
auto = ["start", "stop"]

[daemons.database]
run = "exec docker compose up postgres"
ready_port = 5432

[daemons.worker]
run = "exec bun run worker"
depends = ["database"]

[daemons.worker.hooks]
on_fail = "echo 'worker failed with code $PITCHFORK_EXIT_CODE'"
on_output = { filter = "connected", run = "echo 'worker ready'" }
```

### 4. Common Commands

- `pitchfork start --all`
- `pitchfork list`
- `pitchfork logs <name> --tail`
- `pitchfork stop <name>`
- `pitchfork tui`
- `pitchfork project enter --pid $$`
- `pitchfork project leave --pid $$`

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- pitchfork ติดตั้งและทำงานผ่าน mise
- `pitchfork.toml` กำหนด daemons ครบ
- daemon auto-start/stop ผ่าน shell hook หรือ IDE integration
- ready checks ช่วยให้รู้ว่า service พร้อม
- lifecycle hooks ช่วย monitor และ cleanup
