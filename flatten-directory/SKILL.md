---
name: flatten-directory
description: ยุบ directory ทีลึก/ซ้ำซ้อน หรือแปลง references เป็น flat files
argument-hint: "<path> [--mode refs|code|all] [--depth N]"
related:
  - move-to
  - update-references
  - report-file-structure
  - review-restructure
  - deep-validate
  - report-in-table
  - report-progress
  - suggest-next-action
  - scan-codebase
  - check-reference
  - clean-empty-dirs
  - ask-me
  - check-broken-skills-references
---

## Goal

ลดความลึกและความซ้ำซ้อนของ directory structure ครอบคลุม 3 งาน: collapse nested dirs ที่ลึกเกิน/ซ้ำชื่อ (`src/components/components/`, single-child chains), แปลง skill references จาก `references/<name>/SKILL.md` เป็น flat file `references/<name>.md`, และ flatten code directories ให้เป็น flat structure — พร้อมอัปเดต references ทุกครั้งที่ย้าย

## Scope

- ใช้เมื่อ structure ลึกเกิน: `a/a/a/`, single-child chains ยาว, wrapper dirs ที่ไม่มีค่า
- ใช้เมื่อ `references/` มี nested directories ที่ต้องแปลงเป็น flat `.md` files
- ใช้เมื่อต้องลด nesting ของ code directories เพื่อ simplify imports หรือเตรียม migration
- Destructive-adjacent: move/convert files จริง — dry-run + user confirm + `/update-references` เสมอ
- ไม่ใช้กับ top-level active skills ที่ต้องคง `<skill-name>/SKILL.md` ไว้

## Modes

เลือก mode ผ่าน `--mode` (default: `all`) — แต่ละ mode ใช้ steps ชุดเดียวกันแต่ต่าง target และ naming rules

| Mode | Target | ผลลัพธ์ |
| --- | --- | --- |
| `all` | ทั้ง references และ code dirs | collapse nesting + flat references + flat code ครบทุกส่วน |
| `refs` | `references/` ของ skill | แปลง `references/<name>/SKILL.md` → `references/<name>.md` |
| `code` | code directories ใน `<path>` | ย้ายไฟล์ใน nested dirs มาไว้ flat พร้อม kebab-case names |

## Execute

### 1. Analyze Depth And Structure

> Goal: map structure และหาจุดที่ลึกเกินหรือซ้ำซ้อนใน scope ของ mode ที่เลือก

1. ทำ `/report-file-structure` ดู tree ปัจจุบัน และทำ `/scan-codebase` ถ้า mode `code`/`all` เพื่อรายการไฟล์ทั้งหมด
2. หา patterns: single-child chains (`a/b/c/` ที่ b,c มีลูกเดียว), name repetition (`foo/foo/`, `src/src/`), wrapper dirs ที่มีแค่ dir เดียว
3. วัด depth ต่อ leaf — flag paths ที่ลึกกว่า `--depth` (default: >4 จาก root)
4. ถ้า mode `refs`/`all` → ใช้ `glob` หา `references/*/SKILL.md` และตรวจว่า `name` ใน frontmatter ตรง directory name
5. ถ้า mode `code`/`all` → ระบุ exclusions: `node_modules`, `.git`, `dist`, `.output`, `target`, `build`, `coverage`, hidden files และตรวจ `package.json`, `tsconfig.json`, `Cargo.toml` สำหรับ path alias และ build pipeline

### 2. Plan Flattening

> Goal: ออกแบบ target structure และ mapping ก่อนย้าย

1. ทำ `/review-restructure` — วางแผน relocation ที่ไม่ทำลาย grouping ที่มีค่า
2. สร้าง mapping `old path → new path`:
   - mode `refs`: `references/<name>/SKILL.md` → `references/<name>.md` โดย `<name>` ต้องตรง `name` ใน frontmatter
   - mode `code`: `old/path/file.ext` → `flat-name.ext` เป็น kebab-case โดยเติมชื่อ parent dirs เพื่อ uniqueness (เช่น `domain-user-service.ts`) — index files ให้ rename เป็น `dirname-index.ext`
   - mode `all`: รวม mapping ของทั้งสองชุด พร้อม single-child collapse ของ wrapper dirs
3. Flag collisions: ไฟล์ชื่อซ้ำที่จะชนกันหลัง flatten → rename หรือเก็บ nested, ไม่ overwrite ไฟล์ที่มีอยู่เด็ดขาด
4. ถ้า dir ใน `references/` มีไฟล์นอก `SKILL.md` หรือมีการย้ายจำนวนมาก → ถาม user ผ่าน `/ask-me` พร้อม preview mapping ก่อนดำเนินการ — ถ้าไม่ยืนยัน → stop และ report

### 3. Execute Moves

> Goal: ย้ายและแปลงไฟล์ตาม mapping ที่ confirm แล้ว

