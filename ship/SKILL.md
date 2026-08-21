---
name: ship
description: Ship ครบวงจร ตั้งแต่ planning, review, verify, release โดยมี user confirm
  ก่อน release
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

Ship ครบวงจร ตั้งแต่ planning, review, improve, commit, verify, deep review และ release ไปยัง external platforms โดยมี user confirm ก่อน release เสมอ

## Scope

ครอบคลุมการวางแผน ตั้งค่าพื้นฐาน review ปรับปรุง codebase commit verify deep review และ release ไม่รวม deploy หรือ CI/CD setup (ใช้ `/follow-deploy`)

## Execute

### 1. Prepare

เตรียมความพร้อมก่อนเริ่ม ship

> Goal: ตรวจสอบ prerequisites และวางแผนงานก่อน ship

1. ทำ `/read-related-skills` และ `/follow-skills` เพื่ออ่าน workflows ที่เกี่ยวข้อง
2. ตรวจสอบ `bun install` ผ่าน
3. ถ้า requirement ไม่ชัดเจน ให้ทำ `/ask-requirement`
4. ทำ `/deep-plan` เพื่อวางแผนงาน (ถ้าเสี่ยงสูงให้รอยืนยัน user)
5. ทำ `/update-project` เพื่ออัพเดท `.devin`, `README`, `AGENTS.md`
6. ถ้าเป็น monorepo ให้ทำ `/follow-monorepo` และ `/all-workspaces` เพื่อประมวลผลทุก workspace ตามลำดับ foundation ก่อน
7. ทำ `/follow-tasks` เพื่อตั้งค่า scripts ใน `package.json` หรือ `Cargo.toml` ตามมาตรฐาน
8. ถ้า project ต้องการ deployment ให้ทำ `/follow-deploy` เพื่อตั้งค่า CI/CD

### 2. Review And Fix

ทำ comprehensive review และแก้ไข issues ครบทุกมิติ

> Goal: Review ครบทุกมิติและแก้ไข issues ตาม severity จนครบ

1. ทำ `/review-codebase` เพื่อ review ครบทุกมิติ แก้ไข issues ตาม severity จนครบ
2. ถ้าพบ issues ให้ทำ `/resolve-errors` แล้วทำ `/loop-until-complete` ขั้นตอน 1 จนกว่าจะผ่าน

### 3. Improve Codebase

ปรับปรุง codebase ครบวงจร จาก review → analyze → improve → validate

> Goal: Codebase ผ่านการปรับปรุงครบวงจร ไม่มี regression

1. ทำ `/review-codebase` เพื่อ review → analyze gaps → implement improvements → validate
2. ถ้าพบ issues ให้ทำ `/resolve-errors` แล้วทำ `/loop-until-complete` ขั้นตอน 1 จนกว่าจะผ่าน

### 4. Ship

Git operations และ commit

> Goal: Git operations สำเร็จ

1. ทำ `/git-commit` เพื่อ commit ทุกการเปลี่ยนแปลง
2. ทำ `/update-readme` เพื่ออัปเดท docs ให้ตรงกับ version ใหม่

### 5. Verify

ตรวจสอบ quality gates หลัง commit

> Goal: ตรวจสอบ quality gates ผ่าน verify และ CI

1. ทำ `/loop-until-complete` กับ `/run-verify` จนกว่าจะผ่าน
2. ทำ `/watch-github-actions` เพื่อตรวจสอบว่า CI ผ่านทุก checks
3. ถ้าพบ CI failures ให้ทำ `/resolve-errors` ก่อนดำเนินการต่อ

### 6. Review Codebase

ทำ comprehensive review ครบทุกมิติหลัง verify ผ่าน

> Goal: Review ครบ 8 categories และ issues ถูก validate ครบถ้วน

1. ทำ `/review-codebase` เพื่อ review ครบ 8 category orchestrators พร้อม validate issues
2. ถ้าพบ critical หรือ high severity issues ให้ทำ `/resolve-errors` แล้วทำ `/loop-until-complete` กลับไปทำ Phase 2 จนกว่าจะผ่าน

### 7. Confirm Release

ขอ user confirm ก่อน release เสมอ — ห้ามข้ามขั้นตอนนี้

> Goal: User ยืนยันการ release หรือปฏิเสธ

1. ทำ `/ask-me` เพื่อขอ user confirm การ release พร้อมแสดงสรุปผลจาก Phase 1-6:
   - ตัวเลือก `Proceed with release (recommended)` — ดำเนินการ release ต่อ
   - ตัวเลือก `Abort release` — หยุดไม่ release รายงานสถานะ
   - ตัวเลือก `Review summary first` — แสดงสรุปผลลัพธ์ก่อนตัดสินใจ
2. ถ้า user เลือก `Abort release` → stop และ report ไม่ดำเนินการต่อ
3. ถ้า user เลือก `Review summary first` → แสดงสรุปผลจาก Phase 1-6 แล้วถามซ้ำ

### 8. Run Release

Release ไปยัง external platforms หลัง user confirm

