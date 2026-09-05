---
name: view-files
description: ดูไฟล์ด้วย bat พร้อม syntax highlighting, line ranges, multi-file และ git diff integration
argument-hint: "[files-or-glob]"
allowed-tools:
  - read
  - exec
  - find_file_by_name
  - grep
triggers:
  - user
  - model
related:
  - review
  - scan-codebase
  - check-git-diff
  - search-by-astgrep
  - read-all-files
  - list-file-structure
  - view-diff
  - open-in-explorer
  - capture-terminal
---

## Goal

ดูไฟล์ใน terminal ด้วย `bat` — syntax highlighting, file-path headers, line numbers, line ranges, symbol context และ git integration สำหรับ code reading และ review

## Scope

ใช้เมื่อผู้ใช้ขอให้ดูไฟล์, ชุดไฟล์ หรือ snippet ใน terminal ด้วย layout ที่อ่านง่าย — เหมาะสำหรับ `source code`, `configs`, `logs` และ `markdown` รองรับ single file, multiple files, line ranges และ git diffs

ดูเพิ่มเติม: /review, /scan-codebase, /check-git-diff, /search-by-astgrep, /view-diff, /open-in-explorer, /capture-terminal

## Execute

### 1. Resolve Code Targets

> Goal: ระบุ code files ที่จะดู

1. รับ file paths, glob pattern หรือ directory จาก argument หรือ context
2. ใช้ `find_file_by_name` สำหรับ patterns เช่น `src/**/*.ts`
3. ถ้าได้ symbol (function/class name) ให้ค้นหาตำแหน่งก่อนด้วย `grep` หรือ `/search-by-astgrep`
4. ข้าม paths ใน `node_modules`, `.git`, `dist`, `build`, `coverage`
5. เรียงลำดับไฟล์ตาม import order หรือ path เพื่อ output ที่เสถียร

### 2. Verify Bat

> Goal: ยืนยันว่า `bat` พร้อมใช้งาน

1. รัน `bat --version` เพื่อตรวจสอบ (latest `0.26.x`)
2. ถ้าไม่มี ให้ติดตั้งด้วย `mise use -g bat` หรือ `scoop install bat`
3. ถ้าติดตั้งไม่ได้ ให้ fallback ไปยัง `read` tool แทน

### 3. View Code Files

> Goal: แสดง code พร้อม syntax highlighting

```bash
bat --style=header,numbers,grid --paging=never src/main.ts
bat -n src/main.ts                    # line numbers only
bat src/*.ts                          # หลายไฟล์พร้อม header แยกแต่ละไฟล์
```

1. ใช้ `--style=header,numbers,grid` เป็นค่าเริ่มต้น
2. ใช้ `--language <lang>` เมื่อ detect ผิด เช่น `bat -l tsx file`
3. ใช้ `--tabs 4` เมื่อต้องการ tab width เฉพาะ
4. ใช้ `--wrap never` เมื่อบรรทัดยาวและไม่ต้องการ wrap

### 4. View Symbol Context

> Goal: ดู code รอบ symbol ที่ต้องการ

```bash
bat --line-range 40:80 src/api.ts           # ดูเฉพาะช่วงบรรทัด
bat --highlight-line 55 src/api.ts          # highlight บรรทัดที่สนใจ
bat --line-range :30 --highlight-line 15 src/api.ts
```

1. ค้นหา line number ของ symbol ด้วย `grep -n "functionName" <file>` ก่อน
2. ใช้ `--line-range <start>:<end>` รอบ symbol (เผื่อ context ±10 บรรทัด)
3. ใช้ `--highlight-line <n>` หรือ `<n:m>` สำหรับบรรทัดที่กำลัง debug/review

### 5. View Git Changes

> Goal: ดู code changes ด้วย git integration

```bash
bat -d src/api.ts                    # diff markers กับ git HEAD
bat -d --diff-context 3 src/api.ts   # จำกัด context รอบ changed lines
git diff | bat -l diff               # syntax-highlighted diff
git show HEAD~1:src/api.ts | bat -l ts  # ดูไฟล์จาก commit เก่า
```

