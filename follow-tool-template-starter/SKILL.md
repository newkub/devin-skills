---
name: follow-tool-template-starter
description: ใช้ templates จาก template-starter repository ด้วย degit
related:
  - follow-tool-git
  - follow-package-manifest
  - follow-lang-typescript
  - follow-tool-vite
---

## Goal

ใช้ templates จาก `newkub/template-starter` repository ด้วย `degit` หรือ `git clone` เพื่อเริ่ม project

## Scope

ใช้สำหรับ clone templates จาก `https://github.com/newkub/template-starter/tree/main/templates` มายัง project ปัจจุบัน

## Execute

### 1. Discover Templates

> Goal: ค้นหาและเลือก template ทีเหมาะสม

1. รัน `gh repo view newkub/template-starter` เพื่อดู repository
2. ดู templates ที่มีใน `templates/` directory
3. ตรวจสอบ README ของแต่ละ template
4. เลือก template ตาม stack ทีต้องการ

### 2. Clone Template

> Goal: clone template ด้วย degit โดยไม่รวม git history

1. ใช้ `bunx degit newkub/template-starter/templates/<template-name> <target-dir>`
2. ใช้ `--mode=git` ถ้าต้องการ preserve git history
3. ใช้ `--files` เพื่อ clone เฉพาะไฟล์ทีต้องการ
4. ใช้ `--force` ด้วยความระมัดระวังถ้า target directory ไม่ว่าง
5. ดูรายละเอียด degit ใน [references/degit.md](references/degit.md)

### 3. Setup Cloned Template

> Goal: ตั้งค่า template หลัง clone

1. อ่าน `README.md` ของ template
2. รัน `bun install` เพื่อ install dependencies
3. ตั้งค่า environment variables ตาม template
4. รัน setup scripts ถ้ามี เช่น `bun run setup`
5. ตรวจสอบ `package.json` scripts

### 4. Verify Template

> Goal: ตรวจสอบว่า template ทำงานได้

1. รัน `bun run dev` เพื่อ start development server
2. รัน `bun run build` เพื่อตรวจสอบ build
3. รัน `bun run test` ถ้ามี
4. รัน `bun run lint` ถ้ามี

### 5. Initialize Git and Customize

> Goal: แปลง template ไปยัง project ของตัวเอง

1. ลบ `.git` ของ template ถ้าใช้ degit จะไม่มี
2. ทำ `/follow-tool-git` เพื่อ init repository
3. แก้ไขชื่อ project, package name, README
4. อัปเดต dependencies ถ้าจำเป็น

## Rules

### 1. Tool Selection

- ใช้ `bunx degit` เป็นหลักสำหรับ lightweight clone
- ใช้ `git clone` ถ้าต้องการ full history
- ใช้ `gh repo clone` ถ้าใช้ GitHub CLI

### 2. Safety

- ตรวจสอบ template name ก่อน clone
- backup ไฟล์สำคัญก่อน clone ถ้า target ไม่ว่าง
- ใช้ `--force` เฉพาะเมื่อแน่ใจว่าจะ overwrite

### 3. Validation

- ตรวจสอบ `package.json` และ dependencies
- รัน `bun run dev`, `bun run build`, `bun run test`
- อ่าน README ของ template ก่อน setup

### 4. Customization

- แก้ไข project metadata หลัง clone
- ลบไฟล์ที่ไม่จำเป็น
- commit หลัง setup เสร็จ

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Template ถูก clone มาใช้งาน
- Dependencies ติดตั้งครบถ้วน
- Template รัน dev, build, test ผ่าน
- Project ถูก init และพร้อมพัฒนาต่อ
