# Structure Refactor

## Goal

ปรับปรุง physical file/folder structure ให้ทุกไฟล์และโฟลเดอร์มี single responsibility — naming, content separation, relocation, grouping (logical concern separation ทำใน file/codebase scopes)

## Steps

1. Analyze structure: `/deep-review` (SRP, SoC, type safety, hard code, anti-patterns, dead code, naming) + `/check-files long-files` (>250 บรรทัด) + `/review-code-quality` (folder file count) — ไม่พบปัญหา → stop + report
2. Improve naming: ชื่อไฟล์สะท้อน responsibility → `/update-references` ทุก rename
3. Split multi-responsibility files (>250 บรรทัด หรือหลาย responsibility) → file refactor ตาม `scope-file.md` → `/update-references`
4. Separate content by concern: ไฟล์ที่ผสม types + logic, constants + config, schema + validation หรือ markdown หลายเรื่อง → แยกเป็น `types.ts`, `constants.ts`, `config.ts`, `schema.ts` หรือไฟล์ตามชื่อ concern → `/update-references`
5. Relocate/group by domain — high-risk action:
   - เลือก pattern ตาม directory convention ก่อน relocate (target table ใน parent `### 5. Architecture Refactor`: `packages/`/`crates/` → clean, `apps/` → layered)
   - ทำ `/relocation` ย้ายไฟล์ตาม responsibility — dry run preview + user confirmation ก่อนย้ายจริง
   - `/review-architecture` จัดกลุ่มตาม domain → `/update-references` → `/update-agents-md` ถ้า layout ที่ AGENTS.md อธิบายเปลี่ยน
   - ถ้าย้ายไม่สำเร็จ → rollback + stop + report
6. Imports/exports: `/review-architecture` ปรับ barrel exports และแทน relative paths ซับซ้อนด้วย import aliases
7. Validate: build/typecheck → `/check-files long-files` → `/deep-validate` cross-references หลังย้าย — fail → กลับ step 3 re-validate สูงสุด 3 ครั้ง → stop + report

## Rules

- minimal changes; ไฟล์เกิน 10 ไฟล์ → `/use-scripts`; `/dont-over-engineer` เสมอ
- หนึ่งไฟล์ = หนึ่ง responsibility ≤250 บรรทัด, content ประเภทเดียว; หนึ่งโฟลเดอร์ = domain เดียว
- `/update-references` ทุกครั้งหลังย้าย/rename
- relocation → dry run + confirmation เสมอ; validation fail → rollback
- รักษา public API/behavior เดิม — structural change ไม่ใช่ feature change
