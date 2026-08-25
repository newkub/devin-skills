---
name: git-commit
description: Commit ไฟล์ที่เปลี่ยนแปลงตามมาตรฐาน conventional commits รองรับ split commit
---

## Goal

Commit ไฟล์ที่มีการเปลี่ยนแปลงตามมาตรฐาน conventional commits โดยรองรับ split commit ตามประเภทของการเปลี่ยนแปลง

## Scope

ใช้สำหรับ commit ไฟล์ที่มีการเปลี่ยนแปลง โดยรองรับ 3 โหมด:
- Single Commit (task files): commit เฉพาะไฟล์ที่ task แก้ไปเป็น commit เดียว
- Commit All (single): commit ไฟล์ทั้งหมดเป็น commit เดียว
- Split Commit (all by category): แยก commit ไฟล์ทั้งหมดตามประเภท (docs, config, code, test, chore)
- ใช้ `git add <files>` หรือ `git add -p` เสมอ ไม่ใช้ `git add .`

## Execute

### 1. Setup Prerequisites

> Goal: ตรวจสอบและตั้งค่า prerequisites ก่อน commit

1. ทำตาม `/follow-gitignore` สำหรับ .gitignore
2. ทำตาม `/follow-tool-hk` สำหรับ Git hooks
3. ทำตาม `/follow-config` สำหรับ configuration

### 2. Categorize Changes

> Goal: จัดกลุ่มไฟล์ที่มีการเปลี่ยนแปลง แยกระหว่าง task files และ other files แล้วจัดตามประเภท

1. รัน `git status --porcelain` เพื่อดูไฟล์ที่มีการแก้ไขทั้งหมด
2. ระบุไฟล์ที่ task แก้ไปจาก context (task files)
3. ระบุไฟล์ที่เปลี่ยนแปลงแต่ไม่ใช่จาก task นี้ (other files)
4. จัดกลุ่มไฟล์ทั้งหมดตามประเภท:
   - docs: README.md, docs/, *.md
   - config: package.json, tsconfig.json, biome.jsonc, .gitignore, lefthook.yml
   - code: src/, lib/, packages/
   - test: test/, *.test.ts, *.spec.ts
   - chore: scripts/, tools/, build files

### 3. Choose Commit Mode

> Goal: เลือกโหมดการ commit โดยพิจารณา task files และ other files อัตโนมัติ

1. ถ้ามีเฉพาะ task files (ไม่มี other files) → ใช้ Single Commit (task files)
2. ถ้ามี other files และ task files → ใช้ Split Commit (by category) เพื่อแยก commit ตามประเภท
3. ถ้ามีเฉพาะ other files (ไม่มี task files) → ใช้ Split Commit (by category)
4. ถ้าเลือก Split Commit → ทำ `/update-readme` ก่อน stage

### 4. Review File Changes

> Goal: ดู actual changes ของไฟล์ที่จะ commit เพื่อให้ commit message ตรงมากขึ้น

1. รัน `git diff` เพื่อดู changes ที่ยังไม่ได้ commit
2. รัน `git diff --cached` เพื่อดู changes ที่ staged แล้ว
3. รัน `git diff <file>` เพื่อดู changes ของไฟล์เฉพาะ
4. วิเคราะห์ changes เพื่อเข้าใจสิ่งที่เปลี่ยนแปลงจริงๆ

### 5. Stage Changes By Mode

> Goal: Stage ไฟล์ตามโหมดที่เลือก

Single Commit (task files):
1. ใช้ `git add <files>` เพื่อ stage เฉพาะไฟล์ที่ task แก้ไป
2. ใช้ `git add -p` ถ้าไฟล์มีการเปลี่ยนแปลงหลายส่วน
3. ตรวจสอบด้วย `git diff --cached` ว่าเฉพาะส่วนที่ task แก้ไปถูก stage

Commit All (single):
1. ใช้ `git add <files>` เพื่อ stage ไฟล์ทั้งหมดที่เปลี่ยนแปลง
2. ใช้ `git add -p` ถ้าไฟล์มีการเปลี่ยนแปลงหลายส่วน
3. ตรวจสอบด้วย `git diff --cached` ว่าไฟล์ที่ stage ถูกต้องครบถ้วน

Split Commit (by category):
1. Stage ไฟล์ตามประเภททีละกลุ่มด้วย `git add <files>`
2. ใช้ `git add -p` ถ้าไฟล์มีการเปลี่ยนแปลงหลายส่วน
3. ตรวจสอบด้วย `git diff --cached` ว่าไฟล์ที่ stage ถูกต้องตามประเภท
4. ทำซ้ำจนครบทุกประเภทที่มีการเปลี่ยนแปลง

