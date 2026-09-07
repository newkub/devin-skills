---
name: diff-file-history
description: เทียบไฟล์เดียวกันข้าม git history — evolution, regressions และ change patterns
argument-hint: "<path> [range]"
related:
  - git-file-history
  - report-table
---

## Goal

วิเคราะห์ evolution ของไฟล์ข้าม git history — เมื่อไหร่เปลี่ยน, เปลี่ยนอะไร, โดยใคร, เพิ่มหรือลด — เพื่อเข้าใจ context, หา regression point หรือ trace decision history

## Scope

- ตรวจ file เดียวข้าม commits: change frequency, growth/shrink, major rewrites, regression points
- ครอบคลุม: per-commit diffs, line counts over time, blame patterns, rename history
- Read-only: วิเคราะห์จาก git — ไม่แก้ไฟล์หรือ history

## Execute

### 1. Trace File History

> Goal: map commit timeline ของไฟล์

1. `git log --follow --oneline -- <path>` — รวม rename history ด้วย `--follow`
2. ระบุ: created เมื่อไหร่, renamed จากไหน, last modified เมื่อไหร่
3. flag: gaps ยาวใน history (ไฟล์ abandoned?) vs เปลี่ยนบ่อยมาก (hotspot?)

### 2. Measure Evolution

> Goal: วัดว่าไฟล์เปลี่ยนยังไงข้ามเวลา

1. Line count ต่อ commit: `git log -p` หรือ `git show <sha>:<path> | measure` — growth trend
2. Commit authors ต่อไฟล์ — เจ้าของหลักคือใคร
3. จัดประเภท commits: features, fixes, refactors — จาก messages + diff nature

### 3. Find Key Changes

> Goal: หา commits ที่เปลี่ยนแปลงสำคัญ

1. Major rewrites: commits ที่ diff ใหญ่ผิดปกติ (>50% ของไฟล์)
2. Regression candidates: ถ้า bug ปัจจุบัน → bisect-style หา commit ที่ introduce
3. `git log -S"<pattern>"` — หาเมื่อไหร่ที่ string/symbol เข้าหรือออก (pickaxe)
4. `/view-diff` หรือ `/git-file-history` สำหรับ diff ละเอียดต่อ commit ที่สนใจ

### 4. Report Evolution

> Goal: สรุป history เป็น insight

1. ใช้ `/report-table`: `No.`, `Commit`, `Date`, `Author`, `Lines Δ`, `Type`, `Significance`
2. Timeline summary: created → major changes → current state
3. Insights: hotspot (เปลี่ยนบ่อย = ควร split/refactor?), stable (ไม่แตะนาน), regression point (ถ้าหาเจอ)

## Rules

### 1. Follow Renames

- ใช้ `--follow` เสมอ — rename แล้ว history ไม่ขาด
- รวม pre-rename history ใน analysis

### 2. Evidence-Based

- ทุก claim อ้าง commit SHAs จริง — ไม่สรุปจาก messages อย่างเดียว
- line counts และ diff sizes ต้องวัดจริง

### 3. Purpose Driven

- ตอบคำถามที่ user ต้องการ — regression hunt, context, ownership — ไม่ dump history ดิบ
- ระบุข้อจำกัด: shallow clones, history rewrites ทำให้ history ไม่ครบ

## Expected Outcome

- Timeline ของไฟล์พร้อม key commits
- Change patterns: hotspot vs stable, growth trend, ownership
- Regression point ถ้าหาเจอ พร้อม commit SHA ที่แน่ชัด