1. ใช้ `bat -d` (`--diff`) เพื่อเห็น added/modified lines เทียบ git HEAD
2. ใช้ `--diff-context <N>` เมื่อต้องการเฉพาะรอบ changes
3. ใช้ `git show <rev>:<file> | bat -l <lang>` สำหรับไฟล์ใน revision อื่น

### 6. Review Multiple Files

> Goal: ดู code หลายไฟล์สำหรับ review

1. รัน `bat --style=header,numbers,grid --paging=never <file1> <file2> ...`
2. ถ้า output รวมเกิน 500 บรรทัด ให้แสดง file index ก่อน แล้วดูทีละไฟล์
3. ใช้ `--terminal-width` เมื่อ output ต้อง fit กับ width เฉพาะ
4. สำหรับ codebase ทั้งหมดให้ใช้ `/scan-codebase` หรือ `/read-all-files` แทน

### 7. Report Code Reading

> Goal: สรุปสิ่งที่อ่านได้

1. สรุป structure, entry points และ key symbols ที่พบ
2. อ้างอิงตำแหน่งด้วย `file:line` format
3. ถ้าต้องการรายงาน code block ใน chat ให้ใช้ `/report-codeblock`

## Rules

### 1. Codebase-Style Output

- ใช้ `bat` เป็น primary tool ทุกครั้งเมื่อใช้งานได้
- แสดง `header` และ `line numbers` เสมอ เว้นแต่ขอ `--plain`
- ใช้ `--style=header,numbers,grid` เป็นค่าเริ่มต้น
- ใช้ `--color=always` เมื่อ terminal รองรับ ถ้าไม่ใช้ `auto`
- ใช้ `--plain` สำหรับ output ที่คัดลอกได้ง่าย และ `--list-themes` เมื่อต้องการเปลี่ยน theme

### 2. Language Accuracy

- ตรวจ language detection ก่อน — ถ้า highlight ผิดให้ระบุ `-l <lang>`
- ใช้ `bat --list-languages` เมื่อไม่แน่ใจชื่อ language
- `tsx`/`jsx`/`.mts`/`.cts` ต้องระบุ language เองถ้า detect ไม่ถูก

### 3. Context Discipline

- ดูเฉพาะ range ที่จำเป็น — ไม่ dump ทั้งไฟล์ถ้าสนใจแค่ function เดียว
- เผื่อ context ±10 บรรทัดรอบ symbol เสมอ
- ไฟล์เกิน 500 บรรทัดต้องใช้ `--line-range` หรือขอยืนยันก่อน

### 4. Git Integration

- ใช้ `bat -d` เมื่อ review uncommitted changes
- ใช้ `git show <rev>:<file> | bat -l <lang>` เมื่อเทียบ revisions
- อย่าแก้ไขไฟล์ในระหว่างดู — skill นี้ read-only

### 5. Safety

- ข้าม `node_modules`, `.git`, `dist`, `build`, `coverage` เสมอ
- เตือนเมื่อไฟล์อาจมี secrets ก่อนแสดง
- ใส่ quotes ให้ paths ที่มีช่องว่าง

### 6. Fallback

- ถ้า `bat` ไม่มีและติดตั้งไม่ได้ ให้ใช้ `read` tool
- บน Windows ใช้ `Get-Command bat` ตรวจหา `bat.exe`

## Expected Outcome

- ดู source code ได้พร้อม syntax highlighting และ line numbers ที่ถูกต้อง
- ดู symbol context และ changed lines ได้แม่นยำด้วย `--line-range`, `--highlight-line` และ `--diff`
- Review หลายไฟล์ได้โดยไม่สับสน ด้วย per-file headers
- Git revision comparison ทำได้ผ่าน `git show | bat`
- Fallback เป็น `read` tool ได้เมื่อ `bat` ใช้ไม่ได้
