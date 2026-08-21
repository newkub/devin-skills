---
name: follow-jscpd
description: ตั้งค่าและใช้งาน jscpd สำหรับตรวจจับ code duplication ใน codebase
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตั้งค่าและรัน jscpd เพื่อตรวจจับ code duplication และจัดลำดับการ refactor

## Scope

ใช้สำหรับตรวจจับและวิเคราะห์ code duplication — ไม่ครอบคลุมการ refactor เอง (ดู `/refactor`)

## Execute

### 1. Setup Configuration

สร้าง `.jscpd.json` สำหรับ config ระดับ project

> Goal: Config ครบ สอดคล้อง monorepo

1. สร้าง `.jscpd.json` ที่ project root พร้อม `ignore` patterns สำหรับ `node_modules`, `dist`, `.turbo`, `coverage`
2. ตั้งค่า `minLines: 5`, `minTokens: 50`, `threshold: 0` (report ทั้งหมด ไม่ exit error)
3. ตั้งค่า `reporters: ["console", "json"]` และ `output: "report"`
4. ถ้าเป็น monorepo → เพิ่ม `ignore` สำหรับ `/*.lock`, `/bun.lock`, `/.output/`

### 2. Run Duplication Detection

รัน jscpd เพื่อตรวจจับ duplication

> Goal: ได้ผลลัพธ์ duplication report ชัดเจน

1. รัน `bunx jscpd . --reporters console,json --output report`
2. ถ้า project ใหญ่ → ระบุ paths: `bunx jscpd ./src ./integrations --reporters console,json`
3. ถ้าต้องการ CI gate → เพิ่ม `--threshold 10` (exit error ถ้า duplication >= 10%)
4. ถ้าต้องการ HTML report → เพิ่ม `html` ใน reporters

### 3. Analyze Results

วิเคราะห์ผลจาก `report/jscpd-report.json`

> Goal: ระบุ files, patterns, และ priority สำหรับ refactor

1. อ่าน `report/jscpd-report.json` เพื่อดู `duplicates` array
2. จัดกลุ่ม duplicates ตาม file และ pattern
3. จัดลำดับตามขนาด (lines, tokens) และความถี่ (จำนวน clones)
4. แยก core logic duplication จาก boilerplate และ config patterns
5. ทำ `/report-table` เพื่อสรุปผลเป็นตาราง

### 4. Plan Refactor

วางแผน refactor ตามผล duplication

> Goal: มี priority list สำหรับ refactor แต่ละ item

1. ลำดับที่ 1: core logic ที่ซ้ำและมีผลกระทบสูง
2. ลำดับที่ 2: shared utilities ที่ใช้ในหลาย workspace
3. ลำดับที่ 3: boilerplate ที่สามารถ extract เป็น template หรือ helper
4. ส่งต่อไป `/refactor` สำหรับแต่ละ item

## Rules

### 1. Configuration

- ใช้ `.jscpd.json` สำหรับ config ระดับ project — ไม่ใช่ CLI flags กระจัดกระจาย
- `minLines: 5`, `minTokens: 50` — ค่า default เหมาะสำหรับส่วนใหญ่
- `threshold: 0` สำหรับ report mode, `threshold: 10` สำหรับ CI mode
- `ignore` ต้องครอบคลุม: `/node_modules/`, `/dist/`, `/.turbo/`, `/coverage/`, `/*.lock`, `/bun.lock`
- `gitignore: true` เพื่อ respect `.gitignore` patterns

### 2. Reporters

- `console` — สรุปผลใน terminal สำหรับการอ่านด่วน
- `json` — structured output สำหรับ parse ด้วย scripts
- `html` — interactive report สำหรับ share กับทีม
- `markdown` — สำหรับ include ใน PR หรือ docs
- `sarif` — สำหรับ integrate กับ GitHub Code Scanning

### 3. Detection Modes

- `mild` (default) — skip ignored blocks, new lines, empty symbols — เหมาะสำหรับส่วนใหญ่
- `strict` — use all token types — สำหรับตรวจแบบละเอียด
- `weak` — skip comments ด้วย — สำหรับลด noise จาก comment duplication

### 4. Monorepo

- รันที่ root และใช้ `ignore` patterns เพื่อ exclude workspaces ที่ไม่ต้องการ
- หรือรันเฉพาะ workspace: `bunx jscpd ./apps/website/src --reporters console,json`
- ใช้ `--skip-local` เพื่อตรวจเฉพาะ cross-workspace duplication
- เพิ่ม script `report:duplication` ใน root `package.json`: `bunx jscpd . --reporters console,json --output report`

### 5. CI Integration

- ใช้ `--threshold` เพื่อ fail CI เมื่อ duplication เกินกำหนด
- ใช้ `--reporters sarif` สำหรับ GitHub Code Scanning
- ใช้ `--no-tips` เพื่อ suppress ข้อความที่ไม่จำเป็นใน CI output
- ใช้ `--exit-code 1` เพื่อกำหนด exit code เมื่อพบ duplication

## Expected Outcome

- `.jscpd.json` config ที่ project root
- `report/jscpd-report.json` พร้อมผล duplication
- ตารางสรุป duplicates พร้อม priority สำหรับ refactor
- ส่งต่อไป `/refactor` สำหรับแต่ละ high-priority item

## Example Template

### .jscpd.json

```json
{
  "threshold": 0,
  "reporters": ["console", "json"],
  "ignore": [
    "/node_modules/",
    "/dist/",
    "/.turbo/",
    "/coverage/",
    "**/*.lock",
    "**/bun.lock",
    "/.output/",
    "/dist-spa/"
  ],
  "absolute": true,
  "gitignore": true,
  "minLines": 5,
  "minTokens": 50
}
```

### package.json script

```json
"report:duplication": "bunx jscpd . --reporters console,json --output report"
```

## Reference

- `/refactor` — สำหรับ refactor duplicates ที่พบ
- `/use-scripts` — สำหรับ parse JSON report
- [jscpd Documentation](https://jscpd.dev)
- [jscpd GitHub](https://github.com/kucherenko/jscpd)
