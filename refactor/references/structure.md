# Structure Refactor — Procedure

## Goal

ปรับปรุง physical file/folder structure ให้ทุกไฟล์และโฟลเดอร์มี single responsibility — naming, content separation, relocation, grouping (logical concern separation อยู่ใน file/codebase scopes ของ `/refactor`)

## Sub-Skills

| Skill | ใช้เมื่อ | Step |
|-------|---------|------|
| `/idea-naming` | ต้องได้ชื่อไฟล์/directory ตาม convention ของ project | 3 |
| `/follow-architecture` | ต้องรู้ layer/domain ปลายทาง + canonical file structure | 6 |
| `/update-references` | ทุกครั้งหลัง rename/split/ย้าย | 3, 4, 5, 7, 8 |

## Steps

1. Analyze structure: `/deep-review` (SRP, SoC, type safety, hard code, anti-patterns, dead code, naming) + `/check-long-files` (>250 บรรทัด) + `/check-code-structure` (file-level symbols/exports) — ไม่พบปัญหา → stop + report
2. Baseline เป็นตาราง No./File/Problem/Target/severity — เลือก target ที่ severity สูงสุดก่อน
3. Improve naming: ชื่อไฟล์สะท้อน responsibility → ทำ `/idea-naming` → rename → `/update-references` ทุก rename
4. Split multi-responsibility files (>250 บรรทัด หรือหลาย responsibility) → `/refactor-to-srp` → `/update-references`
5. Separate content by concern: ไฟล์ที่ผสม types + logic, constants + config, schema + validation หรือ markdown หลายเรื่อง → แยกเป็น `types.ts`, `constants.ts`, `config.ts`, `schema.ts` หรือไฟล์ตามชื่อ concern → `/update-references`
6. Align to architecture: ทำ `/follow-architecture` กับ target → ได้ layer table + canonical file structure (stack-specific template ถ้ามี) → map ไฟล์ปัจจุบัน → layer/domain ปลายทางเป็นตารางก่อนย้าย
7. Relocate/group by domain — high-risk action:
   - ทำ `/relocation` ย้ายไฟล์ตาม responsibility — dry run preview + user confirmation ก่อนย้ายจริง
   - `/deep-review` จัดกลุ่มตาม domain → `/update-references` → `/update-agents-md` ถ้า layout ที่ AGENTS.md อธิบายเปลี่ยน
   - ถ้าย้ายไม่สำเร็จ → rollback + stop + report
8. Imports/exports: ปรับ barrel exports และแทน relative paths ซับซ้อนด้วย import aliases — public API ผ่าน `index` เท่านั้น
9. Validate: build/typecheck (`/run-check`) → `/check-long-files` → `/deep-validate` cross-references หลังย้าย — fail → กลับ step 4 re-validate สูงสุด 3 ครั้ง → stop + report

## Rules

- minimal changes; ไฟล์เกิน 10 ไฟล์ → `/use-scripts`; `/dont-over-engineer` เสมอ
- หนึ่งไฟล์ = หนึ่ง responsibility ≤250 บรรทัด, content ประเภทเดียว; หนึ่งโฟลเดอร์ = domain เดียว
- `/update-references` ทุกครั้งหลังย้าย/rename
- relocation → dry run + confirmation เสมอ; validation fail → rollback
- รักษา public API/behavior เดิม — structural change ไม่ใช่ feature change
- canonical pattern detail อยู่ที่ `/deep-review` `## Pattern Guides` + templates ของ `/follow-architecture` — ห้าม copy มาที่นี่
