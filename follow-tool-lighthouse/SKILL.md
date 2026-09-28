---
name: follow-tool-lighthouse
description: ใช้ Lighthouse CLI audit หน้าเว็บเดียว — performance, accessibility, SEO, best-practices
argument-hint: "<url> [options]"
related:
  - follow-tool-unlighthouse
  - review-performance
  - review-accessibility
  - review-seo
  - check-bottlenecks
  - run-dev
  - report
---

## Goal

ใช้ Lighthouse CLI audit web page เดียวอย่าง reproducible — performance, accessibility, SEO, best-practices — พร้อม structured output สำหรับ review/report

## Scope

ใช้สำหรับ audit หน้าเดียว/route เฉพาะเจาะจงด้วย `lighthouse` CLI โดยตรง

- Boundary: site-wide crawl ทุก route → `/follow-tool-unlighthouse`; E2E user-flow assertions → `/follow-tool-playwright`; Lighthouse ใน CI workflow → `/follow-tool-github-actions`
- Latest: `lighthouse@13.5.0` (verified 2026-09-28) — categories เพิ่ม `agentic-browsing` ใน v13
- ต้องมี Chrome/Chromium ≥ v66 ในเครื่อง — หรือระบุด้วย env `CHROME_PATH`

## Execute

### 1. Verify Environment

> Goal: lighthouse และ Chrome พร้อมใช้

1. `lighthouse --version` — ถ้าไม่มี → `bunx lighthouse@latest` หรือ `bun add -g lighthouse`
2. ตรวจ Chrome: auto-detect Chrome Stable/Canary — หรือตั้ง `CHROME_PATH=<path-to-chrome>` env
3. ถ้าเป็น dev URL → start server ก่อนด้วย `/run-dev`

### 2. Run Audit

> Goal: ได้ report ตาม categories ที่ต้องการ

```bash
# audit เต็มทุก category — HTML report
bunx lighthouse <url> --output html --output-path ./reports/lh.html --view

# เฉพาะ performance — JSON stdout สำหรับ parse ต่อ
bunx lighthouse <url> --only-categories performance --output json --output-path stdout

# desktop profile (ไม่ใช่ --form-factor=desktop อย่างเดียว — ใช้ preset)
bunx lighthouse <url> --preset desktop

# mobile emulation เจาะจง
bunx lighthouse <url> --form-factor mobile --screenEmulation.width=360 --screenEmulation.height=640
```

Categories ที่มี: `accessibility`, `best-practices`, `performance`, `seo`, `agentic-browsing` (ใหม่ใน v13)
Presets: `perf`, `experimental`, `desktop`

### 3. Control Measurement

> Goal: ผลลัพธ์เสถียรและตรง production-like conditions

1. `--throttling-method simulate` (default) สำหรับ repeatable numbers; `devtools` เมื่อต้องการ real-network throttling
2. ปรับ `--throttling.rttMs`, `throughputKbps` เมื่อต้องจำลอง network เฉพาะ
3. `--max-wait-for-load <ms>` สำหรับ SPA ที่โหลดช้า
4. `--blocked-url-patterns` ตัด third-party noise (analytics, ads) ออกจากผล
5. `--disable-storage-reset` เมื่อต้อง audit state ที่ cache/login แล้ว
6. reproducibility สูง → รัน 3-5 ครั้งดู median (Lighthouse variance สูง)

### 4. Two-Phase Runs

> Goal: debug หรือ re-audit โดยไม่ต้องเก็บ trace ใหม่

```bash
bunx lighthouse <url> -G            # gather artifacts → ./latest-run/
bunx lighthouse <url> -A            # audit จาก artifacts ที่เก็บไว้
bunx lighthouse <url> -GA           # gather + audit
```

### 5. Parse And Report

> Goal: scores + opportunities เป็น actionable findings

1. `--output json` แล้วอ่าน `categories.*.score` (0-1 → x100) และ `audits` ที่ `score < 0.9`
2. โฟกัส `audits` ที่มี `details.overallSavingsMs`/`overallSavingsBytes` — estimated impact ชัดเจน
3. `--list-all-audits` ดู audit IDs ทั้งหมดเมื่อต้อง `--only-audits`/`--skip-audits` เจาะจง
4. รายงานด้วย `/report` table: No., Category, Score, Top findings (with savings), Recommendation

## Rules

- JSON output สำหรับ automation/parse; HTML สำหรับ human review — `--output` รับหลายค่า
- `--preset desktop` ไม่ใช่แค่ `--form-factor desktop` — preset ปรับ throttling/emulation ครบกว่า
- Lighthouse score เปลี่ยนได้ระหว่างรัน (variance) — อย่าสรุปจากรันเดียว ใช้ median ของหลายรัน
- authenticated pages → launch Chrome ด้วย profile ที่ login แล้วผ่าน `--chrome-flags`/`--port` หรือใช้ `--disable-storage-reset`
- ไม่ audit production third-party sites ที่ไม่มีสิทธิ์
- ใช้ /follow-tool-unlighthouse เมื่อต้อง site-wide; /review-performance เมื่อจะวิเคราะห์ลึกกว่า scores

## Expected Outcome

- Lighthouse report (html/json/csv) ต่อ URL ที่ระบุ พร้อม scores ทุก category ที่เลือก
- Findings พร้อม estimated savings สำหรับ follow-up fixes
