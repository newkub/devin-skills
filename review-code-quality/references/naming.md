# Naming Review

## Goal

ตรวจชื่อ identifiers, files, skills, references ให้ชัดเจน บ่งบอก intent และสม่ำเสมอ

## Checklist

- ชื่อบอก intent ของสิ่งที่เป็น
- หลีกเลี่ยงคำกำกวม เช่น `data`, `info`, `temp`, `utils` โดยไม่มี context
- ชื่อ function บอก action เช่น `validateUser`, `calculateTotal`
- Casing สม่ำเสมอตาม project convention
- ใช้คำศัพท์สม่ำเสมอ เช่น `get` หรือ `fetch` ไม่ผสม
- ชื่อ skill ต้องตรงกับ directory name
- ชื่อ skill ใช้ kebab-case
- ไม่มีชื่อซ้ำกันหรือขัดแย้งใน scope เดียวกัน

## Severity

- `High`: ทำให้เข้าใจ logic ผิดหรือกระทบ public API
- `Medium`: ทำให้ค้นหา/อ่านยาก
- `Low`: แนะนำให้ดีขึ้น

## Fix Path

- `/rename` พร้อม ast-grep ถ้ากระทบหลายไฟล์
- `/refactor` สำหรับ file/folder rename
