---
name: follow-tool-pitchfork
description: ตั้งค่าและใช้งาน pitchfork สำหรับจัดการ daemons/processes ใน project
argument-hint: "[daemon-or-scope]"
related:
  - follow-tool-mise
  - follow-tool-github-actions
  - follow-tool-cargo
  - use-scripts
---

## Goal

จัดการ background daemons ด้วย pitchfork สำหรับ development workflows

## Scope

ครอบคลุม `pitchfork.toml`, daemon lifecycle, ready/health checks, shell hooks, file watching, cron, port management/reverse proxy, TUI, Web UI, MCP server, boot start และ container mode

- ใช้ skill นี้สำหรับ long-running background daemons — ถ้าเป็น one-off scripts หรือ task runner ให้ใช้ `/use-scripts` หรือ `mise` tasks ผ่าน `/follow-tool-mise` แทน

- Latest: `pitchfork@2.25.0` (crate `pitchfork-cli`) (verified 2026-09-16)
- Architecture: CLI/TUI/Web UI → supervisor → daemon processes (supervisor auto-start เมื่อ client ต้องการ)

## Execute

### 1. Install

> Goal: มี pitchfork CLI พร้อมใช้

1. แนะนำติดตั้งผ่าน `mise`: `mise use -g pitchfork` (global) หรือ `mise use pitchfork@<version>` (pin ต่อ project)
2. ทางเลือก: `cargo install pitchfork-cli --locked` หรือ binary จาก GitHub releases (มี builds สำหรับ macOS, Linux, Windows)
3. ถ้า project ไม่มี mise ให้ทำ `/follow-tool-mise` ก่อน
4. ยืนยันด้วย `pitchfork --version`
5. ติดตั้ง shell completion ด้วย `pitchfork completion <bash|zsh|fish>` (แยกจาก shell hook)
6. บน Windows: default daemon shell คือ `cmd /C` — ถ้าต้องการ POSIX behavior ให้วาง `sh.exe` บน PATH และตั้ง `general.shell = "sh -c"`
7. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 2. Create Configuration

> Goal: กำหนด daemons สำหรับ project

1. สร้าง `pitchfork.toml` ใน root หรือ `.config/pitchfork.toml` พร้อม schema: `#:schema https://pitchfork.jdx.dev/schema.json`
2. กำหนด `[daemons.<name>]` ด้วย `run = "..."` — ใช้ foreground command ห้ามใช้ `&` หรือ daemonize flags
3. ใช้ `ready_http`, `ready_output`, `ready_port`, `ready_cmd`, `ready_delay` สำหรับ ready checks (รับ object form `{ ..., timeout = "30s" }` ได้)
4. ใช้ `health_http`, `health_cmd`, `health_port` สำหรับ health probes ตลอดอายุ daemon
5. ใช้ `port` เพื่อ assign port (`port = 3000`, `port = [8080, 8443]`, หรือ `port = { expect = [3000], bump = 10 }`) — resolved port อยู่ใน `$PORT`, `$PORT0..N`
6. ใช้ `depends` สำหรับ dependency ordering และ `retry` (`0|N|true`) สำหรับ auto-restart
7. ใช้ `auto = ["start", "stop"]` สำหรับ shell hook, `watch` + `watch_mode` สำหรับ restart on change, `cron` สำหรับ schedule, `boot_start` สำหรับ start at login
8. ใช้ `[env]` top-level สำหรับ shared env และ `env` ต่อ daemon — ใช้ Tera template `{{ daemons.<name>.port }}` เพื่อเชื่อม services
9. ใช้ `pitchfork.local.toml` สำหรับ local overrides (ไม่ commit) และ `[groups.<name>]` สำหรับ batch operations
10. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 3. Manage Daemons

> Goal: start/stop/monitor daemons

