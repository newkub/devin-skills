# GritQL — Biome Plugins และ Search

## Recommended Patterns

### Custom Lint Plugin (.grit)

- สร้างไฟล์ `.grit/<rule-name>.grit` แล้วลงทะเบียนใน `biome.json`/`biome.jsonc` ใต้ key `plugins`
- ใช้ `register_diagnostic(span: ..., message: ..., severity: ...)` ภายใน `where` เพื่อ emit diagnostic — span มาจาก `as $name` capture
- รวม rewrite ด้วย `=>` operator: `` `old($x)` => `new($x)` `` — match พร้อม fix ใน rule เดียว
- ตั้ง `fix_kind` ใน `register_diagnostic` เสมอเมื่อมี rewrite — `safe` เมื่อ semantics ไม่เปลี่ยน, `unsafe` เมื่ออาจเปลี่ยน (default คือ `unsafe`)

### Apply Fixes

- `biome check --write` apply เฉพาะ safe fixes — เหมาะสำหรับ CI และ auto-fix
- `biome check --write --unsafe` รวม unsafe fixes — ใช้เฉพาะหลัง review pattern แล้ว
- `biome lint --write` เฉพาะ lint fixes (ไม่ format)
- ทดสอบบน sample file หรือ branch ก่อน — rewrite ผิด pattern ซ่อมยากถ้า commit แล้ว

### biome search

- syntax: `bunx biome search '<pattern>' ./src` — pattern ห่อด้วย single quotes เพื่อกัน shell interpret backticks
- `--language=<lang>` ระบุ target: `javascript`, `css`, `json`
- ใช้กับ path/glob เพื่อ scope — `biome search '...' ./src/components`
- search คือ read-only — rewrites ทำผ่าน `.grit` plugins เท่านั้น

## Do / Don't

| Do | Don't |
|---|---|
| ตั้ง `fix_kind` ให้ตรงกับความเสี่ยงจริง | ปล่อย default `unsafe` ให้ rule ที่ semantics-preserving |
| รัน `biome check --write` ใน CI สำหรับ safe fixes | รัน `--unsafe` โดยไม่ review pattern |
| ทดสอบ rewrite กับ sample files ก่อน apply จริง | apply rewrite ทั้ง repo ครั้งแรกที่เขียน |
| ห่อ pattern ด้วย single quotes ใน shell | ใช้ double quotes แล้วชน `$`/backtick expansion |
| เช็คว่า plugin rule ทำงานบน glob scope ที่ตั้งใจ | assume plugin auto-run ทุกไฟล์โดยไม่ config |

## Common Pitfalls

- คิดว่า `biome search` rewrite ได้ — ไม่ได้ search เป็น read-only เท่านั้น
- ลืม `register_diagnostic` → pattern match ได้แต่ไม่ report อะไร
- rewrite `=>` โดยไม่ตั้ง `fix_kind` → default `unsafe` ต้องรัน flag เพิ่ม ดูเหมือน fix ไม่ทำงาน
- plugin file ไม่ถูกลงทะเบียนใน `biome.json` `plugins` array → rule ไม่ fire โดยไม่เตือน
- severity ไม่ระบุ → default อาจเป็น info ไม่ block CI ตามที่ตั้งใจ

## Performance Notes

- plugin ทุกตัวรันบนทุกไฟล์ที่ lint — pattern ที่ broad (root เป็น `$x`) ช้ามากบน codebase ใหญ่
- จำกัด scope ด้วย `files.includes`/path filters ใน config เมื่อ rule ใช้เฉพาะบาง directory
- specific node matchers prune ได้เร็ว — ดู `patterns.md` สำหรับ pattern performance
- unsafe fix ไม่กระทบ perf ของ check ธรรมดา — แต่ review cost สูงกว่า

## Ecosystem / Integration

- GritQL engine อยู่ใน `@biomejs/biome` v2+ — ไม่มี standalone CLI
- plugin diagnostics เข้ากับ `biome check`/`biome lint` output เดียวกัน — CI ใช้ format เดียวได้
- ถ้า rule ซับซ้อนเกิน GritQL (cross-file, type-aware) → เขียน Biome lint rule หรือเครื่องมืออื่นแทน
