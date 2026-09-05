# check-* Template

scan codebase หา issues และ report findings โดยต้องมี `scripts/` ที่พร้อมรัน

## Execute Pattern

- ระบุ target และ criteria. ถ้าเป็น monorepo → ตรวจทุก workspaces หรือระบุ workspace. ถ้า target ไม่มี → stop. ทำ `/scan-codebase`. ใช้ grep, ast-grep, jscpd, knip ตาม criteria. ถ้าซับซ้อน → ทำ `/use-scripts` และเก็บไว้ใน `scripts/<skill-name>.ts` (หรือ `.js`/`.py` ตาม ecosystem) ที่พร้อมรัน
- `scripts/` ต้องมี runnable script สำหรับรัน check ซ้ำได้โดยไม่ต้องพึ่ง agent interpretation
- จัดประเภท: Critical, Warning, Info. ระบุ root cause. กรอง false positives. จัดลำดับตาม impact. ระบุ file และ line number ชัดเจน. Report เป็นตาราง: file, line, issue, severity, recommendation. ถ้ามี critical → แนะนำ `/resolve-errors`. ถ้าไม่พบ → "no issues found". ทุก finding ต้องมี recommendation
- Completeness: ตรวจครบทุก workspaces. ไม่ข้าม files ที่ gitignored. รวม dependencies ถ้าเกี่ยวข้อง

## allowed-tools

`allowed-tools` ต้องรวม `exec`, `grep`, `find_file_by_name`. วางแผนใช้ `/use-scripts` สำหรับ scan ซับซ้อน และสร้าง `scripts/<skill-name>.[ext]` ให้พร้อมรัน
