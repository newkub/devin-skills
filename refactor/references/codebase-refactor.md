# Codebase And SRP Refactor

Merged from: `deep-refactor-codebase` — deep refactor หนึ่ง workspace ด้วย baseline, impact analysis, incremental batches และ validation

## Goal

แก้ไข SRP, long files, consistency และ structure ทั้ง codebase หนึ่ง workspace อย่างเป็นระบบ ลด regression

## Steps

### 1. Baseline And Context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, tech stack, conventions
2. อ่าน `AGENTS.md` เพื่อทราบ rules ของ project
3. ทำ `/review-refactor` เพื่อสร้าง baseline metrics และระบุ refactor targets
4. บันทึก baseline: files, symbols, dependencies, test/lint/typecheck status

### 2. Deep Analysis

1. ทำ `/deep-analyze` สำหรับ architecture, quality, dependencies, security
2. ทำ `/check-code-structure` (cohesion, coupling) และ `/check-files long-files` (>250 บรรทัด)
3. ทำ `/review-quality` เพื่อหา code smells, duplication, dead code
4. รวม findings เป็น prioritized list ตาม severity และ impact

### 3. Impact Analysis

1. ทำ `/deep-impact` สำหรับ refactor target ที่สำคัญ
2. ระบุ consumers, call sites, public API ที่กระทบ
3. ประเมิน blast radius, risk, migration effort + rollback plan

### 4. Plan And Execute

1. ทำ `/plan` หรือ `/create-plan-in-dot-devin` สำหรับงานใหญ่ — จัดลำดับ high impact + low effort ก่อน
2. เลือก strategy ต่อ target: in-place, extract, relocate (`/relocation`), rename (`/rename`), split
3. ถ้า replacement ขนาดใหญ่ที่ทำ big-bang ไม่ได้ → ใช้ strangler fig / branch by abstraction: สร้าง abstraction layer → route callers ทีละกลุ่ม → parallel run เก่า/ใหม่ → cutover → ลบของเก่า
4. แก้ SRP violations และไฟล์ >250 บรรทัด — แยกตาม concern/domain
5. แก้ inconsistencies ใน naming, patterns, structure, style ตาม `/review-quality`
6. ทำทีละ batch พร้อม verify หลังแต่ละ batch และ commit checkpoint หลัง phase สำคัญ

### 5. Update References

1. ทำ `/update-references` สำหรับ relative paths/imports และ global refs (skills, AGENTS.md, rules)
2. ค้นหา references เก่าซ้ำยืนยันไม่เหลือ — ถ้า broken → `/resolve-errors`

### 6. Validate And Report

1. ทำ `/run-verify` + `/run-test-all` ถ้ามี test suites
2. ทำ `/deep-validate` ตรวจ references, structure, public API
3. ทำ `/check-code-structure` เทียบ baseline
4. ทำ `/report-before-after` สรุป metrics — target, action, status, risk
