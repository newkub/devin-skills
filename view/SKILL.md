---
name: view
description: ดูไฟล์ใน terminal ด้วย codebase-style headers, line numbers, และ syntax highlighting
argument-hint: "[file-or-pattern]"
allowed-tools:
  - read
  - exec
  - find_file_by_name
  - grep
triggers:
  - user
  - model
related:
  - open-in-explorer
  - open-in-windows-terminal
  - capture-terminal
  - record-video-terminal
---

## Goal

ดูไฟล์ใน terminal ด้วยการจัดรูปแบบแบบ codebase: file-path headers, line numbers, syntax highlighting, และตัวคั่นที่เรียบร้อย

## Scope

ใช้เมื่อผู้ใช้ขอให้ดูไฟล์, ชุดไฟล์, หรือ snippet ของ codebase ใน terminal ด้วย layout ที่อ่านง่ายและเอื้อต่อ code review เหมาะสำหรับ source code, configs, logs, และ markdown

ดูเพิ่มเติม: /open-in-explorer, /open-in-windows-terminal, /capture-terminal, /record-video-terminal

## Execute

### 1. Resolve Targets

> Goal: Resolve Targets

ระบุสิ่งที่จะดู

1. รับ file path, directory, หรือ glob pattern จาก argument หรือ context
2. ใช้ `find_file_by_name` สำหรับ patterns และ `ls` สำหรับ directories
3. ตรวจสอบว่าแต่ละ target มีอยู่และเป็น text file ที่อ่านได้
4. ปฏิเสธ binary หรือ oversized files เว้นแต่ผู้ใช้ขอดูโดยชัดแจ้ง
5. ข้าม paths ภายใน `node_modules`, `.git`, `dist`, และ `coverage`

### 2. Check View Tool

> Goal: Check View Tool

ตรวจสอบว่ามี terminal viewer ใช้งานได้

1. รัน `where bat` หรือ `Get-Command bat` เพื่อตรวจหา `bat`
2. ถ้า `bat` ไม่มี ให้ติดตั้งด้วย `mise use -g bat` หรือ `scoop install bat`
3. ถ้าการติดตั้งล้มเหลว ให้ fallback ไปยัง `Get-Content <file> | ForEach-Object -Begin { $i=1 } { "{0,4} | {1}" -f $i,$_; $i++ }`
4. ใช้ `bat --list-languages` เมื่อการตรวจจับ language ยังไม่แน่ใจ

### 3. View Single File

> Goal: View Single File

แสดงไฟล์เดียวด้วยรูปแบบ codebase

1. คำนวณ project-relative หรือ absolute path สำหรับ header
2. รัน `bat --style=header,numbers,grid --paging=never --color=always "<file>"`
3. ถ้า `bat` ตรวจจับ language ผิด ให้เติม `--language <lang>`
4. ถ้ามี line number ให้ใช้ `bat --highlight-line <n>`
5. ถ้ามี range ให้ใช้ `bat --line-range <start>:<end>`
6. ถ้าไฟล์มีมากกว่า 500 บรรทัด ให้จำกัด output เป็น 200 บรรทัดแรกและถามก่อนแสดงส่วนที่เหลือ

### 4. View Multiple Files

> Goal: View Multiple Files

แสดงหลายไฟล์พร้อมการแยกแต่ละส่วนอย่างชัดเจน

1. ระบุรายการไฟล์ทั้งหมดจาก pattern
2. เรียงลำดับไฟล์ตาม project-relative path
3. รัน `bat --style=header,numbers,grid --paging=never --color=always <file1> <file2> ...`
4. ตรวจสอบว่าแต่ละไฟล์มี header ของตัวเอง
5. ถ้า output รวมเกิน 1000 บรรทัด ให้แสดง index ก่อนแล้วดูไฟล์ทีละไฟล์

### 5. Adjust Output Style

> Goal: Adjust Output Style

ปรับ output ให้เหมาะกับ use case ต่างๆ

