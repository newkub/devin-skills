# USAGE.md Freshness Checks

## Goal

`USAGE.md` ตรงกับ `usage.kdl`

## Checks

1. ตรวจว่า `USAGE.md` มีอยู่ ถ้าไม่ → flag เป็น High
2. รัน `usage generate markdown -f usage.kdl` แล้วเปรียบเทียบกับ `USAGE.md` ที่มี
3. ถ้า diff → flag เป็น Medium (stale docs)
4. ตรวจว่า `USAGE.md` ไม่เกิน 250 บรรทัด
5. บันทึก findings พร้อม evidence
