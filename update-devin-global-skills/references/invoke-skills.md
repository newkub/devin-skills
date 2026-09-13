# Invoke Skills

(merged from: use-skills-effective)

## Goal

กำหนดวิธีเรียกและอ้างอิง skills อื่นจากภายใน `SKILL.md` ให้เต็มประสิทธิภาพ — delegate แทน duplicate, dispatch ถูกจังหวะ, และ `related` contract ครบถ้วน

## Scope

ใช้เมื่อเขียนหรือแก้ไข `SKILL.md` ที่ต้องเรียก skill อื่น — ครอบคลุม reference syntax, invocation patterns, ลำดับการเรียก และ anti-patterns

ไม่ครอบคลุม:

- การค้นหา skills ที่เกี่ยวข้อง → ทำ `/use-related-skills` หรือ `/follow-skills-map`
- การเลือก skill ถัดไปตอน runtime → ดู `use-related-skills/references/in-another-skills.md`
- การสร้าง skill ใหม่ → ทำ `/new-skills`

## Execute

### 1. Decide Delegate Vs Inline

> Goal: เลือกว่าจะเรียก skill หรือเขียน steps เอง

1. Delegate เมื่อ skill อื่นครอบคลุม step นั้นแล้ว — เขียน `ทำ /skill-name เพื่อ <เหตุผล>` แทนการ copy steps
2. Inline เฉพาะเมื่อ step เล็ก, ไม่มี skill ครอบคลุม, หรือ skill นั้น heavy เกิน context ของ step
3. ห้าม copy `## Execute` ของ skill อื่นมาแปะ — รักษา single source of truth
4. ถ้า step ทำหลายหน้าที่ → ทำ `/follow-single-responsibility` แยก step ก่อนค่อย delegate

### 2. Write Invocation

> Goal: invocation อ่านแล้วรู้ว่าเรียกอะไร เมื่อไหร่ และคาดหวังอะไร

1. Unconditional: `ทำ /skill-name เพื่อ <เหตุผล>`
2. Conditional: `ถ้า <เงื่อนไขวัดผลได้> → ทำ /skill-name`
3. Optional: `ใช้ /skill-name ถ้าจำเป็น`
4. Dispatch table: `ถ้า <case A> → ทำ /skill-a; ถ้า <case B> → ทำ /skill-b` หรือตาราง mapping
5. Pointer: `ดูเพิ่มเติม: /skill-a, /skill-b` สำหรับ references ไม่ใช่ workflow step
6. ระบุ context ที่ต้องส่งต่อเสมอ: paths, arguments, evidence, expected output — skill ที่ถูกเรียกต้องทำงานได้โดยไม่ต้องเดา

### 3. Order And Parallelize

> Goal: เรียง invocation ให้ fail fast และไม่เสียเวลา

1. เรียง Foundation → Dependencies → High impact → Critical path → High risk
2. เคารพทิศทาง `check-*` → `review-*` → `## Fix` — ห้ามย้อนกลับ
3. ถ้า invocations อิสระต่อกัน → เรียก parallel ใน step เดียวตาม `/follow-parallel`
4. Sequential เฉพาะเมื่อ output ของ skill ก่อนหน้าเป็น input ของ skill ถัดไป

### 4. Maintain Related Contract

> Goal: `related` สะท้อน invocation surface จริง

1. ทุก skill ใน `related` ต้องมี directory จริงและถูก mention ใน body
2. ทุก skill ที่ถูกเรียกใน body ควรอยู่ใน `related` — ไม่เกิน 15 ตัว
3. ห้ามใส่ skill ตัวเองหรือ skill ซ้ำใน `related`
4. ถ้า skill A เรียก skill B → พิจารณาใส่ A ใน `related` ของ B ด้วย (reverse link)
5. เมื่อเพิ่ม/ลบ invocation → ทำ `/update-references` เพื่อ sync ทั้งสองทิศ

### 5. Prevent Composition Failures

> Goal: ไม่มี broken refs, cycles หรือ chain ที่เปราะ

1. ทำ `/check-skills-related` mode `Cycles` หรือ `/check-repo-hygiene circular-dependencies` ก่อน ship
2. ทำ `/check-broken-skills-references` เพื่อ verify ทุก `/skill-name` ที่เรียกมีอยู่จริง
3. ห้ามเรียก skill ตัวเอง หรือ skill ที่กำลัง deprecated
4. ถ้า scope ทับ skill อื่นมาก → merge เข้าตัวเดิมแทนสร้าง invocation chain ยาว

### 6. Validate Composition

> Goal: composition ทำงานได้จริงก่อน ship

1. อ่าน `SKILL.md` ของทุก skill ที่เรียก — verify ว่า contract (input, output, side effects) ตรงกับที่เขียนไว้
2. ทำ `/review-devin-global-skills` เพื่อตรวจ conventions และ cross-skill consistency
3. ทำ `/deep-validate` เพื่อตรวจ frontmatter, links และ references
4. ทำ `/report` สรุป invocation map และผล validate

## Rules

### 1. Delegate Not Duplicate

- อ้าง canonical skill เสมอ ไม่ copy เนื้อหา — alias skill เป็น stub ชี้ canonical เท่านั้น
- ถ้า skill ที่เรียกเปลี่ยน → caller ไม่ต้องแก้ เพราะ reference ไม่ใช่ copy

### 2. Invocation Discipline

- ทุก invocation ต้องมีเหตุผล เงื่อนไข หรือ expected result ที่ตีความได้ทางเดียว
- ห้ามเขียน invocation แบบไม่มีเกณฑ์ เช่น "ลองใช้ /x ดู"
- ไม่เกิน ~5 skill calls ต่อ step — ถ้าเกินให้แยก step หรือทำ orchestrator

### 3. Composition Limits

- ห้าม nested dispatch ลึกเกิน 2 ระดับ (A → B → C พอได้ ลึกกว่านั้นใช้ orchestrator `deep-*` หรือ `/use-subagents`)
- เรียก skill = ทำงานใน context เดียวกัน; ต้องการ isolation → ใช้ `/use-subagents` แทน
- ห้ามเรียก skills ที่ไม่เกี่ยวข้องกับ task ของ skill นั้น

### 4. Evidence And Review

- เลือก skill ที่จะเรียกจาก `Goal`/`Scope` ของมัน ไม่ใช่แค่ชื่อ
- อ่าน skill ปลายทางก่อนเขียน invocation เสมอ
- ทำ `/review-devin-global-skills` และ `/deep-validate` ก่อนจบงาน

## Expected Outcome

- `SKILL.md` เรียก skills อื่นด้วย syntax เดียวกัน มีเหตุผลและเงื่อนไขชัดเจน
- ไม่มี duplicated steps, broken references, หรือ circular dependencies
- `related` ครบถ้วนสองทิศและ sync กับ body
- Composition ผ่าน `/deep-validate` พร้อม invocation map จาก `/report`
