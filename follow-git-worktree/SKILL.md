---
name: follow-git-worktree
description: จัดการ git worktrees เพื่อทำงานหลาย branches พร้อมกันโดยไม่ต้อง clone repository หลายครั้ง
---

## Goal

จัดการ git worktrees เพื่อทำงานหลาย branches พร้อมกันใน working directories แยกกัน โดยใช้ repository เดียวกัน

## Scope

ใช้สำหรับ project ที่ต้องการทำงานหลาย branches พร้อมกัน

## Execute

### 1. List Worktrees

แสดงรายการ worktrees ทั้งหมด

1. รัน `git worktree list` เพื่อดู worktrees ทั้งหมด
2. ตรวจสอบ path ของแต่ละ worktree
3. ตรวจสอบ branch และ commit ของแต่ละ worktree
4. ตรวจสอบว่า worktree ไหนเป็น main worktree

### 2. Add New Worktree

สร้าง worktree ใหม่

1. รัน `git worktree add <path> <branch>` เพื่อสร้าง worktree ใหม่
2. ระบุ branch ที่ต้องการ checkout หรือใช้ commit hash
3. ใช้ `-b <new-branch>` เพื่อสร้าง branch ใหม่จาก current HEAD
4. ตรวจสอบว่า path ที่ระบุยังไม่มีอยู่

### 3. Remove Worktree

ลบ worktree

1. รัน `git worktree remove <path>` เพื่อลบ worktree
2. ใช้ `git worktree remove <path> --force` เพื่อลบแม้มี uncommitted changes
3. ตรวจสอบว่าไม่ได้ลบ main worktree
4. ตรวจสอบว่า path ที่ระบุเป็น worktree ที่มีอยู่จริง

### 4. Prune Worktrees

ลบ worktrees ที่ไม่มีการใช้งาน

1. รัน `git worktree prune` เพื่อลบ worktrees ที่ถูกลบจาก filesystem
2. Git จะตรวจสอบและลบ worktrees ที่ไม่มี directory
3. ใช้ `--dry-run` เพื่อดูว่าจะลบอะไรก่อนลบจริง
4. รัน prune อย่างสม่ำเสมอเพื่อรักษาความสะอาด

### 5. Move Worktree

ย้าย worktree ไปยัง path ใหม่

1. รัน `git worktree move <old-path> <new-path>` เพื่อย้าย worktree
2. ตรวจสอบว่า new path ยังไม่มีอยู่
3. ตรวจสอบว่า old path เป็น worktree ที่มีอยู่จริง
4. ตรวจสอบว่าไม่มี uncommitted changes ก่อนย้าย

### 6. Lock Worktree

ล็อก worktree เพื่อป้องกันการลบ

1. รัน `git worktree lock <path>` เพื่อล็อก worktree
2. ใช้ `--reason <reason>` เพื่อระบุเหตุผลในการล็อก
3. รัน `git worktree unlock <path>` เพื่อปลดล็อก worktree
4. ตรวจสอบสถานะการล็อกด้วย `git worktree list`

## Rules

### 1. Worktree Path Rules

เลือก path สำหรับ worktrees อย่างเหมาะสม

1. ใช้ path ที่ชัดเจนและเข้าใจง่ายสำหรับแต่ละ worktree
2. จัดเก็บ worktrees ใน directory แยกจาก main repository
3. ใช้ชื่อที่สื่อความหมายเช่น feature-name, bugfix-123
4. หลีกเลี่ยง path ที่ซับซ้อนหรือซ้อนทับกับ main repository

### 2. Worktree Cleanup Rules

ทำความสะอาด worktrees อย่างสม่ำเสมอ

1. ลบ worktrees ที่ไม่ได้ใช้งานหลังจากเสร็จงาน
2. รัน `git worktree prune` อย่างสม่ำเสมอ
3. ตรวจสอบ worktrees ที่ไม่ได้ใช้งานเกิน 7 วัน
4. ล็อก worktrees ที่ต้องการรักษาไว้ชั่วคราว

### 3. Worktree Switching Rules

สลับระหว่าง worktrees อย่างปลอดภัย

1. ตรวจสอบว่าไม่มี uncommitted changes ก่อนสลับ
2. ใช้ `cd` เพื่อเปลี่ยน directory ไปยัง worktree ที่ต้องการ
3. ตรวจสอบ branch และ status ของ worktree ปัจจุบัน
4. ระมัดระวังกับ changes ที่เกิดขึ้นในหลาย worktrees

### 4. Worktree Commit Rules

จัดการ commits ใน worktrees

1. Commit changes ใน worktree ที่สร้างมาจาก branch นั้น
2. ใช้ `git push` จาก worktree ที่เหมาะสม
3. ตรวจสอบว่า commits ถูก push ไปยัง remote ที่ถูกต้อง
4. ระมัดระวังกับ conflicts ที่อาจเกิดขึ้นระหว่าง worktrees

### 5. Worktree Branch Rules

จัดการ branches ใน worktrees

1. แต่ละ worktree ควรอยู่ใน branch ที่แตกต่างกัน
2. หลีกเลี่ยงการ checkout branch เดียวกันในหลาย worktrees
3. ใช้ worktrees สำหรับ features หรือ bugfixes ที่แยกกัน
4. ลบ worktrees หลังจาก merge branch เข้ากับ main branch

## Expected Outcome

- สามารถทำงานหลาย branches พร้อมกัน
- แต่ละ worktree แยกกันชัดเจน
- ไม่ต้อง clone repository หลายครั้ง
- worktrees ถูกทำความสะอาดหลังใช้งาน
