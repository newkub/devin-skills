---
name: follow-git-tags
description: จัดการ git tags สำหรับ semantic versioning, release tagging และ annotated tags
---

## Goal

จัดการ git tags อย่างเป็นระบบสำหรับ release versioning และ marking important commits

## Scope

ครอบคลุม git tag operations: create, list, delete, push tags และ semantic versioning

## Execute

### 1. List Tags

1. รัน `git tag` เพื่อดู tags ทั้งหมด
2. รัน `git tag -l "v*"` เพื่อกรอง tags ตาม pattern
3. รัน `git show <tag>` เพื่อดูรายละเอียดของ tag

### 2. Create Tag

1. ใช้ `git tag -a v1.0.0 -m "Release v1.0.0"` สำหรับ annotated tag (แนะนำ)
2. ใช้ `git tag v1.0.0` สำหรับ lightweight tag (ใช้กับ temp tags เท่านั้น)
3. ใช้ `git tag -a v1.0.0 <commit-hash>` เพื่อ tag commit เฉพาะ
4. ตรวจสอบว่า tag ถูกสร้างด้วย `git tag -l "v1.0.0"`

### 3. Push Tags

1. รัน `git push origin <tag-name>` เพื่อ push tag เฉพาะ
2. รัน `git push origin --tags` เพื่อ push tags ทั้งหมด
3. ตรวจสอบว่า tag ปรากฏบน remote

### 4. Delete Tag

1. รัน `git tag -d <tag-name>` เพื่อลบ tag ในเครื่อง
2. รัน `git push origin --delete <tag-name>` เพื่อลบ tag บน remote
3. ตรวจสอบว่า tag ถูกลบแล้ว

### 5. Semantic Versioning

1. ใช้ format `vMAJOR.MINOR.PATCH` เช่น `v1.2.3`
2. MAJOR: breaking changes
3. MINOR: new features ที่ backward compatible
4. PATCH: bug fixes ที่ backward compatible
5. ใช้ pre-release tags เช่น `v1.0.0-alpha`, `v1.0.0-beta`, `v1.0.0-rc.1`

## Rules

### 1. Tag Naming

- ใช้ `v` prefix เสมอ เช่น `v1.0.0`
- ใช้ semantic versioning (MAJOR.MINOR.PATCH)
- ห้ามใช้ tag ที่ไม่สื่อความหมาย เช่น `final`, `latest`
- ใช้ pre-release suffix สำหรับ unreleased versions

### 2. Annotated Over Lightweight

- ใช้ annotated tags (`-a`) สำหรับ releases เสมอ
- ใช้ lightweight tags เฉพาะสำหรับ temporary marking
- Annotated tags เก็บ metadata: author, date, message
- ใช้ `-m` เพื่อระบุ message ที่สื่อความหมาย

### 3. Tag Safety

- ห้าม move หรือ re-tag ที่มีอยู่แล้ว
- ถ้าจำเป็นต้อง re-tag ให้ลบ tag เดิมก่อน
- ตรวจสอบว่า tag ไม่ซ้ำกับที่มีอยู่
- Push tags ไปยัง remote ทุกครั้งหลังสร้าง

### 4. Non-Redundancy

- รายละเอียด release process อยู่ใน `/run-release` แล้ว
- รายละเอียด commit format อยู่ใน `/git-commit` แล้ว

## Expected Outcome

- Tags จัดการเป็นระบบ ใช้ semantic versioning
- Releases มี annotated tags พร้อม metadata
- ไม่มี stale หรือ duplicate tags
