---
name: check-test-correctness
description: ตรวจ tests ว่า assert ถูกจริง — assertions ตรง spec, mocks ตรง API, ไม่มี vacuous tests
argument-hint: "[target]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
  - web_search
  - webfetch
related:
  - deep-review
  - update-tests
  - run-test
  - deep-verify
  - report

---

## Goal

ตรวจว่า test cases `assert สิ่งที่ถูกต้องจริง` ไม่ใช่แค่ผ่าน — assertions ตรง spec/requirements, expected values มาจาก requirement ไม่ใช่ copy จาก buggy implementation, mocks/stubs ตรง API ของ dependency จริง, test names ตรงกับสิ่งที่ verify, ไม่มี vacuous tests

## Scope

ใช้สำหรับ verify correctness ของ assertions และ test semantics — ต่างจาก `/deep-review` (test strategy/quality ภาพรวม รวม `## Check: Test Quality` สำหรับ structure/isolation) — skill นี้ตอบคำถาม "test นี้ถ้า implementation ผิด มันจะ fail จริงไหม"

## Execute

### 1. Extract Test Intent

> Goal: รู้ว่าแต่ละ test ตั้งใจ verify อะไร

1. อ่าน test name/describe block — ระบุ expected behavior ที่ claim ไว้
2. ระบุ assertions ที่มีจริงใน test body
3. หา spec/requirement ที่ test อ้างถึง (issue, docs, contract) ถ้ามี
4. ทำ `/use-scripts` ถ้าต้อง extract จากหลายไฟล์

### 2. Verify Assertions Against Behavior

> Goal: ยืนยันว่า assertion ตรวจสิ่งที่ถูก ไม่ใช่สิ่งที่ implementation ทำอยู่

1. Expected values → เทียบ spec/requirement/contract ไม่ใช่ copy จาก implementation output
2. Mocks/stubs → signature และ return shape ตรง dependency จริง (`grep` เทียบ source ของ dep)
3. Assertions → ครอบคลุม claim ของ test name จริง (test ชื่อ "rejects invalid" ต้องมี negative assertion)
4. Snapshot tests → snapshot ไม่ stale และไม่ auto-update กลบ bug (`--ci` mode ห้าม `-u`)
5. Async tests → มี `await`/resolves assertion ครบ ไม่ใช่ promise ลอยที่ผ่านเสมอ

### 3. Detect Vacuous And False-Positive Patterns

> Goal: หา tests ที่ผ่านโดยไม่ verify อะไร

- ไม่มี assertion เลย หรือ assert แค่ "doesn't throw" โดยไม่ระบุผล
- Assertion บน mock ตัวเอง (`expect(mock).toHaveBeenCalled` โดยไม่เช็ค args/effect)
- `expect(true).toBe(true)`, tautological assertions, try/catch ที่กลืน failure
- Conditional assertions (`if (x) expect(...)`) ที่ skip เงียบๆ
- Copy-paste tests ที่ name ไม่ตรง body

### 4. Report And Route

> Goal: รายงานและส่งต่อ

1. ทำ `/report` ตาราง: No, File, Line, Test, Problem, Severity, Suggested Fix
2. Severity: `high` (vacuous/false-positive — test ไม่ป้องกัน bug), `medium` (assertion อ่อน/mock drift), `low` (naming mismatch)
3. Route fixes → `/update-tests` หรือ `/deep-review` สำหรับ redesign
4. ถ้าไม่มี findings → report "test assertions verified" — verify ด้วย `/run-test` ถ้าต้องยืนยันว่า suite ยังเขียว
5. ทำ `/suggest-next-action`

## Rules

### 1. Spec First

- Expected behavior ยึดตาม spec/requirement/contract — ห้ามยึด implementation ปัจจุบันเป็น truth เสมอไป (implementation อาจเป็น bug ที่ test กำลังล็อกไว้)
- ถ้าไม่มี spec → mark "unverified" พร้อมระบุว่าต้องการ requirement source

### 2. Evidence-Based

- ทุก finding ต้องมี `file:line`, test name, และเหตุผลที่ assertion ไม่ตรวจสิ่งที่ claim
- mock drift ต้องเทียบ signature จริงของ dependency ไม่ใช่เดา

### 3. Discipline

- ตรวจเท่านั้น ไม่แก้ test — fixes ผ่าน `/update-tests` หรือ `/deep-review`
- ห้าม flag test ที่ตั้งใจเป็น smoke/contract test ว่าเป็น vacuous ถ้า intent ชัดเจน

- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /update-tests ถ้าจำเป็น
- ใช้ /deep-verify ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- ทุก test ใน scope ถูก verify ว่า assert สิ่งที่ถูก หรือ mark unverified
- รายการ vacuous/false-positive/mock-drift tests พร้อม file:line
- Route ไปยัง fix skill ที่ถูกต้อง