> Goal: Release สำเร็จไปยัง platforms ที่ detect ได้

1. ทำ `/run-release` เพื่อ auto-detect platforms และ release ไปยัง external platforms
2. ถ้า release ไม่สำเร็จ ให้ทำ `/resolve-errors` แล้วทำ `/loop-until-complete` ขั้นตอน 1 จนกว่าจะผ่าน

### 9. Finalize

ตรวจสอบความครบถ้วนและรายงานผล

> Goal: ตรวจสอบความครบถ้วนและรายงานผล

1. ตรวจสอบสถานะของทุก phase (1-8) ว่าทำเสร็จแล้วทั้งหมด
2. รวบรวมสถานะและทำ `/report` พร้อม `/report-format-table`
3. ใช้ symbols: ✅ ผ่าน, ❌ ไม่ผ่าน, ⏭️ ข้าม, ⚠️ มี warning
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Non-Redundancy

> Goal: หลีกเลี่ยงการ duplicate รายละเอียด

- ห้าม duplicate รายละเอียดที่มีอยู่ใน sub-workflows
- Orchestrator อ้างถึง sub-workflow โดยไม่ระบุรายละเอียดภายใน
- Review, refactor, security, test quality, migration validation อยู่ใน `/review-codebase` แล้ว
- Codebase improvement อยู่ใน `/review-codebase` แล้ว
- รายละเอียด verify อยู่ใน `/run-verify` แล้ว — รายละเอียด release อยู่ใน `/run-release` แล้ว

### 2. Mandatory User Confirmation

> Goal: ห้าม release โดยไม่ได้รับ user confirmation

- ห้ามข้าม Phase 7 (Confirm Release) เด็ดขาด — ไม่ว่ากรณีใดๆ
- ใช้ `/ask-me` เท่านั้น สำหรับการขอ confirm — ห้ามใช้วิธีอื่น
- ถ้า user ปฏิเสธ → stop ทันที ไม่ดำเนินการ release
- ถ้า user ขอดูสรุปก่อน → แสดงสรุปแล้วถามซ้ำ ไม่ข้ามไป release

### 3. Error Resolution

> Goal: แก้ไข errors จนกว่าจะผ่านทุกอย่าง

- ทำ `/resolve-errors` เมื่อพบ error แล้วทำ `/loop-until-complete` ซ้ำจนกว่าจะผ่าน
- ห้ามข้าม errors หรือทำ workaround

### 4. Execution Order

> Goal: ทำตามลำดับ phases อย่างเป็นระบบ

- ทำตามลำดับ phases ห้ามข้าม phase
- แต่ละ phase เป็น gate condition ถ้าไม่ผ่านไม่ต้องไป phase ถัดไป
- Review ต้องทำหลัง verify ผ่านเท่านั้น — review บน code ที่ไม่ผ่าน quality gates เป็นการสิ้นเปลือง
- Release ต้องทำหลัง user confirm เท่านั้น — ไม่มีข้อยกเว้น
- ทำงานอัตโนมัติโดยไม่หยุดถาม ยกเว้นกรณีเสี่ยงสูง

### 5. Sub-Workflow Execution Discipline

> Goal: บังคับให้ทุก sub-workflow ถูกอ่านและทำจริง ไม่ข้าม

- คำว่า "ทำ `/xxx`" หมายถึง: อ่านไฟล์ workflow ที่ `C:\Users\Veerapong\.codeium\windsurf\global_workflows\xxx.md` ด้วย `read_file` แล้วทำตาม `## Execute` section ของไฟล์นั้น
- ห้ามตีความ "ทำ `/xxx`" เป็นแค่ concept หรือ suggestion — ต้องอ่านไฟล์จริงและทำตาม steps จริง
- ทุก sub-workflow ต้องถูก track ใน `todo_list`
- ห้ามข้าม sub-workflow ใดๆ ยกเว้นกรณี: ไม่มีไฟล์ workflow อยู่จริง หรือ condition ใน workflow บอกให้ข้าม
- ก่อน mark `completed` ต้อง verify ว่า `## Expected Outcome` ของ sub-workflow นั้นบรรลุแล้ว
- ถ้า sub-workflow มี sub-workflows ของตัวเอง (nested) ต้องทำ recursive เช่นกัน — อ่านและทำตามทุกระดับ

## Expected Outcome

- Requirement ชัดเจน และ plan ได้รับการยืนยันจาก user
- Code ผ่าน comprehensive review และ issues ถูกแก้ไขครบถ้วน ผ่าน `/review-codebase`
- Codebase ผ่านการปรับปรุงครบวงจร ผ่าน `/review-codebase`
- Git operations สำเร็จ
- Code ผ่าน verify และ CI/CD
- Code ผ่าน comprehensive review ครบ 8 categories
- User ยืนยันการ release ผ่าน `/ask-me`
- `/run-release` สำเร็จ (auto-detect platforms, release ไปยัง external platforms)
- รายงานผลลัพธ์การ ship ครบวงจร ตาม `/report`
