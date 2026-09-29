---
name: update-devin-project-rules
description: สร้างและอัปเดต .devin/rules/ Markdown rules สำหรับ always-on, model_decision, glob triggers
argument-hint: "[rule-or-domain]"
related:
  - update-devin
  - report

---

## Goal

สร้างและอัปเดต `.devin/rules/` Markdown rules สำหรับ Devin CLI ตาม project dependencies, conventions และ triggers

## Scope

ใช้สำหรับ `.devin/rules/always-on/`, `.devin/rules/model_decision/`, `.devin/rules/glob/` ใน root project ไม่ใช่ ast-grep rules ใน `rules/`

## Execute

### 1. Analyze Project

> Goal: รู้ dependencies และ conventions

1. อ่าน `package.json`, `AGENTS.md`
2. อ่าน `global_rules.md` ถ้ามี
3. ระบุ tech stack, linters, test framework, build tools
4. ตรวจ `.devin/rules/` ทีมีอยู่

### 2. Plan Rules

> Goal: รู้ rule set ทีต้องมี

1. `always-on/` — rules ที apply ทุก task เสมอ
2. `model_decision/` — rules ที trigger เมื่อ model ตัดสินใจ
3. `glob/` — rules ที trigger ตาม file pattern
4. map dependencies → rule topics เช่น `bun`, `biome`, `vitest`, `moon`

### 3. Create Or Update Rules

> Goal: เขียน rule files

1. ใช้ template ตาม trigger — `templates/always-on.md`, `templates/model_decision.md`, `templates/glob.md` — โดย body ของ rule เป็น markdown table
2. สร้าง `.devin/rules/always-on/<name>.md` สำหรับ global behavior — table columns: `No.`, `Rule`, `When`, `Do`, `Avoid`, `Example`
3. สร้าง `.devin/rules/model_decision/<name>.md` สำหรับ conditional behavior — table columns: `No.`, `Situation`, `Condition`, `Then`, `Example`
4. สร้าง `.devin/rules/glob/<name>.md` สำหรับ file pattern — table columns: `No.`, `Check`, `Then`, `Example`, `Ref`
5. ใช้ frontmatter:

```md
---
name: <rule-name>
description: <short>
trigger: always_on | model_decision | glob
globs:
  - "*.ts"
---
```

6. เนื้อหาภาษาอังกฤษ
7. ระบุ `when`, `then`, `examples` ชัดเจนผ่าน table rows

### 4. Validate Frontmatter

> Goal: ยื่นยัน format

1. `always_on` rules ต้องมี `trigger: always_on`
2. `model_decision` rules ต้องมี `trigger: model_decision`
3. `glob` rules ต้องมี `trigger: glob` และ `globs:` list
4. `name` ตรงกับ filename
5. ตรวจ markdown links

### 5. Report

> Goal: สรุปผล

1. ทำ `/report` แสดง rule, trigger, globs, status
2. ทำ `/suggest-next-action`

## Rules

### 1. Root Only

- `.devin/rules/` อยู่ที่ root เท่านั้น
- ไม่สร้างใน sub-workspace

### 2. Correct Triggers

- `always_on`, `model_decision`, `glob` ต้องตรง directory
- `glob` rules ต้องมี `globs`

### 3. English

- เนื้อหา rules ภาษาอังกฤษ
- ยกเว้น project กำหนดภาษาอื่น

### 4. Specific

- rules ต้องระบุ `when`, `then`, `examples`
- ไม่ generic
- body ของทุก rule file เป็น markdown table ตาม `templates/` — `No.` เป็นคอลัมน์แรกเสมอ

### 5. Ast-Grep Separation

- ast-grep YAML rules อยู่ใน `rules/` ที่ root
- `.devin/rules/` เก็บ Devin CLI Markdown rules เท่านั้น
- ใช้ /update-devin ถ้าจำเป็น


## Expected Outcome

- `.devin/rules/` มี always-on, model_decision, glob rules ครบ
- frontmatter ถูกต้อง
- rules สอดคล้องกับ project dependencies
- report table สรุปผล

