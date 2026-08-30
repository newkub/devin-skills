---
name: update-everythink-in-computer
description: "อัปเดตทุกอย่างในเครื่อง: programs, chezmoi dotfiles, devin global skills"
related:
  - update-all-program-in-computer
  - update-chezmoi
  - update-all-devin-global-skills
  - update-version-latest
  - follow-my-package-manager
  - follow-my-global-cli
  - update-project-skills
---

## Goal

อัปเดตทุกอย่างในเครื่องทีจำเป็นสำหรับ development environment: global programs, active project versions, chezmoi dotfiles, Devin global skills

## Scope

ใช้เมื่อต้องการ sync/อัปเดต state ทั้งหมดของ computer รวม package managers, active project versioned surfaces, dotfiles, skills

## Execute

### 1. Update Programs

> Goal: อัปเดต programs ทั้งหมด

1. ทำ `/update-all-program-in-computer`
2. บันทึก programs ที update สำเร็จ/ล้มเหลว
3. ถ้ามี programs ทีล้าสมัยมาก → ทำ `/follow-my-global-cli`

### 2. Update Active Project Versions

> Goal: อัปเดต project ที่กำลังทำงานอยู่ให้ทันสมัย

1. ถ้ามี project active และ user ต้องการ update ทุก version → ทำ `/update-version-latest`
2. บันทึก runtimes/dependencies/tools ที่อัปเดต
3. ถ้าไม่มี project active → skip

### 3. Update Dotfiles

> Goal: อัปเดต chezmoi dotfiles

1. ถ้ามี chezmoi → ทำ `/update-chezmoi`
2. ถ้าไม่มี chezmoi → skip หรือแนะนำ user
3. บันทึก files ที readd/apply

### 4. Update Devin Global Skills

> Goal: อัปเดต Devin skills catalog

1. ทำ `/update-all-devin-global-skills`
2. บันทึก skills ที update/สร้าง/ลบ

### 5. Update Project Skills (optional)

> Goal: sync project-specific skills

1. ถ้ามี project active → ทำ `/update-project-skills`
2. ถ้ามี workspace หลายอัน → ทำ `/report-workspace-graph` ก่อน
3. บันทึก project skills ทีอัปเดต

### 6. Verify And Report

> Goal: ตรวจสอบและสรุป

1. ใช้ `/report-table` คอลัมน์: Category, Skill, Status, Notes
2. ตรวจสอบว่าไม่มี errors ค้าง
3. ทำ `/deep-validate` สำหรับ skills ทีเปลี่ยนแปลง
4. ทำ `/suggest-next-action`

## Rules

### 1. Order Matters

- อัปเดต programs ก่อน active project/dotfiles/skill เพราะบาง skill อาจต้องใช้ tools ใหม่
- ไม่ข้าม step โดยไม่มีเหตุผล
- ถ้า step หนึ่งล้มเหลว → report ก่อนดำเนินต่อ

### 2. No Forced Updates

- ถ้า program หรือ dotfile มีความเสี่ยง → ถาม user
- ไม่ upgrade ทุกอย่างโดยไม่ได้รับ approval
- สามารถ skip บาง step ถ้า user ระบุ

### 3. Safety

- ไม่ลบ skills หรือ dotfiles โดยไม่มี dry run
- ตรวจ `git status` หลัง update skills
- ใช้ `/ship` หรือ `/git-commit` เมื่อจบ

### 4. Report Everything

- รายงานทุก category
- ระบุ successes, failures, skipped
- เก็บ log ของ commands

- ใช้ /follow-my-package-manager ถ้าจำเป็น

## Expected Outcome

- Programs ทั้งหมดอัปเดตแล้ว
- chezmoi dotfiles sync
- Devin global skills อัปเดตและสอดคล้องกับ active repos
- รายงานครบทุก category พร้อม next action
