# CLI Output

`review-codebase` table output ต้องแสดงรายละเอียดครบตาม spec — ห้ามแสดงแค่ score เดี่ยวหรือ category ละ 1 บรรทัด

## Findings Table (ต่อ category)

| No. | Domain | Category | Score | Grade | C | H | M | L | Status | Top Finding | Evidence | Fix Skill | Delta |
|-----|--------|----------|-------|-------|---|---|---|---|--------|-------------|----------|-----------|-------|

- `No.` column แรกเสมอ เรียง 1..n
- `C`/`H`/`M`/`L` = findings count ตาม severity (Critical/High/Medium/Low)
- `Status` = `new` / `existing` / `regression` / `fixed` เทียบ `reports/review-report.json` ครั้งก่อน — สำคัญสำหรับ iteration 3 รอบของ Step 8
- `Evidence` = `file:line` ของ top finding
- `Fix Skill` = จาก `reviewWorkflow` map — `/deep-review` (domain `review-<domain>` ใน `## Review Domains`) สำหรับ domain finding, `/deep-review-then-fix` เมื่อต้อง apply fix
- `Delta` = score diff เทียบ `reports/review-report.json` ครั้งก่อน (ถ้ามี baseline)
- sort: Critical ก่อน → score ต่ำสุดก่อน

## Domain Summary Table (ต่อท้าย)

| No. | Domain | Score | Grade | Categories | Findings | Errors | FP% | Trend |
|-----|--------|-------|-------|------------|----------|--------|-----|-------|

- `Trend` = up/down/flat เทียบ run ก่อน
- footer row: overall score + grade, `categories N/60`, total analyzer errors, duration

## Output Requirements

- non-TTY/CI → auto plain table หรือใช้ `--json`
- ทุก row ต้องมี `Evidence` — ห้าม row ที่ไม่มี file:line
- หน้าจอแคบ → ตัด `Top Finding` ก่อน ห้ามตัด `Evidence`/`Fix Skill`
- exit code: `exit 1` เมื่อ trigger ใดใน Metric Triggers (`categories < 60`, `score < 70`/`grade D/F`, `domain < 50`, `analyzerErrors > 0`, `falsePositiveRate > 20%`) — CI gate + auto-detect ผ่าน/ไม่ผ่าน ใน Step 8
- filter flags: `--domain <name>` และ `--severity <min>` สำหรับรันเฉพาะส่วนที่ fail ในรอบ 2-3 ของ Step 8 — ไม่ต้อง full scan ทุกครั้ง