### 6. Write Commit Message(s)

> Goal: เลือก commit type และเขียน commit message ตาม conventional commits format

1. เลือก commit type ตาม Rules ส่วน Commit Types
2. เขียน commit message ตาม Rules ส่วน Commit Message Format และ Body
3. สำหรับ Split Commit → เขียน message แยกต่อประเภท โดยใช้ type ที่เหมาะสมกับแต่ละกลุ่ม

### 7. Execute Commit

> Goal: ดำเนินการ commit ตามโหมดที่เลือก

Single Commit และ Commit All:
1. รัน `git commit -m "<message>"` หรือ `git commit`
2. ตรวจสอบผลลัพธ์จาก git commit
3. ถ้ามี error: แก้ไขแล้วลองอีกครั้ง

Split Commit:
1. รัน `git commit -m "<message>"` สำหรับประเภทแรกที่ staged
2. ตรวจสอบผลลัพธ์ — ถ้ามี error: แก้ไขแล้วลองอีกครั้ง
3. Stage ประเภทถัดไปแล้ว commit ทำซ้ำจนครบทุกประเภท

### 8. Report Git Log

> Goal: รายงาน git log หลัง commit สำเร็จ

1. หลังจาก `git commit` สำเร็จทุกกลุ่ม ทำ `/report-git-log` เพื่อสรุป commits ล่าสุด
2. ใช้ range default `HEAD~5..HEAD` หรือช่วงทีเพิ่ม commit ในครั้งนี้
3. ตรวจสอบว่า commit messages ตรงกับ conventional commits
4. ถ้ามีหลายกลุ่ม commits → report แยกตามกลุ่ม

### 9. Verify Commits

> Goal: ตรวจสอบความถูกต้องของ commits

1. รัน `git log --oneline -5` เพื่อดู commits ล่าสุด
2. ตรวจสอบว่า commit messages สอดคล้องกับ conventional commits
3. ตรวจสอบว่าไม่มีไฟล์ที่ยังไม่ commit เหลืออยู่ (สำหรับ commit ทั้งหมด)
4. รัน `git status` เพื่อยืนยันว่า working directory สะอาด (สำหรับ commit ทั้งหมด)

## Rules

### Commit Message Format

> Goal: commit message มีรูปแบบมาตรฐาน

ใช้รูปแบบ conventional commits

- ใช้รูปแบบ `<type>(<scope>): <subject>`
- subject ไม่ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่หรือจบด้วยจุด
- สั้นกระชับไม่เกิน 72 ตัวอักษร
- ใช้ imperative mood (เช่น add ไม่ใช่ added)
- ใช้ภาษาอังกฤษหรือไทยให้สม่ำเสมอ

### Commit Types

> Goal: เลือก type ที่เหมาะสมกับการเปลี่ยนแปลง

- feat: ฟีเจอร์ใหม่
- fix: แก้ไขบั๊ก
- docs: เปลี่ยนแปลงเอกสาร
- style: แก้ไข code style
- refactor: refactor code โดยไม่เพิ่ม feature หรือแก้บั๊ก
- perf: ปรับปรุง performance
- test: เพิ่มหรือแก้ไข tests
- chore: เปลี่ยนแปลง build process, dependencies

### Scope

> Goal: ระบุส่วนของโปรเจกต์ที่ถูกแก้ไข

- ระบุส่วนของโปรเจกต์ที่ถูกแก้ไข
- เช่น: api, ui, db, config, deps, auth, test, docs, ci

### Body

> Goal: อธิบายเหตุผลและ context เพิ่มเติม

- อธิบายเหตุผลและ context
- แยกจาก subject ด้วยบรรทัดว่าง
- ใช้ bullet points สำหรับหลายรายการ

## Expected Outcome

1. Commit messages ที่สอดคล้องกับ conventional commits
2. Git history ที่อ่านง่ายและติดตามง่าย
3. โหมดการ commit ที่เหมาะสม: task files only, commit all, หรือ split by category
4. ไฟล์ที่มีการเปลี่ยนแปลงถูก commit ตามที่ต้องการ
5. Working directory สะอาด (สำหรับ Commit All และ Split Commit)

## Addendum

- ก่อนรัน `git commit` จริง `/git-commit` ต้องเรียก `/follow-tool-hk` เพื่อให้ pre-commit hooks รันและ format/lint ผ่านก่อนเสมอ