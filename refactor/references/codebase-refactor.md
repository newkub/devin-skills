# Codebase And SRP Refactor

## Goal

แก้ไขปัญหา SRP, long files, consistency ทั้ม codebase

## Steps

1. ทำ `/deep-review` หรือ `/review-quality` สำหรับภาพรวม
2. ทำ `/check-code-structure` และ `/check-long-files` เพื่อหา targets
3. ถ้ามี SRP violations หรือไฟล์ยาว >250 บรรทัด:
   - แยก multi-responsibility functions/classes ออกเป็นย่อย
   - แยกไฟล์ตาม concern/domain
   - ทำ `/relocation` หรือ `/rename` ถ้าต้องย้าย/เปลี่ยนชื่อ
4. ถ้ามี inconsistencies ใน naming, patterns, structure, style → แก้ตาม `/review-quality`
5. ถ้าเปลี่ยน structure หรือ root docs/config → ทำ `/update-project`