1. `pitchfork start --all` (`-a`), `--local` (`-l`), `--global` (`-g`), `--group <name>` หรือ `pitchfork start <id>…`
2. `pitchfork list` (`--project`, `--namespace`, `--status`, `--json`) เพื่อดู daemons ทั้ง running และ available
3. `pitchfork status <id> --json` เพื่อดูรายละเอียด daemon เดียว
4. `pitchfork logs <id> --tail` follow logs; filter ด้วย `--grep`, `--regex`, `--level`, `--field`, `--jq`, `--since/--until`, `-n`
5. `pitchfork stop <id>` หรือ `--all`/`--local`/`--group` — graceful stop (SIGTERM → SIGKILL, reverse dependency order)
6. `pitchfork restart <id>` เพื่อ apply config changes แล้ว restart (= `start --force`)
7. `pitchfork run <id> -- <cmd>` สำหรับ ad-hoc daemon โดยไม่ต้องมี config file; `pitchfork wait <id>` รอจน daemon หยุด
8. `pitchfork enable|disable <id>` ควบคุมว่า daemon start ได้หรือไม่; `pitchfork clean [--prune]` ลบ stopped entries
9. `pitchfork daemons add <id> --run '...'` เพื่อเพิ่ม daemon ลง config จาก CLI (`--local`, `--global`, `--watch`, `--cron-schedule` ฯลฯ)
10. ใช้ qualified ID `namespace/name` เมื่อทำงานนอก project directory
11. ดูรายละเอียดใน [references/cli.md](references/cli.md)

### 4. Shell Hook & Project Sessions

> Goal: auto-start/stop เมื่อ enter/leave directory

1. เพิ่ม `eval "$(pitchfork activate bash)"` ใน `.bashrc` (zsh: `activate zsh`, fish: `pitchfork activate fish | source`)
2. ใช้ `auto = ["start"]` start on enter, `auto = ["stop"]` stop on exit, `auto = ["start", "stop"]` ทั้งสอง
3. Autostop รอ `general.autostop_delay` (default `1m`) หลัง session สุดท้ายออก — ตั้งใน `[settings.general]`
4. IDE/tools ใช้ `pitchfork project enter --pid <PID> [--directory <DIR>]` / `leave` / `list --json` แทน shell hook
5. PID ต่อ shell: `$$` (bash/zsh), `$fish_pid` (fish), `$SHELL_PID` (nushell)
6. บน Windows session ที่ crash ไม่ถูก cleanup อัตโนมัติ — ต้อง `project leave` เอง
7. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 5. Lifecycle Hooks

> Goal: react ต่อ events ของ daemon

1. กำหนด `[daemons.<name>.hooks]` ด้วย `on_ready`, `on_fail`, `on_retry`, `on_stop`, `on_exit`, `on_output`
2. `on_output` รับ shorthand string หรือ `{ run, filter?, regex?, debounce? }` (filter/regex ห้ามใช้คู่กัน)
3. Hooks เป็น fire-and-forget ทำงาน background ไม่ block daemon — อย่าใช้ `on_ready` ทำ setup ที่ต้องเสร็จก่อน serve
4. ใช้ environment variables: `PITCHFORK_DAEMON_ID`, `PITCHFORK_DAEMON_NAMESPACE`, `PITCHFORK_RETRY_COUNT`, `PITCHFORK_EXIT_CODE`, `PITCHFORK_EXIT_REASON`, `PITCHFORK_MATCHED_LINE`, `PITCHFORK_PORT0..N`
5. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md)

### 6. Ports, Proxy & Dashboards

> Goal: stable URLs และ monitoring UIs

1. เปิด reverse proxy ใน `~/.config/pitchfork/config.toml`: `[settings.proxy] enable = true` — slug URL `https://<slug>.localhost` คงที่แม้ port เปลี่ยน
2. จัดการ slug ด้วย `pitchfork proxy add <slug> [--dir --daemon]`, `proxy status`, `proxy remove`, `proxy trust`/`untrust` (HTTPS cert)
3. `pitchfork tui [--namespace|--project]` สำหรับ terminal dashboard (vim keys, `?` ดู help)
4. Web UI: `PITCHFORK_WEB_PORT=3120 pitchfork supervisor start --force` หรือ `[settings.web] auto_start = true`
5. MCP server: client config `{ "command": "pitchfork", "args": ["mcp"] }` — tools: status, start, stop, restart, logs
6. ใช้ `mise = true` ต่อ daemon (หรือ `[settings.general] mise = true`) เมื่อ daemon ต้องการ mise tools/env นอก interactive shell
7. `pitchfork boot enable` ลงทะเบียน supervisor ที่ login (macOS launchd / Linux systemd) + `boot_start = true` ต่อ daemon
8. ดูรายละเอียดใน [references/pitchfork.md](references/pitchfork.md) และ [references/apis.md](references/apis.md)

## Rules

### 1. Naming & Namespaces

