# Plan File Template

## Goal

สร้างไฟล์แผนใน `.devin/plan/` ที่อ่านง่าย สแกนได้ และ track ผลได้ด้วย `/implement-plan`

## Section Layout

1. `## Goal` — paragraph สั้น 1-3 บรรทัด
2. `## Architecture` — ANSI diagram หรือ reference ถ้ามี
3. `## Idea Features` — scoring formula + features table
4. `## TODO` — task table พร้อม `Status` (`pending` เริ่มต้น)
5. `## Acceptance Criteria` — checkboxes
6. `## Execution Order` — ลำดับ task ที่ `/implement-plan` ใช้จัด critical path

## Features Table

| Icon | No. | Feature | Description | Files Change | Impact | Risk | Effect | Score | Phase |
|------|-----|---------|-------------|--------------|--------|------|--------|-------|-------|
| [icon] | 1 | ... | ... | ... | High | Low | High | 6.7 | MVP |

- `Icon` อยู่ตำแหน่งแรกเสมอ
- ใช้ Iconify CDN icon URL ด้วย color query ถ้าต้องการเน้น
- `Score` คำนวณจากสูตร
- เพิ่มคอลัมน์ `Dependencies` ถ้ามี dependency ระหว่าง features

## TODO Table

| No. | Task | Status | Depends On | Expected Outcome |
|-----|------|--------|------------|------------------|
| 1 | ... | pending | - | ... |

- `Status` ใช้ `pending`, `in-progress`, `completed` ให้ตรงกับที่ `/implement-plan` อ่าน
- `Expected Outcome` วัดผลได้

## Acceptance Criteria

- ใช้ checkbox list `- [ ]`
- เน้น observable result
- 1 checkbox ต่อ 1 criterion

## Execution Order

- เขียนเป็น numbered list ของ task `No.` เรียงตาม critical path
- ระบุ task ที่ทำ parallel ได้ถ้ามี

## UX/UI Tips

- ใช้ heading level ชัดเจน
- ใช้ table เพื่อเปรียบเทียบ
- จัด diagram ให้อยู่ตรงกลางด้วย `<div align="center">`
- ไม่ใช้ bold markers `**` ใน body
- ใช้ bullet หรือ checklist สำหรับ actions
