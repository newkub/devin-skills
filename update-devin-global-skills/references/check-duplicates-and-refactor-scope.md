# Check Duplicates And Refactor Scope

## Goal

ไม่ซ้ำ และรู้ว่าต้องแยกไฟล์ย่อยเมื่อไหร่

## Steps

1. ทำ `/scan-codebase` เพื่อหา skills ที่ซ้ำหรือคล้ายกัน
2. ถ้าซ้ำมาก → แนะนำ update/extend/rename แทนการสร้างใหม่
3. อ่าน [references/refactor-guidelines.md](references/refactor-guidelines.md)
4. ถ้า `SKILL.md` เกิน 250 บรรทัด หรือมีหลาย responsibility → วางแผนแยกไฟล์ย่อยก่อน write
