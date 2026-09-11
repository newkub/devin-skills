# Commands Checks

## Goal

commands ครบถ้วน มี help และ effect

## Checks

1. ตรวจว่าทุก `cmd` มี `help`
2. ตรวจว่าทุก `cmd` มี `effect` (`read`, `write`, `destructive`)
3. ตรวจว่า subcommands มี structure ที่ถูกต้อง
4. ตรวจว่าไม่มี command ซ้ำชื่อ
5. บันทึก findings พร้อม evidence
