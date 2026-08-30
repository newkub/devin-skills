# Issue Body Template

## Goal

สร้าง issue body ทีอ่านง่าย สแกนได้ และ track ผลได้

## Section Layout

1. `## Goal` — paragraph สั้น 1-3 บรรทัด
2. `## Architecture` — ANSI diagram หรือ reference ถ้ามี
3. `## Idea Features` — scoring formula + features table
4. `## TODO` — task table
5. `## Acceptance Criteria` — checkboxes

## Features Table

| Icon | No. | Feature | Description | Files Change | Impact | Risk | Effect | Score | Phase |
|------|-----|---------|-------------|--------------|--------|------|--------|-------|-------|
| [icon] | 1 | ... | ... | ... | High | Low | High | 6.7 | MVP |

- `Icon` อยู่ตำแหน่งแรกเสมอ
- ใช้ Iconify CDN icon URL ด้วย color query ถ้าต้องการเน้น
- `Score` คำนวณจากสูตร

## TODO Table

| No. | Task | Status | Depends On | Expected Outcome |
|-----|------|--------|------------|------------------|
| 1 | ... | Todo | - | ... |

- `Status` ใช้ `Todo`, `In Progress`, `Done`
- `Expected Outcome` วัดผลได้

## Acceptance Criteria

- ใช้ checkbox list
- เน้น observable result
- 1 checkbox ต่อ 1 criterion

## UX/UI Tips

- ใช้ heading level ชัดเจน
- ใช้ table เพื่อเปรียบเทียบ
- จัด diagram ให้อยู่ตรงกลางด้วย `<div align="center">`
- ไม่ใช้ bold markers `**` ใน body
- ใช้ bullet หรือ checklist สำหรับ actions
