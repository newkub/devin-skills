---
name: copy-skills-global-to-project-readonly
description: คัดลอก global skills ไปยัง project ในโหมด read-only โดยไม่กระทบ source จริง
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

คัดลอก global skills directory ไปยัง project `.devin/skills` ในโหมด read-only เพื่อให้ project ดู skill ได้ แต่ไม่สามารถแก้ไข source ของ global skills โดยบังเอิญ

## Scope

- ใช้บน Windows, macOS, Linux
- คัดลอกด้วย Bun script หรือ native commands (`robocopy` / `rsync` / `cp`)
- ตั้งค่า read-only บน copy เท่านั้น ไม่กระทบ global source
- ไม่ใช้ symlink/junction เพราะไม่อาจทำให้ปลายทาง read-only โดยไม่กระทบ source
- รวม dry run, backup, validation

## Execute

### 1. Prepare Context

> Goal: ระบุ source, target, และสภาพปัจจุบัน

1. หา global skills directory:
   - Windows: `%APPDATA%\devin\skills` หรือ `%LOCALAPPDATA%\devin\skills`
   - macOS/Linux: `~/.config/devin/skills/` หรือ `~/.devin/skills/`
2. หา project directory จาก cwd หรือ argument
3. ตรวจสอบว่า source และ target มีอยู่จริง
4. ถ้า global skills directory หาไม่เจอ → stop และ report

### 2. Check Target And Backup

> Goal: ไม่ทำลาย existing `.devin/skills` ของ project

1. ถ้า `project/.devin/skills` มีอยู่:
   - ถ้าเป็น directory ปกติ → backup เป็น `.devin/skills.bak.<timestamp>`
   - ถ้าเป็น symlink/junction → stop และ report เพราะอาจกระทบ source
2. ถ้าไม่มี → สร้าง `.devin/skills` เปล่า
3. ถ้าจะ overwrite ข้อมูลสำคัญ → ขอ user confirmation ก่อน

### 3. Dry Run

> Goal: แสดงรายการที่จะ copy ก่อนลงมือ

1. สร้าง list ของ global skill directories/files ที่จะ copy
2. แสดงจำนวน files, directories, และขนาดโดยประมาณ
3. ถ้าผู้ใช้ไม่ confirm → stop

### 4. Copy

> Goal: คัดลอก global skills ไปยัง project โดยสร้างของใหม่ (ไม่ใช่ link)

1. เลือกวิธีตาม platform:
   - Windows: `robocopy <source> <target> /MIR /COPY:DAT`
   - macOS/Linux: `rsync -a --delete <source>/ <target>/` หรือ `cp -rT`
   - Bun script: ใช้ `Bun.Glob` + `Bun.file` + `Bun.write` สำหรับ copy แบบ cross-platform
2. ตรวจสอบว่า target ไม่ใช่ symlink/junction หลัง copy
3. ถ้า copy fail → restore from backup และ report

### 5. Set Read-Only

> Goal: target เป็น read-only เพื่อป้องกันการแก้ไข

1. Windows:
   - `attrib +R /S /D <target>\*` สำหรับ files
   - หรือ `icacls <target> /T /deny <username>:(W)` สำหรับ files เฉพาะ (ระวังผลข้างเคียง)
2. macOS/Linux:
   - `chmod -R a-w <target>` สำหรับ files
   - หรือ `find <target> -type f -exec chmod a-w {} +`
3. ไม่เปลี่ยน permission ของ source

### 6. Validate

> Goal: ตรวจสอบว่า target ถูกต้องและ read-only จริง

1. นับ files และ directories ใน target เทียบกับ source
2. ลองเขียนไฟล์ชั่วคราวใน target → ต้องถูกปฏิเสธ (read-only)
3. ตรวจสอบว่า target ไม่มี symlink/junction
4. ถ้า validation ไม่ผ่าน → restore backup, report

### 7. Update References

> Goal: อัปเดต references ที่เกี่ยวข้อง

1. ทำ `/update-reference` สำหรับ skills ที่อ้างอิงถึง `.devin/skills`
2. อัปเดต `.gitignore` หรือ `.devinignore` ถ้าจำเป็น (ดู `/follow-gitignore`)

## Rules

### 1. Safety

- ทำ dry run ก่อน copy
- backup existing `.devin/skills` ก่อน overwrite
- ไม่ลบ/แก้ไข source โดยเด็ดขาด
- ขอ user confirmation ก่อน destructive action

### 2. No Symlink

- ห้ามใช้ `mklink`, `ln -s`, junction, หรือ hard link
- target ต้องเป็น files/directories จริง (reparse point ไม่ผ่าน)

### 3. Read-Only Target Only

- ตั้ง read-only บน target copy เท่านั้น
- ไม่เปลี่ยน permission ของ global skills source
- ถ้าใช้ `icacls` หรือ `chmod` ระบุ username/scope ชัดเจน

### 4. Idempotent

- รันซ้ำได้ โดย backup เดิมถูกแทนที่ทั้งหมด
- ไม่สร้าง duplicate backups โดยไม่จำเป็น

### 5. Validation Before Report

- ต้องผ่าน dry run, copy, และ read-only test ก่อน report success
- ถ้า fail ต้อง restore และ report สถานะจริง

## Expected Outcome

- `project/.devin/skills` เป็น copy ของ global skills ทั้งหมด
- Files ใน target เป็น read-only
- Global skills source ยัง writable เหมือนเดิม
- ไม่มี symlink/junction ใน target
- มี report สรุป files copied, backup path, และ validation result
