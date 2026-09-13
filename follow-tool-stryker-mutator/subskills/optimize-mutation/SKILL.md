---
name: follow-tool-stryker-mutator-optimize-mutation
description: ปรับ Stryker mutation testing ให้เร็ว — incremental, mutator filtering, concurrency, thresholds
argument-hint: "[scope]"
related:
  - follow-tool-stryker-mutator
  - run-test
  - deep-optimize
  - check-bottlenecks
  - setup-cicd
---

## Goal

ลดเวลาและขอบเขตของ Stryker mutation runs — incremental mode, กรอง mutators, concurrency, thresholds — โดยยังได้ signal ที่มีนัยสำคัญ

## Scope

- Optimize Stryker ที่ setup แล้ว (setup → `subskills/setup-stryker`)
- ครอบคลุม: incremental mode, `mutator`/`mutate` filtering, `concurrency`, `thresholds`, CI strategy
- ไม่ครอบคลุม: เพิ่ม tests สำหรับ surviving mutants (ทำ `/update-tests`)

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมก่อน tune

1. รัน `bunx stryker run` จับเวลา — เก็บ duration, mutant count, mutation score
2. ระบุ bottleneck: mutant count สูง, sandbox rebuild, slow tests — ทำ `/check-bottlenecks`
3. ดู report ว่า mutants กระจุกตัวที่ไหน — files ที่มี mutants เยอะแต่ low value

### 2. Enable Incremental Mode

> Goal: รันเฉพาะ mutants ที่เกี่ยวกับ changed code

1. เปิด `incremental: true` ใน config — Stryker reuse ผลจาก run ก่อนสำหรับ files ที่ไม่เปลี่ยน
2. ใช้ร่วมกับ `--since <ref>` (เช่น `--since main`) เพื่อ mutate เฉพาะ changed files ใน PR
3. เหมาะกับ PR checks — full run เก็บไว้สำหรับ main branch/scheduled job

### 3. Filter Mutants

> Goal: ลด mutant count ที่ low value

1. แคบ `mutate` glob — เฉพาะ source ที่สำคัญ ข้าม DTOs, type-only files, generated code
2. ใช้ `mutator.excludedMutations` ข้าม operators ที่ noise สูง เช่น `['StringLiteral']` — เลือกให้เหมาะกับ project
3. ใช้ `// Stryker disable <operators>` comment เฉพาะจุดที่ justify ได้ — อย่า disable มั่ว
4. ตรวจ `timeout` mutants — ถ้าเยอะให้เช็คว่า tests ช้าเองหรือ mutant ทำ infinite loop

### 4. Tune Concurrency And Thresholds

> Goal: ใช้ resources ให้เต็มและ gate ผลลัพธ์

1. ตั้ง `concurrency` ตาม CPU cores ที่มีจริง — default มักพอ แต่เครื่องใหญ่ขึ้นได้
2. ตั้ง `thresholds: { high, low, break }` — `break` ทำให้ exit code fail ถ้า score ต่ำกว่า → ใช้เป็น CI gate
3. เริ่ม `break` ต่ำแล้วค่อยขึ้น — อย่าตั้งสูงจน block ทุก PR
4. `coverageAnalysis: 'perTest'` (ควรตั้งไว้แล้ว) — อย่าลดเป็น `all` ถ้าไม่จำเป็น

### 5. Measure And Report

> Goal: วัดซ้ำและสรุปผล

1. รันซ้ำหลังแก้แต่ละจุด — compare duration และ mutation score กับ baseline
2. ทำ `/report-before-after` รายงานตัวเลขก่อน/หลัง
3. ถ้า score drop เพราะ filtering มากเกิน → คลาย filter แล้ว report trade-off

## Rules

- Baseline ก่อนเสมอ — ห้าม tune โดยไม่มีตัวเลขเดิม
- Filtering ต้องไม่ทำให้ score เทียบไม่ได้ — ระบุ exclusions ใน config ชัดเจน
- `// Stryker disable` เฉพาะที่ justify ได้พร้อมเหตุผล
- Incremental/scoped runs เหมาะกับ PR — อย่าแทนที่ full runs ทั้งหมด
- `thresholds.break` เป็น CI gate — ปรับค่อยๆ ขึ้น ไม่ใช่ตั้งสูงตั้งแต่แรก

## Expected Outcome

- Mutation runs เร็วขึ้นโดยวัดได้ โดยเฉพาะใน CI/PR
- Mutant scope โฟกัสที่ high-value code
- Thresholds gate score ใน CI โดยไม่ block ทุกอย่าง
