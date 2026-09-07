# Post-Merge Verify

(merged from: deep-verify)

ใช้หลัง `/merge` ผลลัพธ์จาก `use-subagents` หรือหลัง implementation ซับซ้อน — verification ที่ลึกกว่า validate ปกติ

## Execute

### 1. Run Automated Checks

> Goal: ตรวจสอบ checks อัตโนมัติผ่านทั้งหมด

1. ทำ `/run-verify` เพื่อรัน lint, format, และ quality checks
2. ทำ `/run-test-unit` เพื่อรัน unit/integration tests
3. ถ้า project มี `package.json` ระบุ typecheck script ให้รัน `bunx tsc --noEmit` หรือคำสั่งที่เหมาะสม
4. บันทึกผลลัพธ์ของแต่ละ check พร้อม evidence

### 2. Check References

> Goal: ตรวจสอบ references ไม่พัง

1. ทำ `/check-reference` เพื่อหา broken references
2. ถ้า project มี skills/workflows อ้างอิงกัน ตรวจสอบ `related` ให้ถูกต้อง
3. ตรวจสอบว่าไฟล์ที่ถูกย้าย/ลบ/merge ถูกอ้างอิงถูกต้อง

### 3. Scan Codebase

> Goal: ตรวจสอบโครงสร้างและ quality ของ codebase

1. ทำ `/scan-codebase` เพื่อหาไฟล์เกิน 250 บรรทัด, orphan files, หรือ issues ด้าน structure
2. ตรวจสอบว่าไม่มี circular dependencies ระหว่าง modules
3. ตรวจสอบว่าโครงสร้างไฟล์สอดคล้องกับ architecture ที่กำหนด

## Rules

### Stop On Failure

- ถ้า `/run-test-unit` หรือ `/run-verify` ไม่ผ่าน → หยุดทันที
- ถ้า `/deep-validate` พบ Critical หรือ High → หยุดทันที
- ถ้า `/check-reference` พบ broken references → หยุดทันที
- ถ้าต้องทำงานต่อ ให้ทำ `/resolve-errors` แล้ว verify ซ้ำ

### Evidence

- ทุก finding ต้องมี evidence: file path, line number, หรือ command output
- ไม่อ้างผล verify ที่ยังไม่ได้รัน
