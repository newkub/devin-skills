# Refactor Guidelines

## Goal

ระบุเมื่อไหร่ควรแยก skill หรือไฟล์ `SKILL.md` เป็นไฟล์ย่อยๆ เพื่อ SRP ชัดเจน อ่านง่าย และ maintenance ได้

## When To Refactor

### 1. SKILL.md Over 250 Lines

- ไฟล์ `SKILL.md` ต้องไม่เกิน 250 บรรทัด
- ถ้าเกิน → ดึงส่วนทีละเอียดออกไป `references/<topic>.md`
- `SKILL.md` เหลือเฉพาะ high-level workflow, rules, และ pointer ไป references

### 2. Multiple Responsibilities

- ถ้า skill ทำหลายอย่าง เช่น update + validate + ship ในทีเดียว → แยก `references/validation.md`, `references/bulk-update.md`
- ถ้า skill มีหลาย execute pattern เช่น `run-*` vs `check-*` → แยก `templates/` แทนการเขียนทั้งหมดใน `SKILL.md`

### 3. Dependencies, CLI, Web, Templates, Examples

- ถ้า skill มี dependencies จำเป็น → สร้าง `references/` ครบทุก dependency
- ถ้า skill ต้องการ template → สร้าง `templates/<prefix>.md`
- ถ้ามีตัวอย่างการใช้ → สร้าง `examples/<example>.md`
- ถ้ามี `src/` สำหรับ CLI/web → ดู [src.md](src.md)

### 4. Cross-Skill Overlap

- ถ้าเนื้อหาซ้ำกับ skill อื่น → merge เข้าตัวเดิม หรือย้ายไป skill ที่เหมาะสม
- ถ้า skill หนึ่งตัวตอบสนองหลาย goal ทีแตกต่างกันมาก → แยกเป็น `subskills/` หรือ `subagents/` ตาม decision matrix ใน [references/subskills-and-subagents.md](subskills-and-subagents.md)

### 5. Nested References

- `references/` ต้อง flat — ถ้ามี nested directories → ใช้ `/flatten-directory --mode refs`
- ทุกไฟล์ใน `references/` ไม่เกิน 250 บรรทัด

## How To Refactor

1. ระบุส่วนที่เกินหรือซ้ำ
2. สร้าง `references/<topic>.md` หรือ `templates/<pattern>.md`
3. แทนที่เนื้อหาใน `SKILL.md` ด้วย pointer สั้นๆ
4. อัปเดต internal links ใน `SKILL.md` และ references
5. รัน `/review-devin-global-skills` และ `/deep-validate`

## Expected Outcome

- `SKILL.md` กระชับ ไม่เกิน 250 บรรทัด
- ทุกไฟล์ย่อยมีหน้าที่เดียวชัดเจน
- references ไม่ broken
- ไม่มี content ซ้ำซ้อนข้าม skill
