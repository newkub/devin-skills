---
name: idea-features
description: สร้าง 30 ไอเดียฟีเจอร์ (extends + net-new + platform) → web viewer (Solid + TanStack Table) ใน skill dir serve data จาก OS temp `idea-features-<id>/ideas.json` + ตอบในแชทเป็นตาราง grouped — merged idea-new-features + platform scope
argument-hint: "[topic]"
related:
  - follow-architecture
  - follow-solid-framework
  - follow-lib-tanstack-ecosystem
  - deep-analyze
  - learn-from-codebase
  - reframe
  - test-usage
  - ask-me
  - open-web
  - run-dev
  - implement-features-to-mvp
  - implement-to-production
  - improve-features
  - create-plan-in-dot-devin
  - bench-competitors
---

## Goal

สร้าง 30 ไอเดียฟีเจอร์สำหรับ project/topic — ครอบคลุม 3 กลุ่ม: `extends` (ขยาย feature เดิม), `new` (net-new capabilities — merged จาก `/idea-new-features`), และ `platform` (cross-cutting capabilities: auth, security, performance, stability, optimize, release, observability — merged จาก platform group ของ `/improve-features`) — เขียน data ลง OS temp `idea-features-<id>/ideas.json` → serve web viewer (อยู่ใน skill dir นี้ — SolidJS + TanStack Table: list table พร้อม search/filter/grouping/sorting และ detail: description/why/benefit) → ตอบในแชทเป็นตาราง grouped ตาม routes/commands/features พร้อมสรุป phase ที่แนะนำ

## Scope

- **Viewer source อยู่ใน skill dir นี้** (`src/`, `vite.config.ts`, `package.json`) — scaffold ครั้งเดียว run ถัดไปแก้เฉพาะ data
- **Data เขียนลง OS temp เท่านั้น**: `$env:TEMP/idea-features-<id>/ideas.json` (Windows) / `${TMPDIR:-/tmp}/idea-features-<id>/ideas.json` (Unix) — `<id>` = project slug เช่น `wrikka-platform`; shape = `{ project, topic, generatedAt, ideas: [...30] }`
- Idea kinds: `extends` + `new` (net-new user flow/module/integration/surface) + `platform` (infrastructure/cross-cutting) — ใช้ `kind` field แยก; idea ที่เป็น gap-fix ของ implementation เดิมและเน้น review findings → `/improve-features`
- ไม่ implement ไอเดีย — idea ที่ confirm ส่งต่อ `/create-plan-in-dot-devin` เสมอ แล้วจึง `/implement-features-to-mvp` (MVP scope) หรือ `/implement-to-production` (full)

## Execute

### 1. Understand Context

> Goal: เข้าใจ topic และ project

1. รับ `<topic>` จาก argument หรือ conversation context — ไม่ชัด → `/suggest-next-action` หรือ `/enhance-prompt`
2. ทำ `/learn-from-codebase` แบบ lightweight เพื่อ ground ไอเดียกับ codebase จริง — ดู routes, commands, features หลักของ target project
3. อ่าน manifest + structure เพื่อรู้ architecture pattern (`/follow-architecture`) — ใช้กับ file changes ของทุก idea
4. **Topic selection** — เสนอ 8-12 topic clusters (เช่น reporting, ux, data, mobile, privacy, workflow) แล้วทำ `/ask-me` multi-select ให้ user เลือกว่าจะ generate topics ไหน — default: ทั้งหมด; ideas 30 รายการกระจายตาม topics ที่เลือก

### 2. Generate 30 Ideas

> Goal: 30 ไอเดียครบทุก field

สร้างไอเดีย **30 รายการเสมอ** (`extends` + `new` + `platform` ผสมตาม topic clusters ที่เลือก) — ทุก idea ต้องครบ fields:

0. Kind semantics — `new` ต้องเป็น net-new capability (new user flow, module, integration, surface) ห้ามปน extends/gap-fill ของของเดิม; `platform` = cross-cutting capability (auth, security, performance, stability, optimize, release, observability); ถ้าพบ idea ที่แค่อุด gap ของ implementation เดิมให้ tag `extends` หรือส่งต่อ `/improve-features`; ถ้าต้องการ market evidence สำหรับ net-new → `/bench-competitors`
1. `no` (1-30), `title`, `kind` (`extends|new|platform`), `group` (route/command/feature surface ของ target project), `category`, `tags[]`, `phase` (`mvp|v2|v3`), `impact` (`high|medium|low`), `effort` (`s|m|l|xl`), `mvp` (1-10)
2. `features[]` — bullet features สั้นๆ 3-5 ข้อ
3. `description`, `why`, `benefit`, `usage`, `risk` — ภาษาเดียวกับ user (why = pain/motivation, benefit = outcome ที่ได้)
4. `fileChanges`/`files` — ระบุไฟล์จริงที่จะสร้าง/แก้ ตาม architecture pattern ของ target project จาก `/follow-architecture`
5. `routes`, `comps`, `store`, `schema`, `types`, `fns`, `deps`, `pkgs`, `cfg`, `tests` — artifacts ที่ idea จะเพิ่ม/แก้ ตามจริงของ codebase

### 3. Write Data + Serve Viewer

> Goal: user browse ไอเดียใน browser ด้วย list table

