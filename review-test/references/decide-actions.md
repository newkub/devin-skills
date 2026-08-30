# Decide Actions, Update Skills And Report

## Goal

สรุป action ถัดไป อัปเดต skill ถ้าพบ systemic gap และ report

## Checks

1. ถ้ามี assertion/implementation failure → แนะนำ `update-test-everything` หรือ `deep-debug`
2. ถ้ามี runtime/setup failure → แนะนำ `resolve-errors` หรือ `update-config`
3. ถ้ามี coverage gap → แนะนำ `update-test-everything`
4. ถ้ามี flaky → แนะนำ refactor test หรือ `follow-test`
5. ถ้าผลลัพธ์ทำให้รู้ว่า skill/flow ใดควรปรับปรุง → ใช้ `/update-devin-global-skills`
6. ถ้าพบว่า skill ที่ใช้ (เช่น `update-test-everything`, `follow-test`) ยังไม่ครอบคลุมกรณีที่เจอ → บันทึก gap
7. รัน `/update-devin-global-skills <skill-name>` เพื่อ update skill นั้น
8. ทำ `/deep-validate` และ `/check-reference` หลัง update
9. ไม่ update skill โดยไม่มี evidence จาก test result
10. ทำ `/report-table` ด้วยคอลัมน์: No., Test, Status, Category, Root Cause, Action
11. ทำ Coverage Delta Report: File, Before, After, Gap, Priority
12. ทำ Flaky Report: Test, Run 1, Run 2, Run 3, Suspected Cause
13. ทำ `/suggest-next-action` ตาม priority

## Severity

- Critical: systemic failure หรือ gap ที่ต้อง update skill ทันที
- High: ต้องส่งต่อ deep-debug/resolve-errors ก่อน merge
- Medium: coverage gap หรือ flaky ที่แก้ได้ภายในวัน
- Low: report/ข้อเสนอแนะที่ไม่ block merge
