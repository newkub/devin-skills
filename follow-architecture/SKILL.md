---
name: follow-architecture
description: เลือกและ apply architecture pattern — clean สำหรับ multi-app unified, layered (flat) สำหรับ app เดียว
argument-hint: "[target-path | clean | layered]"
related:
  - refactor
  - deep-review
  - scan-codebase
  - ask-me
  - update-references
  - run-check
  - report-before-after

---

## Goal

Entry point เดียวสำหรับ architecture restructure — เลือก pattern ที่เหมาะกับ target: **Layered** (flat type-grouped — merged inline ที่นี่) สำหรับ app เดียว, **Clean** (`modules/{domain,features,ports,adapters}` — merged inline ที่นี่) สำหรับหลาย apps unified / `packages/*` / `crates/*`

## Scope

- ใช้เมื่อต้อง restructure codebase/package/app ตาม architecture pattern — ถูก dispatch จาก `/refactor` architecture scope และ callers อื่น
- Pattern detail ฉบับเต็ม (SSOT): `/deep-review` `## Pattern Guides` → `references/pattern-clean.md`, `references/pattern-layered.md`
- File structures (canonical): Clean → [templates/file-structure-clean.md](templates/file-structure-clean.md); Layered → [templates/file-structure-layered.md](templates/file-structure-layered.md)
- Stack-specific file structures (canonical per target type):

| Target | Template |
|--------|----------|
| Vite SPA (React/Vue/Solid client-only) | [templates/file-structure-web-vite-spa.md](templates/file-structure-web-vite-spa.md) |
| Vite frontend + backend repo เดียว | [templates/file-structure-web-vite-fullstack.md](templates/file-structure-web-vite-fullstack.md) |
| Nuxt | [templates/file-structure-web-nuxt.md](templates/file-structure-web-nuxt.md) |
| SvelteKit | [templates/file-structure-web-svelte.md](templates/file-structure-web-svelte.md) |
| Solid + TanStack Router/Query | [templates/file-structure-web-solid-tanstack.md](templates/file-structure-web-solid-tanstack.md) |
| TanStack Start (Nitro) + Bun | [templates/file-structure-web-solid-tanstack-nitro-bun.md](templates/file-structure-web-solid-tanstack-nitro-bun.md) |
| Next.js App Router | [templates/file-structure-web-nextjs.md](templates/file-structure-web-nextjs.md) |
| CLI tool | [templates/file-structure-cli.md](templates/file-structure-cli.md) |
| Plugin package | [templates/file-structure-plugins.md](templates/file-structure-plugins.md) |
| SDK/client library | [templates/file-structure-sdk.md](templates/file-structure-sdk.md) |
| Library package | [templates/file-structure-lib.md](templates/file-structure-lib.md) |

- ไม่ครอบ microservices — อ่าน `/deep-review` `### Pattern: Microservices Architecture` โดยตรง

## Execute

### 1. Detect Target

> Goal: รู้ว่า target คืออะไรและมีกี่ apps

1. ทำ `/scan-codebase` ที่ root — ระบุ `apps/*`, `packages/*`, `crates/*` และ target ที่ user ระบุ
2. นับจำนวน app entry points และตรวจว่ามี shared domain/modules ที่หลาย app ต้องใช้ร่วมกัน (unified support) หรือไม่
3. argument `clean`/`layered` → เลือก pattern นั้นโดยตรง ข้ามตารางเลือก

### 2. Select Pattern

> Goal: เลือก pattern เดียวที่เหมาะกับ target

| No. | Condition | Pattern | Where |
|-----|-----------|---------|-------|
| 1 | หลาย `apps/*` ต้อง unified support — แชร์ `modules/`/`core/`/`contracts/` ข้าม entry points | Clean | inline `### Pattern: Clean` ด้านล่าง |
| 2 | `packages/*`, `crates/*` (shared libs, domain packages) | Clean | inline `### Pattern: Clean` ด้านล่าง |
| 3 | app เดียว — `apps/*` ตัวเดียวหรือ single-app project | Layered | inline `### Pattern: Layered` ด้านล่าง |
| 4 | target อื่น — testability สูง/domain-heavy → Clean; UI-driven/CRUD → Layered | ตามลักษณะ code | ตามนั้น |

- ไม่ชัดเจน → ทำ `/ask-me` ก่อนเลือก
- ห้าม mix pattern ใน target เดียว — ทำทีละ target
- target ตรง stack ในตาราง `## Scope → Stack-specific` → ใช้ template ของ stack นั้นเป็น canonical file structure (layered variants — rules เดียวกับ pattern หลัก)

### Pattern: Layered (merged จาก `/follow-layered-arch`)

> Goal: app เดียวเป็น flat type-grouped structure — dependencies ชี้ลงทางเดียว ไม่ bypass

**Prepare**

1. ทำ `/scan-codebase` บน target — ระบุ routes/pages, business logic, data access
2. อ่าน `/deep-review` `references/pattern-layered.md` — canonical guide (variants, boundaries)
3. อ่าน [templates/file-structure-layered.md](templates/file-structure-layered.md) — canonical flat structure + layer table (มี Required column ระบุ folder ที่บังคับ/optional)
4. ระบุ public API และ route entry points ปัจจุบัน — ต้องรักษาไว้
5. วางแผน folder mapping: presentation → `app/`+`components/`+`hooks/`; domain → `usecases/`+`services/`+`features/`; data → `infra/`+`lib/`; shared leaves → `types/`+`constants/`+`utils/`+`config/`

