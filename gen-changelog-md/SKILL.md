---
name: gen-changelog-md
description: Generate CHANGELOG.md จาก git tags ด้วย Bun Shell script ไม่แก้ไขด้วยมือ
related:
  - run-release
  - report-changelog
  - review-release
  - follow-tool-changelogen
  - follow-tool-semantic-release
---

## Goal

Generate `CHANGELOG.md` จาก `git tag --sort=-version:refname` ด้วย Bun Shell script โดยไม่แก้ไขด้วยมือ ใช้ Keep a Changelog format และ conventional commits grouping

## Scope

ใช้สำหรับ projects ที่ต้องการ `CHANGELOG.md` อัตโนมัติจาก git tags — ไม่รวมการ publish ไปยัง platforms (ใช้ `run-release`) และไม่รวมการรายงาน changelog (ใช้ `report-changelog`)

## Execute

### 1. Run Generator

> Goal: Generate CHANGELOG.md จาก git tags

1. รัน script เพื่อ gen `CHANGELOG.md`:
```bash
bun run skills/gen-changelog-md/scripts/gen-release-md
```
2. สำหรับ dry-run (print ไป stdout ไม่เขียนไฟล์):
```bash
bun run skills/gen-changelog-md/scripts/gen-release-md --dry
```
3. สำหรับ custom output path:
```bash
bun run skills/gen-changelog-md/scripts/gen-release-md --output PATH
```

### 2. Verify Output

> Goal: ตรวจสอบ CHANGELOG.md ที่ gen แล้ว

1. อ่าน `CHANGELOG.md` ที่ gen แล้วเพื่อตรวจสอบ version numbers และ dates ถูกต้อง
2. ตรวจสอบ conventional commits ถูกจัดหมวดหมู่: Breaking Changes, Features, Bug Fixes, Other
3. ตรวจสอบ Unreleased section แสดง commits หลัง latest tag
4. ตรวจสอบ Release History table แสดงทุก tag

### 3. Update If Needed

> Goal: อัปเดต CHANGELOG.md เมื่อมี tag ใหม่

1. ถ้าต้องการอัปเดต → รัน script ใหม่อีกครั้ง ห้ามแก้ไข `CHANGELOG.md` ด้วยมือ
2. รัน script หลัง `git tag` ใหม่เสมอ
3. Commit `CHANGELOG.md` พร้อม release commit

## Rules

### 1. Generation Only

- `CHANGELOG.md` เกิดจากการ gen ด้วย `scripts/gen-release-md` จาก `git tag --sort=-version:refname` เท่านั้น
- ห้ามแก้ไข `CHANGELOG.md` ด้วยมือ — ถ้าต้องการอัปเดต ให้รัน script ใหม่
- ใช้ `Bun.$` สำหรับ shell commands และ `Bun.write()` สำหรับ write file

### 2. Format

- ใช้ Keep a Changelog format: `## vX.Y.Z (YYYY-MM-DD)`
- ใช้ conventional commits grouping: Breaking Changes, Features, Bug Fixes, Other
- แสดง commit hash แบบสั้น (7 ตัว) ในวงเล็บท้ายแต่ละรายการ
- แสดง top 10 releases ในรูปแบบ detail, ที่เหลือใน Release History table
- แสดง Unreleased section สำหรับ commits หลัง latest tag

### 3. Version Format

- ใช้ semantic versioning format: `vX.Y.Z` (เช่น `v1.0.0`, `v1.2.3`)
- ใช้ annotated tags สำหรับ releases
- วันที่จาก `git log -1 --format=%ad --date=short <tag>`

### 4. Non-Redundancy

- การ publish ไปยัง platforms อยู่ใน `run-release` แล้ว
- การรายงาน changelog อยู่ใน `report-changelog` แล้ว
- การ review changelog completeness อยู่ใน `review-release` แล้ว
- สำหรับ projects ที่ใช้ changelogen หรือ semantic-release ให้ใช้ `follow-tool-changelogen` หรือ `follow-tool-semantic-release` แทน

## Expected Outcome

- `CHANGELOG.md` ถูก gen จาก git tags ด้วย script ไม่แก้ไขด้วยมือ
- Conventional commits ถูกจัดหมวดหมู่: Breaking Changes, Features, Bug Fixes, Other
- Unreleased section แสดง commits หลัง latest tag
- Release History table แสดงทุก tag พร้อมวันที่
- Format สอดคล้องกับ Keep a Changelog
