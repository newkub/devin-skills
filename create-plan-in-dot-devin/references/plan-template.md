# Plan File Template

## Goal

สร้างไฟล์แผนใน `.devin/temp/plan/<workspace>/` ที่อ่านง่าย สแกนได้ และ track ผลได้ด้วย `/implement-to-production`

## Section Layout

1. `## Goal` — paragraph สั้น 1-3 บรรทัด
2. `## Architecture` — ANSI diagram หรือ reference ถ้ามี
3. `## Idea Features` — scoring formula + features table
4. `## File Changes` — ตาราง `No. | File | Action | What | How | Acceptance | Risk`
5. `## TODO` — task table พร้อม `Status` (`pending` เริ่มต้น)
6. `## Task Graph` — dependencies ระหว่าง tasks + critical path
7. `## Risks` — ตาราง risk, impact, mitigation
8. `## Test Strategy` — coverage, fixtures, regression
9. `## Assumptions And Unknowns` — สิ่งที่สมมติไว้ + open questions
10. `## Acceptance Criteria` — checkboxes
11. `## Execution Order` — ลำดับ task ที่ `/implement-to-production` ใช้จัด critical path

## Features Table

| Icon | No. | Feature | Description | Files Change | Impact | Risk | Effect | Score | Phase |
|------|-----|---------|-------------|--------------|--------|------|--------|-------|-------|
| [icon] | 1 | ... | ... | ... | High | Low | High | 6.7 | MVP |

- `Icon` อยู่ตำแหน่งแรกเสมอ
- ใช้ Iconify CDN icon URL ด้วย color query ถ้าต้องการเน้น
- `Score` คำนวณจากสูตร
- เพิ่มคอลัมน์ `Dependencies` ถ้ามี dependency ระหว่าง features

## File Changes Table

| No. | File | Action | What | How | Acceptance | Risk |
|-----|------|--------|------|-----|------------|------|
| 1 | `path/to/file.ts` | create / update / delete | API signature/types | pattern ที่ใช้ | observable result | Low |

- `Action` ใช้ `create`, `update`, `delete`, `rename` ให้ตรงกับงานจริง
- `What` ระบุ API signatures/types ที่จะเพิ่มหรือแก้
- `How` อ้าง pattern/abstraction ที่ reuse จาก codebase
- ทุก row ต้องมี evidence จาก deep-analyze — ห้ามเดา path

## TODO Table

| No. | Task | Status | Depends On | Expected Outcome |
|-----|------|--------|------------|------------------|
| 1 | ... | pending | - | ... |

- `Status` ใช้ `pending`, `in-progress`, `completed` ให้ตรงกับที่ `/implement-to-production` อ่าน
- `Expected Outcome` วัดผลได้

## Task Graph

- ระบุ dependencies ระหว่าง tasks ด้วยหมายเลข `No.` (เช่น `1 → 2, 3 → 4`)
- ระบุ critical path ที่ยาวที่สุด
- ระบุ tasks ที่รัน parallel ได้
- Task ที่ถูกพึ่งพาต้องมาก่อนเสมอ

## Risks Table

| Risk | Impact | Likelihood | Mitigation | Rollback |
|------|--------|------------|------------|----------|
| ... | High | Medium | ... | ... |

- `Mitigation` ต้องเป็น action จริง ไม่ใช่คำอธิบายกว้าง
- `Rollback` ระบุวิธีถอยกลับถ้า risk เกิดจริง

## Test Strategy

- Coverage target ที่ต้องมีหลัง implement
- Fixtures / test data ที่ต้องเตรียม
- Regression test ที่ต้องเพิ่มหรืออัปเดต
- ระบุ test file paths จริงจาก codebase

## Assumptions And Unknowns

- `Assumptions` — สิ่งที่สมมติไว้พร้อมเหตุผล
- `Unknowns` — open questions ที่ต้อง `/ask-me` ก่อน implement
- ห้ามปล่อย unknowns เป็นค่าว่างถ้ามีความเสี่ยง — ต้องถามก่อนเขียน plan

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
