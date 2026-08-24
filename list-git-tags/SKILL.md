---
name: list-git-tags
description: แสดง tags ทั้งหมดพร้อมข้อมูลและ semantic versioning status
---

## Goal

แสดงรายการ git tags ทั้งหมดพร้อม metadata และ semantic versioning status

## Scope

ใช้สำหรับดู tags ใน local repository และ remote — ไม่รวมการ create, delete, push (ใช้ `/follow-git` สำหรับ tag operations)

## Execute

### 1. List Tags

> Goal: ดู tags ทั้งหมดในเครื่อง
> Goal: รู้ tags ที่มีและจำนวน

1. รัน `git tag` เพื่อดู tags ทั้งหมด
2. รัน `git tag -l --sort=-version:refname` เพื่อเรียงตาม version ล่าสุดก่อน
3. ถ้าไม่มี tag → รายงาน "No tags found" และจบ
4. ระบุจำนวน tags ทั้งหมด

### 2. Collect Tag Details

> Goal: รวบรวมข้อมูลเพิ่มเติมของแต่ละ tag
> Goal: มีข้อมูลครบสำหรับรายงาน

1. รัน `git show <tag> --no-patch --format="%H|%ci|%an|%s"` สำหรับแต่ละ tag
2. ระบุ tag type: annotated (มี tagger info) หรือ lightweight
3. รัน `git tag -l --format='%(refname:short) %(objecttype)'` เพื่อดู tag type
4. ตรวจสอบ remote tags ด้วย `git ls-remote --tags origin`

### 3. Analyze Semantic Versioning

> Goal: วิเคราะห์ tags ตาม semantic versioning
> Goal: รู้ versioning status และ patterns

1. ระบุ tags ที่เป็น semantic version (เริ่มด้วย `v` + MAJOR.MINOR.PATCH)
2. ระบุ tags ที่ไม่ใช่ semantic version
3. ระบุ pre-release tags (มี suffix เช่น `-alpha`, `-beta`, `-rc.1`)
4. ระบุ latest stable version และ latest pre-release version
5. ตรวจสอบ version sequence ว่ามี gap หรือไม่

### 4. Format Output

> Goal: จัดรูปแบบผลลัพธ์เป็นตาราง
> Goal: รายงานอ่านง่าย ครบข้อมูล

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Tag ชื่อ tag
   - Type annotated / lightweight
   - Commit SHA แบบสั้น
   - Date วันที่ tag
   - Author ผู้ tag
   - Message commit message แบบสั้น
   - SemVer ✅ / ❌
3. เรียงตาม version ล่าสุดก่อน

## Rules

### Read-Only

- ไม่ create, delete, push tags — ใช้ `/follow-git` สำหรับ tag operations
- ไม่แก้ไข repository state
- รายงานเท่านั้น — read-only operation

### Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- เรียงตาม version ล่าสุดก่อน
- ชี้เน้น latest stable และ latest pre-release
- ใช้ symbols: ✅ SemVer compliant, ❌ non-SemVer

### High Impact Content

- ถ้ามีมากกว่า 50 tags → แสดงเฉพาะ 20 ล่าสุด
- ชี้เน้น tags ที่ไม่ใช่ semantic version
- ชี้เน้น version gaps ที่ขาดหายไป

### Non-Redundancy

- Tag operations อยู่ใน `/follow-git` แล้ว
- GitHub releases อยู่ใน `/list-github-release` แล้ว
- Branch listing อยู่ใน `/list-git-branch` แล้ว

## Expected Outcome

- รายการ tags ทั้งหมดในตารางที่อ่านง่าย
- ข้อมูลครบ: tag name, type, commit, date, author, message, SemVer status
- ชี้เน้น latest stable, latest pre-release และ non-SemVer tags
- ไม่มีการแก้ไข tag ใดๆ — read-only report
