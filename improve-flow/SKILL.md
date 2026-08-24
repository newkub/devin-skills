---
name: improve-flow
description: ปรับปรุง flow ของ workflow ให้ fail-fast ชัดเจน ลด bottleneck และ parallel ได้เมื่องปลอดภัย
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - report
---
## Goal

ปรับปรุง flow ของ workflow file ให้ fail-fast ชัดเจน ลด bottleneck และ parallel ได้เมื่องปลอดภัย โดยรักษา deterministic และ intent เดิม

## Scope

ใช้กับ workflow files ใน `global_workflows/` และ workspace workflows — ปรับ step ordering, dependencies, parallelism, transitions ตาม `/follow-write-devin-skills` Rule `Flow And Parallelism`

## Execute

### 1. Map Current Flow
> Goal: Map Current Flow

วิเคราะห์ flow ปัจจุบัน

1. อ่าน workflow ที่ต้องปรับปรุง พร้อม frontmatter และ `related`
2. ระบุ steps ทั้งหมด รวม dependencies, inputs, outputs, side effects
3. ระบุ branches/conditions เช่น `ถ้า X → stop/report`, `ถ้า fail → retry`
4. บันทึก flow เป็น list หรือ diagram ง่ายๆ เพื่อวิเคราะห์

### 2. Identify Flow Issues
> Goal: Identify Flow Issues

หาปัญหา flow ที่ทำให้ช้าหรือ fail ช้า

1. หา validation หรือ reference check ที่ควรย้ายไปต้น (fail-fast)
2. หา hidden dependencies ที่ไม่ได้ระบุชัดเจน
3. หา steps ที่อ่าน/scan/search อิสระแต่ยัง sequential → parallel ได้
4. หา high-risk หรือ destructive ที่ควรมี dry run/confirm ก่อน
5. หา transitions ที่ไม่ชัด เช่น `จากนั้น` โดยไม่มีเงื่องไข
6. ถ้า flow ซับซ้อน → ทำ `/use-scripts` ช่วยวิเคราะห์ dependencies และ ordering

### 3. Reorder And Parallelize
> Goal: Reorder And Parallelize

ปรับลำดับ steps และเพิ่ม parallelism

1. เรียง steps ตาม: foundation → validation → high impact → dependencies → report/cleanup
2. ย้าย context/reference/requirement checks ไปต้นเพื่อ fail-fast
3. ทำ `/follow-parallel` เพื่อรวม independent reads/scans/searches เป็น parallel batch
4. ใช้ `/follow-subagents` หรือ sequential steps สำหรับ independent operations ตาม `/follow-write-devin-skills` Rule `Flow And Parallelism`
5. ถ้า step ใหญ่เกินไปหรือมีหลายหน้าที่ → ทำ `/plan` เพื่อแยกเป็น sub-workflows
6. ทำ `/follow-deterministic` เพื่อตรวจสอบว่า parallel ไม่เปลี่ยนผลลัพธ์

### 4. Clarify Transitions
> Goal: Clarify Transitions

ทำ transitions และ conditions ชัดเจน

1. ระบุ condition สำหรับทุก branch: `ถ้า X → Y`, `ถ้าไม่ X → Z`
2. ใช้ `stop/report` เมื่อง context/ref ไม่ชัด หรือ validation fail
3. ใช้ `retry (max 3 → stop/report)` สำหรับ recoverable failures ที่ชัดเจน
4. ห้ามใช้คำกำกวม เช่น `จากนั้น` โดยไม่มีเหตุผลหรือเงื่องไข
5. ทำ `/dont-over-engineer` เพื่อไม่เพิ่ม transitions ที่ไม่จำเป็นทำให้ flow ซับซ้อน

### 5. Validate And Report
> Goal: Validate And Report

ตรวจสอบผลการปรับปรุง

1. ทำ `/review-correctness` เพื่อ verify flow ถูกต้อง
2. ทำ `/check-reference` เพื่อยืนยัน references ทั้งหมดถูกต้อง
3. ทำ `/review-codebase` เพื่อตรวจ content ไม่ซ้ำซ้อนหลังแก้ flow
4. ตรวจสอบ workflow ไม่เกิน 250 บรรทัด และ steps ไม่เกิน 10
5. ทำ `/report` เพื่อสรุปการปรับปรุง flow
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Fail Fast

- ตรวจ context, references, requirements ให้เร็วทีสุดก่อนเริ่มงานหลัก
- validation ก่อน processing ในทุก step ที่จำเป็น
- ถ้า context ไม่ชัดหรือ reference ไม่มี → stop/report ทันที

### 2. Dependencies Explicit

- ระบุ dependency ของทุก step ชัดเจน
- dependent step ต้องอยู่หลัง prerequisite step
- ไม่ซ่อน ordering ด้วยคำกำกวม เช่น `จากนั้น` โดยไม่มีเงื่องไข
- ถ้า A ต้องใช้ผลจาก B → B ต้องมาก่อน A

### 3. Parallel When Safe

- อ่าน/scan/search/check อิสระ → รวมเป็น parallel batch
- สร้าง/แก้ไข/ลบไฟล์เดียวกันหรือ state เดียวกัน → sequential
- ไม่ใช้ `parallel:` หรือ `∥` ใน Execute numbered list ตาม `/follow-write-devin-skills`
- parallel operation ต้องไม่แชร์ mutable state หรือ resource ที่ไม่ปลอดภัย

### 4. Deterministic

- flow เดียวกัน input เดียวกัน → ผลลัพธ์เดียวกันเสมอ
- ไม่พึ่ง execution order ของ parallel results → ใช้ key หรือ label ระบุผลลัพธ์
- ระบุ retry limit (max 3 → stop/report) สำหรับ recoverable failures
- ทำ `/follow-deterministic` เมื่อ reorder หรือ parallelize เสร็จ

### 5. Minimal Changes

- ไม่ reorder เพื่อความสวยงามอย่างเดียว ถ้าไม่ได้ช่วย fail-fast หรือ parallelize
- รักษา workflow intent และ public behavior เดิม
- ใช้ `/dont-over-engineer` เพื่อหลีกเลี่ยง over-parallelization หรือ over-branching
- ถ้า flow ยังดีอยู่ → ข้าม ไม่ force change

### 6. Verification

- ทำ `/review-correctness` และ `/check-reference` ก่อนและหลังแก้ flow
- ตรวจสอบ workflow ไม่เกิน 250 บรรทัด และ steps ไม่เกิน 10
- ห้ามใช้ `**` (bold markers) ใน workflow
- ใช้ backticks สำหรับ `tools`, `commands`, `workflow-name`, และ transition markers

## Expected Outcome

- workflow มี flow ที่ fail-fast ชัดเจน
- bottleneck ลดลงด้วย parallel ที่ปลอดภัย
- dependencies และ transitions ชัดเจน
- ไม่มี broken references
- workflow ไม่เกิน 250 บรรทัด และ steps ไม่เกิน 10
- flow ยัง deterministic และสอดคล้องกับ `/follow-write-devin-skills`
- มี report สรุปการปรับปรุง flow
