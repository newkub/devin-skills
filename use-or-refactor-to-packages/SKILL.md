---
name: use-or-refactor-to-packages
description: ประเมินและ refactor packages ให้มี SRP หรือแนะนำ packages จาก workspace ที่ควรนำมาใช้
---

## Goal

Refactor packages ให้มี single responsibility ตาม SRP และแนะนำ packages จาก workspace ที่ควรนำมาใช้

## Scope

ครอบคลุมการตัดสินใจว่าควร refactor packages หรือไม่, ประเมิน cohesion, change frequency, deployment boundaries, และแนะนำ packages จาก workspace ที่ควรนำมาใช้

## Execute

### 1. Analyze Project And Packages

วิเคราะห์โปรเจกต์และ packages ปัจจุบัน

> Goal: เข้าใจโครงสร้างปัจจุบัน dependencies และ package complexity

1. อ่าน `package.json`, `Cargo.toml`, หรือไฟล์จัดการ dependencies ที่เกี่ยวข้อง
2. ทำ `/analyze-project` เพื่อดูภาพรวมโปรเจกต์และระบุประเภท (web, backend, desktop, mobile, library)
3. ทำ `/deep-analyze` เพื่อวิเคราะห์ cognitive complexity, navigability, reasons to change และ coupling ของแต่ละ package
4. ทำ `/scan-codebase` เพื่อค้นหา consumers, call sites และ import patterns ของแต่ละ package
5. ทำ `/check-unused-deps` เพื่อระบุ dependencies ที่ไม่ได้ใช้และ test setup complexity
6. ถ้าเป็น monorepo → ทำ `/follow-monorepo`; ถ้า analyze ไม่ได้ → stop และ report

### 2. Evaluate Refactor Necessity

ประเมินว่าควร refactor หรือไม่

> Goal: ตัดสินใจ refactor อย่างมีหลักฐาน ไม่ฝืนแยก

1. วิเคราะห์ change patterns: เปลี่ยนพร้อมกัน, maintain โดยทีมเดียวกัน, release lifecycle เดียวกันหรือไม่
2. ประเมิน refactor signals:
   - Refactor: หลาย reasons to change, test setup ยุ่ง, coupling สูง, `/check-duplication` พบ code ซ้ำข้าม packages
   - ไม่ refactor: แยกแล้ว import วน, แยกแล้วต้องส่ง dependency เยอะ, ทุกอย่างเปลี่ยนพร้อมกันเสมอ
3. พิจารณา deployment boundaries — อย่าแยก concerns ที่ deploy ร่วมกันเสมอ และทำ `/dont-over-engineer` เพื่อกำหนดขอบเขต minimal
4. ถ้า package มี single responsibility ชัดเจนและ cohesive สูง → ไม่ refactor และ skip ไป step 4

### 3. Plan Refactor Strategy

วางแผนการ refactor เมื่อจำเป็น

> Goal: แผน refactor ชัดเจน ไม่ทำลาย stability

1. ทำ `/use-or-refactor-to-modules` เพื่อแยก modules ภายใน package ที่มี mixed concerns
2. จัดลำดับ dependencies ระหว่าง packages ให้ชัดเจน — ไม่สร้าง circular dependencies
3. สร้าง abstractions เมื่อจำเป็นและ beneficial เท่านั้น พร้อมวางแผน versioning strategy
4. ตรวจสอบ backward compatibility — consumers ยังใช้งานได้; ถ้ามี over-refactoring signs → revise
5. ทำ `/report-plan` ก่อนลงมือ execute

### 4. Scan And Recommend Workspace Packages

สำรวจ packages ใน workspace และแนะนำที่ควรนำมาใช้

> Goal: รายงาน packages ที่ควรใช้แบ่งตาม priority พร้อม integration path

