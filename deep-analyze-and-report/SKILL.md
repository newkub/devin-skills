---
name: deep-analyze-and-report
description: วิเคราะห์เชิงลึกหลายมิติแล้วออกรายงานเป็น artifact — รองรับ compare 2 targets
argument-hint: "[target|compare <a> <b>|scope]"
related:
  - deep-analyze
  - deep-research
  - deep-review
  - scan-codebase
  - report-deep
  - create-report-in-dot-devin
  - report
  - search-project-in-drive-d
  - use-subagents
  - suggest-next-action
---

## Goal

วิเคราะห์ target อย่างลึกซึ้งครบทุกมิติที่เกี่ยวข้อง แล้วออกรายงานที่ actionable เป็น artifact เดียว — ทุก finding มี evidence อ้าง `path:line` ได้ และรองรับโหมด compare 2 targets เพื่อทำ gap matrix

## Scope

- single target: project, codebase, หรือ feature area ใน workspace ปัจจุบัน
- compare: 2 targets (เช่น 2 repo) เทียบที่ระดับ feature/domain เดียวกัน → ตาราง has/missing/partial
- ใช้เมื่อ user ต้องการวิเคราะห์แล้วรายงานในคำสั่งเดียว
- ไม่ใช้แทน `/deep-analyze` (วิเคราะห์อย่างเดียว ไม่มี artifact) หรือ `/deep-review` (code review report-only) — skill นี้ delegate ไปทั้งคู่

## Execute

### 1. Resolve Targets And Mode

> Goal: รู้ว่าจะวิเคราะห์อะไร กี่ target
1. ระบุ target จาก argument; ไม่ระบุ → `/ask-me` ก่อน ห้ามเดา
2. compare → ต้องได้ 2 targets ชัดเจน (path หรือชื่อ repo); หา project ในเครื่องไม่เจอ → `/search-project-in-drive-d`
3. ตรวจว่า target มีอยู่จริงและอ่านได้; เข้าไม่ได้ → report และ stop

### 2. Define Dimensions And Baseline

> Goal: เลือกมิติให้ตรงคำถาม และมีตัวเลขตั้งต้นไว้เทียบ
1. เลือก dimensions ตามคำถาม (เช่น architecture, features, settings, templates, booking flows, data model, integrations) — ไม่รันทุกมิติโดยไม่เกี่ยวกับคำถาม
2. บันทึก baseline ที่วัดซ้ำได้: จำนวน routes/features/files ต่อ domain, tech stack, versions
3. ระบุ critical path ของ analysis: structure → features → data → integration

### 3. Per-Dimension Deep Analysis

> Goal: ได้ข้อเท็จจริงต่อมิติ พร้อม evidence
1. ทำ `/scan-codebase` ดู structure/patterns ก่อน
2. dispatch `/deep-analyze` ต่อ dimension ที่เลือก
3. อ่าน manifest, routes, schema, config แบบ parallel
4. ใช้ `ast-grep`/`grep` หา symbols และ flows ที่ต้องยืนยัน
5. dimensions อิสระกันหลายตัว → `/use-subagents` ทำขนาน แล้ว parent รวมผล

### 4. Feature And Domain Inventory

> Goal: มีรายการ feature ที่อ้างกลับได้ ไม่ใช่ความจำ
1. enumerate feature ต่อ domain ด้วย evidence (route, component, handler, `path:line`)
2. ระบุสถานะจริง: implemented / partial / stub / missing
3. จัดกลุ่มตาม domain ที่ user สนใจ แล้วนับจำนวนต่อ domain

### 5. Cross-Reference And Gap Matrix

> Goal: compare mode → เห็นชัดว่าใครมี/ขาดอะไร
1. เทียบ feature ระดับ domain เดียวกัน; scope ที่ต่างกันต้องระบุ
2. สร้าง gap matrix: feature × target × status + หมายเหตุ
3. จัดลำดับตาม impact/effort; แยก immediate / short-term / long-term
4. single target → ข้ามไป step 6 แต่ยังต้องสรุป findings ตาม impact

