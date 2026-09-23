---
name: edit-by-astgrep
description: Batch refactor หลายไฟล์ด้วย ast-grep AST patterns — dry-run + confirm ก่อนเขียนทับเสมอ
argument-hint: "<pattern> <replacement> [path|glob]"
related:
  - use-astgrep
  - search-by-astgrep
  - migration-by-astgrep
  - use-astgrep-programmatic
  - run-check
  - ask-me
  - report
---

## Goal

แก้ code หลายไฟล์ด้วย ast-grep AST patterns แบบปลอดภัย — preview matches + diff ก่อน, confirm แล้วค่อย `--rewrite`, verify หลัง apply — สำหรับ "เปลี่ยน X เป็น Y ทุกที่" ที่เร็วกว่า manual edit และปลอดภัยกว่า `sg -r` ดิบ

## Scope

- One-shot pattern apply: rename API/deprecated call, syntax transform (`var`→`const`, callback→async), pattern removal (`console.log`), import reorganize — per language (ts/js, rust, python, go)
- Pattern syntax/authoring deep-dive → `/use-astgrep`; search เท่านั้น → `/search-by-astgrep`; migration ทั้ง codebase ด้วย rule file → `/migration-by-astgrep`; script/CI integration → `/use-astgrep-programmatic`
- Pattern library พร้อมใช้อยู่ใน `references/patterns.md` — ใช้เป็น starting point แทนเขียนเองจากศูนย์

## Execute

### 1. Define Pattern

> Goal: ได้ pattern + replacement ที่ match เฉพาะสิ่งที่ต้องการ

1. ระบุ refactor intent จาก argument — เช่น `console.log` removal, API rename, syntax upgrade
2. เช็ค `references/patterns.md` ก่อน — มี pattern พร้อมใช้หรือใกล้เคียงให้ปรับ
3. เขียน pattern (metavar `$VAR`, `$$$` สำหรับ variadic) — หรือ rule YAML ถ้าต้อง constraints (kind, regex, inside/has)
4. ระบุ scope: path หรือ glob (`--stdin` / `--globs`) — เริ่มแคบก่อนกว้าง

### 2. Dry-Run Matches

> Goal: เห็นจุดที่จะถูกแก้ก่อนเขียนทับ — บังคับ

1. รัน `ast-grep run -p '<pattern>' <path>` (ไม่มี `-r`) — list matches ทั้งหมด
2. แสดงตาราง `No.`, `File`, `Line`, `Match` — count total
3. ตรวจ false positives: match ที่ไม่ควรแก้ (comments, strings, tests ที่ตั้งใจ) — ปรับ pattern หรือยกเว้น scope
4. ถ้า matches = 0 → report และจบ (อาจ pattern ผิดหรือไม่มี target จริง)

### 3. Preview Diff

> Goal: user เห็น before/after จริงก่อน apply

1. รัน `ast-grep run -p '<pattern>' -r '<replacement>' <path>` (ไม่ใส่ `-U`) — sg เข้า interactive mode แสดง diff ต่อ match เอง
2. ตรวจ diff 3-5 match แรก — ถ้า rewrite ถูกต้องกด `a` accept all ผ่าน sg; ถ้าพังยกเลิกแล้วปรับ pattern
3. ถ้า repo มี uncommitted changes → เตือน user ว่า revert จะยาก — แนะนำ commit/stash ก่อน

### 4. Confirm And Apply

> Goal: เขียนทับเฉพาะหลัง user เห็น diff และอนุมัติ

1. เลือก mode: `interactive` (sg confirm ทีละ change — เหมาะกับ false-positive risk สูง) หรือ `bulk` (`-U` apply all — เมื่อ user confirm แล้วและ diff ตัวอย่างถูก)
2. Bulk: `ast-grep run -p '<pattern>' -r '<replacement>' -U <path>` หรือ `sg scan --fix-all` ถ้าใช้ rule file
3. ห้าม apply ถ้ายังไม่ได้ confirm — dry-run เป็น default เสมอ

### 5. Verify

> Goal: ยืนยันแก้ถูก ไม่พัง ไม่เหลือ

1. Re-scan: `ast-grep run -p '<pattern>' <path>` → ต้องเหลือ 0 matches (ยกเว้น intentional leftovers)
2. ทำ `/run-check` — lint/typecheck ต้องผ่าน ไม่มี syntax break จาก rewrite
3. ถ้า fail → แก้ด้วย `git checkout`/`git restore` บนไฟล์ที่พัง แล้วปรับ pattern (max 3 รอบ)
4. ทำ `/report` สรุป: `No.`, `File`, `Changes`, `Status` + matches→applied→verified counts

## Rules

### 1. Dry-Run And Confirm

- ห้ามรัน `-r`/`-U`/`--fix` ก่อนแสดง matches + diff และได้ user confirm
- เริ่ม scope แคบ (subdir หรือ glob เดียว) ก่อนขยายทั้ง repo — fail fast ลด rework

### 2. Pattern Precision

- AST match ไม่สนความหมาย — `console.log` pattern อาจ match `logger.console.log` ที่ตั้งใจไว้; ตรวจ matches เสมอ
- replacement ต้องเท่า metavar structure — `$VAR` ใน replacement ต้อง capture จาก pattern ไม่ใช่คิดชื่อเอง

### 3. Reversible

- git working tree ควร clean ก่อน apply — `sg` rewrite ไม่มี undo ของตัวเอง
- ถ้า dirty → เตือนและเสนอ commit/stash ก่อน ไม่ apply เงียบๆ

- ใช้ /use-astgrep ถ้าจำเป็น (pattern syntax)
- ใช้ /migration-by-astgrep ถ้าจำเป็น (rule-file migrations)
- ใช้ /ask-me ถ้าจำเป็น

## Expected Outcome

- Matches + diff preview ก่อนเขียนทับเสมอ — user confirm แล้วค่อย apply
- Pattern ไม่เหลือ match หลัง verify (`run-check` ผ่าน)
- Report ชัด: files changed, lines rewritten, leftovers ที่ตั้งใจ