1. สำรวจโครงสร้าง workspace และอ่าน `package.json` หรือ `Cargo.toml` ของแต่ละ package
2. จัดกลุ่ม packages ตามประเภท: UI Components, Utilities, Frameworks, Libraries, Tools, Integrations
3. สำหรับแต่ละ package ตรวจสอบ: ความเข้ากันได้ (ภาษา, platform, dependencies), ประโยชน์ (ลด duplication, เพิ่มประสิทธิภาพ, ปรับปรุง DX), สถานะ (version stability, maintenance, docs)
4. ทำ `/use-lib-effective` เพื่อวิเคราะห์ dependencies และใช้ libraries ให้ครอบคลุม
5. สร้างรายงานแนะนำแบ่งตาม priority:
   - High — แก้ปัญหาที่มีอยู่, ลด duplication ชัดเจน, เพิ่มประสิทธิภาพอย่างมีนัย
   - Medium — ปรับปรุง DX, เพิ่ม features ที่มีประโยชน์, มี trade-offs
   - Low — อาจไม่จำเป็น, over-engineering, dependencies มากเกินไป
6. รายงานต้องประกอบด้วย: ชื่อ package, version, เหตุผล, วิธีติดตั้ง, trade-offs, breaking changes (ถ้ามี)

### 5. Execute Refactor

ดำเนินการ refactor ตามแผน

> Goal: Refactor ตามแผน ผ่าน tests ไม่ทำลาย consumers

1. ดำเนินการ split/merge packages ตาม strategy จาก step 3
2. อัปเดท `package.json` dependencies และ import paths ในทุก packages
3. ทำ `/update-reference` เพื่ออัปเดท references ทั้งหมด
4. ถ้ามี broken references → ทำ `/resolve-errors`
5. ติดตั้ง packages ที่แนะนำจาก step 4 ตาม priority

### 6. Verify Impact

ตรวจสอบผลกระทบของ refactor

> Goal: Package ดีขึ้น ไม่มี regression ไม่มี circular dependencies

1. ทำ `/run-test` เพื่อยืนยัน functionality
2. ทำ `/run-lint` เพื่อตรวจสอบ code quality
3. ทำ `/check-circular-dependencies` เพื่อตรวจสอบและแก้ไข circular dependencies ระหว่าง packages
4. ประเมินว่าไม่เกิด fragmentation และ consumers ยังใช้งานได้
5. เปรียบเทียบ package quality กับก่อน refactor — ถ้าไม่ดีขึ้น → rollback และ report

## Rules

### 1. Cohesion First

- ไม่แยก packages เพื่อ conceptual purity เท่านั้น — รวม code ที่ changes together, deploys together, tests together
- หลีกเลี่ยง fragmentation ที่เพิ่ม cognitive load — พิจารณา dependency graph complexity

### 2. When To Refactor Vs Not

- Refactor: หลาย reasons to change, ยาก test, coupling สูง, ไม่ reusable, dependencies ไม่จำเป็น
- ไม่ refactor: single responsibility ชัดเจน, cohesive สูง, changes together, deploys together
- ถ้า refactor จะทำลาย stability หรือเพิ่ม fragmentation → อย่า refactor

### 3. Appropriate Coupling And Avoid Over-Refactoring

- ใช้ abstractions เมื่อจำเป็นและ beneficial — ไม่ lock implementation โดยไม่จำเป็น
- ไม่แยก micro-packages หรือสร้าง abstractions ที่ไม่จำเป็น — ใช้ `/dont-over-engineer`
- Dependencies ระหว่าง packages ชัดเจนและจำเป็น — ใช้ language idioms อย่างเหมาะสม

### 4. Package Recommendation Criteria

- ประเมินตาม: relevance, compatibility, stability, documentation, adoption, maintenance
- ไม่แนะนำ packages ที่ซับซ้อนเกินความจำเป็น, มี dependencies มากเกินไป, ไม่มี clear benefit หรือไม่มีการ maintain
- พิจารณา context: ขนาดโปรเจกต์, ทีม, timeline, constraints (performance, security, compliance)

## Expected Outcome

- Packages ที่มี single responsibility, high cohesion, low coupling, dependency graph ที่จัดการได้
- ไม่ over-refactor หรือ fragmentation
- รายงาน packages ที่ควรใช้แบ่งตาม priority พร้อม integration path
- Code ผ่าน tests และ lint ไม่มี circular dependencies และ regression
