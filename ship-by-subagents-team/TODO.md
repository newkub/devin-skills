# ship-by-subagents-team — TODO

> สร้าง skill สำหรับ agentic orchestration แบบทีม subagents พร้อม dashboard ClickUp-style แทน Linear MCP
> สถานะ: วางแผน / ยังไม่เริ่ม implement

## ข้อมูลที่ตกลงแล้วจาก ask-me

- ชื่อ skill: `ship-by-subagents-team`
- ตำแหน่ง: `C:\Users\Veerapong\AppData\Roaming\devin\skills\ship-by-subagents-team\`
- Manager: AI หลักทำหน้าที่ manager ได้ทั้ง 2 แบบ (ตาม context)
  - งานเล็ก: AI หลักเป็น manager เอง
  - งานใหญ่: spawn manager subagent แล้วให้ manager สั่ง spawn ลูกทีม
- ลำดับ spawn subagents: ตาม dependency chain (ไม่ parallel ทั้งหมด)
  - phase 1: update-project → analyze/research
  - phase 2: design/plan
  - phase 3: implement
  - phase 4: review/security/error-resolve
- Progress reporting: subagent เขียน progress ลง SQLite dashboard โดยตรง
- Error handling: subagent ล้มเหลว/เจอ blocker → รอ manager ตัดสินใจ แล้วค่อย spawn resolve-error
- Dashboard views: Board + List (ClickUp-like)
- Real-time updates: Server-Sent Events (SSE)
- Backend API: Bun + Elysia
- Database: SQLite แชร์ใน skill directory (`data/tasks.db`) โดยใช้ `bun:sqlite`
- Frontend: SolidJS + TanStack Router + UnoCSS
- Web app runtime: สร้างใหม่ทุกครั้งจาก `app-template/` ไปยัง `.run/<session>/`
  - DB อยู่ที่ `data/tasks.db` นอก `.run/` เพื่อ persist ข้าม session
- Token counter: Rust + tiktoken-rs CLI รองรับ `--model` flag
- CSS: UnoCSS
- Auto-open: dashboard เปิด browser อัตโนมัติเมื่อ skill รัน
- Subagent spawning: SKILL.md สั่งให้ AI หลัก spawn ด้วย `run_subagent`

## การออกแบบที่ตั้งใจ (ให้ตรวจสอบ/ปรับได้)

- Percent: hybrid — subagent self-report เป็นหลัก manager ปรับได้
- เวลาที่ใช้ไป: wall-clock ตั้งแต่ spawn จนถึง done + ให้ subagent แจ้งเพิ่มได้
- Blocker: structured fields
  - `blocker_agent`, `blocker_task`, `reason`, `status`, `resolved_at`
- Sub-tasks: รองรับ parent/child แบบ optional
- Token counter: CLI รับ stdin/file/JSON และ `--model` เช่น `cl100k_base`, `o200k_base`

## Phase 0: Research & Context

- [ ] อ่าน `ship-by-agents/SKILL.md` ที่มีอยู่
- [ ] อ่าน `follow-solid-tanstack/SKILL.md`
- [ ] อ่าน `follow-framework-solidjs/SKILL.md`
- [ ] อ่าน `follow-lib-unocss/SKILL.md`
- [ ] อ่าน `update-agents-md/SKILL.md`
- [ ] อ่าน `consider-use-subagents/SKILL.md`
- [ ] อ่าน `follow-loop-engineering/SKILL.md`
- [ ] อ่าน `update-devin-global-subagents/SKILL.md`
- [ ] อ่าน `update-devin-global-skills/SKILL.md` หรือ template ที่เกี่ยวข้อง
- [ ] อ่าน `prepare-skills-context/SKILL.md` เพื่อยืนยันรูปแบบ skill
- [ ] ตรวจสอบ `global_rules.md` ว่า skill ใหม่นี้ impact workflow ใดบ้าง

## Phase 1: Skill Structure

- [ ] สร้างโครงสร้างโฟลเดอร์หลัก
  - `SKILL.md`
  - `app-template/`
  - `tools/token-counter/`
  - `scripts/`
  - `data/` (สำหรับ SQLite ร่วม)
  - `.gitignore` (ignore `.run/`, `node_modules/`, `target/`, `*.db` ใน runtime)
- [ ] เขียน `SKILL.md` ฉบับเต็ม
  - Goal / Scope / Execute / Rules / Expected Outcome
  - ระบุบทบาท subagents ทั้งหมด (analyzer, web-researcher, coder, writer, uxui-designer, fullstack-web, database, api, devin-context, security, resolve-error, manager-reviewers N)
  - ระบุ workflow: update-project → manager → spawn → review → manager-reviewers → implement → resolve-error
  - ระบุ task board columns และกฎการ update
  - ระบุการ spawn subagent ด้วย `run_subagent` พร้อม profile/role
  - ระบุการเปิด dashboard และ token counter

## Phase 2: Rust Token Counter CLI

- [ ] สร้าง `tools/token-counter/Cargo.toml`
- [ ] เขียน `tools/token-counter/src/main.rs`
  - รับ input จาก stdin, file, หรือ JSON
  - รองรับ `--model` flag (default `cl100k_base`)
  - ใช้ `tiktoken-rs` หรือ `rustc-tokenizers` ที่เหมาะสม
  - output เป็น JSON เช่น `{"tokens": 123, "model": "cl100k_base"}`
- [ ] สร้าง build script สำหรับ skill (`cargo build --release`)
- [ ] ทดสอบ CLI กับ sample text

## Phase 3: Web App Template (SolidJS + TanStack + Elysia + UnoCSS)

- [ ] สร้าง `app-template/package.json`
  - dependencies: `solid-js`, `@tanstack/solid-router`, `@tanstack/solid-table`, `elysia`, `bun:sqlite`, `unocss`
  - devDependencies: `vite`, `typescript`, `@unocss/vite`
- [ ] สร้าง `app-template/vite.config.ts`
- [ ] สร้าง `app-template/tsconfig.json`
- [ ] สร้าง `app-template/uno.config.ts`
- [ ] สร้าง `app-template/src/server.ts` (Elysia backend)
  - endpoints: `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id`, `DELETE /api/tasks/:id`
  - endpoint `GET /api/sse` สำหรับ Server-Sent Events
  - serve static frontend ด้วย Elysia
- [ ] สร้าง `app-template/src/db/schema.ts`
  - tables: `tasks`, `subtasks`, `agents`, `runs`, `events`
- [ ] สร้าง `app-template/src/db/client.ts`
  - เปิด `bun:sqlite` ที่ `DATABASE_URL` จาก env (default `../data/tasks.db`)
  - migrate schema ถ้ายังไม่มี
- [ ] สร้าง `app-template/src/app.tsx`
- [ ] สร้าง `app-template/src/index.tsx` (client entry)
- [ ] สร้าง `app-template/src/routes/index.tsx` (dashboard route)
- [ ] สร้าง components
  - `TaskBoard.tsx` — Kanban/ClickUp board view
  - `TaskTable.tsx` — list view ด้วย TanStack Table
  - `TaskCard.tsx`
  - `StatusBadge.tsx`
  - `ViewSwitcher.tsx` — สลับ board/list
  - `BlockerForm.tsx` — กรอก blocker แบบ structured
  - `AgentAvatar.tsx` / assignee display
- [ ] สร้าง `app-template/src/lib/sse.ts` (Solid resource สำหรับ SSE)
- [ ] สร้าง `app-template/src/lib/api.ts` (fetch helpers)
- [ ] สร้าง `app-template/index.html`
- [ ] สร้าง `app-template/src/styles/global.css` และ UnoCSS safelist

## Phase 4: Dashboard Features

- [ ] Board view: columns ตาม status (todo, in-progress, review, blocked, done)
- [ ] List view: ตาราง TanStack Table พร้อม sort/filter
- [ ] SSE: อัปเดต UI ทันทีเมื่อ task เปลี่ยน
- [ ] Task form: create/edit task พร้อม fields ทั้งหมด
  - name, assignee, status, percent, time_spent, token_count, blocker fields, parent_id
- [ ] Sub-tasks UI: แสดง/ซ่อน children
- [ ] Search/filter tasks ตาม agent, status, blocker
- [ ] Dark mode / theme ด้วย UnoCSS (optional)

## Phase 5: Skill Integration Scripts

- [ ] สร้าง `scripts/init-dashboard.ts`
  - สร้าง `.run/<session>/` จาก `app-template/`
  - ตั้งค่า `DATABASE_URL` ชี้ไป `data/tasks.db`
  - รัน `bun install` ใน runtime dir
  - รัน `bun run dev` หรือ `bun run start` + auto-open browser
- [ ] สร้าง `scripts/update-task.ts`
  - CLI อัปเดต task ผ่าน Elysia API
  - รับ input JSON หรือ CLI args
- [ ] สร้าง `scripts/count-tokens.ts` (ห่อเรียก Rust CLI)
  - รัน `tools/token-counter/target/release/token-counter`
  - ส่งคืนผลลัพธ์ให้ subagent หรือ manager
- [ ] สร้าง `scripts/spawn-subagent.ts` (optional wrapper)
  - เอกสาร/ตัวอย่างการเรียก `run_subagent` ตาม role
  - บันทึก agent run ลง DB

## Phase 6: Data Model & API

- [ ] กำหนด schema SQLite ฉบับสมบูรณ์
  - `runs(id, name, started_at, ended_at, status)`
  - `agents(id, run_id, role, name, status, started_at, ended_at)`
  - `tasks(id, run_id, parent_id, agent_id, name, status, percent, time_spent, token_count, blocker_json, created_at, updated_at)`
  - `events(id, run_id, task_id, event_type, payload, created_at)`
- [ ] API endpoints ครบ CRUD + SSE
- [ ] Seed data สำหรับทดสอบ

## Phase 7: Workflow Logic in SKILL.md

- [ ] ระบุ protocol สำหรับ `update-project` agent (คำสั่ง/expected output/วิธีอัปเดต AGENTS.md)
- [ ] ระบุ protocol สำหรับ manager (วิธี spawn subagents, track progress, สลับ views)
- [ ] ระบุ protocol สำหรับ initial review รอบแรก
- [ ] ระบุ protocol สำหรับ N manager-reviewers (เลือกจำนวนตาม context)
- [ ] ระบุ protocol สำหรับ coder implement
- [ ] ระบุ protocol สำหรับ resolve-error (trigger condition, ขั้นตอนการแก้)
- [ ] ระบุวิธีคำนวณ/อัปเดต token count ให้ task board
- [ ] ระบุวิธี auto-open dashboard

## Phase 8: Validation & Testing

- [ ] รัน `run-check` / lint / typecheck ใน web app
- [ ] ทดสอบ Rust token counter CLI
- [ ] ทดสอบ Elysia API ด้วย `curl` หรือ test script
- [ ] ทดสอบ SSE real-time update
- [ ] ทดสอบ dashboard ใน browser
- [ ] ตรวจสอบไม่ซ้ำซ้อนกับ `ship-by-agents`
- [ ] ตรวจสอบ broken skill references ถ้ามี
- [ ] ตรวจสอบ `.gitignore` ครบถ้วน

## Phase 9: Documentation & Ship

- [ ] เขียน `README.md` หรือ `USAGE.md` ใน skill directory (ถ้าจำเป็น)
- [ ] อัปเดต `AGENTS.md` ของ skills repo (ถ้ามีผลต่อ global workflow)
- [ ] ตรวจสอบ `global_rules.md` อีกครั้ง
- [ ] `git add` ไฟล์ที่ต้อง commit
- [ ] Commit ด้วย conventional commit
- [ ] (optional) Push ไป remote ถ้าผู้ใช้ต้องการ

## Notes / คำถามค้างจาก ask-me ชุด 2

- ได้ตอบ 4 ข้อแรกแล้ว (manager/spawn/progress/error) แต่ ask-me ชุดที่ 2 (board columns, percent, time, blocker, sub-tasks) ถูก interrupt
- อาจต้องกลับไปถามให้ครบหรือใช้ default ด้านบน

## Next Action

1. รอผู้ใช้ confirm TODO / ตอบคำถามค้าง
2. เริ่ม Phase 0 โดยอ่าน related skills
3. สร้างโครงสร้างไฟล์ Phase 1
