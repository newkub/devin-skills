# Folder Domain Grouping Checks

## Checks

### Domain Cohesion

- pass: ไฟล์ในโฟลเดอร์อยู่ใน domain เดียวกัน
- warning: มี 1-2 ไฟล์ที่ไม่อยู่ใน domain เดียวกัน
- fail: ไฟล์ในโฟลเดอร์อยู่ในหลาย domain ปนกัน

### File Count Per Folder

- pass: ≤20 ไฟล์ต่อโฟลเดอร์ (ไม่รวม test/generated)
- warning: 21-40 ไฟล์
- fail: >40 ไฟล์ (bloat)

### Mixed Concerns

- pass: ไม่มี logic, test, config, generated ปนกันในโฟลเดอร์เดียว
- warning: มี 1-2 ไฟล์ที่ปนประเภท
- fail: มีไฟล์หลายประเภทปนกัน

### Nesting Depth

- pass: 3-5 ระดับ
- warning: 6 ระดับ หรือ 2 ระดับ (flat เกินไป)
- fail: >6 ระดับ หรือ 1 ระดับ (flat เกินไป)

### Import Boundaries

- pass: ไม่มี imports ข้าม domain หรือ layer
- warning: มี 1-2 imports ข้าม boundary
- fail: มี imports ข้าม boundary จำนวนมาก

### Folder Naming

- pass: ชื่อโฟลเดอร์สะท้อน domain และเป็น `kebab-case`
- warning: ชื่อโฟลเดอร์กำกวม
- fail: ชื่อโฟลเดอร์ไม่สะท้อน domain

## Detection Tools

- `/follow-folder-quality` สำหรับ comprehensive folder quality scan
- `/scan-codebase` สำหรับ directory tree
- `sg outline --items imports <paths>` สำหรับ import boundaries

## Exclusions

- ข้าม `node_modules/`, `.git/`, `dist/`, `build/`, `coverage/`, `temp/`
- ข้าม generated folders
- ไม่นับ test files ใน file count

## Severity

- High: bloat + low cohesion + cross-boundary imports
- Medium: moderate bloat หรือ mixed concerns บางส่วน
- Low: minor grouping inconsistency
