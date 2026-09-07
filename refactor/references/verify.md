# Verify

## Goal

ตรวจสอบว่า refactor ผ่าน

## Steps

1. ทำ `/run-verify` สำหรับ lint, typecheck, test, build
2. ทำ `/check-code-structure` เปรียบเทียบ baseline
3. ทำ `/deep-validate` เพื่อ validate ครบหลายมิติหลัง refactor
4. ถ้าไม่ผ่าน → กลับไปแก้ที่ file/workspace/codebase step (max 3)