1. ทำ `/move-to` ย้ายตาม mapping — ทีละกลุ่มเพื่อ rollback ง่าย, ใช้ `git mv` ถ้าอยู่ใน git repo เพื่อรักษา history
2. สำหรับ mode `refs`/`all`: เขียน `<name>.md` จากเนื้อหา `SKILL.md` เดิม ตรวจว่า `read` ได้และ frontmatter ไม่เสียหาย แล้วลบ directory `<name>/` — ถ้า dir ไม่ว่างหลังย้าย → stop และ report
3. ลบ empty dirs ที่เหลือตาม `/clean-empty-dirs`
4. ทำ `/update-references` ทันทีหลังย้ายทุกกลุ่ม — ไม่มีข้อยกเว้น

### 4. Update All References

> Goal: แก้ทุก path ที่อ้างถึงตำแหน่งเดิมให้ชี้ไปตำแหน่งใหม่

1. mode `refs`/`all`: ค้น `references/<name>/` และ `references/<name>/SKILL.md` ทั่ว repo แล้วแทนที่ด้วย `references/<name>.md` — รวมถึง `related` lists ของ active skills
2. mode `code`/`all`: แก้ relative imports (`../`, `./`), barrel exports (`index.ts`, `mod.ts`, `lib.rs`), path aliases ใน config, `package.json` `exports`/`types`/`main` ถ้าจำเป็น
3. ค้น path เดิมทั้ง repo เพื่อหา string literals ที่ยังอ้าง — รวม README, docs, comments, test files
4. ทำ `/update-references` ซ้ำจนไม่มี references เก่าเหลือ

### 5. Validate

> Goal: ไม่มี broken references และ structure ใหม่ใช้งานได้

1. ทำ `/check-reference` เพื่อตรวจ broken path references — ถ้าแก้ skills repo ให้ทำ `/check-broken-skills-references` ด้วย
2. ทำ `/deep-validate` — รัน build / test / lint ตาม project ถ้า mode `code`/`all`
3. ถ้าพบปัญหา → แก้และ re-validate สูงสุด 3 รอบ → ถ้ายังไม่ผ่าน stop และ report

### 6. Report

> Goal: สรุป structural change ให้ตรวจสอบย้อนหลังได้

1. ทำ `/report-in-table` ด้วยคอลัมน์ `No.`, `Old Path`, `New Path`, `Files Moved`, `Refs Updated` พร้อม before/after depth comparison
2. ระบุ manual follow-ups ถ้ามี (docs นอก repo, external links)
3. ทำ `/report-progress` สรุปงานเสร็จ/งานค้าง แล้วทำ `/suggest-next-action`

## Rules

### 1. Confirm Before Move

- structural change ต้อง dry-run preview + user confirm ผ่าน `/ask-me` ก่อนทุกครั้ง — ไม่ flatten เองโดยไม่ถาม
- preserve git history — `git mv` ไม่ใช่ copy+delete
- ไม่ลบ source ต้นฉบับจนกว่า verify ผ่าน และไม่ overwrite ไฟล์ที่มีอยู่เด็ดขาด
- ถ้า git working tree ไม่สะอาด → stop และ report ก่อนแปลง

### 2. References Always

- ทำ `/update-references` ทุกครั้งหลังย้ายหรือแปลงไฟล์ — ไม่มีข้อยกเว้น
- verify ว่าไม่มี references เก่าเหลือก่อนจบ ด้วย `/check-reference` และ `/deep-validate`
- ไม่เปลี่ยน `name` ใน frontmatter ของ flat file ที่แปลง

### 3. Naming And Exclusions

- flat filename ใช้ kebab-case และเก็บ parent context เพื่อ uniqueness — ไม่เปลี่ยน extension
- `references/<name>.md` ต้องตรงกับ `name` ใน frontmatter — ถ้าไม่ตรงให้แก้ให้ตรงก่อน flatten
- ข้าม `node_modules`, `.git`, `dist`, `.output`, `target`, `build`, `coverage`, `tmp`, `temp`, `.cache`, hidden files และ binary assets เว้นระบุ explicit include

### 4. Value Preserving

- flatten เฉพาะ nesting ที่ไม่มีค่า — grouping ที่มีเหตุผล (feature boundaries) เก็บไว้
- ระวัง framework conventions (`app/`, `pages/` ที่ router expect)
- ไม่แปลง top-level active skills ที่ต้องคง `<skill-name>/SKILL.md`

## Expected Outcome

- Structure ตื้นขึ้นและสื่อความหมาย — ไม่มี redundant nesting หรือ single-child chains ที่ไม่จำเป็น
- ไม่มี nested `references/<name>/` เหลือ — ทุก reference เป็น `references/<name>.md`
- ไฟล์ code ใน scope อยู่ flat directory ชื่อ unique kebab-case
- ทุก reference อัปเดตและ verify ผ่าน ไม่มี broken references
- Git history รักษาไว้ผ่าน `git mv` และรายงาน mapping table ครบถ้วน
