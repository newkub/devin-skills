# Flags And Args Checks

## Goal

flags และ args ครบถ้วน มี help

## Checks

1. ตรวจว่าทุก `flag` มี `help` และ `short` (ถ้ามี)
2. ตรวจว่าทุก `arg` มี `help` และ `required` หรือ `optional`
3. ตรวจว่า flag types ถูกต้อง (`string`, `bool`, `int`, `counter`)
4. ตรวจว่าไม่มี flag/arg ซ้ำชื่อ
5. บันทึก findings พร้อม evidence