### 6. External Validation

> Goal: ยืนยันว่าสิ่งที่ขาดเป็นมาตรฐานจริง ไม่ใช่ความเห็น
1. ทำ `/deep-research` เมื่อต้องยืนยัน best practice หรือมาตรฐานอุตสาหกรรม
2. ระบุ source ทุกครั้ง; official docs มาก่อน
3. เทียบ finding กับ context ของ target — ระบุ assumption

### 7. Assemble Report

> Goal: รายงานที่ actionable ไม่ใช่ dump
1. โครง: สรุปบนสุด (exec summary + ตัวเลข baseline) → ตาราง findings (`No. | Dimension | Finding | Evidence | Severity | Impact | Effort`) → gap matrix (compare) → recommendations → next actions
2. ทุก finding มี evidence `path:line` หรือ command output; assumption ระบุแยก
3. ระบุวันที่และ source ของ analysis

### 8. Persist Artifact

> Goal: ได้ไฟล์ที่เปิดอ่านต่อได้
1. ทำ `/create-report-in-dot-devin` เขียน `.devin/temp/report/<workspace>/`
2. ต้องการแค่สรุปใน chat → `/report-deep`
3. ตรวจ markdown links ชี้ไฟล์จริงทั้งหมด

### 9. Validate Claims

> Goal: ไม่มี claim ที่พิสูจน์ไม่ได้
1. ทำ `/check-reference` ตรวจ claims/paths/versions ชี้ของจริง
2. ไล่ทุก finding ว่ามี evidence ครบ; ตัวที่ไม่มี → ตัดออกหรือย้ายไป assumptions
3. compare mode → ตรวจว่าเทียบ fairness (ระดับเดียวกัน, scope ระบุ)

### 10. Summarize And Next

> Goal: ปิดงานด้วยสรุปและก้าวถัดไป
1. ทำ `/report` สรุป findings, files/artifacts ที่สร้าง
2. ทำ `/suggest-next-action` เสนอ action ถัดไปตาม impact

## Rules

### 1. Evidence Required

- ทุก finding ต้องมี evidence อ้าง `path:line` หรือ command output — ห้ามเดา
- ยืนยันไม่ได้ → ระบุเป็น assumption ชัดเจน ไม่ปนกับ finding

### 2. Read-Only During Analysis

- ห้ามแก้ target ระหว่างวิเคราะห์ (ยกเว้น user สั่งชัด)
- compare mode: ห้ามแก้ทั้งสอง target

### 3. Fair Comparison

- เทียบที่ระดับ feature/domain เดียวกัน; ระบุ scope ที่ต่าง (ขนาด, maturity, ข้อจำกัด)
- ไม่ตัดสินว่า target ไหนดีกว่าโดยไม่มีเกณฑ์

### 4. Actionable Output

- จัดลำดับ impact/effort ทุก recommendation; แยก immediate/short-term/long-term
- next actions ต้องทำได้จริง ระบุไฟล์/จุดที่ต้องแตะ

### 5. Delegate, Don't Duplicate

- analysis → `/deep-analyze`; report format → `/report-deep`/`/create-report-in-dot-devin`; research → `/deep-research`
- ห้าม copy `## Execute` ของ skill อื่น (SSOT)
- หลาย dimension อิสระ → `/use-subagents` ถ้าจำเป็น

### 6. Content Standard

- ไฟล์ ≤250 บรรทัด; ไม่มี TODO/MOCK/placeholder; ไม่มี `**` bold
- ระบุวันที่และ source ของ analysis เสมอ

## Expected Outcome

- เข้าใจ target ครบ dimensions ที่เลือก โดยมีตัวเลข baseline เทียบได้
- รายงาน artifact ที่ทุก finding มี evidence อ้างไฟล์ได้ และเรียงตาม impact/effort
- compare mode → gap matrix ชัดว่า target ไหนมี/ขาด feature อะไร พร้อม next actions
- ไม่มี claim ที่พิสูจน์ไม่ได้ และไม่มี assumption ที่ถูกนำเสนอเป็นข้อเท็จจริง
