# File Naming Convention Checks

## Checks

### Naming Style

- pass: ใช้ `kebab-case` สำหรับไฟล์ทั้งหมด (หรือ convention ของ project)
- warning: มีไฟล์บางส่วนไม่ตรง convention
- fail: มีไฟล์จำนวนมากไม่ตรง convention

### Name Reflects Responsibility

- pass: ชื่อไฟล์สะท้อน responsibility ของไฟล์
- warning: ชื่อไฟล์กำกวม เช่น `utils`, `helpers`, `common`, `misc`
- fail: ชื่อไฟล์ไม่สะท้อน responsibility เลย เช่น `data`, `temp`, `stuff`

### Consistency

- pass: naming convention สม่ำเสมอทั้งโปรเจกต์
- warning: มี 1-2 ไฟล์ที่ไม่ consistent
- fail: naming inconsistent ทั้งโปรเจกต์

### Prefix/Suffix Conventions

- pass: ใช้ prefix/suffix ที่สื่อความหมาย เช่น `*-service.ts`, `*-handler.ts`, `*-types.ts`
- warning: ใช้ prefix/suffix ไม่สม่ำเสมอ
- fail: ไม่ใช้ prefix/suffix หรือใช้ผิดประเภท

### File Type Indicators

- pass: ชื่อไฟล์บอกประเภท เช่น `*.test.ts`, `*.spec.ts`, `*.config.ts`
- warning: บางไฟล์ไม่มี type indicator
- fail: ไม่มี type indicator ทั้งโปรเจกต์

## Detection Tools

- `/scan-codebase` สำหรับ list ไฟล์ทั้งหมด
- `/review-codebase-everythink` สำหรับ naming conventions review
- `Get-ChildItem -Recurse -File` สำหรับ file discovery

## Exclusions

- ข้าม `node_modules/`, `.git/`, `dist/`, `build/`, `coverage/`
- ข้าม generated files (`*.generated.*`, `*.min.*`)
- ข้าม hidden files ยกเว้นมีเหตุผล

## Severity

- High: naming ไม่สะท้อน responsibility, inconsistent ทั้งโปรเจกต์
- Medium: naming กำกวม, ไม่ consistent บางส่วน
- Low: minor naming inconsistency
