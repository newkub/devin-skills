---
name: follow-tool-mutants-rs-optimize-mutation
description: ปรับ cargo-mutants ให้เร็ว — skip lists, shard/parallel jobs, CI integration
argument-hint: "[scope]"
related:
  - follow-tool-mutants-rs
  - follow-tool-nextest
  - run-test-mutation
  - deep-optimize
  - setup-cicd
---

## Goal

ลดเวลา cargo-mutants runs — กรอง mutants ที่ low value, parallel jobs, sharding ข้าม machines, incremental CI — โดยยังได้ signal ครบ

## Scope

- Optimize cargo-mutants ที่ setup แล้ว (setup → `subskills/setup-mutants`)
- ครอบคลุม: `#[mutants::skip]`, `exclude_globs`/`exclude_re`, `--jobs`, `--shard`, CI strategy
- ไม่ครอบคลุม: เขียน tests สำหรับ missed mutants (ทำ `/update-tests`)

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมและหา mutants ที่ไม่คุ้ม

1. รัน `cargo mutants` จับเวลา — เก็บ duration และ mutant count
2. ดู `mutants.out/` — หา functions/files ที่ mutants เยอะแต่ low value (logging, getters, trivial)
3. ระบุ tests ที่ช้า — mutants ต่อ test-time คือต้นทุนหลัก

### 2. Prune Low-Value Mutants

> Goal: ลด mutant count ด้วย skip lists

1. ใช้ `#[mutants::skip]` บน functions/impls ที่ไม่น่าสนใจ (ต้องเพิ่ม `mutants` crate เป็น dependency)
2. ตั้ง `exclude_globs` ใน `.cargo/mutants.toml` สำหรับ generated/testdata/infra files
3. ใช้ `exclude_re` (config) หรือ `--exclude-re "pattern"` กรอง mutation patterns เฉพาะ
4. ใช้ `examine_globs` โฟกัสเฉพาะ modules ที่ critical — เช่น domain logic ไม่ใช่ UI glue
5. ทุก exclusion ต้อง justify — เขียน comment หรือเอกสารไว้

### 3. Parallelize

> Goal: ใช้ CPU เต็มที่และแบ่งงานข้าม machines

1. ตั้ง `--jobs`/`-j` สำหรับ parallel builds+tests บนเครื่องเดียว — เริ่ม conservative (`-j2`/`-j3`) เพราะ cargo build กิน resources
2. ตั้ง `test_tool = "nextest"` ถ้ายังไม่ได้ใช้ — fail-fast ลดเวลาต่อ mutant
3. ใช้ `--in-place` ถ้า tree copying ช้า (workspace ใหญ่) — แต่ระวัง side effects บน working tree
4. หลาย machines → `--shard k/n` (k จาก 0 ถึง n-1) — CI รันแต่ละ shard เป็น job แยกแล้วรวมผล
5. ทุก shard ต้องรันด้วย args และ denominator `n` เดียวกัน — ไม่งั้นการแบ่งผิด

### 4. CI Integration

> Goal: วาง cargo-mutants ใน pipeline อย่างคุ้ม

1. PR checks → รันเฉพาะ changed code (`-f`/`--in-diff` กับ diff จาก base) หรือ shard เล็ก
2. Full run → main branch หรือ scheduled (nightly) — mutation testing ช้าเกิน block ทุก PR
3. ใช้ `--baseline=skip` ใน CI ถ้า pre-check ว่า tests ผ่านอยู่แล้ว — ข้าม unmutated re-test
4. Upload `mutants.out/` เป็น artifact — review ผลย้อนหลังได้
5. ติดตั้งผ่าน `taiki-e/install-action` ใน GitHub Actions แทน `cargo install` — เร็วกว่า

### 5. Measure And Report

> Goal: วัดซ้ำและสรุป trade-off

1. รันซ้ำหลังแก้แต่ละจุด — compare duration และ caught/missed กับ baseline
2. ทำ `/report-before-after` รายงานก่อน/หลัง
3. ถ้า exclusions ทำให้ miss mutants ที่ควรจับ → คลาย filter แล้ว report

## Rules

- Baseline ก่อนเสมอ — ห้าม tune โดยไม่มีตัวเลขเดิม
- `#[mutants::skip]`/`exclude_*` ต้องมีเหตุผล — อย่า skip เพื่อให้ score ดูดี
- `--jobs` ตั้ง conservative — cargo build กิน CPU/memory สูง เครื่องอาจ thrash
- Shards ทุกตัว args และ `n` ต้องเหมือนกัน — ผลรวมถึงจะถูก
- Scoped runs ใน PR ไม่แทน full runs — เก็บ scheduled full run ไว้เสมอ

## Expected Outcome

- Mutation runs เร็วขึ้นโดยวัดได้ ทั้ง local และ CI
- Mutant scope โฟกัส critical code — low-value mutants ถูก skip พร้อมเหตุผล
- CI รัน scoped บน PR และ full บน schedule
