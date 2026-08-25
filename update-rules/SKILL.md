---
name: update-rules
description: อัพเดท rules ทั้ง .devin/rules และ ast-grep rules
---

## Goal

อัพเดท rules ทั้งหมดใน project ทั้ง `.devin/rules/` (devin rules) และ `rules/` (ast-grep rules) เพื่อให้ rules สอดคล้องกับ codebase ปัจจุบัน

## Scope

ใช้สำหรับอัพเดท rules ทั้งระบบใน project workspace ใดๆ ที่มี `.devin` structure และ ast-grep setup อยู่แล้ว ครอบคลุม devin rules และ ast-grep rules

## Execute

### 1. Update Devin Rules

> Goal: อัพเดท devin rules

อัพเดท `.devin/rules/` ทั้ง 3 subdirectories ตาม project analysis และ dependencies จริง

1. ทำ `/update-devin-project-rules` เพื่ออัพเดท rules ใน `.devin/rules/always-on/`, `.devin/rules/model_decision/`, และ `.devin/rules/glob/`
2. ตรวจสอบว่า devin rules ครอบคลุม tools ทั้งหมดจาก `package.json` ทั้ง root และ workspace
3. ตรวจสอบว่า devin rules ครอบคลุม domain patterns และ file patterns ที่สำคัญ
4. ลบ rules ที่ล้าสมัยหรือไม่ใช้แล้ว และอัพเดท references ทั้งหมด

### 2. Update Ast-Grep Rules

> Goal: อัพเดท `rules/` directory ที่ project root ให้ครอบคลุมทุก devin rules ที่อัพเดทใน step 1 และสอดคล้องกับ official documentation

1. ทำ `/update-ast-grep-rules` เพื่อแปลง devin rules ทั้งหมดจาก step 1 เป็น ast-grep YAML format
2. ตรวจสอบ coverage ทุก devin rule: สำหรับทุกไฟล์ใน `.devin/rules/always-on/`, `.devin/rules/model_decision/`, `.devin/rules/glob/` ต้องมี ast-grep rule ที่เกี่ยวข้อง ถ้าแปลงไม่ได้ ให้ระบุเหตุผลและใช้ `/use-scripts` แทน
3. ถ้า ast-grep ไม่เหมาะสม ให้ทำ `/use-scripts` แทน เช่น ต้องวิเคราะห์ context ข้ามไฟล์, ตรวจสอบ runtime behavior, หรือ pattern ที่ AST จับไม่ได้
4. ตรวจสอบว่า `sgconfig.yml` ตั้งค่า `ruleDirs`, `languageAliases`, และ `devPaths` ครบถ้วน
5. ตรวจสอบว่า ast-grep rules ครอบคลุม atomic, relational, และ composite rules
6. ลบ ast-grep rules ที่ล้าสมัยหรือไม่ใช้แล้ว และอัพเดท `sgconfig.yml` และ references ทั้งหมด
7. รัน `bunx ast-grep scan --inspect summary` เพื่อตรวจสอบ rules ทั้งหมด effective

### 3. Update AGENTS.md

> Goal: อัพเดท `AGENTS.md`

อัพเดท `AGENTS.md` ให้สอดคล้องกับ rules ที่อัพเดท

1. ทำ `/update-agents-md` เพื่อเขียน `AGENTS.md` ตาม project analysis และ dependencies ล่าสุด
2. ตรวจสอบว่า `AGENTS.md` ระบุ workflows และ skills ที่สอดคล้องกับ rules ใหม่
3. ตรวจสอบว่า root และ workspace `AGENTS.md` อัพเดทครบถ้วน

### 4. Validate And Finalize

> Goal: ยืนยัน rules ทั้งสองระบบถูกต้องและสอดคล้องกัน

1. ทำ `/review-rules` เพื่อปรับปรุง rule files ให้สมบูรณ์ สอดคล้องกับ project ไม่ซ้ำซ้อน และตรวจสอบความถูกต้องของ rules ทั้งหมดและ references
2. รัน `bun run scan` เพื่อตรวจสอบ ast-grep rules ทำงานได้
3. รัน `bun run typecheck` เพื่อตรวจสอบไม่มี type errors จากการเปลี่ยนแปลง
4. รัน `bun run lint` เพื่อตรวจสอบไม่มี lint errors
5. ตรวจสอบว่า rules ทั้งสองระบบ (devin และ ast-grep) สอดคล้องกัน

## Rules

### 1. Execution Order

- ทำ `/update-devin-project-rules` ก่อนเสมอ เพราะ ast-grep rules อ้างอิงจาก devin rules
- ลบ devin rules ที่ล้าสมัยหลังจากอัพเดทเสร็จ และอัพเดท references
- ทำ `/update-ast-grep-rules` หลังจาก devin rules อัพเดทเสร็จ ใช้ `/use-scripts` แทนเมื่อ ast-grep ไม่เหมาะสม เช่น ต้องวิเคราะห์ context ข้ามไฟล์ หรือ pattern ที่ AST จับไม่ได้
- ลบ ast-grep rules ที่ล้าสมัยหลังจากอัพเดทเสร็จ และอัพเดท `sgconfig.yml` และ references

### 2. Full Coverage

- ทุก devin rule ที่แปลงเป็น ast-grep ได้ ต้องมี ast-grep rule ที่เกี่ยวข้อง — ห้ามมี devin rule ที่ขาด ast-grep counterpart โดยไม่ระบุเหตุผล
- ถ้า devin rule เพิ่ม/เปลี่ยน/ลบ ให้ตรวจสอบและอัพเดท ast-grep rule ที่เกี่ยวข้องทันที
- ถ้า ast-grep rule เพิ่ม/ลบ ให้ตรวจสอบว่า `sgconfig.yml` และ scripts อัพเดทด้วย
- Devin rules และ ast-grep rules ต้องสอดคล้องกัน ไม่ขัดแย้งกัน

## Expected Outcome

- `.devin/rules/` ครอบคลุม tools, domains, และ file patterns ทั้งหมดจาก `package.json` และ codebase analysis
- `rules/` (ast-grep) ครอบคลุม atomic, relational, และ composite rules ที่ครบทุก devin rules ที่แปลงได้ — ไม่มี devin rule ที่ขาด ast-grep counterpart โดยไม่ระบุเหตุผล
- `AGENTS.md` อัพเดทครบถ้วนทั้ง root และ workspace level ด้วย `/update-agents-md`
- `sgconfig.yml` ตั้งค่าครบถ้วน: `ruleDirs`, `languageAliases`, `devPaths`
- `bun run scan` ทำงานได้และ report ผลลัพธ์
- `bun run typecheck` และ `bun run lint` ผ่าน
- Rules ทั้งสองระบบสอดคล้องกันและไม่ขัดแย้ง
