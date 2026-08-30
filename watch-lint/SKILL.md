---
name: watch-lint
description: ตรวจสอบและ monitor linting ในโปรเจกต์อย่างต่อเนื่อง พร้อมจัดการ errors อัตโนมัติ
argument-hint: "[linter]"
related:
  - run-typecheck
  - resolve-errors
  - run-lint
---

## Goal

Watch linting อย่างต่อเนื่อง ตรวจจับ errors และ warnings ใหม่ๆ พร้อมจัดการและแก้ไขอัตโนมัติ

## Scope

ใช้สำหรับ project ที่ต้องการ monitor linting อย่างต่อเนื่องด้วย linter เช่น `biome`, `eslint`, `oxlint` ไม่ใช่การ run lint ครั้งเดียว (ใช้ `run-lint`)

ไม่ครอบคลุม: การรัน lint watch mode อย่างต่อเนื่องขณะพัฒนา (linter ส่วนใหญ่มี `--watch` flag อยู่แล้ว ใช้ `bunx biome check --watch` หรือ `eslint --watch` โดยตรง)

## Execute

### 1. Detect Linter

> Goal: รู้ว่า project ใช้ linter ใด

1. ตรวจ `package.json` และ config files เช่น `biome.json`, `.eslintrc`, `oxlintrc.json` เพื่อระบุ linter
2. ถ้ารับ `linter` จาก argument ให้ใช้ linter นั้น
3. ถ้าไม่พบ linter → stop และ report
4. ถ้า project ใช้ TypeScript ให้ทำ `/run-typecheck` ก่อนเริ่ม watch lint

### 2. Start Watch

> Goal: เริ่ม watch lint อย่างต่อเนื่อง

1. เลือก watch command ตาม linter ที่ตรวจพบ:
   - `biome` → `bunx biome check --watch` หรือ `npx @biomejs/biome check --watch`
   - `eslint` → `eslint --watch` หรือ `npx eslint --watch`
   - `oxlint` → `oxlint --watch` หรือ `npx oxlint --watch`
2. รัน watch command ใน background shell ด้วย `timeout: 0`
3. กำหนด files และ ignore patterns ตาม config ของ linter
4. ถ้า linter ไม่รองรับ `--watch` ให้ใช้ `watchexec` หรือ `chokidar` เพื่อ trigger lint ซ้ำเมื่อไฟล์เปลี่ยน

### 3. Monitor Results

> Goal: ตรวจสอบ linting results อย่างต่อเนื่อง

1. อ่าน output จาก watch shell ทุก 5 วินาที ด้วย `get_output`
2. ตรวจจับ errors และ warnings ใหม่ๆ
3. ระบุไฟล์และบรรทัดที่มีปัญหา
4. ตรวจสอบ trends ของ linting results ว่าลดลงหรือเพิ่มขึ้น

### 4. Handle Errors

> Goal: จัดการ linting errors และ warnings อัตโนมัติ

1. ถ้าพบ errors ให้ทำ `/resolve-errors` ทันที
2. แก้ที่ root cause ไม่ใช่เพียง suppress warning
3. ถ้า linter รองรับ auto-fix ให้รัน `biome check --write`, `eslint --fix` หรือ `oxlint --fix`
4. ยืนยันว่า errors ถูกแก้ไขแล้ว output สะอาด
5. กลับไป watch lint ต่อ

### 5. Maintain Configuration (optional)

> Goal: รักษา linting configuration ให้เป็นปัจจุบัน

ขั้นตอนนี้ optional — อัปเดต config เฉพาะเมื่อ user ร้องขอ

1. อัปเดต linting rules ตาม best practices ของ linter
2. ปรับปรุง ignore patterns เมื่อมีไฟล์ใหม่ที่ไม่ควรตรวจ
3. ตรวจไม่มี unused rules หรือ conflicting config
4. อัปเดต documentation ของ linting setup ถ้ามีการเปลี่ยนแปลง

## Rules

### 1. Continuous Monitoring

- Watch lint output ทุก 5 วินาทีต่อเนื่อง
- ตรวจจับ errors และ warnings ใหม่ๆ ทันทีที่เกิด
- ตรวจสอบว่า watch command ยังรันอยู่ ถ้า crash ให้ restart
- บันทึก linting results สำหรับ track trends

### 2. Error Handling

- ทำ `/resolve-errors` สำหรับแก้ไข linting errors อัตโนมัติ
- แก้ root cause ไม่ใช่ suppress ด้วย `eslint-disable` หรือ `biome-ignore` โดยไม่จำเป็น
- ใช้ auto-fix ของ linter เช่น `biome check --write`, `eslint --fix`, `oxlint --fix` เมื่อเป็นไปได้
- ยืนยันว่า errors ถูกแก้ไขอย่างสมบูรณ์ก่อนกลับไป watch

### 3. Linter Selection

- ตรวจ ecosystem จาก `package.json` ก่อนเลือก linter
- ใช้ `biome` สำหรับ project ที่ติดตั้ง `@biomejs/biome`
- ใช้ `eslint` สำหรับ project ที่ติดตั้ง `eslint`
- ใช้ `oxlint` สำหรับ project ที่ติดตั้ง `oxlint`
- ถ้า linter ไม่รองรับ `--watch` ให้ใช้ `watchexec -e ts,tsx,js,jsx -- <linter> check` แทน

### 4. Configuration Consistency

- ใช้ consistent linting rules ทั้ง codebase
- ไม่มี overrides โดยไม่มีเหตุผล และ document overrides ที่จำเป็น
- ตรวจไม่มี conflicting rules ระหว่าง linters ถ้าใช้หลายตัว
- อัปเดต rules ตาม official docs ของ linter เมื่อมี version ใหม่

### 5. Circuit Breaker

- ถ้า error เดิมเกิดซ้ำ ≥ `3` ครั้งหลังแก้ไข → stop และ report ว่า fix ไม่ได้ผล
- ถ้า auto-fix สร้าง error ใหม่ → stop หลัง `3` รอบ
- บันทึก error fingerprint (file + line + rule) เพื่อตรวจจับ recurring errors

### 6. Timeout And Retry Limits

- `timeout` = `600` วินาที (10 นาที) สำหรับการ watch ทั้งหมด
- `maxErrors` = `50` ก่อน stop และ report
- `maxRestarts` = `3` สำหรับ watch process crash recovery

### 7. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ปิด watch process อย่างสะอาด

### 8. Rollback Safety

- ก่อนรัน `--write` หรือ `--fix` ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า auto-fix สร้าง error ใหม่ → `git stash pop` เพื่อคืนค่า
- ห้ามรัน `--write` โดยไม่มี checkpoint

## Expected Outcome

- Linting errors ถูกตรวจจับและแก้ไขอัตโนมัติอย่างต่อเนื่อง
- Codebase สะอาด consistent และลด technical debt
- Watch lint ทำงานต่อเนื่องโดยไม่ขัดจังหวะ
- Configuration เป็นปัจจุบันและสอดคล้องกับ best practices
