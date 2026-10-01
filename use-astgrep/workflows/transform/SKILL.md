---
name: use-astgrep-transform
description: เขียน rule-YAML transformations ด้วย ast-grep — fix, constraints, transform, rewriters สำหรับ rewrite ที่ pattern string เดียวทำไม่ได้
argument-hint: "[rule-or-intent]"
related:
  - use-astgrep
  - update-astgrep-rules
  - use-astgrep-programmatic
  - run-check
  - report
---

## Goal

สร้าง ast-grep rule YAML ที่ transform code ได้เกิน metavar replacement — case conversion, conditional text, regex capture, per-subnode fix — แล้ว apply อย่างปลอดภัยด้วย dry-run → confirm → fix flow

## Scope

- ครอบคลุม `rule` fields (`pattern`, `kind`, `inside`, `has`, `follows`, `precedes`, `all`/`any`/`not`), `constraints`, `fix`, `transform`, `rewriters`, `utils` — deep-dive อยู่ใน `references/rewrite.md`
- Pattern string ธรรมดาพอ → `/use-astgrep rewrite`; permanent lint rules → `/update-astgrep-rules`; transform ที่ YAML ไม่รองรับ (cross-file, stateful) → `/use-astgrep-programmatic`

## Execute

### 1. Detect Need

> Goal: รู้ว่าต้อง rule YAML ไม่ใช่ pattern string

1. ต้อง constraints บน metavar (`regex`, `kind`, `not`) หรือ context (`inside`/`has`/`follows`) → rule YAML
2. ต้องแปลง captured text — case convert, substring, regex replace, conditional text → `transform:` (ดู `references/rewrite.md`)
3. Sub-nodes ใน match เดียวต้อง fix ต่างกัน → `rewriters:` + `transform.rewrite` (ดู `references/rewrite.md`)
4. ถ้าไม่เข้าเงื่อนไขเลย → `/use-astgrep rewrite` พอ

### 2. Write Rule YAML

> Goal: rule file ที่ correct และจำกัด scope ชัด

1. Scaffold: `ast-grep new rule <name> --lang <lang>` หรือเขียนเองใน temp/`sg-rules/` (ไม่ใช่ `rules/` ถ้ายังไม่ promote)
2. โครงขั้นต่ำ: `id`, `language`, `rule`, `fix` — เพิ่ม `severity`, `message`, `constraints`, `transform`, `rewriters`, `utils` ตามต้องการ
3. เขียน `fix` ด้วย metavars ที่ capture จริง — var จาก `transform:` ใช้ใน `fix` ได้ (chain ตามลำดับ)
4. อ้าง `utils` rules ผ่าน `matches: <util-id>` เมื่อต้อง shared helpers

### 3. Dry-Run And Preview

> Goal: เห็น findings + diff ก่อน apply — บังคับ

1. `sg scan --rule <file>` = list findings (dry run)
2. `sg scan --rule <file> --fix` = interactive diff ทีละ change — ตรวจ 3-5 match แรก
3. False positives → เพิ่ม constraints/inside; missed targets → ลด constraints หรือแยก rule

### 4. Apply And Verify

> Goal: apply หลัง confirm แล้วยืนยันผล

1. หลัง user confirm: `sg scan --rule <file> --fix-all` หรือ interactive accept (`a`)
2. Re-scan rule เดิม → 0 findings (ยกเว้น intentional)
3. ทำ `/run-check` — lint/typecheck ผ่าน; fail → `git restore` ไฟล์ที่พัง + ปรับ rule (max 3 รอบ)
4. Rule ที่ควรใช้ซ้ำถาวร → promote เข้า `rules/` ผ่าน `/update-astgrep-rules`
5. ทำ `/report`: `No.`, `Rule`, `Files`, `Changes`, `Status`

## Rules

- Dry-run + diff preview + user confirm ก่อน `--fix`/`--fix-all` ทุกครั้ง — เหมือน `/use-astgrep rewrite`
- git working tree ควร clean ก่อน apply — sg rewrite ไม่มี undo
- regex capture groups ใช้ได้เฉพาะใน `transform.replace` — `regex` rule ธรรมดาไม่รองรับ
- `rewriters` entries ต้องมี `id`/`rule`/`fix` เท่านั้น — ไม่มี `severity`/`message`; ลำดับใน list สำคัญ (ตัวแรกที่ match ชนะ)
- ใช้ `/use-astgrep-programmatic` ถ้าจำเป็น

## Expected Outcome

- Rule YAML transform ถูกต้อง — preview ผ่าน, apply แล้ว 0 findings, checks เขียว
- Rule พร้อม promote เข้า `rules/` ถ้าต้องใช้ซ้ำ
