---
name: ship-repo
description: Ship ทุก workspace ใน repo และ update-project ที่ root
---

## Goal

Ship ทุก workspace ใน repo โดยเรียก `ship-workspace` ทุกตัว แล้วทำ `update-project` ที่ root เพื่อรวมข้อมูลและ commit

## Scope

ใช้เมื่อต้องการ ship ทุก workspace ใน repo พร้อมกัน ไม่รวม push หรือ release ใช้กับ monorepo หรือ repo ที่มีหลาย workspace

## Execute

### 1. Discover Workspaces

> Goal: ระบุทุก workspace ใน repo

1. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
2. ทำ `/all-workspaces` เพื่อระบุทุก workspace
3. ถ้าไม่ใช่ monorepo → ใช้ `/ship-workspace` แทน
4. จัดรายการ workspaces ตาม dependency order (foundation ก่อน)

### 2. Ship Each Workspace

> Goal: ship ทุก workspace ตามลำดับ dependency

1. สำหรับแต่ละ workspace ตามลำดับ:
   - เข้า workspace directory
   - ทำ `/ship-workspace` เพื่อ update, verify, commit
   - ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)
2. บันทึก commit hash ของแต่ละ workspace
3. ถ้า workspace มี submodule → ทำ `/ship-skills` สำหรับ submodules

### 3. Update Project At Root

> Goal: root repo อัปเดตข้อมูลจากทุก workspace

1. กลับมาที่ root repo
2. ทำ `/update-project` เพื่อเช็ค git log ล่าสุดและ restore ข้อมูล
3. ทำ `/update-agents-md` เพื่ออัปเดต root `AGENTS.md`
4. ตรวจว่า root docs สะท้อนการเปลี่ยนแปลงของทุก workspace

### 4. Validate And Commit Root

> Goal: root repo ผ่าน validation และ commit

1. ทำ `/validate` เพื่อตรวจ root structure และ references
2. ทำ `/git-commit` ที่ root พร้อมสรุป workspace commits
3. ถ้า commit ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)

### 5. Report

> Goal: รายงานผล ship-repo

1. ทำ `/report` พร้อม `/report-table` สรุป:
   - แต่ละ workspace commit hash
   - Root commit hash
   - สิ่งที่เปลี่ยนแปลง
2. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. Dependency Order

- ship workspace ตามลำดับ dependency (foundation ก่อน)
- ถ้า workspace A พึ่ง workspace B → ship B ก่อน A
- ถ้า workspace มี submodule → ใช้ `/ship-skills` สำหรับ submodules

### 2. No Push Or Release

- `ship-repo` ไม่ทำ push หรือ release
- ถ้า user ต้องการ push → รัน `git push` ด้วย `exec` หลัง `/ship-repo`
- ไม่ถาม user ว่าจะ push/release หรือไม่

### 3. Update Project Last

- ทำ `/update-project` หลัง ship ทุก workspace เสร็จ
- root commit ต้องรวมการเปลี่ยนแปลงของ root docs ด้วย

## Expected Outcome

- ทุก workspace ผ่าน `/ship-workspace` และ commit สำเร็จ
- Root repo ผ่าน `/update-project` และ `/update-agents-md`
- Root commit สำเร็จ พร้อมสรุป workspace commits
- รายงานผลลัพธ์ครบถ้วน
