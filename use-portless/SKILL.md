---
name: use-portless
description: ใช้ portless แทน port numbers ด้วย named .localhost URLs สำหรับ dev servers
argument-hint: "[app-name-or-command]"
related:
  - run-load-test
  - check-my-global-cli
---

## Goal

ใช้ `portless` รัน dev servers ผ่าน HTTPS proxy ด้วย stable named URLs (`https://<name>.localhost`) แทน `localhost:<port>` — สำหรับ humans และ agents

## Scope

ใช้เมื่อ task ต้องรัน dev server, preview, หรือ wire services เข้าด้วยกันบนเครื่อง local — ครอบคลุม run, routes, aliases, subdomains, worktrees, custom TLD, LAN mode, troubleshooting — ไม่รวม production deploy

## Execute

### 1. Verify Install

> Goal: `portless` พร้อมใช้

1. `portless --version` ตรวจว่าติดตั้ง — ถ้าไม่มี → `mise use -g portless` หรือ `npm install -g portless` (ต้อง Node.js 24+)
2. ครั้งแรกรัน `portless trust` — เพิ่ม local CA เข้า system trust store (จำเป็นสำหรับ HTTPS)
3. `portless doctor` ตรวจ health: Node version, state dir, proxy, CA trust, hostname resolution

### 2. Run App

> Goal: รัน dev server ผ่าน named URL

```bash
portless                          # run "dev" script จาก package.json → https://<project>.localhost
portless --script start           # run script อื่นแทน "dev"
portless run --name myapp vite    # override ชื่อที่ infer
portless myapp vite dev           # explicit name + command
portless api.myapp pnpm start     # subdomain → https://api.myapp.localhost
```

- ชื่อ infer จาก `portless.json`, `package.json`, git root หรือ directory name
- monorepo root (workspaces/pnpm-workspace) → `portless` เปิดทุก package ที่มี script นั้น
- port สุ่ม 4000-4999 ส่งผ่าน `PORT` env; Vite/Astro/RR/Angular ได้ auto-inject `--port`/`--host`

### 3. Routes And Aliases

> Goal: จัดการ routes และ service URLs

```bash
portless list                          # active routes + ports
portless get <name>                    # print URL — e.g. BACKEND_URL=$(portless get backend)
portless alias <name> <port>           # route ไป service ที่ไม่ได้รันผ่าน portless (Docker ฯลฯ)
portless alias --remove <name>
portless <name> --force <cmd>          # override route ที่ชนกัน
```

### 4. Advanced Modes

> Goal: worktrees, custom TLD, LAN, sharing

- Git worktrees: `portless run` ใน linked worktree → branch prefix อัตโนมัติ `https://<branch>.<app>.localhost` — main worktree ใช้ชื่อเปล่า
- Custom TLD: `portless proxy start --tld test` → `https://myapp.test` (auto-sync `/etc/hosts`); repeat `--tld` ได้หลายตัว; ใช้ `.test` (IANA-reserved), หลีกเลี่ยง `.local` (mDNS ชน) และ `.dev` (HSTS)
- LAN mode: `portless proxy start --lan` → เข้าจากมือถือใน WiFi เดียวกันผ่าน `.local` mDNS (macOS/Linux เท่านั้น); Next.js ต้องเพิ่ม `allowedDevOrigins` เอง
- Share: `--tailscale`, `--funnel`, `--ngrok` flags บน run command

### 5. Proxy Control And Cleanup

> Goal: จัดการ proxy lifecycle

```bash
portless proxy start [-p 443] [--no-tls] [--foreground]
portless proxy stop
portless service install|status|uninstall   # OS startup service
portless prune [--force]                     # kill orphaned dev servers หลัง crash
portless clean                               # stop + ลบ CA + hosts entries + state
portless hosts sync|clean                    # manual /etc/hosts sync
PORTLESS=0 pnpm dev                          # bypass proxy
```

## Rules

### 1. Prefer Named URLs

- ใช้ `portless` แทนการจำ port เมื่อรัน dev servers ที่ต้องเปิดใน browser หรือ wire ระหว่าง services
- ใช้ `portless get <name>` ใน scripts/env vars แทน hardcode `localhost:<port>`

### 2. Framework Port Injection

- ถ้า framework ignore `PORT` (Vite, Astro, RR, Angular) portless inject `--port` เอง — แต่ compound commands (`&&`, `|`), env prefix, หรือ script delegation (`npm run dev:vite`) จะถูกข้าม → set port ใน script เอง
- ห้ามใส่ `--port`/`--host` ซ้ำใน command เมื่อ portless inject ให้อยู่แล้ว

### 3. State And Elevation

- ครั้งแรกต้อง `portless trust` — port 443 bind อาจขอ sudo/admin
- ถ้า hostname ไม่ resolve → `portless hosts sync`; ถ้า route ค้างหลัง crash → `portless prune`

### 4. Windows Notes

- LAN mode ไม่รองรับ Windows; `.localhost` resolve ได้ใน browsers สมัยใหม่โดยไม่ต้องแก้ hosts
- `service install` ใช้ Task Scheduler (SYSTEM) บน Windows
- ใช้ `/run-load-test` ถ้าจำเป็น
- ใช้ `/check-my-global-cli` ถ้าจำเป็น


## Expected Outcome

- Dev servers เข้าถึงผ่าน `https://<name>.localhost` แทน port numbers
- Multi-service wiring ใช้ `portless get` ได้โดยไม่ hardcode ports
- Worktrees/aliases/subdomains ทำงานโดยไม่ชนกัน
- ปัญหา trust/resolution/orphans แก้ด้วย `doctor`/`trust`/`hosts sync`/`prune`
