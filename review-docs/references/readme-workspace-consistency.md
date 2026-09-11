# Workspace READMEs In Monorepo

กฎการตรวจสอบ workspace READMEs ใน monorepo

## Workspace README Requirements

- ทุก workspace ใน monorepo ต้องมี `README.md`
- ถ้า workspace ใดไม่มี `README.md` → flag เป็น `Low`

## License In Workspace

- workspace `README.md` ห้ามมี License section
- License section อยู่ที่ root `README.md` เท่านั้น
- ถ้า workspace มี License section → flag เป็น `Low`

## No Duplicate Root Content

- workspace `README.md` ต้องไม่ซ้ำเนื้อหา root `README.md`
- ตัวอย่างเนื้อหาที่ต้องไม่ซ้ำ:
  - Project overview ทั้งโครงการ
  - Features ทั้งโครงการ
  - Tech Stack ทั้งโครงการ
- workspace ควรมีเฉพาะข้อมูลเฉพาะของ workspace นั้น
- ถ้าพบเนื้อหาซ้ำ → flag เป็น `Low`

## Workspace Section Order

- workspace `README.md` ใช้ section order เดียวกับ root ยกเว้น License
- ไม่ต้องมี Status Callout ถ้า workspace ไม่มี status แยก
- ถ้า workspace section order ผิด → flag เป็น `Medium`

## Validation Steps

1. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
2. ระบุ workspaces ทั้งหมดจาก project structure
3. ตรวจว่าทุก workspace มี `README.md`
4. ตรวจว่า workspace `README.md` ไม่มี License section
5. เทียบเนื้อหา workspace กับ root เพื่อหา duplicate
6. ตรวจ workspace section order
7. บันทึก finding พร้อม file path และ line number

## Severity Mapping

| Issue | Severity |
|---|---|
| workspace ไม่มี `README.md` | `Low` |
| workspace มี License section | `Low` |
| workspace ซ้ำเนื้อหา root | `Low` |
| workspace section order ผิด | `Medium` |
