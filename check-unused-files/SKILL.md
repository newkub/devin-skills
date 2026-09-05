---
name: check-unused-files
description: Detect and remove unused files in project using Knip and reference analysis
argument-hint: "[scope]"
related:
  - check-should-update
  - cleanup-files-in-project
  - check-dead-code
  - delete-projects
  - check-unused-deps
  - follow-tool-knip
  - update-references
---
## Goal

ตรวจจับและระบุไฟล์ที่ไม่ได้ใช้ในโปรเจกต์ และลบหรือนำไปใช้

## Scope

ใช้กับทุกโปรเจกต์ — รองรับทั้ง single project และ monorepo — ไม่รวมการตรวจสอบ unused dependencies (ใช้ `/check-unused-deps` แทน) หรือ unused exports (ใช้ `/follow-tool-knip` แทน)

## Execute

### 1. Detect Ecosystem

> Goal: ระบุ ecosystem และ tool ที่จะใช้

1. ตรวจสอบ `package.json` → JavaScript/TypeScript ใช้ `knip`
2. ตรวจสอบ `Cargo.toml` → Rust ใช้ `cargo-udeps`
3. ตรวจสอบ `go.mod` → Go ใช้ `go mod tidy`
4. ถ้าไม่ตรวจพบ ecosystem ใด → ใช้ `find_by_name` และ `grep_search` แบบ manual
5. ถ้าเป็น monorepo → ระบุ workspace ที่ต้องตรวจสอบ

### 2. Run File Analysis

> Goal: รัน tool ตรวจสอบ unused files

1. ถ้าเป็น JavaScript/TypeScript → ทำ `/follow-tool-knip` แล้วรัน `bunx knip --include files`
2. ถ้าเป็น Rust → รัน `cargo +nightly udeps`
3. ถ้าเป็น Go → รัน `go mod tidy -v`
4. ถ้าไม่มี tool เฉพาะ → ใช้ `find_by_name` รวบรวมไฟล์ และ `grep_search` ตรวจสอบ references
5. ถ้าเป็น monorepo → รัน `bunx knip -W <workspace> --include files` เพื่อ filter

### 3. Verify Results

> Goal: ตรวจสอบผลลัพธ์เพื่อแยก false positives

1. ตรวจสอบ dynamic imports — `import()` ที่อาจไม่ detect โดย static analysis
2. ตรวจสอบ configuration references — ไฟล์ที่อ้างอิงจาก config ไม่ใช่จาก code
3. ตรวจสอบ entry points — ไฟล์ที่เป็น entry โดย convention เช่น `index.ts`, `cli.ts`
4. ตรวจสอบ side effects — ไฟล์ที่มี module initialization, global registration
5. ถ้าผลลัพธ์ว่าง → ไม่มี unused files และจบ workflow

### 4. Remove Or Implement

> Goal: ลบไฟล์ที่ไม่ได้ใช้หรือนำไปใช้งาน

1. ลบไฟล์ที่ยืนยันว่าไม่ได้ใช้
2. ถ้าไฟล์ควรใช้งาน → implement หรือ import ในที่ที่ควรใช้
3. ทำ `/update-references` เพื่ออัปเดต references ของไฟล์ที่ลบ
4. ทำ `/resolve-errors` ถ้ามี build errors หลังลบ
5. รัน `bunx knip --include files` อีกครั้งเพื่อยืนยันว่าไม่มี unused เหลือ

## Rules

### 1. Use Knip For JavaScript

- ใช้ `knip --include files` สำหรับ JS/TS — ไม่ใช้ manual grep
- Knip วิเคราะห์ module graph ทั้งโปรเจกต์ ไม่ใช่แค่ text search
- ใช้ `knip --production --include files` เพื่อตรวจเฉพาะ production files
- ใช้ `ignoreFiles` ใน `knip.json` สำหรับ generated files ที่ไม่ควรตรวจ

### 2. Monorepo Handling

- ใช้ `knip -W <workspace> --include files` เพื่อ filter ตาม workspace
- ตรวจสอบ cross-workspace references — ไฟล์ที่ unused ใน workspace หนึ่งแต่ใช้ในอีก workspace
- รัน `bunx knip --include files` ที่ root เพื่อตรวจทุก workspace พร้อมกัน

### 3. Safety

- ตรวจสอบ dynamic imports ก่อนลบเสมอ — `import()` อาจไม่ detect โดย static analysis
- ตรวจสอบ configuration references — vite config, tsconfig paths, routing config
- ตรวจสอบ side effects — module initialization, global registration, polyfills
- ทดสอบ build และ test หลังลบไฟล์
- ถ้าลบแล้วมี error → เพิ่มกลับและใช้ `ignoreFiles` แทน

### 4. Generated Files

- แยก generated files ออกจาก analysis — build artifacts, cache, lock files
- ใช้ `ignoreFiles` ใน `knip.json` สำหรับ generated files ที่ไม่ควรตรวจ
- ห้ามลบไฟล์ใน `dist/`, `build/`, `.output/`, `node_modules/` — เป็น build artifacts

- ใช้ /check-should-update ถ้าจำเป็น
- ใช้ /cleanup-files-in-project ถ้าจำเป็น
- ใช้ /check-dead-code ถ้าจำเป็น
- ใช้ /delete-projects ถ้าจำเป็น

## Expected Outcome

- รายการ unused files ที่ยืนยันแล้ว (หรือไม่มีถ้าผลลัพธ์ว่าง)
- ไฟล์ที่ไม่ได้ใช้ถูกลบหรือนำไปใช้งาน
- References ของไฟล์ที่ลบถูกอัปเดต
- Build และ test ผ่านหลังลบ
