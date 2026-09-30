---
name: read-all-files
description: อ่าน/concat ไฟล์ทั้งหมดหรือเฉพาะไฟล์ที่เกี่ยวข้องในโปรเจกต์เพื่อวิเคราะห์ — ใช้ check-file-relation Rust CLI
argument-hint: "all | patterns <glob> | related <entry-file>"
related:
  - check-file-relation
  - all-this-patterns
  - deep-analyze
  - report-file-structure
  - read-devin-context
  - update-devin-global-skills
---

## Goal

อ่านและวิเคราะห์ไฟล์ทั้งหมดในโปรเจกต์อย่างครบถ้วน — ใช้ `/check-file-relation` Rust CLI เป็น engine สำหรับหาไฟล์ เรียงลำดับ และ concat เป็น output เดียว

## Scope

ใช้เมื่อต้องการอ่านทุกไฟล์หรือเฉพาะไฟล์ที่เกี่ยวข้องกับ task

- `all` — concat ทุกไฟล์ที่จำเป็นในโปรเจกต์ เรียง config → entry → deps → rest
- `patterns <glob>` — เฉพาะไฟล์ที่ตรง glob เช่น `src/**/*.ts`
- `related <entry>` — เฉพาะ entry + ไฟล์ที่ reachable ผ่าน import chain (deps ก่อน)

CLI engine: `<skills>/check-file-relation/target/release/check-file-relation.exe` (build: `cargo build --release` ใน `<skills>/check-file-relation/`) — ตัวอย่างใช้ `cfr` แทน

## Execute

### 1. Prepare

> Goal: วางแผนการอ่าน

1. ทำ `/report-file-structure` เพื่อดู overview
2. ระบุประเภทไฟล์ที่ต้องการอ่าน ตาม argument
3. กำหนดลำดับความสำคัญ: config → entry points → core → tests → docs

### 2. Collect + Concat Files

> Goal: ได้ไฟล์ครบถ้วนในลำดับที่อ่านง่าย

1. ถ้า argument `all`:

   ```bash
   cfr . --all --order smart --out .devin/tmp/bundle.txt
   ```

   - `--order smart` = config files → entry points → topo deps → ที่เหลือ
   - default ข้าม `node_modules`, `.git`, `dist`, `build`, `coverage`, `target` ฯลฯ — ข้าม `.devin/tmp` เองด้วยการไม่ส่ง output กลับเข้า scope เดิม หรือใช้ `--include` จำกัด scope

2. ถ้า argument `patterns <glob>`:

   ```bash
   cfr . --include "src/**/*.ts" --all --order smart
   cfr . --include "*.json" --include "*.toml" --all   # non-source ด้วย
   ```

3. ถ้าต้องการเฉพาะไฟล์ที่เกี่ยวข้องกับ entry (`related`):

   ```bash
   cfr src --from src/main.ts            # entry + transitive deps, deps ก่อน
   cfr . --summary --ext ts,tsx          # ดู graph/อันดับ imported ก่อนเลือก entry
   ```

4. ภาษา/import style ที่ built-in ไม่ครอบ → เติม `--pattern '<regex>'` (ดู `/check-file-relation`)
5. codebase ใหญ่ → จำกัดด้วย `--max-lines 250` ต่อไฟล์ หรือแบ่งตาม subdir

### 3. Read + Analyze

> Goal: อ่านและวิเคราะห์สิ่งที่ concat มา

1. อ่าน output — ไฟล์ละไม่เกิน 250 บรรทัดต่อครั้ง; ถ้า bundle ยาวให้อ่านต่อด้วย offset หรือแยกรัน `--from` ทีละ subdir
2. วิเคราะห์โครงสร้างโปรเจกต์และความสัมพันธ์ระหว่างไฟล์ (เทียบ `===== <path> =====` headers กับ `--json` graph)
3. สรุป pattern และ architecture — ทำ `/deep-analyze` หากต้องการวิเคราะห์ลึก
4. ตรวจสอบความสมบูรณ์ของการอ่าน (เทียบจำนวนไฟล์กับ summary ของ CLI)

## Rules

- ใช้ `/check-file-relation` CLI เป็น engine เสมอ — ห้ามเขียน walker/concat เองซ้ำ
- อ่าน config ก่อนเสมอ → `--order smart` จัดให้แล้ว; entry ก่อน deps → ใช้ `--from`
- ข้ามไฟล์ที่ไม่เกี่ยวข้อง — scope ด้วย `--include`/`--ext`/`--from`
- output อาจมี secrets → ทำ `/check-secrets` ก่อน feed เข้า LLM
- ใช้ `/read-devin-context` ถ้าจำเป็น
- ถ้าอ่านเพื่อปรับปรุง devin global skills → ใช้คู่กับ `/update-devin-global-skills`

## Expected Outcome

- ได้ bundle เดียวที่มีทุกไฟล์/เฉพาะไฟล์ที่เกี่ยวข้อง เรียงตาม import chain
- เข้าใจโครงสร้างโปรเจกต์และความสัมพันธ์ระหว่างไฟล์
- พร้อมสำหรับการวิเคราะห์ต่อ
