---
name: save-to-github-gist
description: สร้าง GitHub gist จากไฟล์หรือข้อความที่ระบุ
allowed-tools:
  - exec
  - read
  - write
  - ask_user_question
triggers:
  - user
related:
argument-hint: <file-or-content> [--public|--secret]
---

## Goal

สร้าง GitHub gist ใหม่จากไฟล์หรือข้อความ

## Scope

- ใช้ `gh gist create` เท่านั้น
- รองรับ public และ secret gists
- รองรับทั้งไฟล์และ stdin

## Execute

### 1. Prepare Gist Content
> Goal: มีเนื้อหาที่จะบันทึกลง gist

1. ตรวจสอบ `gh auth status` ถ้าไม่ login ให้หยุดและแจ้งให้ทำ `gh auth login`
2. รับ input จาก argument (file path หรือ content)
3. ถ้า input เป็น file path ให้อ่านเนื้อหา
4. ถ้าไม่มี input ให้ถาม user
5. รับ `--public` หรือ `--secret` จาก argument (ค่าเริ่มต้น `--secret`)
6. รับ description จาก argument หรือถาม user

### 2. Create Gist
> Goal: gist ถูกสร้างบน GitHub

1. กำหนด visibility: ใช้ `--public` ถ้า public; ถ้า secret ไม่ต้องใส่ flag (ค่าเริ่มต้นของ `gh`)
2. ถ้าเป็นไฟล์: `gh gist create <file1> <file2> --desc "<description>"` แล้วเพิ่ม `--public` ถ้าเลือก public
3. ถ้าเป็น content จาก stdin: `printf "%s" "<content>" | gh gist create - --filename "<name>" --desc "<description>"` แล้วเพิ่ม `--public` ถ้าเลือก public
4. บันทึก URL จาก output

### 3. Open And Report
> Goal: แสดงผล gist URL

1. รับ URL จาก output หรือ `gh gist view <gist-id> --json url --jq .url`
2. ทำ `/open-web` หรือ `start <url>`
3. รายงาน URL และ visibility

## Rules

### 1. Visibility

- ค่าเริ่มต้นเป็น secret ไม่ต้องใส่ flag ของ `gh`
- รับ `--public` จาก argument ถ้าต้องการ gist public
- ถ้าไม่ระบุให้ถาม user
- ไม่ส่ง `--secret` ให้ `gh gist create` เพราะไม่ใช่ flag ที่ถูกต้อง

### 2. Input Handling

- ถ้า argument ตรงกับ file path ที่มีอยู่ ให้อ่านไฟล์
- ถ้าไม่ตรง file path ให้ถือเป็นข้อความ
- รองรับหลายไฟล์โดยแยกด้วย space

### 3. Safety

- ไม่บันทึกไฟล์ที่มี secrets หรือ credentials
- ตรวจสอบเนื้อหาก่อน gist
- ถ้าไฟล์ใหญ่เกิน 10 MB ให้แจ้ง user

## Expected Outcome

- Gist ถูกสร้างบน GitHub
- ได้รับ URL ที่ถูกต้อง
- Visibility ตรงกับที่ระบุ