1. เขียน `ideas.json` ลง OS temp `idea-features-<id>/ideas.json` — `{ project, topic, generatedAt, ideas }` ครบ 30 ideas ทุก field; ถ้า temp drive เต็ม/เขียนไม่ได้ → fallback `<drive>:/temp/idea-features-<id>` + แจ้ง user (redirect package-manager cache ด้วยถ้าจำเป็น เช่น `BUN_INSTALL_CACHE_DIR`)
2. Viewer ใน skill dir นี้ (มีอยู่แล้ว): SolidJS + Vite + `@tanstack/solid-table` ตาม `/follow-solid-framework` + `/follow-lib-tanstack-ecosystem`; `vite.config.ts` มี plugin serve `/ideas.json` — อ่าน `IDEA_DATA` env ก่อน, fallback = `ideas.json` ล่าสุดใน `tmpdir()/idea-features-*`
3. UI: list/table — **default grouping = `group`** (surface: routes/commands/main-api — expand ทุก group ตอนโหลด), **search** (global filter: title/desc/tags), **filter row ใน thead** (per-column: select สำหรับ kind/phase/impact/effort/group — group options จาก unique values ของ data, text input สำหรับ title/tags), **grouping select** ใน toolbar (none/group/kind/phase/impact/effort → `getGroupedRowModel` + expand), **sorting** (คลิก header label row → asc/desc), row click → **detail panel** (description, why, benefit, usage, risk, features, artifacts ครบ, tests, files) — dark theme
4. Run: `bun install` ใน skill dir (ครั้งแรกเท่านั้น — ถ้า drive ของ skill เต็มให้ junction `node_modules` ไป drive ที่ว่าง) → `IDEA_DATA=<path/to/ideas.json> bun run dev` port 3030 (ชนให้เลือก port ถัดไป) ตาม `/run-dev` ถ้ามี error → `/open-web http://localhost:<port>`
5. Verify `/ideas.json` คืน 30 items และ viewer render ครบก่อนสรุป — ทำ `/test-usage` เพื่อยืนยัน usage flow ทำงานจริง (`bun install`, `IDEA_DATA=<path> bun run dev`, endpoint `/ideas.json`) ก่อน report link ให้ user

### 4. Answer In Chat

> Goal: user เห็นไอเดียครบจัดกลุ่มอ่านง่ายในแชท

1. **Group ideas** ตาม routes/commands/features หลักของ target project (เช่น `apps/desktop` routes, `tools/wrikka` commands, `packages/shared` features, domain apps, platform/cross-cutting) — แต่ละ group มีหัวข้อ + ตารางของตัวเอง
2. **Table columns** (ครบทุก col ต่อ group):
   `No. | Title | Kind | Phase | Impact | Effort | MVP | Routes/Cmd | Comps | Store | Schema | Types | Fns/API | Deps | Pkgs | Cfg | Tests | Files | Risk`
   - `Routes/Cmd` — app routes, `wrikka://` deep links, CLI commands, `/api` endpoints ที่เพิ่ม/แก้
   - `Comps` — UI components ที่สร้าง/แก้ (`-` ถ้าไม่มี)
   - `Store` — TanStack store / state module ที่เพิ่ม/แก้
   - `Schema` — zod schema / db table / config schema ที่เพิ่มหรือแก้ (`-` ถ้าไม่มี)
   - `Types` — TS types/interfaces หลักที่เพิ่ม
   - `Fns/API` — functions, orpc procedures, Tauri/Rust commands, modules หลักที่เพิ่มหรือแก้
   - `Deps` — external npm dependencies ที่ต้องเพิ่ม (`-` ถ้าไม่มี)
   - `Pkgs` — internal workspace packages ที่ใช้/แก้ (`@wrikka/*`)
   - `Cfg` — config/env files ที่แตะ (wrangler.toml, moon.yml, vite.config, package.json, env vars; `-` ถ้าไม่มี)
   - `Tests` — test cases ที่วัดได้ (ย่อ)
   - `Files` — file paths จริงที่จะ create/edit/delete (ย่อ, ตาม architecture จริง)
   - `Risk` — risk หลักของ idea (สั้น)
3. **Phase recommendation** — สรุปท้ายคำตอบ: แนะนำทำ phase ไหนก่อน (mvp/v2/v3) พร้อมเหตุผล + รายการ no. ที่อยู่ใน phase นั้น + link ไป viewer ที่รันอยู่

## Rules

- 30 ไอเดียเสมอ — ห้ามน้อยกว่า; ทุก field ต้องมีค่าจริง ห้าม placeholder
- `kind` ต้องตรง semantics — `new` = net-new เท่านั้น, `platform` = cross-cutting เท่านั้น, `extends` = ขยายของเดิม
- `files`/`fileChanges` ต้องสอดคล้อง architecture จริงของ target project — ห้ามเดา path
- Grouping ต้องอิง surface จริงของ target project (routes/commands/features ที่มีอยู่หรือสอดคล้อง pattern) — ห้าม group มั่ว
- **Data → OS temp เท่านั้น** (`idea-features-<id>/ideas.json`) — ห้ามเขียน data ลง skill dir หรือ target repo เว้น user สั่ง; viewer source ใน skill dir แก้ได้เฉพาะตอน user สั่ง
- ใช้ /reframe ถ้าจำเป็น

## Expected Outcome

- `idea-features-<id>/ideas.json` ใน OS temp มี 30 ไอเดียครบ field
- Web viewer ใน skill dir serve data นั้นอยู่ — list table พร้อม search/filter/grouping/sorting + detail panel ครบ description/why/benefit
- คำตอบในแชทมี 30 ไอเดีย grouped by routes/commands/features หลัก พร้อมตารางครบทุก column + phase recommendation
