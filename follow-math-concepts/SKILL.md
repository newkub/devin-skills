---
name: follow-math-concepts
description: คู่มือคณิตศาสตร์สำหรับ software development
argument-hint: "[topic]"
related:
  - follow-context-engineering
  - deep-research
  - follow-best-practice
  - follow-algorithms
  - report-math-equation
  - explain
  - learn-references
  - follow-lib-fast-check
  - review-performance
  - learn-by-slide
  - ask-me
---

## Goal

ให้ผู้ใช้เข้าใจและประยุกต์ใช้คณิตศาสตร์ในการพัฒนาซอฟต์แวร์

## Scope

ใช้สำหรับเข้าใจ concepts ทั่วไป: algorithms, discrete math, linear algebra, information theory, set theory, algorithm complexity

## Execute

### 1. Select Topic

> Goal: รู้ว่าจะใช้เนื้อหาคณิตศาสตร์ด้านไหน

1. รับ `topic` จาก argument หรือ context
2. ถ้าไม่ระบุ ให้ดูตาราง topics ด้านล่างและถามผู้ใช้ด้วย `/ask-me`
3. เลือกอ่าน `references/{topic}.md` ที่ตรงกับ topic
4. สำหรับ sources และ references ภาพรวม ดู [references/math-resources.md](references/math-resources.md) และ [references/website.md](references/website.md)

| No. | Topic | Reference |
|-----|-------|-----------|
| 1 | algorithm-complexity | [references/algorithm-complexity.md](references/algorithm-complexity.md) |
| 2 | boolean-algebra | [references/boolean-algebra.md](references/boolean-algebra.md) |
| 3 | category-theory | [references/category-theory.md](references/category-theory.md) |
| 4 | combinatorics | [references/combinatorics.md](references/combinatorics.md) |
| 5 | cryptography | [references/cryptography.md](references/cryptography.md) |
| 6 | discrete-math | [references/discrete-math.md](references/discrete-math.md) |
| 7 | game-theory | [references/game-theory.md](references/game-theory.md) |
| 8 | graph-theory | [references/graph-theory.md](references/graph-theory.md) |
| 9 | information-theory | [references/information-theory.md](references/information-theory.md) |
| 10 | linear-algebra | [references/linear-algebra.md](references/linear-algebra.md) |
| 11 | numerical-methods | [references/numerical-methods.md](references/numerical-methods.md) |
| 12 | optimization | [references/optimization.md](references/optimization.md) |
| 13 | predicate-logic | [references/predicate-logic.md](references/predicate-logic.md) |
| 14 | probability | [references/probability.md](references/probability.md) |
| 15 | proofs | [references/proofs.md](references/proofs.md) |
| 16 | propositional-logic | [references/propositional-logic.md](references/propositional-logic.md) |
| 17 | set-theory | [references/set-theory.md](references/set-theory.md) |
| 18 | statistics | [references/statistics.md](references/statistics.md) |

### 2. Apply Mathematics

> Goal: ประยุกต์ใช้คณิตศาสตร์กับปัญหา

1. ระบุ domain ที่ต้องการแก้ไข
2. เลือก concepts จาก `references/{topic}.md` ที่เหมาะสม
3. สร้างตัวอย่างหรือ model ตาม concepts
4. ทดสอบความถูกต้อง
5. อ้างอิง sources ที่เชื่อถือได้
6. ถ้าต้องหา sources เพิ่ม → ใช้ `/deep-research`

## Rules

- ใช้ภาษาไทยในการอธิบาย
- ให้ examples ที่ชัดเจนและใช้งานได้จริง
- อ้างอิง sources ที่เชื่อถือได้
- อัปเดต content ให้ทันสมัยตาม version ล่าสุด
- ใช้ `/follow-context-engineering` ถ้าเป้น long-horizon task
- ทำตาม `/follow-best-practice` ถ้าจำเป็น

### 5. Cross Skills

- ใช้ `/follow-algorithms`, `/report-math-equation`, `/explain`, `/learn-references`, `/follow-lib-fast-check`, `/review-performance`, `/learn-by-slide` ตาม context ของปัญหา

## Expected Outcome

- เข้าใจ discrete mathematics สำหรับ algorithms
- สามารถใช้ linear algebra ใน ML และ graphics ได้
- สามารถประยุกต์ใช้ information theory ได้
- สามารถวิเคราะห์ algorithm complexity ได้