1. ใช้ `bat --plain <file>` สำหรับ output ที่คัดลอกได้ง่ายโดยไม่มี line numbers หรือ borders
2. ใช้ `bat --style numbers <file>` เมื่อต้องการ line numbers เท่านั้น
3. ใช้ `bat --theme <name> <file>` เพื่อเปลี่ยน theme
4. ใช้ `bat --paging never` เพื่อปิด pager
5. ใช้ `bat --wrap never` เพื่อปิด line wrapping
6. แสดงรายการ themes ด้วย `bat --list-themes`

### 6. Handle Large And Binary Files

> Goal: Handle Large And Binary Files

จัดการ edge cases อย่างปลอดภัย

1. ตรวจสอบ file type ด้วย `file <file>` ถ้ามีให้ใช้งาน
2. สำหรับ large files ให้ใช้ `bat <file> | less` หรือ `bat --paging never` ถ้าไม่ต้องการ pager
3. สำหรับ binary files ให้เตือนและใช้ `bat --show-all` หรือ `xxd`/`od` เฉพาะเมื่อถูกขอ
4. อย่าใช้ `bat` กับไฟล์ที่มี control characters จำนวนมาก

### 7. Integration And Aliases

> Goal: Integration And Aliases

เพิ่มประสิทธิภาพด้วยการปรับ environment

1. เพิ่ม alias `cat=bat` หรือ `catp=bat --plain` ใน shell
2. ตั้งค่า `BAT_THEME` เป็น default theme
3. ตั้งค่า `BAT_STYLE` เป็น default style
4. ใช้ `bat` ใน scripts สำหรับ file previews แทน `cat` หรือ `type`

## Rules

### 1. Codebase-Style Output

- แสดง file-path header เสมอ
- แสดง line numbers เสมอ เว้นแต่ผู้ใช้ขอ `--plain`
- ใช้ `--style=header,numbers,grid` เป็นค่าเริ่มต้น
- ใช้ `--color=always` เมื่อ terminal รองรับ, ถ้าไม่ใช้ `auto`

### 2. Tooling

- ใช้ `bat` เป็นหลักสำหรับ syntax highlighting และ paging control
- ใช้ `Get-Content` พร้อม custom line-number prefix เฉพาะเมื่อ fallback
- ติดตั้ง `bat` ถ้าขาดหายและ environment อนุญาต

### 3. Scope And Limits

- อย่าดูไฟล์ที่มีมากกว่า 500 บรรทัด ทั้งหมดโดยไม่ได้รับการยืนยัน
- อย่าดู binary files เว้นแต่ถูกขอโดยชัดแจ้ง
- ปฏิเสธ patterns ที่ตรงกับ `node_modules`, `.git`, `dist`, หรือ `coverage`

### 4. Patterns

- รองรับ globs และ directory listings
- เรียงลำดับไฟล์ตาม path เพื่อ output ที่เสถียร
- ถ้ามีหลายไฟล์ตรงกัน ให้แสดง index ก่อนดูเมื่อจำนวนรวมมาก

### 5. Safety

- ตรวจสอบว่าไฟล์มีอยู่ก่อนดู
- เตือนเมื่อดูไฟล์ที่อาจมี secrets
- ไม่เขียนหรือแก้ไขไฟล์ในระหว่างการดู

### 6. Windows Considerations

- ใช้ `where bat` หรือ `Get-Command bat` เพื่อหาตำแหน่ง `bat.exe`
- fallback ไปยัง `type <file>` ถ้า `bat` ไม่ได้ติดตั้ง
- ใส่เครื่องหมายคำพูดให้ path ที่มีช่องว่าง

## Expected Outcome

- ไฟล์ถูกแสดงใน terminal ด้วยการจัดรูปแบบ codebase-style ที่ชัดเจน
- Headers แสดง file path, line numbers ปรากฏอยู่, และ syntax highlighting ถูกต้อง
- Large files และ binary files ถูกจัดการอย่างปลอดภัย
- Fallback ทำงานได้เมื่อ `bat` ไม่ได้ติดตั้ง
- ไม่มี terminal lag หรือ binary garbage
