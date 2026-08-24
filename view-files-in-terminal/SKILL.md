---
name: view-files-in-terminal
description: แสดงเนื้อหาไฟล์ใน terminal ด้วย bat พร้อม syntax highlighting
---

## Goal

แสดงเนื้อหาไฟล์ใน terminal ด้วย `bat` เพื่อ syntax highlighting, line numbers, และ theme support

## Scope

ใช้สำหรับอ่าน source code, config files, log files, และ text files ทั่วไปใน terminal แทน `cat` หรือ `type`

## Execute

### 1. Check Bat Installation

> Goal: ตรวจสอบว่า `bat` ติดตั้งแล้ว
> Goal: ใช้ `bat` ได้หรือ fallback ถูกต้อง

1. รัน `where bat` หรือ `Get-Command bat`
2. ถ้าไม่พบ ให้ติดตั้งด้วย `mise use -g bat` หรือ `scoop install bat`
3. ถ้าไม่สามารถติดตั้งได้ ให้ fallback ไปยัง `cat` (Unix) หรือ `type` (Windows)

### 2. View Single File

> Goal: แสดงไฟล์เดียวด้วย `bat`
> Goal: ดูเนื้อหาไฟล์แบบ highlight

1. รัน `bat <file>`
2. ตรวจสอบว่า syntax highlighting ถูกต้องตาม file extension
3. ถ้า bat เลือกภาษาผิด ให้ใช้ `bat --language <lang> <file>`
4. ใช้ `bat --list-languages` เพื่อดูภาษาทีรองรับ

### 3. View Multiple Files

> Goal: แสดงหลายไฟล์พร้อมกัน
> Goal: เปรียบเทียบหรืออ่านหลายไฟล์ต่อเนื่อง

1. รัน `bat <file1> <file2> <file3>`
2. ตรวจสอบว่าไฟล์แต่ละอันแสดง header แยกกัน
3. ถ้าต้องการ suppress headers ให้ใช้ `bat --style plain <files>`
4. ถ้าต้องการแสดงเฉพาะบางบรรทัด ให้ใช้ `bat --highlight-line <n>`

### 4. Adjust Output Style

> Goal: ปรับ style ของ output ให้เหมาะสม
> Goal: output อ่านง่ายและ copy ได้

1. ใช้ `bat --plain <file>` เพื่อ output แบบไม่มี line numbers หรือ borders
2. ใช้ `bat --style numbers <file>` เพื่อแสดง line numbers เท่านั้น
3. ใช้ `bat --theme <name> <file>` เพื่อเปลี่ยน theme
4. ใช้ `bat --list-themes` เพื่อดู themes ทีมี

### 5. Handle Large And Binary Files

> Goal: จัดการไฟล์ขนาดใหญ่หรือ binary
> Goal: ไม่ทำ terminal lag หรือแสดง binary garbage

1. ตรวจสอบ file type ก่อนด้วย `file <file>` ถ้ามี
2. ถ้าไฟล์ใหญ่เกินไป ให้ใช้ `bat <file> | less` หรือ `bat --paging never` ถ้าไม่ต้องการ pager
3. ถ้าเป็น binary file ให้ใช้ `bat --show-all <file>` เฉพาะเมื่อจำเป็น หรือใช้ `xxd`/`od`
4. ไม่ควรใช้ `bat` กับ files ที่มี control characters จำนวนมาก

### 6. Integration And Aliases

> Goal: เพิ่ม productivity ด้วย aliases
> Goal: ใช้งาน `bat` ได้เร็วขึ้น

1. เพิ่ม alias `cat=bat` หรือ `catp=bat --plain` ตาม shell
2. ตั้ง `BAT_THEME` environment variable สำหรับ default theme
3. ตั้ง `BAT_STYLE` environment variable สำหรับ default style
4. ใช้ `bat` ใน scripts สำหรับ preview files แทน `cat`

## Rules

### 1. Prefer Bat For Source Code

- ใช้ `bat` แทน `cat`/`type` สำหรับ source code, configs, logs
- ใช้ `bat --plain` เมื่อต้องการ copy ไปยัง clipboard หรือ paste
- ใช้ `bat --language` เมื่อ bat detect ภาษาผิด

### 2. Multiple Files

- `bat <file1> <file2>` รวม output พร้อม header แยกไฟล์
- `bat --style plain <files>` สำหรับ output แบบ minimal
- ไม่ควร `bat` หลายไฟล์ถ้า total size ใหญ่เกินไป

### 3. Paging And Large Files

- ค่าเริ่มต้น `bat` อาจใช้ pager ถ้า output ยาว
- ใช้ `bat --paging never` ถ้าไม่ต้องการ pager
- ใช้ `bat --wrap never` ถ้าไม่ต้องการ wrap long lines

### 4. Windows Considerations

- บน Windows `bat` อาจเรียก `batcat` ใน environment อื่น
- `where bat` หรือ `Get-Command bat` ช่วยยื่นยันตำแหน่ง
- fallback ใช้ `type <file>` ถ้า `bat` ไม่มี

### 5. Safety

- ไม่ควร `bat` ไฟล์ที่มี secrets โดยไม่ตรวจสอบ
- ไม่ใช้ `bat` กับ binary files โดยตรง
- ตรวจสอบ file permissions ก่อนอ่านไฟล์ที่ sensitive

## Expected Outcome

- `bat` ติดตั้งและใช้งานได้
- ไฟล์แสดงด้วย syntax highlighting ถูกต้อง
- สามารถ view หลายไฟล์และปรับ style ได้
- รู้วิธี fallback เมื่อ `bat` ไม่พร้อม
- ไม่เกิด terminal lag หรือ binary garbage
