# Context Rot Checks

> Goal: ตรวจ harness ว่า content เน่าเสื่อมตามเวลา — stale versions/commands, dead references, claims ที่ไม่ตรงความจริง, context bloat

## 1. Stale Content

1. ทำ `/check-content-outdate` กับ skills repo — version pins, `(verified YYYY-MM-DD)` markers, deprecated commands, dead links
2. รายงาน skill ที่ marker เก่ากว่า threshold (เช่น verified > 90 วัน หรือ version pin ต่างจาก latest เกิน 1 major)
3. route fixes ไป `/update-devin-global-skills` หรือ `update-*-md`

## 2. Incorrect Content

1. ทำ `/check-correctness` กับ skills ที่แก้ล่าสุดหรือ high-traffic — commands/APIs/claims ต้องตรง ground truth
2. claims ที่ unverified → flag Warning ให้ cite source

## 3. Dead Weight

1. Skills/subagents ที่ไม่ถูก invoke เลย (เทียบ `/check-skill-usage`) → candidate สำหรับ merge/remove
2. `references/` ที่ไม่ถูก link จาก SKILL.md → orphan files
3. `related` entries ที่ชี้ไป skills ที่ถูกลบ/merge แล้ว (checker ครอบคลุมส่วนใหญ่ — เสริมด้วย spot check)

## 4. Context Bloat

1. SKILL.md ใกล้/เกิน 250 บรรทัด → เสนอ split ไป `references/`
2. `references/` รวมใหญ่ผิดปกติต่อ skill (> ~1500 บรรทัดรวม) → พิจารณา consolidate
3. `related` > 15 entries → พิจารณาตัดให้เหลือที่จำเป็น — related ยาว = context cost ทุก invocation

## Scoring

| Finding | Severity |
|---------|----------|
| command/API ที่ใช้ไม่ได้แล้วใน skill ที่ invoke บ่อย | Critical |
| version pin เก่า >1 major ใน skill active | Warning |
| orphan references / dead related | Warning |
| context bloat (ไฟล์ยาว/related เยอะ) | Info |
| verified marker เก่าแต่ content ยังตรง | Info |
