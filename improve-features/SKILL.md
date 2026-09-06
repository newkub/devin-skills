---
name: improve-features
description: ปรับปรุง feature ที่มีอยู่ให้สมบูรณ์ — edge cases, states, flow, polish จนพร้อม production
argument-hint: "<feature-name-or-module>"
related:
  - idea-features
  - review-features
  - implement-features-to-mvp
  - update-features-md
  - productionize-implementation
  - deep-review
  - improve-uxui
  - run-verify
  - report-table
---

## Goal

ปรับปรุง feature ที่มีอยู่แล้วใน project ให้สมบูรณ์ — เติม edge cases, empty/error/loading states, flow ที่ขาด และ polish จนพร้อม production

## Scope

ใช้เมื่อต้องการยกระดับ feature เดิม (ไม่ใช่สร้างใหม่ — สร้างใหม่ใช้ `/implement-features-to-mvp`, คิดไอเดียใช้ `/idea-features`)

## Execute

### 1. Understand Feature

> Goal: เข้าใจ feature ปัจจุบันก่อนแก้

1. ระบุ feature target จาก argument — ถ้าไม่ชัด ทำ `/ask-me`
2. ทำ `/scan-codebase` หา module, routes, components, API ที่เกี่ยวข้อง
3. อ่าน `docs/project/features.md` และ API docs ของ feature นั้นถ้ามี
4. map happy path + edge cases ที่มีอยู่แล้ว

### 2. Find Gaps

> Goal: ระบุช่องว่างที่ต้องเติม

1. ตรวจ states ที่ขาด: loading, empty, error, permission-denied, offline
2. ตรวจ edge cases: validation, boundary values, race conditions, cancellation
3. ตรวจ flow gaps: dead ends, ขาด confirmation, ขาด undo, ขาด error recovery
4. ตรวจความสอดคล้อง: copy, i18n keys, permission checks, audit logging
5. ทำ `/review-features` เพื่อเทียบกับมาตรฐาน features อื่นใน codebase

### 3. Prioritize And Plan

> Goal: เลือก improvements ที่ impact สูงสุดก่อน

1. จัดลำดับ gaps: critical (broken/incorrect) → high (missing states) → medium (polish) → low (nice-to-have)
2. ทำ `/report-plan` แสดงรายการก่อนลงมือ — รอ user confirm ถ้า scope ใหญ่
3. จำกัด scope ต่อรอบ — ถ้า gaps เยอะ แนะนำแยกเป็น phase

### 4. Implement Improvements

> Goal: เติม gaps แบบ minimal และ consistent

1. ทำตาม `/follow-architecture` — เคารพ structure เดิม ไม่ restructure โดยไม่จำเป็น
2. reuse components/hooks ที่มีใน codebase — ห้ามสร้างใหม่ถ้ามีอยู่แล้ว
3. เติม states ที่ขาดด้วย patterns เดียวกับ feature อื่นใน project
4. เขียน/อัปเดต tests สำหรับ edge cases ที่เพิ่ม

### 5. Validate

> Goal: ยืนยัน improvements ไม่ทำลายของเดิม

1. ทำ `/run-verify` — lint, typecheck, tests
2. ทำ `/review-uxui` ถ้าแตะ UI flows
3. อัปเดต `docs/project/features.md` ผ่าน `/update-features-md` ถ้า behavior เปลี่ยน
4. รายงาน before/after เป็นตาราง: gap ที่แก้, ไฟล์, verification

## Rules

### 1. Improve Not Rewrite

- ปรับปรุงบน structure เดิม — ห้าม rewrite ทั้ง feature
- ถ้าพบปัญหา architecture ใหญ่ → รายงานแยก ไม่แก้ใน task เดียวกัน

### 2. Consistent With Codebase

- states/patterns ใหม่ต้องเหมือน features อื่นใน project เดียวกัน
- reuse shared components, hooks, error handling เดิม

### 3. Scope Discipline

- เติมเฉพาะ gaps ของ feature ที่ระบุ — ไม่ไล่แก้ทั้ง codebase
- gap ที่ out-of-scope ให้บันทึกเป็น suggestion ไม่ใช่ implement

### 4. Evidence-Based Gaps

- ทุก improvement ต้องชี้ไปที่ code/flow จริง — ไม่เดา
- ถ้า gap ไม่แน่ใจว่าเป็น intentional → ทำ `/ask-me`

## Expected Outcome

- feature ครบ states และ edge cases หลักตามมาตรฐาน codebase
- ไม่มี regression — tests และ verify ผ่าน
- `features.md` สะท้อนพฤติกรรมปัจจุบัน
- รายงาน before/after ชัดเจนพร้อมไฟล์ที่แตะ