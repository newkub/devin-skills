# Analyze Coverage Delta And Detect Flakiness

## Goal

ตรวจ coverage หลัง run และหา tests ที่ไม่เสถียร

## Checks

1. เปรียบเทียบ coverage กับ target: Minimal 70%, Standard 85%, Complete 100%
2. ระบุไฟล์ที่ coverage ลดลง หรือ source files ที่ไม่ถูก test
3. ใช้ `jq` อ่าน `coverage/coverage-summary.json` เพื่อดูเปอร์เซ็นต์
4. ระบุ branches/functions/statements ที่ missing
5. รัน test ซ้ำ 3 รอบ ถ้า result ไม่ consistent
6. ตรวจสอบ race condition, shared state, async timing, random data
7. ตรวจ `beforeEach`/`afterEach` cleanup
8. ถ้า flaky → คั่นด้วย `tag` และแนะนำให้แก้ก่อน merge

## Severity

- Critical: coverage ต่ำกว่า 50% หรือ flaky ใน critical path
- High: coverage ลดลง หรือ source file ที่ไม่ถูก test
- Medium: coverage ใกล้ target แต่ไม่ถึง หรือ flaky ที่พบเฉพาะบางรอบ
- Low: coverage report ขาดรายละเอียดบาง category
