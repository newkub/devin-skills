---
name: report-changelog
description: สร้าง changelog รายงานจาก git log ระหว่าง tags หรือ releases
argument-hint: "[range]"
---

## Goal

สร้าง changelog รายงานจาก git log ระหว่าง tags หรือ releases ในรูปแบบที่อ่านง่าย

## Scope

ใช้สำหรับการรายงาน changelog จาก git history — ไม่รวมการสร้างไฟล์ changelog (ใช้ `/follow-tool-changelogen` สำหรับสร้าง `CHANGELOG.md`) และไม่รวมการสร้าง release (ใช้ `/run-release`)

## Execute

### 1. Determine Version Range

> Goal: ระบุช่วงของ changelog ที่ต้องการ

1. ระบุ range ที่ต้องการ:
   - Between tags: `git log <tag-old>..<tag-new>`
   - Since last tag: `git log <latest-tag>..HEAD`
   - Specific commit range: `git log <commit-a>..<commit-b>`
   - Date range: `git log --since="2024-01-01" --until="2024-12-31"`
2. ถ้าไม่ระบุ → ใช้ `git log <latest-tag>..HEAD` เป็น default
3. รัน `git tag --sort=-version:refname | head -5` เพื่อดู tags ล่าสุด

### 2. Collect Commits

> Goal: รวบรวม commits ในช่วงที่กำหนด

1. รัน `git log <range> --oneline` เพื่อดู commits ทั้งหมด
2. รัน `git log <range> --format="%H|%s|%an|%ai|%b"` เพื่อเก็บ metadata ครบ
3. ระบุจำนวน commits ทั้งหมด
4. ระบุ contributors ทั้งหมด

### 3. Categorize Commits

> Goal: จัดหมวดหมู่ commits ตาม conventional commits

1. จัดกลุ่มตาม commit type:
   - Features (`feat`): ฟีเจอร์ใหม่
   - Bug Fixes (`fix`): แก้ไขบั๊ก
   - Breaking Changes: การเปลี่ยนแปลงที่ไม่ backward compatible
   - Performance (`perf`): ปรับปรุง performance
   - Refactor (`refactor`): refactor code
   - Documentation (`docs`): เอกสาร
   - Tests (`test`): tests
   - Chores (`chore`): build, dependencies, config
   - Other: commits ที่ไม่ตรง conventional format
2. ระบุ breaking changes จาก commit body หรือ `!` ใน type
3. ระบุ scope ของแต่ละ commit ถ้ามี

### 4. Format Changelog

> Goal: จัดรูปแบบ changelog ให้อ่านง่าย

1. ทำ `/report-table` สำหรับสรุปสถิติ
2. แสดงผลตามลำดับ: Summary → Breaking Changes → Features → Bug Fixes → Other
3. ใช้ format ตาม Keep a Changelog:
   ```markdown
   ## [version] - date

   ### Breaking Changes
   - description

   ### Features
   - description

   ### Bug Fixes
   - description
   ```
4. แสดง commit hash แบบสั้น (7 ตัว) นำหน้าแต่ละรายการ

### 5. Provide Insights

> Goal: ให้ insights ของ changelog

1. สรุปจำนวน commits แยกตามประเภท
2. ระบุ contributors และจำนวน commits ต่อคน
3. ระบุไฟล์ที่เปลี่ยนแปลงมากที่สุด
4. แนะนำ next steps: ตรวจสอบ breaking changes, อัปเดต docs, สร้าง release

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Commit Parsing

- ใช้ conventional commits format สำหรับจัดหมวดหมู่
- ระบุ breaking changes จาก `!` ใน type หรือ `BREAKING CHANGE:` ใน body
- ถ้า commit ไม่ใช่ conventional format → จัดในหมวด "Other"
- แสดง commit hash แบบสั้น (7 ตัว)

### Output Format

- ทำ `/report-table` สำหรับสรุปสถิติ
- ใช้ Keep a Changelog format สำหรับรายละเอียด
- เรียงตามลำดับ: Breaking Changes → Features → Bug Fixes → Other
- แสดง version และ date ใน header

### High Impact Content

- ชี้เน้น breaking changes ก่อนเสมอ
- ถ้ามีมากกว่า 100 commits → แสดงเฉพาะ summary และ top 20 ที่สำคัญ
- ชี้เน้น features และ bug fixes ที่มีผลกระทบมาก
- ไม่แสดง chore commits ในรายละเอียดถ้าเกิน 10 รายการ

### Read-Only

- ไม่สร้างไฟล์ changelog — ใช้ `/follow-tool-changelogen` สำหรับสร้าง `CHANGELOG.md`
- ไม่สร้าง release — ใช้ `/run-release`
- รายงานเท่านั้น — read-only operation

### Non-Redundancy

- การสร้างไฟล์ changelog อยู่ใน `/follow-tool-changelogen` แล้ว
- การสร้าง release อยู่ใน `/run-release` แล้ว
- การจัดการ tags อยู่ใน `/follow-tool-git` แล้ว

## Expected Outcome

- Changelog รายงานจัดหมวดหมู่ตาม conventional commits
- สรุปสถิติ: จำนวน commits ตามประเภท, contributors
- ชี้เน้น breaking changes ก่อนเสมอ
- ไม่มีการสร้างไฟล์ — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน