---
name: follow-template-starter
description: ใช้ templates จาก template-starter repository ด้วย degit
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

ใช้ templates จาก `https://github.com/newkub/template-starter` ด้วย `bunx degit` หรือ tools อื่นๆ

## Scope

ใช้สำหรับ clone templates จาก `https://github.com/newkub/template-starter/tree/main/templates` มาใช้ใน project ปัจจุบัน

## Execute

### 1. Check Repository
> Goal: Check Repository

ตรวจสอบ repository และ templates ที่มี

1. ตรวจสอบ repository ด้วย `gh repo view newkub/template-starter`
2. ดู templates ที่มีใน `templates/` directory
3. ตรวจสอบ template structure และ dependencies
4. ตรวจสอบ README ของแต่ละ template

### 2. Clone Template With Degit
> Goal: Clone Template With Degit

Clone template ด้วย `bunx degit`

1. ใช้ `bunx degit newkub/template-starter/templates/<template-name> <target-dir>`
2. ใช้ `--mode=git` ถ้าต้องการ preserve git history
3. ใช้ `--filter` สำหรับ filter files ที่ไม่ต้องการ
4. ตรวจสอบ cloned files ว่าครบถ้วน

### 3. Setup Template
> Goal: Setup Template

ตั้งค่า template หลัง clone

1. อ่าน `README.md` ของ template สำหรับ setup instructions
2. รัน `bun install` สำหรับ install dependencies
3. ตั้งค่า environment variables ตาม template requirements
4. รัน setup scripts ถ้ามี (เช่น `bun run setup`)

### 4. Verify Template
> Goal: Verify Template

ตรวจสอบว่า template ทำงานได้

1. รัน `bun run dev` สำหรับ start development server
2. ตรวจสอบ build ด้วย `bun run build`
3. ตรวจสอบ tests ด้วย `bun run test`
4. ตรวจสอบ lint ด้วย `bun run lint`

## Rules

### 1. Tool Selection

เลือก tool ที่เหมาะสมสำหรับ clone templates

- ใช้ `bunx degit` สำหรับ clone ไม่รวม git history (default)
- ใช้ `bunx degit --mode=git` สำหรับ clone รวม git history
- ใช้ `git clone` ถ้าต้องการ full repository รวม history
- ใช้ `gh repo clone` ถ้าต้องการ clone ด้วย GitHub CLI
- ใช้ `degit` สำหรับ lightweight clone ไม่รวม `.git`

### 2. Template Validation

ตรวจสอบ template ก่อนใช้งาน

- ตรวจสอบ template name ว่ามีอยู่จริงใน `templates/` directory
- ตรวจสอบ template dependencies ใน `package.json`
- ตรวจสอบ template README สำหรับ setup instructions
- ตรวจสอบ template compatibility กับ current environment
- ตรวจสอบ template version และ updates

### 3. Path Handling

จัดการ paths อย่างถูกต้อง

- ใช้ absolute paths สำหรับ target directory
- ตรวจสอบว่า target directory ไม่มีไฟล์สำคัญอยู่แล้ว
- ใช้ `--force` flag กับ degit ถ้าต้องการ overwrite
- Backup existing files ก่อน clone ถ้าจำเป็น
- ใช้ meaningful directory names สำหรับ templates

### 4. Dependency Management

จัดการ dependencies หลัง clone

- รัน `bun install` หลัง clone template
- ตรวจสอบ `package.json` สำหรับ scripts ที่จำเป็น
- ตรวจสอบ environment variables ที่ template ต้องการ
- ตรวจสอบ peer dependencies และ conflicts
- รัน `bunx bun-upgrade` สำหรับ update dependencies ถ้าจำเป็น

### 5. Error Handling

จัดการ errors จาก cloning process

- ตรวจสอบ internet connection ก่อน clone
- จัดการ authentication errors ถ้า repository เป็น private
- จัดการ permission errors สำหรับ target directory
- จัดการ template not found errors
- ตรวจสอบ disk space ก่อน clone

## Expected Outcome

- Template จาก `template-starter` ถูก clone มาใช้งานได้
- Dependencies ถูกติดตั้งครบถ้วน
- Template ทำงานได้ตามที่คาดหวัง
- Development server สามารถ start ได้
- Build และ test ผ่านทั้งหมด

## Common Mistakes

ข้อผิดพลาดที่พบบ่อย:

- ไม่ตรวจสอบ template name ว่าถูกต้อง
- Clone ไปยัง directory ที่มีไฟล์สำคัญอยู่แล้ว
- ไม่รัน `bun install` หลัง clone
- ไม่อ่าน README ของ template ก่อน setup
- ใช้ `git clone` แทน `degit` เมื่อไม่จำเป็นต้องการ history