**Restructure**

1. สร้าง flat type-grouped folders ตาม template — ห้าม nest ตาม capability; ตั้งชื่อไฟล์ prefix ตาม domain (`user-service.ts`)
2. ย้าย UI/routes → `app/`+`components/`+`hooks/`; use cases → `usecases/`; business rules → `services/`+`features/`; persistence/external calls → `infra/`+`lib/`; pure helpers → `utils/`/`types/`/`constants/` — ทำ `/refactor` ทีละ move
3. ถ้า concerns ปนกันในไฟล์เดียว (handler + logic + query) → ทำ `/refactor` `### /separate-of-concerns` (merged) แยก concern ก่อนจัด layer
4. Enforce dependencies: presentation → domain → data เท่านั้น; `app/` เรียก `usecases/`/`features/` เท่านั้น; public API ผ่าน `index` barrel
5. Align tests ตาม layers; ทำ `/update-references` + `/refactor` structure scope หลังย้ายแต่ละชุด

**Verify**

1. ตรวจไม่มี layer bypass (presentation เรียก `infra/`/`lib/` โดยตรง) และไม่มี deep imports ข้าม layer — รัน `madge` หา circular deps ถ้ามี
2. ทำ `/run-check` และ tests; ทำ `/report-before-after`

### Pattern: Clean (merged จาก `/follow-clean-arch`)

> Goal: target เป็น Clean Architecture — pure domain core, application orchestration, ports & adapters — dependency direction `core` ← `modules` ← `adapters`/`infra` ← `app`

**Prepare**

1. ทำ `/scan-codebase` บน target — ระบุ domain logic, side effects, external deps
2. อ่าน `/deep-review` `references/pattern-clean.md` — canonical guide (structure, rules, splitting thresholds)
3. อ่าน [templates/file-structure-clean.md](templates/file-structure-clean.md) — canonical file structure + layer table
4. ระบุ public API ปัจจุบัน (barrel `index`, exported symbols) — ต้องรักษาไว้
5. หา consumers ของ package — ทำ `/update-references` ไว้ในแผน

**Restructure**

1. สร้าง structure ตาม [templates/file-structure-clean.md](templates/file-structure-clean.md): `modules/<name>/{domain,usecases?,features,ports,adapters}` + `index.ts`, `core/` (primitives + `ports/`), `adapters/`, `infra/`, `contracts/`, `config/`, entry/composition ที่ `app/` — ทำ `/refactor` ทีละ move
2. ย้าย pure logic → `modules/*/domain/` + `core/`; application use cases ที่ `app/` เรียก → `modules/*/usecases/`; feature orchestration → `modules/*/features/`; interfaces → `ports/`; IO/framework → `infra/` + `adapters/`
3. ถ้า concerns ปนกันในไฟล์เดียว (logic + IO + config) → ทำ `/refactor` `### /separate-of-concerns` (merged) แยก concern ก่อนจัด layer
4. กำหนด ports (interfaces) ที่ `features/` ต้องการ — adapters/infra implement; wire ทั้งหมดที่ `app/runtime.ts` composition root
5. ทำ `/update-references` + `/refactor` structure scope หลังย้ายแต่ละชุด

**Verify**

1. ตรวจไม่มี import จาก `core/`/`modules/*/domain`/`features` ไป `infra/`/`adapters/` — รัน `madge` หา circular deps ถ้ามี
2. ทำ `/run-check` (lint/typecheck) และ test ของ package; ทำ `/report-before-after`

**Clean rules**

- `domain/` + `core/` ต้อง pure — ไม่มี IO, framework imports, side effects; ไม่มี `fx/` layer — side effects อยู่ `infra/` orchestrate ผ่าน `features/` (+ `usecases/` เมื่อมี) + ports; ทิศทาง `usecases → features → domain` ห้ามกลับ
- Public API ผ่าน `index` เท่านั้น — ห้าม deep imports ข้าม layer/module จากภายนอก; modules ข้ามกันผ่าน `contracts/` หรือ ports

### 3. Apply And Verify

> Goal: restructure สำเร็จและ boundaries ถูกต้อง

1. Layered → ทำตาม `### Pattern: Layered` ข้างบน; Clean → ทำตาม `### Pattern: Clean` ข้างบน
2. ถ้าพบ mixed concerns ระหว่างย้าย (logic + IO + config ในไฟล์เดียว) → ทำ `/refactor` `### /separate-of-concerns` (merged) แยก concern ก่อนจัด layer
3. หลังแต่ละ target → ทำ `/update-references` + `/run-check` ก่อน target ถัดไป
4. ทำ `/report-before-after` เมื่อครบทุก target

## Rules

- entry point เดียว — architecture restructure ทุกครั้งเลือก pattern ผ่าน skill นี้
- ห้าม duplicate pattern detail — canonical: Layered = `### Pattern: Layered` + `templates/file-structure-layered.md`; Clean = `### Pattern: Clean` + `templates/file-structure-clean.md` ที่นี่; pattern guides = `/deep-review` `references/pattern-*.md`
- รักษา behavior และ public API เดิมเสมอ — tests ต้องผ่านเหมือนก่อน restructure

## Expected Outcome

- Target ถูก restructure ด้วย pattern ที่เหมาะ — multi-app unified/`packages/`/`crates/` = Clean, app เดียว = Layered (flat type-grouped)
- ไม่มี circular dependencies; public API เดิมใช้ได้
- ผ่าน `/run-check` และ tests
