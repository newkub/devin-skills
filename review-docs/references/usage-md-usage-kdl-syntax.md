# Syntax Checks

## Goal

`usage.kdl` ผ่าน KDL syntax validation

## Checks

1. รัน `usage parse usage.kdl` เพื่อ validate syntax
2. ถ้า parse ไม่ผ่าน → flag เป็น critical พร้อม error message
3. ตรวจว่า KDL structure ถูกต้อง: nodes, attributes, values
4. บันทึก findings พร้อม evidence
