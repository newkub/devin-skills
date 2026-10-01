# Biome Best Practices

แนวทางใช้ Biome เป็น linter + formatter + assist เดียวแทน ESLint/Prettier — config, rules, suppression และ CI

## Recommended Patterns

### Check vs Fix Discipline

- ใช้ `biome ci` ใน CI เท่านั้น — mode นี้ read-only, reporter-friendly, exit non-zero เมื่อมีปัญหา ห้ามใช้ `--write` ใน CI
- Local dev ใช้ `biome check --write` (รวม lint+format+assist ครั้งเดียว) แทนการรัน `lint` และ `format` แยก
- ใช้ `--error-on-warnings` ใน CI เมื่อต้องการให้ warnings เป็น gate จริง ไม่ใช่แค่ noise
- ใช้ `--since=<ref>` หรือ `--changed` กับ VCS integration เพื่อ check เฉพาะไฟล์ที่แก้ใน PR — เร็วมากใน repo ใหญ่

### Config Structure

- ใช้ `biome.jsonc` (รองรับ comments) ไม่ใช่ `biome.json` สำหรับอธิบาย rule overrides
- เปิด `vcs.enabled` + `useIgnoreFile: true` เสมอ — Biome จะ respect `.gitignore` อัตโนมัติ ไม่ต้อง maintain excludes ซ้ำ
- Monorepo: root config มี `root: true` (default), package configs ใช้ `extends: ["//"]` (shorthand หา root) หรือ path ตรง
- ใช้ `overrides` block สำหรับ per-path rules เช่นปิด `noExplicitAny` ใน `**/generated/**` หรือผ่อน test files — อย่าปิด rule ทั้ง project เพราะไฟล์เดียว

### Rules And Domains

- เริ่มจาก `recommended` แล้วเพิ่มเฉพาะ domains ที่ใช้จริง (React, Vitest, Drizzle) — `domains` แต่ละตัวมีค่า analysis โดยเฉพาะ `project` และ `types`
- เลือก React หรือ Solid อย่างใดอย่างหนึ่ง — เปิดพร้อมกัน rules จะชนกัน
- ปิด rule ที่ไม่ตรง codebase ใน config ไม่ใช่ suppression เยอะๆ — เช่น `noBarrelFile` ถ้า architecture ตั้งใจใช้ barrel

### Suppression

- ใช้ `// biome-ignore lint/<group>/<rule>: <เหตุผล>` เมื่อจำเป็น — ใส่ reason เสมอเพื่อ reviewer
- Suppress เฉพาะบรรทัด/scope ที่ต้องการ — ห้าม `biome-ignore` ทั้งไฟล์เพราะ rule เดียว
- `biome-ignore-start`/`biome-ignore-end` สำหรับ generated blocks; ถ้าทั้งไฟล์ generated ให้ exclude ใน config แทน

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| รัน Prettier + Biome พร้อมกัน | format แก้กลับไปมา ไม่จบ | เลือกตัวเดียวต่อ file type; Biome จัดการ JS/TS/JSON/CSS |
| เปิด domain `types`/`project` ทั้ง monorepo | lint ช้าลงมาก | เปิดเฉพาะที่ต้องการ หรือเฉพาะ CI job แยก |
| ใช้ `biome format --write` ใน CI | CI pass แต่ code ยัง dirty | ใช้ `biome ci` (read-only) ให้ fail เมื่อ unformatted |
| `extends` path ผิดใน workspace | rules ไม่ inherit | ใช้ `extends: ["//"]` ชี้ root config |
| Suppress ไม่ใส่เหตุผล | ไม่มีใครรู้ว่าทำไม | `: <reason>` บังคับทุก suppression |
| Schema path ชี้ node_modules ตาย | IDE autocomplete เสียเมื่อ version เปลี่ยน | ใช้ published schema URL หรือยอมรับว่า path ผูก version |
| ESLint legacy rules ยังเปิด | double-report diagnostics | ปิด ESLint บนไฟล์ที่ Biome ดูแล (workflow migrate) |

## Do / Don't

| Do | Don't |
|---|---|
| `biome check --write` ก่อน commit | commit แล้วค่อยให้ CI format แทน |
| เปิด VCS integration + useIgnoreFile | maintain excludes list ซ้ำกับ `.gitignore` |
| pin version ใน CI ด้วย `biomejs/setup-biome` | `version: latest` ใน production CI (rules เพิ่มในแต่ละ release ทำให้ CI fail เงียบๆ) |
| รวม lint+format+assist ใน script เดียว | แยก 3 commands ต่อกันใน pre-commit (ช้า 3 เท่า) |
| ใช้ `--diagnostic-level=error` เมื่อ warnings เยอะเกิน | ปิด linter เพราะ output รก |
| editor extension + format-on-save | rely on CI คนเดียวจับ format |

## Performance And CI Notes

- Biome เร็วมาก (Rust) — full check บน repo ใหญ่มัก < นาที ไม่จำเป็นต้อง incremental ใน CI เว้น repo ใหญ่จริงๆ
- Domains `project` และ `types` เพิ่ม analysis cost อย่างมีนัยสำคัญ — วัดก่อนเปิดทั้ง monorepo
- GitHub Actions: `biomejs/setup-biome` + `biome ci .` คือ pattern มาตรฐาน; เพิ่ม `--reporter=github` ได้ annotations บน PR
- `--max-diagnostics` จำกัด output เมื่อ migrate repo ใหญ่ — ค่อยๆ ลดตามที่แก้
- Cache ไม่จำเป็นเท่า ESLint (ไม่มี slow JS plugin loading) — แต่ cache `node_modules` ยังช่วย install step
- สำหรับ pre-commit: run ผ่าน lefthook/husky ด้วย `biome check --write --staged` หรือ `--changed` เท่านั้น

## Config Guidance

- จัด group config: `vcs` → `files` → `formatter` → `linter` → `assist` → `overrides` อ่านง่าย
- `files.includes` ใช้ negated patterns (`!**/generated`) แทน excludes field เก่า
- formatter defaults ควรตั้งครั้งเดียวที่ root: `indentStyle`, `lineWidth`, `quoteStyle` — อย่า override ต่อ package เว้นมีเหตุผล
- ตรวจ `biome explain <rule>` เมื่อไม่แน่ใจว่า rule ทำอะไร ก่อนเพิ่ม/ปิดใน config
