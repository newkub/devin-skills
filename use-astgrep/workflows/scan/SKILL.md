---
name: use-astgrep-scan
description: Scan project ด้วย ast-grep rules — run, filter, format output และ consume findings
argument-hint: "[scope|--flags]"
related:
  - use-astgrep
  - search-with-astgrep
  - update-astgrep-rules
  - improve-astgrep-rules
  - check-code-structure
  - deep-review
  - report
---

## Goal

รัน `ast-grep scan` กับ project rules แล้ว interpret ผลอย่างถูกต้อง — filter, format, severity และ route findings ไป fix/report ต่อ

## Scope

- ครอบคลุม `ast-grep scan` (rules-driven), `--inline-rules`, `ast-grep test`, output/severity options และ CI integration
- ad-hoc pattern search (`ast-grep run -p`) → `/search-with-astgrep`; rewrite findings → `/use-astgrep rewrite`; rule authoring → `/update-astgrep-rules`; programmatic batch scan → `/use-astgrep-programmatic`

## Execute

### 1. Verify Setup

> Goal: `ast-grep scan` รันได้ใน project

1. ต้องมี `sgconfig.yml` ที่ root + `ruleDirs` ชี้ `rules/` — ถ้าไม่มีทำ `/use-astgrep` setup steps ก่อน
2. เรียก CLI: `ast-grep`/`sg` ถ้า `@ast-grep/cli` อยู่ใน devDependencies; ไม่งั้น `bunx -p @ast-grep/cli ast-grep` — ห้าม `bunx ast-grep` ลอยๆ (คนละ package ที่ถูก abandon)
3. ตรวจ config ถูกต้องด้วย `ast-grep scan --inspect summary`

### 2. Run Scan

> Goal: ได้ findings ที่อ่านและตัดสินใจได้

1. `bun run scan` (ถ้ามี script) หรือ `ast-grep scan` — scan ทั้ง project ด้วย rules ทั้งหมด
2. Filter rule เดียว: `ast-grep scan --filter 'RULE_ID'` (regex บน rule id)
3. Temporary rule โดยไม่แตะ `rules/`: `ast-grep scan --inline-rules 'id: ...\nlanguage: TypeScript\nrule: {...}' [paths]`
4. Severity gate: `--min-severity warning|error` หรือ override `--error/--warning/--info/--hint/--off [RULE_ID]`
5. Verbosity: `--report-style rich|medium|short` (default `rich`)

### 3. Format Output

> Goal: output เข้ากับ consumer

1. Human review: default rich output หรือ `--json pretty` เมื่อต้อง structured fields
2. Scripts/aggregation: `--json compact|stream` → feed เข้า `/use-scripts` หรือ `/use-astgrep-programmatic`
3. CI: `--format github` (annotations) หรือ `--format sarif` (SARIF upload) — exit code นับ error findings
4. Threads: `-j <num>` เมื่อ scan repo ใหญ่

### 4. Test Rules

> Goal: rules ที่มี `testConfigs` ผ่าน tests

1. `ast-grep test` รัน test cases ใน `rule-tests/` (ตาม `testConfigs` ใน sgconfig)
2. `ast-grep test --update-all` เพื่อ refresh snapshots
3. `ast-grep test --interactive` เพื่อ review diff ทีละ case

### 5. Consume Findings

> Goal: findings ถูก route ไปถูกที่

1. Report ตาราง `No. | Rule | File:Line | Severity | Message` ผ่าน `/report` เมื่อ findings เยอะ
2. Fix ทีละจุดน้อยๆ → แก้มือหรือ `/edit-only`; pattern เดียวหลายไฟล์ → `/use-astgrep rewrite`
3. Findings noise สูง / rule dead / coverage ขาด → `/improve-astgrep-rules`
4. Rule ใหม่ที่ควรมีถาวร → `/update-astgrep-rules`

## Rules

- `ast-grep scan` ต้องการ `sgconfig.yml` (root หรือ `--config <path>`) — `run` subcommand ไม่อ่าน rules
- `--inline-rules` ใช้สำหรับ temporary checks เท่านั้น — rule ที่ใช้ซ้ำต้อง promote เข้า `rules/` ผ่าน `/update-astgrep-rules`
- severity default ของ rules ใน repo นี้คือ `warning` — อย่า escalate เป็น `error` นอกจาก project กำหนด
- CI: ใช้ `ast-grep/action@v1.5` ใน GitHub Actions หรือ `scan --format github` ใน CI อื่น
- ใช้ `/search-with-astgrep` ถ้าจำเป็น (ad-hoc patterns)
- ใช้ `/check-code-structure` ถ้าจำเป็น (structural metrics)
- ใช้ `/deep-review` ถ้าจำเป็น

## Expected Outcome

- `ast-grep scan` รันสำเร็จพร้อม findings ที่ถูก filter/format ตาม consumer
- Rules ผ่าน `ast-grep test` ถ้ามี `testConfigs`
- Findings ถูก route ไป fix/improve/report — ไม่มี findings ค้างโดยไม่ได้ตัดสินใจ
