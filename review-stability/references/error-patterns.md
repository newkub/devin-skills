## Goal
รวบรวมและจับกลุ่ม errors/exceptions จาก logs เพื่อหา patterns และ root cause

## Scope
- รองรับไฟล์ log, stdin, หรือ log aggregation
- ใช้ clustering, regex, หรือ ML
- รายงาน top patterns พร้อม frequency

## Execute
### 1. Collect Logs

> Goal: Collect Logs

1. ระบุ log source เช่น `app.log`, Datadog, Sentry
2. ใช้ `jq`, `lnav`, หรือ `seqcli` เพื่อ parse
3. กรองช่วงเวลาถ้าจำเป็น

### 2. Normalize

> Goal: Normalize

1. แยก timestamp, level, message, stack trace
2. ลบ dynamic values เช่น IDs, timestamps
3. สร้าง signature สำหรับแต่ละ error type

### 3. Cluster

> Goal: Cluster

1. จับกลุ่มตาม message pattern หรือ exception type
2. นับ frequency และ affected services
3. หา correlation กับ deployments หรือ releases

### 4. Report

> Goal: Report

1. สรุป top error patterns
2. ระบุ affected users/requests ถ้ามี
3. แนะนำ next action: หา root cause หรือ fix

## Rules
### 1. Privacy

- ลบ PII ก่อน analyze
- ไม่ส่ง log ที่มี sensitive data ไปนอก
- ใช้ local tools ก่อน

### 2. Actionable

- แยก noise จาก real issues
- ระบุ pattern ทีต้อง fix จริง
- เชื่อมโยงกับ source code ถ้าได้

## Expected Outcome
- รายการ error patterns เรียงตาม frequency
- ตัวอย่าง log สำหรับแต่ละ pattern
- แนวทาง root cause
