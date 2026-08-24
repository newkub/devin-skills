---
name: create-git-worktree
description: สร้าง git worktree ใน worktree/ ของ project เพื่อทำงานหลาย branches พร้อมกัน
---

## Goal

สร้าง git worktree ใน directory `worktree/` ของ project เพื่อทำงานหลาย branches พร้อมกันโดยไม่ต้อง clone repository หลายครั้ง

## Scope

สร้าง worktree ใน `worktree/` ของ project root สำหรับ branch ที่ต้องการทำงาน

## Execute

### 1. Prepare Worktree Directory
> Goal: Prepare Worktree Directory

1. ตรวจสอบว่า `worktree/` directory มีอยู่ใน project root
2. ถ้าไม่มีให้สร้าง `worktree/` directory
3. ตรวจสอบว่า `worktree/` ไม่ได้อยู่ใน `.gitignore`

### 2. Check Current Branch
> Goal: Check Current Branch

1. รัน `git branch --show-current` เพื่อดู branch ปัจจุบัน
2. รัน `git status` เพื่อตรวจสอบ working tree clean
3. ถ้ามี uncommitted changes ให้ commit หรือ stash ก่อน

### 3. Create Worktree
> Goal: Create Worktree

1. รัน `git worktree add worktree/<branch-name> -b <branch-name>` เพื่อสร้าง worktree พร้อม branch ใหม่เสมอ
2. ตรวจสอบว่า worktree ถูกสร้างด้วย `git worktree list`
3. รัน `cd worktree/<branch-name>` เพื่อเข้าไปทำงานใน worktree

### 4. Verify Worktree
> Goal: Verify Worktree

1. ตรวจสอบว่า worktree directory มีไฟล์ครบถ้วน
2. รัน `git status` ใน worktree เพื่อตรวจสอบ branch ถูกต้อง
3. ตรวจสอบว่าสามารถทำงานได้ปกติใน worktree

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Worktree Directory Structure

- เก็บ worktrees ใน `worktree/` directory ของ project root
- ใช้ชื่อ directory ตรงกับ branch name
- หลีกเลี่ยงชื่อที่ซับซ้อนหรือมี spaces

### 2. Branch Naming

- ใช้ branch name ที่สื่อความหมาย (feature/, bugfix/, hotfix/)
- สร้าง branch ใหม่เสมอด้วย `-b` flag
- ตรวจสอบว่า branch name ไม่ซ้ำกับ branch ที่มีอยู่แล้ว

### 3. Working Tree Clean

- ต้อง commit หรือ stash uncommitted changes ก่อนสร้าง worktree
- ตรวจสอบ working tree clean ก่อนสร้าง worktree
- ห้ามสร้าง worktree ขณะมี uncommitted changes

### 4. Worktree Management

- ลบ worktree หลังจากเสร็จงานด้วย `git worktree remove worktree/<branch-name>`
- รัน `git worktree prune` อย่างสม่ำเสมอเพื่อลบ worktrees ที่ไม่มี directory
- หลีกเลี่ยงการสร้าง worktree จำนวนมากโดยไม่จำเป็น

## Expected Outcome

- Worktree ถูกสร้างใน `worktree/` directory ของ project
- Worktree อยู่ใน branch ที่ต้องการและพร้อมทำงาน
- สามารถทำงานหลาย branches พร้อมกันโดยไม่ต้อง clone repository หลายครั้ง
