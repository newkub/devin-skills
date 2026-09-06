---
name: use-lib-better
description: เปรียบเทียบ dependencies ปัจจุบัน และสรุปว่าควรใช้ dependency อะไร
argument-hint: "[library-or-category]"
related:
  - deep-research
  - learn-from-web
  - use-lib-effective
  - follow-my-tech-stack
  - follow-devin-skills
  - deep-review-codebase
  - optimize-deps
---

## Goal

วิเคราะห์ dependencies ปัจจุบัน, เปรียบเทียบ alternatives, และสรุปว่าควรใช้ เปลี่ยน หรือลบ dependency ใด

## Scope

- ใช้เมื่อต้องตัดสินใจเลือก library หรือ framework
- ไม่รวมการ execute การเปลี่ยนแปลงจริง (ให้ส่งต่อไปยัง `/deep-review-codebase` ถ้าต้องการทำ)
- ใช้กับ dependencies ทุก ecosystem (npm, cargo, pip, go, etc.)

## Execute

### 1. Setup

> Goal: เตรียม context และ tools

1. อ่าน project manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, ฯลฯ)
2. รัน `/follow-my-tech-stack` เพื่อดู tech stack ทั้งหมด
3. รัน `/follow-devin-skills` เพื่ออ่าน workflows ที่เกี่ยวข้อง
4. ถ้าขาด tool หรือ context → รัน `/research-setup`

### 2. Snapshot Dependencies

> Goal: รวบรวม dependencies ปัจจุบัน

1. อ่าน manifest ทั้งหมดใน workspace
2. จัดกลุ่มตาม category: framework, ui, database, testing, tooling, runtime
3. ระบุ:
   - version ปัจจุบัน
   - deprecated / unmaintained packages
   - duplicate packages
   - unused packages (ค้นหาด้วย import grep)

### 3. Analyze Usage

> Goal: ตรวจสอบว่า dependency ถูกใช้จริงหรือไม่

1. ค้นหา imports ของแต่ละ package ใน codebase
2. ระบุ dead dependencies
3. ระบุ packages ที่เป็น candidate สำหรับ replace / upgrade / remove

### 4. Research Alternatives

> Goal: หา alternatives ที่ดีกว่า

1. รัน `/deep-research` เพื่อหา alternatives
2. รัน `/learn-from-web` เพื่ออ่าน official docs ของแต่ละตัว
3. เปรียบเทียบ apples-to-apples:
   - npm trends / Bundlephobia
   - GitHub stars / forks / release frequency
   - bundle size
   - security advisories
4. จำกัดตัวเลือกให้เหลือ 2-3 candidates

### 5. Score Candidates

> Goal: ให้คะแนนทุก candidate ด้วยเกณฑ์เดียวกัน

| Criteria | Weight | Notes |
|---|---:|---|
| Modern | 5 | ใช้ latest standards, APIs, patterns |
| Type Safety | 5 | built-in types หรือ TS definitions ดี |
| Performance | 5 | benchmarks ดีกว่าหรือเทียบเท่า |
| DX | 5 | API ง่าย, docs ดี, error messages ชัด |
| Maintenance | 5 | active, responsive, security updates |
| Bundle Size | 5 | เล็กกว่าหรือเท่ากับปัจจุบัน |
| Dependencies | 5 | น้อยกว่าหรือเท่ากับปัจจุบัน |

คำนวณ Total Score (สูงสุด 35) และระบุ Migration Effort + Risk:
- **Effort**: Low / Medium / High
- **Risk**: Low / Medium / High

### 6. Recommend

> Goal: สรุปผลลัพธ์เป็น actionable list

ตอบด้วยตาราง:

| No. | Category | Current | Recommended | Action | Score | Effort | Risk | Why |
|---:|---|---|---|---:|---|---|---|---|
| 1 | ui | react | solid-js | replace | 30 | Medium | Low | ประหยัด bundle, เร็วขึ้น |

Action ใช้ค่า: `keep`, `upgrade`, `replace`, `remove`

เรียงลำดับตาม priority:
- **High**: Score >= 25, Effort Low, Risk Low
- **Medium**: Score 20-24 หรือ Effort Medium
- **Low**: Score < 20 หรือ Risk High

## Rules

- ตอบเฉพาะรายการที่ควรใช้ / เปลี่ยน / ลบ ไม่ execute การเปลี่ยนแปลง package
- ถ้าพบ unused / duplicate / security issues ให้ reference ไป `/deep-review-codebase`
- ใช้ scoring system ชัดเจน (1-35 points)
- เปรียบเทียบ apples-to-apples กับ version ล่าสุด
- ไม่เขียน migration plan ละเอียด (ให้ `/deep-review-codebase` ทำ)
- ถ้าจำเป็นต้องทดสอบ dependency จริง ให้ส่งต่อไป `/use-lib-effective`

## Expected Outcome

- ตาราง dependencies ที่ควรใช้ พร้อมคะแนน ระดับ priority action และเหตุผล
- ไม่มีการ execute changes
- ชัดเจนว่า dependency ใดควร replace, add, remove, หรือ upgrade
