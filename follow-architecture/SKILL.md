---
name: follow-architecture
description: เลือกและ apply architecture pattern — clean สำหรับ multi-app unified, layered (flat) สำหรับ app เดียว
argument-hint: "[target-path | clean | layered]"
related:
  - follow-clean-arch
  - separate-of-concerns
  - refactor
  - deep-review
  - scan-codebase
  - ask-me
  - update-references
  - run-check
  - report-before-after

---

## Goal

Entry point เดียวสำหรับ architecture restructure — เลือก pattern ที่เหมาะกับ target: **Layered** (flat type-grouped — merged inline ที่นี่) สำหรับ app เดียว, **Clean** (dispatch → `/follow-clean-arch`) สำหรับหลาย apps unified / `packages/*` / `crates/*`

## Scope

- ใช้เมื่อต้อง restructure codebase/package/app ตาม architecture pattern — ถูก dispatch จาก `/refactor` architecture scope และ callers อื่น
- Pattern detail ฉบับเต็ม (SSOT): `/deep-review` `## Pattern Guides` → `references/pattern-clean.md`, `references/pattern-layered.md`
- File structures (canonical): Clean → `follow-clean-arch/templates/file-structure.md`; Layered → [templates/file-structure-layered.md](templates/file-structure-layered.md)
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
| 1 | หลาย `apps/*` ต้อง unified support — แชร์ `modules/`/`core/`/`contracts/` ข้าม entry points | Clean | `/follow-clean-arch` |
| 2 | `packages/*`, `crates/*` (shared libs, domain packages) | Clean | `/follow-clean-arch` |
| 3 | app เดียว — `apps/*` ตัวเดียวหรือ single-app project | Layered | inline `### Pattern: Layered` ด้านล่าง |
| 4 | target อื่น — testability สูง/domain-heavy → Clean; UI-driven/CRUD → Layered | ตามลักษณะ code | ตามนั้น |

- ไม่ชัดเจน → ทำ `/ask-me` ก่อนเลือก
- ห้าม mix pattern ใน target เดียว — ทำทีละ target

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
3. ถ้า concerns ปนกันในไฟล์เดียว (handler + logic + query) → ทำ `/separate-of-concerns` แยก concern ก่อนจัด layer
4. Enforce dependencies: presentation → domain → data เท่านั้น; `app/` เรียก `usecases/`/`features/` เท่านั้น; public API ผ่าน `index` barrel
5. Align tests ตาม layers; ทำ `/update-references` + `/refactor` structure scope หลังย้ายแต่ละชุด

**Verify**

1. ตรวจไม่มี layer bypass (presentation เรียก `infra/`/`lib/` โดยตรง) และไม่มี deep imports ข้าม layer — รัน `madge` หา circular deps ถ้ามี
2. ทำ `/run-check` และ tests; ทำ `/report-before-after`

### 3. Apply And Verify

> Goal: restructure สำเร็จและ boundaries ถูกต้อง

1. Layered → ทำตาม `### Pattern: Layered` ข้างบน; Clean → dispatch `/follow-clean-arch`
2. ถ้าพบ mixed concerns ระหว่างย้าย (logic + IO + config ในไฟล์เดียว) → ทำ `/separate-of-concerns` แยก concern ก่อนจัด layer
3. หลังแต่ละ target → ทำ `/update-references` + `/run-check` ก่อน target ถัดไป
4. ทำ `/report-before-after` เมื่อครบทุก target

## Rules

- entry point เดียว — architecture restructure ทุกครั้งเลือก pattern ผ่าน skill นี้
- ห้าม duplicate pattern detail — canonical: Layered = `### Pattern: Layered` + `templates/file-structure-layered.md` ที่นี่; Clean = `/follow-clean-arch`; pattern guides = `/deep-review` `references/pattern-*.md`
- รักษา behavior และ public API เดิมเสมอ — tests ต้องผ่านเหมือนก่อน restructure

## Expected Outcome

- Target ถูก restructure ด้วย pattern ที่เหมาะ — multi-app unified/`packages/`/`crates/` = Clean, app เดียว = Layered (flat type-grouped)
- ไม่มี circular dependencies; public API เดิมใช้ได้
- ผ่าน `/run-check` และ tests