- daemon names ใช้ ASCII alphanumeric, `_`, `-`, `.` เท่านั้น — ห้าม double dashes, slashes, spaces, leading/trailing dashes, parent references
- ID มี 2 รูปแบบ: short `api` กับ qualified `frontend/api` (`--` ถูก reserve สำหรับ internal encoding)
- namespace ใช้ชื่อ directory ถ้าไม่ได้กำหนด `namespace = "..."` — global config ใช้ namespace `global`
- ถ้าชื่อ directory ไม่ valid ต้องกำหนด top-level `namespace` ใน config ไม่งั้น parse fail
- Git worktrees ได้ namespace ตาม directory name อัตโนมัติ (ปิดด้วย `general.worktree = false`)

### 2. Configuration

- Precedence ภายใน directory: `.config/pitchfork.toml` → `.config/pitchfork.local.toml` → `pitchfork.toml` → `pitchfork.local.toml` (สูงสุด, ไม่ commit)
- ใช้ `exec` นำหน้า command สุดท้ายเพื่อให้ PID ตรงกับ daemon binary: `run = "cd /app && exec node server.js"`
- Ready checks หลายตัวเป็น "any" ไม่ใช่ "all" — ถ้าทุก check หมดเวลา startup fail ด้วย exit code `124`
- `ready_delay` เป็น fallback เท่านั้นเมื่อไม่มี check อื่น (default 3s)
- Health check `retries` = failed probes; daemon `retry` = restart attempts — คนละตัวกัน
- Deprecated: `expected_port`, `auto_bump_port`, `port_bump_attempts` — ใช้ `port = { expect = [...], bump = N }` แทน

### 3. Example pitchfork.toml

```toml
#:schema https://pitchfork.jdx.dev/schema.json

[env]
APP_ENV = "development"

[daemons.redis]
run = "exec redis-server --port $PORT"
port = { expect = [6379], bump = 10 }
ready_cmd = { run = "redis-cli -p $PORT ping", timeout = "15s" }

[daemons.api]
run = "exec node server.js"
port = 3000
depends = ["redis"]
env = { REDIS_URL = "redis://127.0.0.1:{{ daemons.redis.port }}" }
ready_http = { url = "http://127.0.0.1:3000/health", timeout = "30s" }
health_http = { url = "http://127.0.0.1:3000/health", interval = "10s", retries = 3 }
watch = ["src/**/*.ts", "package.json"]
auto = ["start", "stop"]
retry = 3

[daemons.backup]
run = "./scripts/backup.sh"
cron = { schedule = "0 0 2 * * *", retrigger = "finish" }
mise = true

[daemons.api.hooks]
on_fail = "echo 'api failed: $PITCHFORK_EXIT_CODE'"
on_output = { filter = "connected", run = "echo 'api ready'" }

[groups.backend]
daemons = ["redis", "api"]
```

### 4. Common Commands

- `pitchfork start --all` / `pitchfork run demo --port 8000 -- python3 -u -m http.server 8000`
- `pitchfork list --project` / `pitchfork status api`
- `pitchfork logs api --tail` / `pitchfork logs api --level error --jq '.fields.status >= 500'`
- `pitchfork restart api` / `pitchfork stop --local` / `pitchfork wait api`
- `pitchfork tui` / `pitchfork supervisor start --force` / `pitchfork logs pitchfork`
- `pitchfork settings get general.autostop_delay` / `pitchfork settings explain <key>`
- `pitchfork project enter --pid $$` / `pitchfork project leave --pid $$`
- `pitchfork proxy add api` / `pitchfork boot enable` / `pitchfork mcp`

- ใช้ /follow-tool-mise ถ้าจำเป็น (mise integration)
- ใช้ /follow-tool-github-actions ถ้าจำเป็น (tool pitchfork)
- ใช้ /follow-tool-cargo ถ้าจำเป็น

## References

- [Pitchfork reference](references/pitchfork.md)
- [CLI reference](references/cli.md)
- [HTTP API & MCP](references/apis.md)
- [Docs route map](references/routes.md)
- [Official resources](references/website.md)

## Expected Outcome

- pitchfork ติดตั้งและทำงานผ่าน mise
- `pitchfork.toml` กำหนด daemons ครบ พร้อม ready/health checks, dependencies, retry
- daemon auto-start/stop ผ่าน shell hook หรือ IDE project sessions
- file watching, cron, port bumping, reverse proxy, lifecycle hooks ใช้งานตามต้องการ
- monitor ผ่าน `pitchfork list`, `logs`, `tui`, Web UI หรือ MCP server ได้
