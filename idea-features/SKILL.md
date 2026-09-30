---
name: idea-features
description: สร้าง 30 ไอเดียฟีเจอร์แล้วแสดงใน web viewer (Solid + TanStack Start + Nitro bun) ที่ src/ ของ skill นี้
argument-hint: "[topic]"
related:
  - follow-create-solid-tanstack-nitro-bun
  - follow-architecture
  - draw-ansi
  - deep-analyze
  - learn-from-codebase
  - enhance-prompt
  - think-reframe
  - open-web
  - run-dev
  - ship-verify
  - implement-features-to-mvp
---

## Goal

สร้าง 30 ไอเดียฟีเจอร์ (`extends` + `new`) สำหรับ project/topic แล้วเขียนลง `src/data/ideas.json` ของ viewer app ใน skill นี้ จากนั้น serve web ให้ user ดู — grid 4 col + preview panel + search/filter/grouping/tags/category

## Scope

- Web viewer อยู่ใน directory ของ skill นี้ (`src/`) — TanStack Start (SolidJS) + Nitro `preset: bun` ตาม `/follow-create-solid-tanstack-nitro-bun`
- Agent generate ไอเดีย → เขียน `src/data/ideas.json` → run web → user browse ใน browser
- ไม่ implement ไอเดีย — implement → `/implement-features-to-mvp`; plan → `/deep-plan`

## Execute

### 1. Understand Context

> Goal: เข้าใจ topic และ project

1. รับ `<topic>` จาก argument หรือ conversation context — ไม่ชัด → `/suggest-next-action` หรือ `/enhance-prompt`
2. ทำ `/learn-from-codebase` แบบ lightweight เพื่อ ground ไอเดียกับ codebase จริง
3. อ่าน manifest + structure เพื่อรู้ architecture pattern (`/follow-architecture`) — ใช้กับ `fileChanges` ของทุก idea

### 2. Generate 30 Ideas

> Goal: 30 ไอเดียครบทุก field ตาม schema

สร้างไอเดีย **30 รายการเสมอ** (`extends` + `new` ผสม) — ทุก idea ต้องครบ fields ของ `src/types/idea.ts`:

1. `no` (1-30), `title`, `kind` (`extends|new`), `category`, `tags[]`, `phase` (`mvp|v2|v3`), `impact` (`high|medium|low`), `effort` (`s|m|l|xl`), `mvpScore` (1-10)
2. `features[]` — bullet features สั้นๆ 3-5 ข้อ
3. `description`, `why`, `usage`, `risk` — ภาษาเดียวกับ user
4. `ansi` — UX/UI sketch ด้วย box-drawing ตาม `/draw-ansi` (กล่องเท่ากัน ไม่เพี้ยน)
5. `fileChanges[]` — `{ path, action: create|edit|delete|move, note }` — ระบุไฟล์จริงที่จะสร้าง/แก้ ตาม architecture pattern ของ target project จาก `/follow-architecture`
6. `testCases[]` — test cases ที่วัดได้

### 3. Write Data

> Goal: ideas.json valid ตาม zod schema

1. เขียนผลลง `src/data/ideas.json` ใน skill directory นี้ — `{ project, topic, generatedAt, ideas: [...30] }`
2. validate กับ `ideaSchema`/`ideasFileSchema` — ห้ามมี missing field หรือ placeholder
3. sort `ideas` ไม่จำเป็น — UI sort ตาม impact เอง

### 4. Serve Web

> Goal: user เห็น viewer ใน browser

1. `bun install` ใน skill directory (ครั้งแรกเท่านั้น)
2. `bun run dev` → dev server port `3030` — ทำตาม `/run-dev` ถ้ามี error
3. เปิด browser ด้วย `/open-web` → `http://localhost:3030`
4. Production mode: `bun run build` → `bun .output/server/index.mjs` (Nitro bun preset)
5. บอก user: ซ้าย = grid 4 col (card: no, ansi, features, description), hover card → preview เต็มด้านขวา (description, why, usage, risk, impact, file changes, test cases), บน = search/filter/grouping/tags/category

### 5. Ship Verify

> Goal: งานผ่าน verification gate

1. ทำ `/ship-verify` — เฉพาะ gates ที่ apply (skills repo ไม่มี test suite → ข้าม `/run-test-all` พร้อมเหตุผล)
2. สรุปผลในแชท

## Rules

- 30 ไอเดียเสมอ — ห้ามน้อยกว่า; ทุก field ของ schema ต้องมีค่าจริง ห้าม placeholder
- `ansi` ต้องเป็น box-drawing ที่ align ถูกต้อง (ทำ `/draw-ansi` ถ้าเพี้ยน)
- `fileChanges` ต้องสอดคล้อง architecture จริงของ target project — ห้ามเดา path
- ห้ามแก้ source code ของ viewer (`src/`) นอกจาก `src/data/ideas.json` เว้น user สั่ง
- ห้าม commit/push ใน skill นี้ — ship ทำผ่าน `/ship-to-dev-branch`
- ใช้ /think-reframe ถ้าจำเป็น

## Expected Outcome

- `src/data/ideas.json` มี 30 ไอเดียครบ schema
- Web viewer รันและเปิดใน browser — user เห็น grid + preview + filters ครบ
- ผ่าน `/ship-verify` gates ที่ apply
