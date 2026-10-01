# loc — Best Practices

Fast lines-of-code counting — filtering และ size analysis

## Recommended Patterns

- `loc` ที่ repo root — summary ต่อ language; `-d <dir>` เจาะ scope
- ใช้สำหรับ size signals ไม่ใช่ productivity metric — LOC = proxy ของ complexity/maintenance surface เท่านั้น
- กรองผ่าน gitignore-aware defaults — ตรวจว่า excluded generated/vendor dirs (node_modules, dist)
- Combine กับ `/check-long-files` (250-line rule) — loc ภาพรวม, check-long-files per-file
- Track trends: loc ก่อน/หลัง refactor — เพิ่มขึ้นมากจาก refactor = questionable

## Common Pitfalls

- LOC ≠ quality — ใช้ spot outliers (ไฟล์/dir ผิดปกติใหญ่) ไม่ใช่เชียร์ตัวเลข
- Generated code inflate counts — verify excludes ก่อน conclude
- Blank/comment lines: ตรวจว่า mode นับอย่างไร — comparisons ต้อง mode เดียวกัน
- Monorepo: per-workspace counts meaningful กว่า total

## Usage

- Quick audit: `loc` → sorted output หา top offenders → เจาะด้วย file-level tools
- Reporting: pipe output เข้า tables ใน `/report` — cite per-language breakdown

## Do / Don't

| Do | Don't |
|----|-------|
| outlier detection | productivity KPI |
| exclude generated/vendor | count node_modules |
| combine กับ file-length checks | rely LOC เดียวสำหรับ quality |
| trend comparisons (before/after) | absolute LOC judgments |
